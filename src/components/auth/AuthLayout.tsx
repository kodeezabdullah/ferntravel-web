import type { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  /** Two-line headline — pass JSX so the amber keyword can be a <span> */
  headline: ReactNode;
  /** Short caption beneath the headline */
  subtext: string;
  /** The right-panel content (the form card) */
  children: ReactNode;
}

export default function AuthLayout({ headline, subtext, children }: AuthLayoutProps) {
  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      {/* ── LEFT PANEL (55%) ── */}
      <div className="relative hidden md:flex md:w-[55%] flex-col">
        {/* Background photo */}
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80"
          alt="Mountain landscape — Hunza Valley, Pakistan"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />

        {/* Dark gradient overlay — stronger at bottom for text */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.18) 100%)',
          }}
        />

        {/* Top-left wordmark */}
        <div className="relative z-10 p-9">
          <span
            className="text-white text-2xl font-black tracking-wide select-none"
            style={{ fontFamily: 'var(--font-poppins), sans-serif', letterSpacing: '0.04em' }}
          >
            Fernweh
          </span>
        </div>

        {/* Bottom-left headline + subtext */}
        <div className="relative z-10 mt-auto p-9 pb-14">
          <h1
            className="text-white text-5xl font-black leading-[1.15] mb-4"
            style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
          >
            {headline}
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed max-w-[340px]">
            {subtext}
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL (45%) ── */}
      <div
        className="flex flex-1 md:w-[45%] items-center justify-center px-6 py-10 overflow-y-auto"
        style={{ background: '#0a0a0a' }}
      >
        {children}
      </div>
    </div>
  );
}
