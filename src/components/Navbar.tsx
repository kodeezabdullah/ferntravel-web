'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import MobileSidebar from './MobileSidebar';

interface NavbarProps {
  /** When true the nav plays its entrance (called by HeroSection after all text animations) */
  triggerEntrance?: boolean;
}

// Exported so HeroSection can imperatively animate it via a forwarded ref pattern
export default function Navbar({ triggerEntrance }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    if (!navRef.current) return;
    // Start hidden — hero timeline will animate this in
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
    { label: 'Destinations', href: '#' },
    { label: 'Operators', href: '/operators' },
    { label: 'How It Works', href: '#' },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-[76px] transition-colors duration-200 ${
        menuOpen ? 'bg-[#0f4d28] md:bg-transparent' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-[72px]">
        {/* Logo + wordmark */}
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

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-[48px]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-white/90 hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA (Desktop) */}
        <a
          href="/login"
          className="hidden md:inline-flex bg-white rounded-full px-6 py-2.5 text-[11.5px] font-semibold text-[#1b7a3d] hover:bg-[#f0fdf4] transition-colors whitespace-nowrap items-center justify-center"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Log in / Sign up
        </a>

        {/* Hamburger Icon (Mobile) */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden text-white p-2 focus:outline-none cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <MobileSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
        cta={{ label: 'Log in / Sign up', href: '/login' }}
      />
    </nav>
  );
}
