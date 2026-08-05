import Image from 'next/image';

const footerLinks = [
  {
    heading: 'Explore',
    links: ['Destinations', 'Travel Agencies', 'How It Works'],
  },
  {
    heading: 'For Operators',
    links: ['Register as Operator', 'Operator Login'],
  },
  {
    heading: 'Company',
    links: ['About Fernweh', 'Contact'],
  },
  {
    heading: 'Legal',
    links: ['Privacy Policy', 'Terms & Conditions'],
  },
];

const LINK_HREFS: Record<string, string> = {
  'Register as Operator': '/signup',
  'Operator Login': '/login',
  'Tours': '/tours',
  'Operators': '/operators',
  'About Fernweh': '/about',
  'Contact': '/support',
  'Privacy Policy': '/privacy-policy',
};

export default function Footer() {
  return (
    <footer className="relative w-full min-h-[460px] overflow-hidden">
      {/* Background photo */}
      <Image
        src="/assets/footer-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0f4d28]/45" />

      <div className="relative z-10 flex flex-col px-6 md:px-[80px] pt-8 md:pt-[50px] pb-8 min-h-[460px]">
        {/* Brand row */}
        <div className="flex flex-wrap items-center gap-4 mb-8 md:mb-12">
          <Image src="/assets/logo-footer.png" alt="Fernweh logo" width={70} height={63} className="object-contain" />
          <div>
            <p
              className="font-anton text-white text-[22px] tracking-wide leading-none"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              FERNWEH
            </p>
            <p
              className="text-[#c8e6d0] text-[12px] mt-1"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Wander far, belong everywhere
            </p>
          </div>

          {/* Google Play badge — pushed to far right */}
          <div className="ml-auto">
            <Image src="/assets/google-play.svg" alt="Get it on Google Play" width={140} height={48} className="object-contain" />
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p
                className="text-white text-[13px] font-semibold mb-4"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {col.heading}
              </p>
              {col.links.map((link) => (
                <a
                  key={link}
                  href={LINK_HREFS[link] || '#'}
                  className="block text-[#c8e6d0] text-[12px] mb-3 hover:text-white transition-colors"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 md:mt-auto">
          <div className="w-full h-px bg-white/15 mb-6" />
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
            <p
              className="text-[#b3c7ba] text-[11.5px]"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              © 2026 Fernweh Travels. All rights reserved.
            </p>
            <p
              className="text-[#b3c7ba] text-[11.5px]"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              A product of The Map Ventures
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
