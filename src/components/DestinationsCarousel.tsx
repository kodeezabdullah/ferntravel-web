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
  },
  {
    id: 2,
    name: 'SKARDU EXPEDITION',
    watermark: 'SKARDU',
    days: '7 Days',
    region: 'Gilgit-Baltistan',
    stops: 'Skardu City [2N] | Deosai Plains [2N] | Sheosar Lake [1N] | Satpara Lake [2N]',
    image: '/assets/skardu-peek.jpg',
  },
  {
    id: 3,
    name: 'FAIRY MEADOWS TREK',
    watermark: 'FAIRY',
    days: '4 Days',
    region: 'Diamer, KPK',
    stops: 'Raikot Bridge [1N] | Fairy Meadows [2N] | Nanga Parbat Base Camp [1N]',
    image: '/assets/hero-bg.jpg',
  },
];

export default function DestinationsCarousel() {
  const sectionRef    = useRef<HTMLElement>(null);
  const slideRef      = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const imgRef        = useRef<HTMLDivElement>(null);
  const infoRef       = useRef<HTMLDivElement>(null);
  const prevRef       = useRef<HTMLButtonElement>(null);
  const nextRef       = useRef<HTMLButtonElement>(null);
  const [current, setCurrent] = useState(0);

  useGSAP(() => {
    const st = { trigger: sectionRef.current, start: 'top 75%' };

    // Heading — drops in from top
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.5, scrollTrigger: st }
    );

    // Image — slides in from left + slight zoom
    gsap.fromTo(imgRef.current,
      { opacity: 0, x: -80, scale: 0.92 },
      { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 1.8, scrollTrigger: st }
    );

    // Info panel — slides in from right
    gsap.fromTo(infoRef.current,
      { opacity: 0, x: 80 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 2.1, scrollTrigger: st }
    );

    // Arrows — pop in with scale bounce
    gsap.fromTo([prevRef.current, nextRef.current],
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', delay: 2.5, stagger: 0.15, scrollTrigger: st }
    );

  }, { scope: sectionRef });

  const goTo = (idx: number) => {
    if (!slideRef.current) return;
    gsap.to(slideRef.current, {
      opacity: 0,
      x: idx > current ? -30 : 30,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setCurrent(idx);
        gsap.fromTo(
          slideRef.current,
          { opacity: 0, x: idx > current ? 30 : -30 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );
      },
    });
  };

  const prev = () => goTo(current === 0 ? destinations.length - 1 : current - 1);
  const next = () => goTo(current === destinations.length - 1 ? 0 : current + 1);

  const dest = destinations[current];

  return (
    <section ref={sectionRef} className="w-full bg-white pt-[64px] pb-20 overflow-hidden">

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-12" style={{ opacity: 0 }}>
        <p
          className="font-alex-brush text-[#8a8a85] text-[30px] leading-none mb-2"
          style={{ fontFamily: 'var(--font-alex-brush)' }}
        >
          Plan Your Trip
        </p>
        <h2
          className="font-poppins font-bold text-[#3d3229] text-[44px] leading-none"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Where to next?
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center max-w-[1440px] mx-auto px-4 md:px-[100px]">

        {/* Prev arrow */}
        <button
          ref={prevRef}
          onClick={prev}
          className="absolute left-2 md:left-8 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 backdrop-blur-sm border border-[#ede8dc] shadow-sm hover:shadow-md hover:border-[#1b7a3d] transition-all flex items-center justify-center top-1/2 -translate-y-1/2 cursor-pointer"
          style={{ opacity: 0 }}
        >
          <span className="text-[#3d3229] text-[18px] md:text-[20px] leading-none select-none" style={{ marginTop: '-2px' }}>‹</span>
        </button>

        {/* Slide content */}
        <div ref={slideRef} className="flex flex-col md:flex-row items-center w-full gap-6 md:gap-16 px-4 md:px-0">

          {/* Image — animates from left */}
          <div
            ref={imgRef}
            className="relative w-full md:w-[580px] h-[240px] sm:h-[300px] md:h-[400px] flex-shrink-0 rounded-[8px] overflow-hidden"
            style={{ opacity: 0 }}
          >
            <Image src={dest.image} alt={dest.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 580px" priority={current === 0} />
            <p
              className="absolute bottom-0 left-2 font-poppins font-bold text-[50px] md:text-[90px] leading-none text-white/20 select-none pointer-events-none"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {dest.watermark}
            </p>
          </div>

          {/* Info panel — animates from right */}
          <div ref={infoRef} className="w-full flex-1" style={{ opacity: 0 }}>
            <h3
              className="font-poppins font-bold text-[#3d3229] text-[20px] md:text-[22px] mb-3 md:mb-4"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {dest.name}
            </h3>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-5">
              <div className="flex items-center gap-2">
                <Image src="/assets/icon-duration.svg" alt="Duration" width={16} height={16} />
                <span className="text-[12.5px] text-[#5d5d5a]" style={{ fontFamily: 'var(--font-inter)' }}>{dest.days}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/assets/icon-location.svg" alt="Location" width={16} height={16} />
                <span className="text-[12.5px] text-[#5d5d5a]" style={{ fontFamily: 'var(--font-inter)' }}>{dest.region}</span>
              </div>
            </div>
            <p className="text-[13px] font-semibold text-[#3d3229] mb-1 md:mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
              Destination:
            </p>
            <p className="text-[12.5px] text-[#5d5d5a] leading-[1.6] mb-6 md:mb-8 max-w-[500px]" style={{ fontFamily: 'var(--font-inter)' }}>
              {dest.stops}
            </p>

            {/* Dots */}
            <div className="flex gap-2 mb-6 md:mb-8">
              {destinations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#1b7a3d' : '#c8e6d0' }}
                />
              ))}
            </div>

            <button className="bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white text-[13px] font-semibold rounded-full px-8 h-12 cursor-pointer">
              Explore in App
            </button>
          </div>
        </div>

        {/* Next arrow */}
        <button
          ref={nextRef}
          onClick={next}
          className="absolute right-2 md:right-8 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 backdrop-blur-sm border border-[#ede8dc] shadow-sm hover:shadow-md hover:border-[#1b7a3d] transition-all flex items-center justify-center top-1/2 -translate-y-1/2 cursor-pointer"
          style={{ opacity: 0 }}
        >
          <span className="text-[#3d3229] text-[18px] md:text-[20px] leading-none select-none" style={{ marginTop: '-2px' }}>›</span>
        </button>

      </div>
    </section>
  );
}
