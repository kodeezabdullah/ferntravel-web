'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRequireOperator } from '@/lib/use-require-operator';
import { apiFetch } from '@/lib/api';
import TourForm from '../../TourForm';
import type { OperatorTour, Departure } from '@/types/api';

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useRequireOperator();

  const [tour, setTour] = useState<OperatorTour | null>(null);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'operator') return;
    let cancelled = false;

    Promise.all([
      apiFetch<OperatorTour>(`/operator/tours/${id}`),
      apiFetch<Departure[]>(`/operator/tours/${id}/departures`).catch(() => []),
    ])
      .then(([foundTour, foundDepartures]) => {
        if (cancelled) return;
        setTour(foundTour);
        setDepartures(foundDepartures);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, id, version]);

  if (!user || user.role !== 'operator') return null;

  if (loading) {
    return (
      <div className="px-6 md:px-10 py-8">
        <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Loading…
        </p>
      </div>
    );
  }

  if (notFound || !tour) {
    return (
      <div className="px-6 md:px-10 py-8">
        <p className="text-[16px] font-semibold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
          Tour not found.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-8">
      <Link
        href="/operator/tours"
        className="text-[13px] font-semibold text-[#8a8a85] hover:text-[#1b7a3d] transition-colors mb-2 inline-block"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        &larr; Tours
      </Link>
      <h1 className="text-[26px] font-bold text-[#3d3229] mb-8" style={{ fontFamily: 'var(--font-poppins)' }}>
        Edit Tour
      </h1>
      <TourForm
        mode="edit"
        tourId={tour.id}
        initial={tour}
        departures={departures}
        onDeparturesChange={() => setVersion((v) => v + 1)}
      />
    </div>
  );
}
