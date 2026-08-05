'use client';

import { useEffect, useState } from 'react';
import { useRequireOperator } from '@/lib/use-require-operator';
import { apiFetch } from '@/lib/api';
import type { OperatorTour, TourFunnel } from '@/types/api';

function FunnelRow({ funnel }: { funnel: TourFunnel }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ede8dc] p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-[16px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
          {funnel.tour_name}
        </h3>
        <span className="text-[13px] font-semibold text-[#1b7a3d] bg-[#e8f2ec] px-3 py-1 rounded-full">
          {funnel.seats_fill_rate}% filled
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Metric label="Departures" value={funnel.departures_total} />
        <Metric label="Active Bookings" value={funnel.active_bookings} />
        <Metric label="Cancelled" value={funnel.cancelled_bookings} />
        <Metric label="Seats Filled" value={`${funnel.seats_filled} / ${funnel.seats_total}`} />
      </div>

      <div className="mt-4 pt-4 border-t border-[#ede8dc] flex items-center gap-6">
        <div>
          <span className="text-[12px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            App bookings
          </span>
          <p className="text-[15px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
            {funnel.booking_source_breakdown.app}
          </p>
        </div>
        <div>
          <span className="text-[12px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Manual bookings
          </span>
          <p className="text-[15px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
            {funnel.booking_source_breakdown.manual}
          </p>
        </div>
        <div>
          <span className="text-[12px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Operator rating
          </span>
          <p className="text-[15px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
            {funnel.operator_rating > 0 ? `${funnel.operator_rating} ★` : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[11.5px] font-semibold text-[#8a8a85] uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
        {label}
      </p>
      <p className="text-[20px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
        {value}
      </p>
    </div>
  );
}

export default function OperatorAnalyticsPage() {
  const { user } = useRequireOperator();
  const [funnels, setFunnels] = useState<TourFunnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'operator') return;
    let cancelled = false;

    apiFetch<OperatorTour[]>('/operator/tours?status=published&limit=50')
      .then(async (tours) => {
        if (cancelled) return;
        const results = await Promise.all(
          tours.map((t) =>
            apiFetch<TourFunnel>(`/operator/analytics/tours/${t.id}/funnel`).catch(() => null),
          ),
        );
        if (!cancelled) setFunnels(results.filter((f): f is TourFunnel => f !== null));
      })
      .catch(() => {
        if (!cancelled) setFunnels([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user || user.role !== 'operator') return null;

  const totalActiveBookings = funnels.reduce((sum, f) => sum + f.active_bookings, 0);
  const totalSeatsFilled = funnels.reduce((sum, f) => sum + f.seats_filled, 0);
  const totalSeats = funnels.reduce((sum, f) => sum + f.seats_total, 0);
  const overallFillRate = totalSeats > 0 ? Math.round((totalSeatsFilled / totalSeats) * 100) : 0;

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
          Analytics
        </h1>
        <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Performance across your published tours
        </p>
      </div>

      {!loading && funnels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-[#ede8dc] p-5">
            <p className="text-[11.5px] font-semibold text-[#8a8a85] uppercase tracking-wider mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
              Published Tours
            </p>
            <p className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
              {funnels.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#ede8dc] p-5">
            <p className="text-[11.5px] font-semibold text-[#8a8a85] uppercase tracking-wider mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
              Active Bookings
            </p>
            <p className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
              {totalActiveBookings}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#ede8dc] p-5">
            <p className="text-[11.5px] font-semibold text-[#8a8a85] uppercase tracking-wider mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
              Overall Fill Rate
            </p>
            <p className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
              {overallFillRate}%
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Loading…
        </p>
      ) : funnels.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede8dc] p-10 text-center">
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Publish a tour to see performance analytics here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {funnels.map((f) => (
            <FunnelRow key={f.tour_id} funnel={f} />
          ))}
        </div>
      )}
    </div>
  );
}
