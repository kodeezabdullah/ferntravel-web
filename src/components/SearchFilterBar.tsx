'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface SearchFilterBarProps {
  triggerEntrance?: boolean;
}

const filters = [
  { icon: '/assets/icon-destination.svg', label: 'Destination', placeholder: 'Where do you want to go?' },
  { icon: '/assets/icon-triptype.svg', label: 'Trip Type', placeholder: 'Trek, Camp, or Cultural' },
  { icon: '/assets/icon-difficulty.svg', label: 'Difficulty', placeholder: 'Easy, Moderate, Hard' },
  { icon: '/assets/icon-budget.svg', label: 'Budget', placeholder: 'Average price range' },
];

export default function SearchFilterBar({ triggerEntrance }: SearchFilterBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!barRef.current) return;
    gsap.set(barRef.current, { opacity: 0, y: 50 });
  }, []);

  useGSAP(() => {
    if (!triggerEntrance || !barRef.current) return;
    gsap.to(barRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [triggerEntrance]);

  return (
    <div
      ref={barRef}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-[1200px] max-w-[calc(100vw-48px)]"
    >
      <div className="bg-white rounded-[20px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.12)] h-[88px] flex items-center px-8">
        {filters.map((f, i) => (
          <div key={f.label} className="flex-1 flex items-center gap-3 min-w-0">
            <Image src={f.icon} alt={f.label} width={20} height={20} className="flex-shrink-0" />
            <div className="min-w-0">
              <p
                className="text-[12.5px] font-semibold text-[#3d3229] leading-none mb-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {f.label}
              </p>
              <p
                className="text-[11.5px] text-[#8a8a85] leading-none truncate"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {f.placeholder}
              </p>
            </div>
            {i < filters.length - 1 && (
              <div className="w-px h-12 bg-[#ede8dc] flex-shrink-0 ml-auto mr-4" />
            )}
          </div>
        ))}

        {/* Explore button */}
        <button className="ml-4 flex-shrink-0 bg-[#1b7a3d] hover:bg-[#155f30] transition-colors rounded-[16px] h-[72px] w-[124px] flex items-center justify-center gap-2">
          <Image src="/assets/icon-explore.svg" alt="" width={18} height={18} />
          <span
            className="text-white text-[14px] font-semibold"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Explore
          </span>
        </button>
      </div>
    </div>
  );
}
