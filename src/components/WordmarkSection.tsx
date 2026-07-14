'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WordmarkSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const sublineRef  = useRef<HTMLParagraphElement>(null);
  const lettersRef  = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sublineRef.current || !lettersRef.current) return;

    // Start state — both invisible
    gsap.set(sublineRef.current,  { opacity: 0, y: -50 });
    gsap.set(lettersRef.current,  { opacity: 0, scale: 1.04 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      },
    });

    // Step 1 — subtitle drifts down from top, 2s after section enters
    tl.to(sublineRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
    }, 1.2);

    // Step 2 — FERNWEH letters dim-to-vivid, 0.8s after subtitle starts
    tl.to(lettersRef.current, {
      opacity: 1,
      scale: 1,
      duration: 2.8,
      ease: 'power1.inOut',
    }, 2);

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full h-[500px] overflow-hidden">
      {/* Background photo — visible immediately on enter */}
      <Image
        src="/assets/wordmark-bg.jpg"
        alt="Northern Pakistan landscape"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        {/* Subtitle — slides in from top */}
        <p
          ref={sublineRef}
          className="font-alex-brush text-white text-[32px] leading-none mb-6 text-center"
          style={{ fontFamily: 'var(--font-alex-brush)' }}
        >
          Your Northern Pakistan Specialist
        </p>

        {/* FERNWEH photo-clip letters — dims in slowly */}
        <div ref={lettersRef} style={{ width: 580, height: 150 }}>
          <Image
            src="/assets/fernweh-letters.png"
            alt="FERNWEH"
            width={580}
            height={150}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
