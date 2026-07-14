'use client';

import { useRef, useState } from 'react';
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

  useGSAP(() => {
    // Start everything hidden
    gsap.set([boldLineRef.current, scrollHintRef.current], { opacity: 0, y: 60 });
    gsap.set(scriptLineRef.current, { opacity: 1 }); // visible but empty — typewriter fills it
    if (scriptLineRef.current) scriptLineRef.current.textContent = '';

    const tl = gsap.timeline();

    // Step 1 — wait 1s after load, then typewriter on script line
    tl.add(() => {
      if (!scriptLineRef.current || !cursorRef.current) return;
      const el = scriptLineRef.current;
      const cursor = cursorRef.current;
      let i = 0;
      const typeInterval = setInterval(() => {
        el.textContent = SCRIPT_TEXT.slice(0, i + 1);
        i++;
        if (i >= SCRIPT_TEXT.length) {
          clearInterval(typeInterval);
          // Blink cursor briefly then hide it
          gsap.to(cursor, {
            opacity: 0,
            duration: 0.15,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
              cursor.style.display = 'none';
              // Step 2 — "NORTHERN PAKISTAN" rises from below once typing done
              gsap.to(boldLineRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                onComplete: () => {
                  // Step 3 — scroll hint
                  gsap.to(scrollHintRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
                  // Step 4 — nav
                  setTimeout(() => setNavVisible(true), 300);
                  // Step 5 — search bar
                  setTimeout(() => setBarVisible(true), 600);
                },
              });
            },
          });
        }
      }, 55); // ~55ms per character = smooth typing speed
    }, 1); // 1s delay

  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative w-full h-screen min-h-[860px]">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
        onCanPlay={(e) => { (e.target as HTMLVideoElement).playbackRate = 1.8; }}
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
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        {/* Script line — typewriter fills this */}
        <p
          ref={scriptLineRef}
          className="font-alex-brush text-white text-[56px] leading-none mb-2"
          style={{ fontFamily: 'var(--font-alex-brush)', minHeight: '1.2em' }}
        >
          {/* filled by typewriter */}
          <span ref={cursorRef} className="inline-block w-[2px] h-[0.8em] bg-white align-middle ml-0.5 animate-pulse" />
        </p>

        {/* Bold line + 3D reflection */}
        <div ref={boldLineRef} className="flex flex-col items-center" style={{ lineHeight: 0 }}>
          {/* Real text */}
          <p
            className="font-anton text-white text-[130px] leading-none tracking-[1.3px]"
            style={{
              fontFamily: 'var(--font-anton)',
              textShadow: '0 8px 32px rgba(0,0,0,0.55), 0 2px 0 rgba(0,0,0,0.4)',
            }}
          >
            NORTHERN PAKISTAN
          </p>

          {/* Reflection — flipped vertically, fades out downward */}
          <p
            className="font-anton text-[130px] leading-none tracking-[1.3px] select-none pointer-events-none"
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
        className="absolute bottom-[60px] left-0 right-0 z-20 text-center text-white/70 text-[11px] tracking-[0.88px]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Scroll to explore
      </p>

      {/* Search / Filter bar */}
      <SearchFilterBar triggerEntrance={barVisible} />
    </section>
  );
}
