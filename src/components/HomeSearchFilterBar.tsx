'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface SearchFilterBarProps {
  triggerEntrance?: boolean;
}

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

  const items = [
    { label: 'Destination', value: 'Northern Areas' },
    { label: 'Check-in', value: '18 Jul 2026' },
    { label: 'Check-out', value: '21 Jul 2026' },
    { label: 'Travelers', value: '2 Adults' },
  ];

  return (
    <div
      ref={barRef}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[50%] z-30 w-[1200px] max-w-[calc(100vw-48px)] px-4 md:px-0"
    >
      <div className="bg-white rounded-[24px] shadow-[0px_12px_40px_0px_rgba(0,0,0,0.08)] flex max-md:flex-col items-center justify-between p-4 md:p-3 pl-8 md:pl-10 border border-[#ede8dc]">
        <div className="flex flex-1 max-md:flex-col max-md:w-full items-center justify-between gap-6 md:gap-8">
          {items.map((item, idx) => (
            <div key={item.label} className="flex-1 flex items-center justify-between w-full min-w-0">
              <div className="min-w-0">
                <p
                  className="text-[11px] uppercase tracking-wider font-bold text-[#8a8a85] mb-1"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-[15px] font-bold text-[#3d3229] truncate"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {item.value}
                </p>
              </div>
              {idx < items.length - 1 && (
                <div className="hidden md:block w-px h-10 bg-[#ede8dc] ml-auto mr-4" />
              )}
            </div>
          ))}
        </div>

        {/* Search button */}
        <button className="max-md:mt-4 max-md:w-full flex-shrink-0 bg-[#1b7a3d] hover:bg-[#155f30] transition-colors rounded-full h-[60px] px-8 flex items-center justify-center gap-3 cursor-pointer shadow-md">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span
            className="text-white text-[15px] font-bold"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Search
          </span>
        </button>
      </div>
    </div>
  );
}
