import type { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  /** Two-line headline — pass JSX so the amber keyword can be a <span> */
  headline: ReactNode;
  /** Short caption beneath the headline */
  subtext: string;
  /** The card contents — floats on the right over the photo */
  children: ReactNode;
}

export default function AuthLayout({ headline, subtext, children }: AuthLayoutProps) {
  return (
    <div
      className="relative min-h-screen w-full overflow-y-auto"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      {/* ── Full-bleed background photo (fixed to prevent scrolling) ── */}
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=85"
          alt="Mountain landscape — Hunza Valley, Pakistan"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0.10) 100%)',
          }}
        />
      </div>

      {/* ── Wordmark — top-left ── */}
      <div className="absolute top-9 left-9 z-10 pointer-events-none">
        <span
          className="text-white text-2xl font-black select-none"
          style={{ fontFamily: 'var(--font-poppins), sans-serif', letterSpacing: '0.04em' }}
        >
          Fernweh
        </span>
      </div>

      {/* ── Headline + subtext — bottom-left ── */}
      <div className="absolute bottom-14 left-9 z-10 max-w-[460px] pointer-events-none hidden md:block">
        <h1
          className="text-white text-5xl font-black leading-[1.15] mb-4"
          style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
        >
          {headline}
        </h1>
        <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>
          {subtext}
        </p>
      </div>

      {/* ── Card wrapper — allows content to determine height and page to scroll ── */}
      <div
        className="
          relative z-10 min-h-screen w-full flex items-center py-10 md:py-6
          md:justify-end md:pr-[8%]
          max-md:justify-center max-md:px-4 max-md:items-end max-md:pb-6
        "
      >
        <div className="md:w-[420px] max-md:w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
