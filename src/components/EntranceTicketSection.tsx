'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EntranceTicketSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const baseRef    = useRef<HTMLImageElement>(null);
  const tiltedRef  = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (!textRef.current || !baseRef.current || !tiltedRef.current) return;

    const st = { trigger: sectionRef.current, start: 'top 70%' };

    // Left slides in from left — 2s delay after section enters
    gsap.fromTo(textRef.current,
      { opacity: 0, x: -80 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 1.2, scrollTrigger: st }
    );

    // Both tickets slide in from right — 2s delay
    gsap.fromTo([baseRef.current, tiltedRef.current],
      { opacity: 0, x: 80 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 1.2, scrollTrigger: st }
    );

    // Top ticket rotates after 2s + 1.5s extra
    gsap.fromTo(tiltedRef.current,
      { rotation: 0 },
      { rotation: 18, duration: 0.7, ease: 'power2.out', delay: 2.7, scrollTrigger: st }
    );

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#faf7f2] py-[100px] px-[100px] flex items-center justify-between"
      style={{ minHeight: 500 }}
    >
      {/* LEFT */}
      <div ref={textRef} className="max-w-[500px]" style={{ opacity: 0 }}>
        <p className="text-[#1b7a3d] text-[12px] font-semibold tracking-[0.72px] mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
          TRAIL ACCESS
        </p>
        <h2 className="font-anton text-[#3d3229] text-[46px] leading-[1.1] mb-6" style={{ fontFamily: 'var(--font-anton)' }}>
          FAIRY MEADOWS<br />TREK PASS
        </h2>
        <p className="text-[13.5px] text-[#8a8a85] leading-[1.6] mb-10 max-w-[440px]" style={{ fontFamily: 'var(--font-inter)' }}>
          Every registered trail comes with a verified route, difficulty rating,
          and directions from Islamabad or Lahore — all confirmed before you set out.
        </p>
        <button className="bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white text-[13px] font-semibold rounded-full px-8 h-[50px]">
          View on App
        </button>
      </div>

      {/* RIGHT — mix-blend on the container so tickets composite each other normally first */}
      <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 520, height: 400, mixBlendMode: 'multiply' }}>
        {/* Base — flat, stays still */}
        <Image
          ref={baseRef}
          src="/assets/ticket.png"
          alt="Trek Pass"
          width={480}
          height={260}
          className="absolute rounded-2xl"
          style={{ opacity: 0, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'cover' }}
        />

        {/* Top — same position, rotates after 1.5s */}
        <Image
          ref={tiltedRef}
          src="/assets/ticket.png"
          alt="Trek Pass tilted"
          width={480}
          height={260}
          className="absolute rounded-2xl"
          style={{
            opacity: 0,
            top: '50%',
            left: '50%',
            translate: '-50% -50%',
            transformOrigin: 'center center',
            filter: 'drop-shadow(-14px 18px 30px rgba(0,0,0,0.28))',
            objectFit: 'cover',
          }}
        />
      </div>
    </section>
  );
}
