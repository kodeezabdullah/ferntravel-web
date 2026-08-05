'use client';

import { useEffect, useState } from 'react';
import HomeNavbar from '@/components/HomeNavbar';
import HomeFooter from '@/components/HomeFooter';
import OperatorTourRow from '@/components/OperatorTourRow';
import { Tour } from '@/components/DestinationTourRow';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import type { Operator, Tour as ApiTour } from '@/types/api';

const FALLBACK_IMAGE = '/assets/nature-1.jpg';

interface OperatorRow {
  operator: Operator;
  tours: Tour[];
}

function toRowTour(tour: ApiTour): Tour {
  return {
    id: tour.id,
    name: tour.tour_name,
    duration: tour.duration,
    price: tour.cost.toLocaleString('en-PK'),
    date: tour.status ?? '',
    rating: tour.rating ?? 0,
    image: tour.cover_image_url || FALLBACK_IMAGE,
  };
}

export default function OperatorsPage() {
  const [rows, setRows] = useState<OperatorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Operator[]>('/operators?limit=8')
      .then(async (operators) => {
        if (cancelled) return;
        const withTours = await Promise.all(
          operators.map(async (operator) => {
            const tours = await apiFetch<ApiTour[]>(`/operators/${operator.id}/tours`).catch(
              () => [],
            );
            return { operator, tours: tours.map(toRowTour) };
          }),
        );
        if (!cancelled) setRows(withTours);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen">
      {/* Navbar */}
      <HomeNavbar triggerEntrance={true} />

      {/* Hero Banner (darker/greener) */}
      <section className="relative w-full h-[380px] md:h-[420px] overflow-hidden flex items-center px-6 md:px-16">
        {/* Background photo */}
        <Image
          src="/assets/hero-bg.jpg"
          alt="Trusted Operators scenery"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />

        {/* Darker/greener overlay */}
        <div className="absolute inset-0 bg-[#072411]/65 z-10" />

        {/* Hero content */}
        <div className="relative z-20 max-w-[600px]">
          <p
            className="text-[#f2a93b] font-medium text-[13px] md:text-[14px] tracking-[4px] uppercase mb-3 italic"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            TRUSTED PARTNERS
          </p>
          <h1
            className="text-white text-[36px] md:text-[56px] font-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            Meet Our Verified Operators
          </h1>
          <p
            className="text-white/85 text-[15px] md:text-[17px] italic max-w-[500px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Handpicked, background-checked tour operators across Pakistan.
          </p>
        </div>
      </section>

      {/* Main Page Content */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <div
          className="text-[#8a8a85] text-[13px] mb-4 flex items-center gap-1"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <span>Home</span>
          <span className="text-[11px]">&rsaquo;</span>
          <span className="text-[#3d3229] font-medium">Operators</span>
        </div>

        {/* Heading */}
        <div className="mb-12">
          <h2
            className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            All Operators
          </h2>
          <p
            className="text-[#8a8a85] text-[15px] md:text-[16px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Browse operators and their upcoming tours
          </p>
        </div>

        {/* Operators rows */}
        {!loading && rows.length === 0 && (
          <p className="text-[#8a8a85] text-[15px]" style={{ fontFamily: 'var(--font-inter)' }}>
            No operators available right now.
          </p>
        )}

        {rows.map(({ operator, tours }) => (
          <OperatorTourRow
            key={operator.id}
            operatorName={operator.operator_name}
            tourCount={operator.tours_hosted ?? tours.length}
            rating={operator.rating ?? 0}
            tours={tours}
            profileHref={`/operators/${operator.id}`}
          />
        ))}

        {/* See More Button */}
        {rows.length > 0 && (
          <div className="flex justify-center mt-12 mb-8">
            <button
              type="button"
              className="border border-[#1b7a3d] text-[#1b7a3d] hover:bg-[#1b7a3d] hover:text-white transition-all duration-300 rounded-full px-8 py-3 font-bold text-[14px] cursor-pointer"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              See More Operators
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <HomeFooter />
    </main>
  );
}
