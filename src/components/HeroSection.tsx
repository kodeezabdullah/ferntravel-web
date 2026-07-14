'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import Navbar from './Navbar';
import SearchFilterBar from './SearchFilterBar';

gsap.registerPlugin(SplitText);

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const scriptLineRef = useRef<HTMLParagraphElement>(null);
  const boldLineRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLParagraphElement>(null);

  const [navVisible, setNavVisible] = useState(false);
  const [barVisible, setBarVisible] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Step 1 — BG already visible, script + bold start hidden
    gsap.set([scriptLineRef.current, boldLineRef.current, scrollHintRef.current], {
      opacity: 0,
      y: 60,
    });

    // Step 2 — script line rises (0.3s)
    tl.to(scriptLineRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.3);

    // Step 2b — bold line rises 0.15s after script
    tl.to(boldLineRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.45);

    // Step 3 — character light sweep on "NORTHERN PAKISTAN"
    tl.add(() => {
      if (!boldLineRef.current) return;
      const split = SplitText.create(boldLineRef.current, { type: 'chars' });
      gsap.fromTo(
        split.chars,
        { textShadow: '0 0 0px rgba(255,255,255,0)' },
        {
          textShadow: '0 0 18px rgba(255,255,255,0.85), 0 4px 12px rgba(0,0,0,0.35)',
          duration: 0.3,
          stagger: 0.03,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
          onComplete: () => split.revert(),
        }
      );
    }, 0.9);

    // Step 4 — scroll hint fades in (~1.8s)
    tl.to(scrollHintRef.current, { opacity: 1, y: 0, duration: 0.5 }, 1.8);

    // Step 5 — nav (~2.1s)
    tl.add(() => setNavVisible(true), 2.1);

    // Step 6 — search bar (~2.4s)
    tl.add(() => setBarVisible(true), 2.4);
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative w-full h-screen min-h-[860px] overflow-hidden">
      {/* Background image */}
      <Image
        src="/assets/hero-bg.jpg"
        alt="Northern Pakistan mountains"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Navbar — starts hidden, animated in at step 5 */}
      <Navbar triggerEntrance={navVisible} />

      {/* Hero copy — centered */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <p
          ref={scriptLineRef}
          className="font-alex-brush text-white text-[56px] leading-none mb-2"
          style={{ fontFamily: 'var(--font-alex-brush)' }}
        >
          Explore the Beauty of
        </p>
        <p
          ref={boldLineRef}
          className="font-anton text-white text-[130px] leading-none tracking-[1.3px]"
          style={{ fontFamily: 'var(--font-anton)' }}
        >
          NORTHERN PAKISTAN
        </p>
      </div>

      {/* Scroll hint */}
      <p
        ref={scrollHintRef}
        className="absolute bottom-[60px] left-0 right-0 z-20 text-center text-white/70 text-[11px] tracking-[0.88px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Scroll to explore
      </p>

      {/* Search / Filter bar — floats over hero bottom edge */}
      <SearchFilterBar triggerEntrance={barVisible} />
    </section>
  );
}
