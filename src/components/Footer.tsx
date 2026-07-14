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

export default function Footer() {
  return (
    <footer className="relative w-full h-[460px] overflow-hidden">
      {/* Background photo */}
      <Image
        src="/assets/footer-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0f4d28]/45" />

      <div className="relative z-10 h-full flex flex-col px-[80px] pt-[50px]">
        {/* Brand row */}
        <div className="flex items-center gap-4 mb-12">
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
        <div className="flex gap-[220px]">
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
                  href="#"
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
        <div className="mt-auto pb-0">
          <div className="w-full h-px bg-white/15 mb-6" />
          <div className="flex justify-between items-center pb-8">
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
