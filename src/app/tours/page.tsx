'use client';

import { useEffect, useState } from 'react';
import HomeNavbar from '@/components/HomeNavbar';
import HomeFooter from '@/components/HomeFooter';
import DestinationTourRow, { Tour } from '@/components/DestinationTourRow';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import type { Tour as ApiTour } from '@/types/api';

const FALLBACK_IMAGE = '/assets/nature-1.jpg';

interface DestinationGroup {
  destination: string;
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

export default function ToursPage() {
  const [groups, setGroups] = useState<DestinationGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiFetch<ApiTour[]>('/tours?limit=50')
      .then((tours) => {
        if (cancelled) return;
        const byDestination = new Map<string, ApiTour[]>();
        for (const tour of tours) {
          const key = tour.destination || 'Other';
          if (!byDestination.has(key)) byDestination.set(key, []);
          byDestination.get(key)!.push(tour);
        }
        setGroups(
          Array.from(byDestination.entries()).map(([destination, tours]) => ({
            destination,
            tours: tours.map(toRowTour),
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setGroups([]);
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

      {/* Shorter Hero Banner */}
      <section className="relative w-full h-[380px] md:h-[420px] overflow-hidden flex items-center px-6 md:px-16">
        {/* Background photo */}
        <Image
          src="/assets/hunza-valley.jpg"
          alt="Scenic Mountain Valley"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        {/* Hero content */}
        <div className="relative z-20 max-w-[600px]">
          <p
            className="text-[#f2a93b] font-medium text-[13px] md:text-[14px] tracking-[4px] uppercase mb-3 italic"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            EXPLORE PAKISTAN
          </p>
          <h1
            className="text-white text-[36px] md:text-[56px] font-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            Find Your Next Adventure
          </h1>
          <p
            className="text-white/85 text-[15px] md:text-[17px] italic max-w-[500px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Handpicked tours across every valley, from Naran to Hunza.
          </p>
        </div>
      </section>

      {/* Main page content area */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <div
          className="text-[#8a8a85] text-[13px] mb-4 flex items-center gap-1"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <span>Home</span>
          <span className="text-[11px]">&rsaquo;</span>
          <span className="text-[#3d3229] font-medium">All Tours</span>
        </div>

        {/* Page Heading */}
        <div className="mb-12">
          <h2
            className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            All Tours
          </h2>
          <p
            className="text-[#8a8a85] text-[15px] md:text-[16px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Browse verified tours by destination across Pakistan
          </p>
        </div>

        {/* Destinations Rows */}
        {!loading && groups.length === 0 && (
          <p className="text-[#8a8a85] text-[15px]" style={{ fontFamily: 'var(--font-inter)' }}>
            No tours available right now.
          </p>
        )}
        {groups.map((group) => (
          <DestinationTourRow
            key={group.destination}
            destinationName={group.destination}
            tourCount={group.tours.length}
            tours={group.tours}
          />
        ))}
      </section>

      {/* Footer */}
      <HomeFooter />
    </main>
  );
}
