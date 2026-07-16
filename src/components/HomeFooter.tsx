import Link from 'next/link';

const footerColumns = [
  {
    heading: 'Explore',
    links: [
      { name: 'Tours', href: '#' },
      { name: 'Operators', href: '#' },
      { name: 'Explore Map', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Careers', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { name: 'Terms & Privacy', href: '#' },
      { name: 'Cancellation Policy', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f4d28] text-white pt-16 pb-8 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12">
          {/* Left column */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <span
              className="text-white text-3xl font-black tracking-[0.04em]"
              style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
            >
              Fernweh
            </span>
            <p
              className="italic text-white/80 text-[14px] font-medium"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Wander far, belong everywhere.
            </p>
            <p
              className="text-white/50 text-[12px] max-w-[320px] mt-1"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Discover Pakistan&apos;s trails with trusted operators.
            </p>
          </div>

          {/* Right link columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6">
            {footerColumns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-4">
                <span
                  className="text-white text-[14px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {col.heading}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-white/60 hover:text-white transition-colors text-[13px]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-white/40 text-[12px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            &copy; 2026 Fernweh Travels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
