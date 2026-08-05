'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export interface MobileSidebarLink {
  label: string;
  href: string;
}

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  links: MobileSidebarLink[];
  variant?: 'dark' | 'light';
  cta?: { label: string; href: string };
}

export default function MobileSidebar({
  open,
  onClose,
  links,
  variant = 'light',
  cta,
}: MobileSidebarProps) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useGSAP(() => {
    if (!mounted || !panelRef.current || !backdropRef.current) return;

    if (open) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
      );
      gsap.fromTo(
        panelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.35, ease: 'power3.out' },
      );
    } else {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' });
      gsap.to(panelRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setMounted(false),
      });
    }
  }, [open, mounted]);

  if (!mounted) return null;

  const isDark = variant === 'dark';

  return (
    <div className="md:hidden fixed inset-0 z-[100]">
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        style={{ opacity: 0 }}
      />

      <div
        ref={panelRef}
        className={`absolute top-0 right-0 h-full w-[280px] sm:w-[320px] flex flex-col shadow-2xl ${
          isDark ? 'bg-[#0f4d28]' : 'bg-white'
        }`}
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="flex items-center justify-end px-5 pt-5 pb-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              isDark
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-[#3d3229] hover:text-[#1b7a3d] hover:bg-[#f5f1e8]'
            }`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 flex flex-col px-6 py-4 gap-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={`text-[16px] font-semibold py-4 border-b transition-colors ${
                isDark
                  ? 'text-white/90 hover:text-white border-white/10'
                  : 'text-[#3d3229] hover:text-[#1b7a3d] border-[#ede8dc]'
              }`}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {cta && (
          <div className="px-6 pb-8 pt-2">
            <Link
              href={cta.href}
              onClick={onClose}
              className="block text-center rounded-full px-6 py-3.5 text-[14px] font-bold transition-colors bg-white text-[#1b7a3d] hover:bg-[#f0fdf4]"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
