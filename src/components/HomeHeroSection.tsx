'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import HomeNavbar from './HomeNavbar';

const filters = [
  { icon: '/assets/icon-destination.svg', label: 'Destination', placeholder: 'Where do you want to go?' },
  { icon: '/assets/icon-triptype.svg', label: 'Trip Type', placeholder: 'Trek, Camp, or Cultural' },
  { icon: '/assets/icon-difficulty.svg', label: 'Difficulty', placeholder: 'Easy, Moderate, Hard' },
  { icon: '/assets/icon-budget.svg', label: 'Budget', placeholder: 'Average price range' },
];

function ResponsiveSearchFilterBar({
  triggerEntrance,
  filterModalOpen,
  setFilterModalOpen,
}: {
  triggerEntrance?: boolean;
  filterModalOpen: boolean;
  setFilterModalOpen: (open: boolean) => void;
}) {
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
    <>
      {/* Desktop Search / Filter bar */}
      <div
        ref={barRef}
        className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[65%] z-30 w-[1200px] max-w-[calc(100vw-48px)]"
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

          <button className="ml-4 flex-shrink-0 bg-[#1b7a3d] hover:bg-[#155f30] transition-colors rounded-[16px] h-[72px] w-[124px] flex items-center justify-center gap-2 ring-4 ring-white cursor-pointer">
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

      {/* Mobile Search Icon Button */}
      <button
        type="button"
        onClick={() => setFilterModalOpen(true)}
        aria-label="Open search filters"
        className={`md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-[#1b7a3d] text-white flex items-center justify-center shadow-lg hover:bg-[#155f30] transition-all duration-500 cursor-pointer ring-2 ring-white ${triggerEntrance ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      </button>

      {/* Mobile Search Filter Modal Overlay */}
      {filterModalOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setFilterModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 w-full max-w-[340px] shadow-2xl relative flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ede8dc] pb-3">
              <h3 className="text-[16px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
                Search Tours
              </h3>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f1e8] text-[#3d3229] flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {filters.map((f) => (
              <div key={f.label} className="flex items-center gap-3 border-b border-[#ede8dc] pb-3">
                <Image src={f.icon} alt={f.label} width={20} height={20} className="flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>{f.label}</p>
                  <p className="text-[11px] text-[#8a8a85] truncate" style={{ fontFamily: 'var(--font-inter)' }}>{f.placeholder}</p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setFilterModalOpen(false)}
              className="w-full bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white font-bold text-[14px] rounded-xl py-3 flex items-center justify-center gap-2 mt-1 cursor-pointer"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <Image src="/assets/icon-explore.svg" alt="" width={18} height={18} />
              <span>Explore</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [navVisible, setNavVisible] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current.children, { opacity: 0, y: 30 });
  }, { scope: heroRef });

  useEffect(() => {
    const startAnim = () => {
      setTimeout(() => {
        if (!containerRef.current) return;

        gsap.to(containerRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          onComplete: () => {
            setNavVisible(true);
            setTimeout(() => setBarVisible(true), 200);
          }
        });
      }, 300);
    };

    startAnim();
  }, []);

  return (
    <section ref={heroRef} className="relative w-full min-h-screen md:h-screen md:min-h-[780px] overflow-visible md:overflow-hidden pb-12 md:pb-0">
      <Image
        src="/assets/hero-bg.jpg"
        alt="Mountain landscape scenery in Pakistan"
        fill
        priority
        unoptimized
        className="object-cover object-center"
      />

      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <HomeNavbar triggerEntrance={navVisible} />

      <div
        ref={containerRef}
        className="relative md:absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pt-32 md:pt-0"
      >
        <p
          className="text-[#f2a93b] font-medium text-[14px] md:text-[16px] tracking-[4px] uppercase mb-4 italic"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          PAKISTAN AWAITS
        </p>

        <h1
          className="text-white text-[44px] md:text-[84px] font-black leading-[1.08] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-anton)' }}
        >
          Your Journey Starts
          <br />
          Before You Go
        </h1>

        <p
          className="text-white/85 text-[15px] md:text-[19px] max-w-[600px] mb-8 italic leading-relaxed"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Verified operators, real trails, every peak in Pakistan mapped for you.
        </p>

        <Link
          href="/tours"
          className="bg-white text-[#1b7a3d] hover:bg-[#f0fdf4] transition-colors rounded-full px-8 py-3.5 text-[14px] font-bold shadow-lg cursor-pointer inline-block text-center"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          View Tours
        </Link>
      </div>

      <ResponsiveSearchFilterBar
        triggerEntrance={barVisible}
        filterModalOpen={filterModalOpen}
        setFilterModalOpen={setFilterModalOpen}
      />
    </section>
  );
}