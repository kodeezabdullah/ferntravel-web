'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireOperator } from '@/lib/use-require-operator';
import { apiFetch } from '@/lib/api';
import type { OperatorTour, Departure, OperatorBooking } from '@/types/api';

interface NeedsAttentionItem {
  key: string;
  message: string;
  detail: string;
  href: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function OperatorDashboardPage() {
  const { user } = useRequireOperator();
  const [now] = useState(() => Date.now());

  const [tours, setTours] = useState<OperatorTour[]>([]);
  const [departuresByTour, setDeparturesByTour] = useState<Record<string, Departure[]>>({});
  const [recentBookings, setRecentBookings] = useState<OperatorBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'operator') return;
    let cancelled = false;

    apiFetch<OperatorTour[]>('/operator/tours?status=published&limit=50')
      .then(async (publishedTours) => {
        if (cancelled) return;
        setTours(publishedTours);

        const entries = await Promise.all(
          publishedTours.slice(0, 20).map(async (tour) => {
            const departures = await apiFetch<Departure[]>(
              `/operator/tours/${tour.id}/departures`,
            ).catch(() => []);
            return [tour.id, departures] as const;
          }),
        );
        if (!cancelled) setDeparturesByTour(Object.fromEntries(entries));
      })
      .catch(() => {
        if (!cancelled) setTours([]);
      });

    apiFetch<OperatorBooking[]>('/operator/bookings?limit=5')
      .then((data) => {
        if (!cancelled) setRecentBookings(data);
      })
      .catch(() => {
        if (!cancelled) setRecentBookings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user || user.role !== 'operator') return null;

  const allDepartures = Object.entries(departuresByTour).flatMap(([tourId, deps]) =>
    deps.map((d) => ({ ...d, tourId, tourName: tours.find((t) => t.id === tourId)?.tour_name ?? '' })),
  );

  const upcomingDepartures = allDepartures.filter(
    (d) => new Date(d.departure_date).getTime() >= now,
  );

  const seatsBooked = upcomingDepartures.reduce((sum, d) => sum + (d.seats_total - d.seats_available), 0);
  const seatsTotal = upcomingDepartures.reduce((sum, d) => sum + d.seats_total, 0);

  const needsAttention: NeedsAttentionItem[] = [];
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  for (const d of upcomingDepartures) {
    const daysAway = new Date(d.departure_date).getTime() - now;
    const fillRate = d.seats_total > 0 ? (d.seats_total - d.seats_available) / d.seats_total : 0;
    if (daysAway <= sevenDays && fillRate < 0.5) {
      needsAttention.push({
        key: d.id,
        message: `${d.tourName} departs ${formatDate(d.departure_date)} — only ${d.seats_total - d.seats_available}/${d.seats_total} seats booked`,
        detail: 'Consider a reminder push or last-minute discount',
        href: '/operator/tours',
      });
    }
  }

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Dashboard
          </h1>
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Welcome back — here&apos;s what needs your attention
          </p>
        </div>
      </div>

      {/* Snapshot cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SnapshotCard label="Upcoming Tours" value={String(upcomingDepartures.length)} />
        <SnapshotCard
          label="Seats Booked (upcoming)"
          value={`${seatsBooked} / ${seatsTotal}`}
          sub={seatsTotal > 0 ? `${Math.round((seatsBooked / seatsTotal) * 100)}% filled` : undefined}
        />
        <SnapshotCard label="Published Tours" value={String(tours.length)} />
      </div>

      {/* Needs Attention */}
      <div className="bg-white rounded-2xl border border-[#ede8dc] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
            ⚠ Needs Attention
          </h2>
          <Link href="/operator/tours" className="text-[13px] font-semibold text-[#1b7a3d] hover:opacity-80">
            View all &rsaquo;
          </Link>
        </div>
        {loading ? (
          <p className="text-[13.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Loading…
          </p>
        ) : needsAttention.length === 0 ? (
          <p className="text-[13.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Nothing needs your attention right now.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-[#ede8dc]">
            {needsAttention.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="py-3 flex items-start gap-3 hover:bg-[#faf7f2] -mx-2 px-2 rounded-lg transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#f2a93b] mt-1.5 shrink-0" />
                <div>
                  <p className="text-[13.5px] font-semibold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {item.message}
                  </p>
                  <p className="text-[12.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {item.detail}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-[#ede8dc] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Recent Activity
          </h2>
          <Link href="/operator/bookings" className="text-[13px] font-semibold text-[#1b7a3d] hover:opacity-80">
            View all &rsaquo;
          </Link>
        </div>
        {loading ? (
          <p className="text-[13.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Loading…
          </p>
        ) : recentBookings.length === 0 ? (
          <p className="text-[13.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            No recent bookings yet.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-[#ede8dc]">
            {recentBookings.map((b) => (
              <Link
                key={b.id}
                href="/operator/bookings"
                className="py-3 flex items-center gap-3 hover:bg-[#faf7f2] -mx-2 px-2 rounded-lg transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-[#e8f2ec] text-[#1b7a3d] flex items-center justify-center text-[13px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-[13.5px] text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
                  <strong>{b.customer_name}</strong> booked {b.seats_requested}{' '}
                  {b.seats_requested === 1 ? 'seat' : 'seats'} on <strong>{b.tour_name}</strong>
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/operator/tours/new"
          className="flex-1 text-center bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-xl px-6 py-3.5"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          + New Tour
        </Link>
        <Link
          href="/operator/bookings"
          className="flex-1 text-center border-2 border-[#1b7a3d] text-[#1b7a3d] hover:bg-[#1b7a3d] hover:text-white transition-colors font-bold text-[14px] rounded-xl px-6 py-3.5"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          View Bookings
        </Link>
      </div>
    </div>
  );
}

function SnapshotCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ede8dc] p-5">
      <p className="text-[11.5px] font-semibold text-[#8a8a85] uppercase tracking-wider mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
        {label}
      </p>
      <p className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
        {value}
      </p>
      {sub && (
        <p className="text-[12px] text-[#1b7a3d] font-semibold mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
          {sub}
        </p>
      )}
    </div>
  );
}
