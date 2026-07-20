'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface NavbarProps {
  triggerEntrance?: boolean;
}

export default function HomeNavbar({ triggerEntrance }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, { opacity: 0, y: -40 });
  }, []);

  useGSAP(() => {
    if (!triggerEntrance || !navRef.current) return;
    gsap.to(navRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [triggerEntrance]);

  const navLinks = [
    { label: 'Home', href: '/home' },
    { label: 'Tours', href: '/tours' },
    { label: 'Operators', href: '/operators' },
    { label: 'About Us', href: '#' },
    { label: 'Support', href: '#' },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[76px] h-[72px]"
      style={{ background: 'transparent' }}
    >
      <div className="flex items-center gap-3">
        <Image
          src="/assets/logo-nav.png"
          alt="Fernweh logo"
          width={42}
          height={38}
          className="object-contain"
        />
        <span
          className="font-anton text-white text-[22px] tracking-[0.88px]"
          style={{ fontFamily: 'var(--font-anton)' }}
        >
          FERNWEH
        </span>
      </div>

      <div className="flex items-center gap-[48px]">
        {navLinks.map((item) => {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-white/90 hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/tours"
          className="bg-white rounded-full px-6 py-2.5 text-[12px] font-bold text-[#1b7a3d] hover:bg-[#f0fdf4] transition-colors whitespace-nowrap"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Book Now
        </Link>
        <Link
          href="/settings"
          aria-label="Account profile"
          className="w-10 h-10 bg-white hover:bg-white/90 transition-colors rounded-full flex items-center justify-center text-[#1b7a3d] cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}