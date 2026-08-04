'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Navbar from './Navbar';
import SearchFilterBar from './SearchFilterBar';

const SCRIPT_TEXT = 'Explore the Beauty of';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const scriptLineRef = useRef<HTMLParagraphElement>(null);
  const boldLineRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const [navVisible, setNavVisible] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Hide animated elements immediately on mount
  useGSAP(() => {
    gsap.set([boldLineRef.current, scrollHintRef.current], { opacity: 0, y: 60 });
    gsap.set(scriptLineRef.current, { opacity: 1 });
    if (scriptLineRef.current) scriptLineRef.current.textContent = '';
  }, { scope: heroRef });

  // Start animation only after loading screen finishes
  useEffect(() => {
    let typeInterval: ReturnType<typeof setInterval> | null = null;

    const startAnim = () => {
      setTimeout(() => {
        if (!scriptLineRef.current || !cursorRef.current) return;
        const el = scriptLineRef.current;
        const cursor = cursorRef.current;
        let i = 0;

        typeInterval = setInterval(() => {
          el.textContent = SCRIPT_TEXT.slice(0, i + 1);
          i++;
          if (i >= SCRIPT_TEXT.length) {
            clearInterval(typeInterval!);
            typeInterval = null;

            gsap.to(cursor, {
              opacity: 0,
              duration: 0.15,
              repeat: 3,
              yoyo: true,
              onComplete: () => {
                cursor.style.display = 'none';

                gsap.to(boldLineRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  ease: 'power3.out',
                  onComplete: () => {
                    gsap.to(scrollHintRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
                    setTimeout(() => setNavVisible(true), 300);
                    setTimeout(() => setBarVisible(true), 600);
                  },
                });
              },
            });
          }
        }, 55);
      }, 300);
    };

    window.addEventListener('fernweh:loaded', startAnim, { once: true });
    return () => {
      window.removeEventListener('fernweh:loaded', startAnim);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-screen min-h-[700px] md:min-h-[860px] overflow-x-clip md:overflow-visible">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center"
        onCanPlay={(e) => {
          (e.target as HTMLVideoElement).playbackRate = 1.8;
          window.dispatchEvent(new Event('fernweh:videoready'));
        }}
      >
        <source src="/assets/hero-video.webm" type="video/webm" />
      </video>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Navbar */}
      <Navbar triggerEntrance={navVisible} />

      {/* Hero copy */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        {/* Script line — typewriter fills this */}
        <p
          ref={scriptLineRef}
          className="font-alex-brush text-white text-[36px] sm:text-[48px] md:text-[56px] leading-none mb-2"
          style={{ fontFamily: 'var(--font-alex-brush)', minHeight: '1.2em' }}
        >
          <span ref={cursorRef} className="inline-block w-[2px] h-[0.8em] bg-white align-middle ml-0.5 animate-pulse" />
        </p>

        {/* Bold line + 3D reflection */}
        <div className="flex flex-col items-center max-w-full overflow-hidden px-2" style={{ lineHeight: 0 }}>
          <p
            ref={boldLineRef}
            className="font-anton text-white text-[36px] sm:text-[60px] md:text-[130px] leading-none tracking-[1px] md:tracking-[1.3px] whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-anton)',
              textShadow: '0 8px 32px rgba(0,0,0,0.55), 0 2px 0 rgba(0,0,0,0.4)',
            }}
          >
            NORTHERN PAKISTAN
          </p>

          {/* Reflection — flipped vertically, fades out downward */}
          <p
            className="font-anton text-[36px] sm:text-[60px] md:text-[130px] leading-none tracking-[1px] md:tracking-[1.3px] select-none pointer-events-none whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-anton)',
              transform: 'scaleY(-1)',
              marginTop: 4,
              color: 'rgba(0,0,0,0.55)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 65%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 65%)',
              filter: 'blur(2px)',
            }}
          >
            NORTHERN PAKISTAN
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <p
        ref={scrollHintRef}
        className="absolute bottom-[80px] md:bottom-[60px] left-0 right-0 z-20 text-center text-white/70 text-[11px] tracking-[0.88px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Scroll to explore
      </p>

      {/* Desktop Search / Filter bar */}
      <div className="hidden md:block">
        <SearchFilterBar triggerEntrance={barVisible} />
      </div>

      {/* Mobile Search Icon Button */}
      <button
        type="button"
        onClick={() => setFilterModalOpen(true)}
        aria-label="Open search filters"
        className={`md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-[#1b7a3d] text-white flex items-center justify-center shadow-lg hover:bg-[#155f30] transition-all duration-500 cursor-pointer ring-2 ring-white ${barVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
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

            {[
              { icon: '/assets/icon-destination.svg', label: 'Destination', placeholder: 'Where do you want to go?' },
              { icon: '/assets/icon-triptype.svg', label: 'Trip Type', placeholder: 'Trek, Camp, or Cultural' },
              { icon: '/assets/icon-difficulty.svg', label: 'Difficulty', placeholder: 'Easy, Moderate, Hard' },
              { icon: '/assets/icon-budget.svg', label: 'Budget', placeholder: 'Average price range' },
            ].map((f) => (
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
    </section>
  );
}
