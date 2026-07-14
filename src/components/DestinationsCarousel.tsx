'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    id: 1,
    name: 'HUNZA VALLEY TREK',
    watermark: 'HUNZA',
    days: '5 Days',
    region: 'Gilgit-Baltistan',
    stops: 'Karimabad [2N] | Passu Cones [1N] | Attabad Lake [1N] | Khunjerab Pass [1N]',
    image: '/assets/hunza-valley.jpg',
    peekImage: '/assets/skardu-peek.jpg',
    nextWatermark: 'SK',
  },
];

export default function DestinationsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current] = useState(0);

  useGSAP(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal-up');
    if (!els?.length) return;
    gsap.fromTo(
      els,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    );
  }, { scope: sectionRef });

  const dest = destinations[current];

  return (
    <section ref={sectionRef} className="w-full bg-white py-20 px-0 overflow-hidden">
      {/* Section heading */}
      <div className="text-center mb-12">
        <p
          className="font-alex-brush text-[#8a8a85] text-[30px] leading-none mb-2 reveal-up"
          style={{ fontFamily: 'var(--font-alex-brush)' }}
        >
          Plan Your Trip
        </p>
        <h2
          className="font-poppins font-bold text-[#3d3229] text-[44px] leading-none reveal-up"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Where to next?
        </h2>
      </div>

      {/* Carousel layout */}
      <div className="relative flex items-center max-w-[1440px] mx-auto px-[100px]">
        {/* Prev arrow */}
        <button className="absolute left-5 z-10 w-11 h-11 rounded-full border border-[#ede8dc] flex items-center justify-center bg-white hover:bg-[#f5f5f0] transition-colors reveal-up">
          <Image src="/assets/arrow-left.svg" alt="Previous" width={20} height={20} />
        </button>

        {/* Destination image */}
        <div className="relative w-[580px] h-[400px] flex-shrink-0 rounded-[4px] overflow-hidden reveal-up">
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            className="object-cover"
            sizes="580px"
          />
          {/* Watermark */}
          <p
            className="absolute bottom-0 left-0 font-poppins font-bold text-[90px] leading-none text-white/20 select-none pointer-events-none px-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {dest.watermark}
          </p>
        </div>

        {/* Next arrow */}
        <button className="absolute left-[680px] z-10 w-11 h-11 rounded-full border border-[#ede8dc] flex items-center justify-center bg-white hover:bg-[#f5f5f0] transition-colors reveal-up">
          <span className="text-[#5d5d5a] text-[18px]">›</span>
        </button>

        {/* Info panel */}
        <div className="ml-20 flex-1 reveal-up">
          <h3
            className="font-poppins font-bold text-[#3d3229] text-[22px] mb-4"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {dest.name}
          </h3>
          <div className="flex items-center gap-6 mb-5">
            <div className="flex items-center gap-2">
              <Image src="/assets/icon-duration.svg" alt="Duration" width={16} height={16} />
              <span className="text-[12.5px] text-[#5d5d5a]" style={{ fontFamily: 'var(--font-inter)' }}>
                {dest.days}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/assets/icon-location.svg" alt="Location" width={16} height={16} />
              <span className="text-[12.5px] text-[#5d5d5a]" style={{ fontFamily: 'var(--font-inter)' }}>
                {dest.region}
              </span>
            </div>
          </div>
          <p
            className="text-[13px] font-semibold text-[#3d3229] mb-2"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Destination:
          </p>
          <p
            className="text-[12.5px] text-[#5d5d5a] leading-[1.6] mb-8 max-w-[500px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {dest.stops}
          </p>
          <button className="bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white text-[13px] font-semibold rounded-full px-8 h-12">
            Explore in App
          </button>
        </div>

        {/* Peek of next card */}
        <div className="absolute right-0 w-[80px] h-[400px] overflow-hidden rounded-l-[4px] opacity-60">
          <Image
            src={dest.peekImage}
            alt="Next destination"
            fill
            className="object-cover"
            sizes="80px"
          />
          <p
            className="absolute bottom-0 left-0 font-poppins font-bold text-[90px] leading-none text-white/20 select-none pointer-events-none"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {dest.nextWatermark}
          </p>
        </div>
      </div>
    </section>
  );
}
