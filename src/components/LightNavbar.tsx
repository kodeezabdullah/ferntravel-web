import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

interface LightNavbarProps {
  links?: NavLink[];
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Home', href: '/home' },
  { label: 'Tours', href: '/tours' },
  { label: 'Operators', href: '/operators' },
  { label: 'About Us', href: '#' },
  { label: 'Support', href: '#' },
];

export default function LightNavbar({ links = DEFAULT_LINKS }: LightNavbarProps) {
  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-[#ede8dc] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-[68px] flex items-center justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/home"
          className="text-[#1b7a3d] text-[22px] font-black tracking-[0.04em] flex-shrink-0"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Fernweh
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-[#5d5d5a] hover:text-[#1b7a3d] transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Account Icon */}
        <Link
          href="/settings"
          aria-label="Account profile"
          className="w-10 h-10 bg-[#1b7a3d] hover:bg-[#155f30] transition-colors rounded-full flex items-center justify-center text-white cursor-pointer flex-shrink-0"
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
