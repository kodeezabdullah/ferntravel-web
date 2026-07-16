'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Navbar from './Navbar';
import SearchFilterBar from './SearchFilterBar';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [navVisible, setNavVisible] = useState(false);
  const [barVisible, setBarVisible] = useState(false);

  // Hide animated elements immediately on mount, then trigger after loaded
  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current.children, { opacity: 0, y: 30 });
  }, { scope: heroRef });

  useEffect(() => {
    const startAnim = () => {
      setTimeout(() => {
        if (!containerRef.current) return;
        
        // Fade up the text content sequentially
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

    window.addEventListener('fernweh:loaded', startAnim, { once: true });
    return () => window.removeEventListener('fernweh:loaded', startAnim);
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-screen min-h-[780px] overflow-hidden">
      {/* Background image */}
      <Image
        src="/assets/hero-bg.jpg"
        alt="Mountain landscape scenery in Pakistan"
        fill
        priority
        unoptimized
        className="object-cover object-center"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Navbar */}
      <Navbar triggerEntrance={navVisible} />

      {/* Hero copy */}
      <div 
        ref={containerRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
      >
        {/* Centered small italic amber text */}
        <p
          className="text-[#f2a93b] font-medium text-[14px] md:text-[16px] tracking-[4px] uppercase mb-4 italic"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          PAKISTAN AWAITS
        </p>

        {/* Centered large bold headline */}
        <h1
          className="text-white text-[48px] md:text-[84px] font-black leading-[1.08] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-anton)' }}
        >
          Your Journey Starts
          <br />
          Before You Go
        </h1>

        {/* Centered italic subtext */}
        <p
          className="text-white/85 text-[16px] md:text-[19px] max-w-[600px] mb-8 italic leading-relaxed"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Verified operators, real trails, every peak in Pakistan mapped for you.
        </p>

        {/* View Tours button */}
        <button
          type="button"
          className="bg-white text-[#1b7a3d] hover:bg-[#f0fdf4] transition-colors rounded-full px-8 py-3.5 text-[14px] font-bold shadow-lg cursor-pointer"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          View Tours
        </button>
      </div>

      {/* Search Filter Bar */}
      <SearchFilterBar triggerEntrance={barVisible} />
    </section>
  );
}
