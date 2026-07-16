'use client';

export default function MapSection() {
  return (
    <section className="w-full bg-[#faf7f2] pb-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Heading */}
        <div className="mb-10">
          <h2
            className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Explore The Map
          </h2>
          <p
            className="text-[#8a8a85] text-[15px] md:text-[16px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            See where your next trek begins and ends
          </p>
        </div>

        {/* Map Placeholder Box */}
        <div
          className="relative w-full h-[400px] bg-[#eef3f0] rounded-[24px] overflow-hidden border border-[#ede8dc] flex items-center justify-center select-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(27, 122, 61, 0.15) 1px, transparent 0), radial-gradient(rgba(27, 122, 61, 0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        >
          {/* Faint Text Background */}
          <div
            className="text-black/[0.06] font-bold text-[32px] md:text-[48px] tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            MAP PLACEHOLDER
          </div>

          {/* Curved Connector Line */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <path
              d="M 25 75 Q 40 30 75 25"
              fill="none"
              stroke="#1b7a3d"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Islamabad Pin (bottom-left) */}
          <div className="absolute left-[25%] top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            {/* Dark green pin icon */}
            <div className="text-[#1b7a3d] hover:scale-110 transition-transform duration-200 filter drop-shadow-[0px_2px_4px_rgba(0,0,0,0.1)] cursor-pointer">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="white"
                strokeWidth="1.5"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            {/* Label */}
            <span
              className="text-[#3d3229] font-bold text-[13px] mt-1 bg-white/95 px-2.5 py-0.5 rounded-md shadow-sm border border-[#ede8dc]/80"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Islamabad
            </span>
          </div>

          {/* Fairy Meadows Pin (upper-right) */}
          <div className="absolute left-[75%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            {/* Orange/amber pin icon */}
            <div className="text-[#f2a93b] hover:scale-110 transition-transform duration-200 filter drop-shadow-[0px_2px_4px_rgba(0,0,0,0.1)] cursor-pointer">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="white"
                strokeWidth="1.5"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            {/* Label */}
            <span
              className="text-[#3d3229] font-bold text-[13px] mt-1 bg-white/95 px-2.5 py-0.5 rounded-md shadow-sm border border-[#ede8dc]/80"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Fairy Meadows
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
