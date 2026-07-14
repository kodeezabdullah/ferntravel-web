'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WordmarkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      [sublineRef.current, lettersRef.current],
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full h-[500px] overflow-hidden">
      {/* Background photo */}
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
        <p
          ref={sublineRef}
          className="font-alex-brush text-white text-[32px] leading-none mb-4 text-center"
          style={{ fontFamily: 'var(--font-alex-brush)' }}
        >
          Your Northern Pakistan Specialist
        </p>
        <div ref={lettersRef} className="relative" style={{ width: 576.811, height: 146.094 }}>
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
