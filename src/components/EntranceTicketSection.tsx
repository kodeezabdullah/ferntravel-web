'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EntranceTicketSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const baseRef     = useRef<HTMLDivElement>(null);
  const tiltedRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const st = { trigger: sectionRef.current, start: 'top 70%' };

    // Left text slides in from left
    gsap.fromTo(textRef.current,
      { opacity: 0, x: -80 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 1.2, scrollTrigger: st }
    );

    // Both tickets slide in from right
    gsap.fromTo([baseRef.current, tiltedRef.current],
      { opacity: 0, x: 80 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 1.2, scrollTrigger: st }
    );

    // Top ticket rotates after entry
    gsap.fromTo(tiltedRef.current,
      { rotation: 0 },
      { rotation: 18, duration: 0.7, ease: 'power2.out', delay: 2.7, scrollTrigger: st }
    );

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#faf7f2] py-12 md:py-[100px] px-6 md:px-[100px] flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 overflow-hidden"
      style={{ minHeight: 450 }}
    >
      {/* LEFT */}
      <div ref={textRef} className="w-full max-w-full md:max-w-[500px] text-center md:text-left flex flex-col items-center md:items-start" style={{ opacity: 0 }}>
        <p className="text-[#1b7a3d] text-[12px] font-semibold tracking-[0.72px] mb-3 md:mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
          TRAIL ACCESS
        </p>
        <h2 className="font-anton text-[#3d3229] text-[32px] md:text-[46px] leading-[1.1] mb-4 md:mb-6" style={{ fontFamily: 'var(--font-anton)' }}>
          FAIRY MEADOWS<br />TREK PASS
        </h2>
        <p className="text-[13.5px] text-[#8a8a85] leading-[1.6] mb-6 md:mb-10 max-w-[440px]" style={{ fontFamily: 'var(--font-inter)' }}>
          Every registered trail comes with a verified route, difficulty rating,
          and directions from Islamabad or Lahore — all confirmed before you set out.
        </p>
        <button className="bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white text-[13px] font-semibold rounded-full px-8 h-[50px] cursor-pointer">
          View on App
        </button>
      </div>

      {/* RIGHT — mix-blend on container so tickets composite each other first */}
      <div
        className="relative flex-shrink-0 w-full max-w-[340px] md:max-w-none md:w-[520px] h-[240px] md:h-[400px]"
        style={{ mixBlendMode: 'multiply' }}
      >
        {/* Base ticket wrapper — GSAP animates this div */}
        <div
          ref={baseRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <Image
            src="/assets/ticket.png"
            alt="Trek Pass"
            width={480}
            height={260}
            className="max-w-[90%] md:max-w-full h-auto object-contain"
            loading="eager"
          />
        </div>

        {/* Tilted ticket wrapper — GSAP animates this div, rotation applied here */}
        <div
          ref={tiltedRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: 0,
            transformOrigin: 'center center',
            filter: 'drop-shadow(-14px 18px 30px rgba(0,0,0,0.28))',
          }}
        >
          <Image
            src="/assets/ticket.png"
            alt="Trek Pass tilted"
            width={480}
            height={260}
            className="max-w-[90%] md:max-w-full h-auto object-contain"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
