'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '@/lib/auth-context';

export interface MobileSidebarLink {
  label: string;
  href: string;
}

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  links: MobileSidebarLink[];
  cta?: { label: string; href: string };
}

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function CompassIcon({ className }: IconProps) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-2 5-5 2 2-5z" />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 5 18.5V20" />
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M19 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" />
      <path d="M15 4.13a3.5 3.5 0 0 1 0 6.74" />
    </svg>
  );
}

function InfoIcon({ className }: IconProps) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.51v.01" />
    </svg>
  );
}

function LifeBuoyIcon({ className }: IconProps) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m8.5 8.5-2.7-2.7M18.2 6.2l-2.7 2.3M15.5 15.5l2.7 2.7M5.8 17.8l2.7-2.3" />
    </svg>
  );
}

function MapPinIcon({ className }: IconProps) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

function LayersIcon({ className }: IconProps) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </svg>
  );
}

function iconForLink(link: MobileSidebarLink) {
  const href = link.href.toLowerCase();
  const label = link.label.toLowerCase();
  if (href === '/home' || href === '/') return HomeIcon;
  if (href.startsWith('/tours')) return CompassIcon;
  if (href.startsWith('/operators')) return UsersIcon;
  if (href.startsWith('/about')) return InfoIcon;
  if (href.startsWith('/support')) return LifeBuoyIcon;
  if (label.includes('destination')) return MapPinIcon;
  if (label.includes('how it works')) return LayersIcon;
  return CompassIcon;
}

export default function MobileSidebar({
  open,
  onClose,
  links,
  cta,
}: MobileSidebarProps) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user } = useAuth();

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

  if (!mounted || typeof document === 'undefined') return null;

  const initials = (user?.full_name ?? user?.email ?? 'F W')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return createPortal(
    <div className="md:hidden fixed inset-0 z-[100]">
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        style={{ opacity: 0 }}
      />

      <div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-[290px] sm:w-[320px] flex flex-col bg-[#faf7f2] shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Header: wordmark + close */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/logo-nav.png"
              alt="Fernweh logo"
              width={28}
              height={25}
              className="object-contain"
            />
            <span
              className="text-[#1b7a3d] text-[17px] font-black tracking-[0.03em]"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Fernweh
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors text-[#8a8a85] hover:text-[#1b7a3d] hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col px-4 pt-2 gap-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = iconForLink(link);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-colors ${
                  isActive
                    ? 'bg-[#1b7a3d] text-white shadow-[0_4px_14px_rgba(27,122,61,0.3)]'
                    : 'text-[#5d5d5a] hover:bg-white hover:text-[#3d3229]'
                }`}
              >
                <Icon className={isActive ? 'text-white' : 'text-[#8a8a85]'} />
                <span
                  className="text-[15px] font-semibold"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {cta && (
          <div className="px-4 pb-3">
            <Link
              href={cta.href}
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[14px] font-bold transition-colors border-2 border-[#1b7a3d] text-[#1b7a3d] hover:bg-[#1b7a3d] hover:text-white"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {cta.label}
            </Link>
          </div>
        )}

        {/* Profile card */}
        <div className="px-4 pb-5 pt-2">
          <Link
            href={user ? '/settings' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 bg-white rounded-2xl px-3.5 py-3 shadow-sm border border-[#ede8dc] hover:border-[#1b7a3d]/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#1b7a3d] text-white flex items-center justify-center overflow-hidden shrink-0">
              {user?.profile_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profile_photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-inter)' }}>
                  {initials}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[13.5px] font-bold text-[#3d3229] truncate"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {user ? (user.full_name || 'Your account') : 'Log in'}
              </p>
              <p
                className="text-[11.5px] text-[#8a8a85] truncate"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {user ? user.email : 'Access your bookings'}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#c8c2b0] shrink-0">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
