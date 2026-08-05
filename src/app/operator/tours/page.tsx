'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRequireOperator } from '@/lib/use-require-operator';
import { apiFetch } from '@/lib/api';
import type { OperatorTour, TourStatus } from '@/types/api';

const FALLBACK_IMAGE = '/assets/nature-1.jpg';

const TABS: { label: string; value: TourStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Past', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_STYLES: Record<TourStatus, string> = {
  draft: 'bg-[#fdf0dd] text-[#c98a2e]',
  published: 'bg-[#e8f2ec] text-[#1b7a3d]',
  completed: 'bg-[#f0eee8] text-[#8a8a85]',
  cancelled: 'bg-[#fbe8e6] text-[#c0392b]',
};

const STATUS_LABELS: Record<TourStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  completed: 'Past',
  cancelled: 'Cancelled',
};

export default function OperatorToursPage() {
  const { user } = useRequireOperator();
  const [activeTab, setActiveTab] = useState<TourStatus | 'all'>('all');
  const [tours, setTours] = useState<OperatorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'operator') return;
    let cancelled = false;
    const statusParam = activeTab === 'all' ? '' : `?status=${activeTab}`;
    apiFetch<OperatorTour[]>(`/operator/tours${statusParam}${statusParam ? '&' : '?'}limit=50`)
      .then((data) => {
        if (!cancelled) setTours(data);
      })
      .catch(() => {
        if (!cancelled) setTours([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, activeTab]);

  const handleDuplicate = async (tourId: string) => {
    setDuplicatingId(tourId);
    try {
      await apiFetch(`/operator/tours/${tourId}/duplicate`, { method: 'POST' });
      setActiveTab('draft');
    } catch {
      // leave the list unchanged on failure
    } finally {
      setDuplicatingId(null);
    }
  };

  if (!user || user.role !== 'operator') return null;

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Tours
          </h1>
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            {tours.length} total
          </p>
        </div>
        <Link
          href="/operator/tours/new"
          className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-6 py-2.5"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          + New Tour
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`shrink-0 rounded-full px-5 py-2 text-[13.5px] font-bold transition-all cursor-pointer ${
              activeTab === tab.value
                ? 'bg-[#1b7a3d] text-white'
                : 'bg-white border border-[#ede8dc] text-[#3d3229] hover:border-[#d8d2c2]'
            }`}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Loading…
        </p>
      ) : tours.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede8dc] p-10 text-center">
          <p className="text-[14px] text-[#8a8a85] mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
            No tours in this category yet.
          </p>
          <Link
            href="/operator/tours/new"
            className="inline-block bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-6 py-2.5"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Create your first tour
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ede8dc] overflow-hidden">
          <div className="flex flex-col divide-y divide-[#ede8dc]">
            {tours.map((tour) => (
              <div key={tour.id} className="flex items-center gap-4 p-4">
                <div className="relative w-[64px] h-[64px] rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={tour.cover_image_url || FALLBACK_IMAGE}
                    alt={tour.tour_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#3d3229] truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {tour.tour_name}
                  </p>
                  <p className="text-[12.5px] text-[#8a8a85] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                    {tour.destination} · PKR {tour.cost.toLocaleString('en-PK')}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-bold ${STATUS_STYLES[tour.status]}`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {STATUS_LABELS[tour.status]}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {tour.status === 'completed' || tour.status === 'cancelled' ? (
                    <button
                      type="button"
                      disabled={duplicatingId === tour.id}
                      onClick={() => handleDuplicate(tour.id)}
                      className="border border-[#ede8dc] hover:border-[#1b7a3d] text-[#3d3229] hover:text-[#1b7a3d] transition-colors font-bold text-[13px] rounded-full px-4 py-2 cursor-pointer disabled:opacity-60"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {duplicatingId === tour.id ? 'Duplicating…' : 'Duplicate'}
                    </button>
                  ) : (
                    <Link
                      href={`/operator/tours/${tour.id}/edit`}
                      className="border border-[#ede8dc] hover:border-[#1b7a3d] text-[#3d3229] hover:text-[#1b7a3d] transition-colors font-bold text-[13px] rounded-full px-4 py-2"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
