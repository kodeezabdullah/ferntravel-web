'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const LOADING_TEXT = 'FERNWEH';
const SUBTITLE = 'Explore the North';

export default function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    const sub = subtitleRef.current;
    const bar = barFillRef.current;
    if (!el || !sub || !bar) return;

    el.textContent = '';

    // Progress bar crawls to 80% while typing / loading
    gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 0.8, duration: 3, ease: 'power1.out' });

    let i = 0;
    const interval = setInterval(() => {
      el.textContent = LOADING_TEXT.slice(0, i + 1);
      i++;
      if (i >= LOADING_TEXT.length) {
        clearInterval(interval);

        // Subtitle fades in after typing finishes
        gsap.to(sub, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.25 });

        const minWait = new Promise<void>((res) => setTimeout(res, 900));
        const pageReady = new Promise<void>((res) => {
          if (document.readyState === 'complete') res();
          else window.addEventListener('load', () => res(), { once: true });
        });
        // Never block more than 5s on a slow connection
        const maxWait = new Promise<void>((res) => setTimeout(res, 5000));

        Promise.race([Promise.all([minWait, pageReady]), maxWait]).then(() => {
          // Snap bar to 100%, then fade the whole overlay out
          gsap.to(bar, {
            scaleX: 1,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
              gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.65,
                ease: 'power2.inOut',
                delay: 0.1,
                onComplete: () => {
                  window.dispatchEvent(new Event('fernweh:loaded'));
                  setDone(true);
                },
              });
            },
          });
        });
      }
    }, 140);

    return () => clearInterval(interval);
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#faf7f2' }}
    >
      {/* Main typewriter text */}
      <p
        ref={textRef}
        style={{
          fontFamily: 'var(--font-anton)',
          fontSize: 'clamp(56px, 9vw, 110px)',
          color: '#1b7a3d',
          letterSpacing: '10px',
          lineHeight: 1,
          minHeight: '1.2em',
        }}
      />

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontFamily: 'var(--font-alex-brush)',
          fontSize: 'clamp(22px, 3vw, 38px)',
          color: '#8a8a85',
          marginTop: 12,
          opacity: 0,
          transform: 'translateY(8px)',
        }}
      >
        {SUBTITLE}
      </p>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 3, background: 'rgba(0,0,0,0.06)' }}
      >
        <div
          ref={barFillRef}
          style={{
            height: '100%',
            background: '#1b7a3d',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  );
}
