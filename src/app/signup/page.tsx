'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import RoleSwitcher from '@/components/auth/RoleSwitcher';
import AuthInput from '@/components/auth/AuthInput';

/* ── Eye icon SVGs ── */
function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── Google G SVG ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.45 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── Or divider ── */
function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-3.5">
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
      <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)' }}>
        or
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
    </div>
  );
}

const ROLE_OPTIONS: [string, string] = ['Sign up as Traveler', 'Sign up as Operator'];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      headline={
        <>
          Explore Pakistan&apos;s
          <br />
          <span style={{ color: '#f2a93b' }}>wildest peaks</span>
        </>
      }
      subtext="Join thousands of travellers discovering trails across the north."
    >
      <AuthCard>
        {/* Role switcher */}
        <RoleSwitcher
          options={ROLE_OPTIONS}
          value={role}
          onChange={setRole}
        />

        {/* Heading */}
        <div className="mb-4.5">
          <h2
            className="text-white text-[22px] font-bold mb-1"
            style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
          >
            Create account
          </h2>
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Start your adventure with Fernweh
          </p>
        </div>

        {/* Fields */}
        <AuthInput
          id="signup-name"
          label="Full Name"
          type="text"
          placeholder="Abdullah Khan"
          autoComplete="name"
        />

        <AuthInput
          id="signup-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />

        <AuthInput
          id="signup-phone"
          label="Phone Number"
          type="tel"
          placeholder="+92 300 0000000"
          autoComplete="tel"
        />

        <AuthInput
          id="signup-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="new-password"
          rightSlot={
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((p) => !p)}
              style={{ color: 'rgba(255,255,255,0.4)' }}
              className="hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff /> : <EyeOpen />}
            </button>
          }
        />

        {/* Primary CTA */}
        <button
          id="signup-submit"
          type="button"
          onClick={() => router.push('/home')}
          className="w-full rounded-full py-3 text-[15px] font-bold mt-2 transition-all duration-150 hover:brightness-105 active:scale-[0.98]"
          style={{
            background: '#f2a93b',
            color: '#1a1a1a',
            fontFamily: 'var(--font-poppins), sans-serif',
          }}
        >
          Create account
        </button>

        <OrDivider />

        {/* Google button */}
        <button
          id="signup-google"
          type="button"
          onClick={() => router.push('/home')}
          className="w-full rounded-full py-3 text-[14px] font-medium flex items-center justify-center gap-3 transition-all duration-150 hover:bg-white/10 active:scale-[0.98]"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Footer */}
        <div className="mt-4 flex flex-col items-center gap-2 text-center">
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)' }}>
            By signing up, you agree to our{' '}
            <a
              href="#"
              className="underline transition-opacity hover:opacity-80"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Terms
            </a>
            {' '}&amp;{' '}
            <a
              href="#"
              className="underline transition-opacity hover:opacity-80"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Privacy Policy
            </a>
          </p>
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-inter)' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold transition-opacity hover:opacity-80"
              style={{ color: '#f2a93b' }}
            >
              Log in
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
