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

    // Bar crawls to 85% while video loads in background
    gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 0.85, duration: 6, ease: 'power1.out' });

    let i = 0;
    const interval = setInterval(() => {
      el.textContent = LOADING_TEXT.slice(0, i + 1);
      i++;
      if (i >= LOADING_TEXT.length) {
        clearInterval(interval);

        gsap.to(sub, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.25 });

        // Wait for video to be ready to play (minimum 1.2s for animation to breathe)
        const minWait = new Promise<void>((res) => setTimeout(res, 1200));
        const videoReady = new Promise<void>((res) => {
          window.addEventListener('fernweh:videoready', () => res(), { once: true });
        });
        // Hard fallback — never block longer than 8s even on very slow connections
        const maxWait = new Promise<void>((res) => setTimeout(res, 8000));

        Promise.race([Promise.all([minWait, videoReady]), maxWait]).then(() => {
          gsap.to(bar, {
            scaleX: 1,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.7,
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
