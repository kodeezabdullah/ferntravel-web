'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { Tour } from './DestinationTourRow';

interface OperatorTourRowProps {
  operatorName: string;
  tourCount: number;
  rating: number;
  tours: Tour[];
  profileHref?: string;
}

export default function OperatorTourRow({
  operatorName,
  tourCount,
  rating,
  tours,
  profileHref,
}: OperatorTourRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowRef.current) return;
    const el = rowRef.current;

    gsap.set(el, { opacity: 0, y: 24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rowRef} className="w-full mb-16 relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `,
        }}
      />

      {/* Row Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1b7a3d] text-white flex items-center justify-center flex-shrink-0">
            <svg
              width="20"
              height="20"
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
          </div>

          <div>
            <h3
              className="text-[20px] md:text-[22px] font-bold text-[#3d3229] leading-tight"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {operatorName}
            </h3>
            <p
              className="text-[#8a8a85] text-[13.5px] mt-0.5 flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <span>{tourCount} tours</span>
              <span>&middot;</span>
              <span className="flex items-center gap-0.5">
                <span className="text-[#f2a93b]">★</span> {rating}
              </span>
              <span>&middot;</span>
              <span className="text-[#1b7a3d] font-semibold">✓ Verified</span>
            </p>
          </div>
        </div>

        <Link
          href={profileHref || "/operators/northern-trails-co"}
          className="text-[#1b7a3d] font-bold text-[14px] hover:opacity-85 transition-opacity"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          View Profile &rarr;
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-none py-2 px-1">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="flex-shrink-0 w-[280px] md:w-[350px] h-[380px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 border border-[#ede8dc]/40"
          >
            <Image
              src={tour.image}
              alt={tour.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 350px"
              unoptimized
            />

            <div className="absolute bottom-0 inset-x-0 h-[55%] bg-gradient-to-t from-black/30 to-transparent z-10" />

            <div
              className="absolute top-4 left-4 bg-white/95 backdrop-blur-[4px] rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm font-bold text-[12px] text-[#3d3229] z-20"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <span className="text-[#f2a93b]">★</span>
              <span>{tour.rating}</span>
            </div>

            <div className="absolute bottom-0 inset-x-0 h-[52%] p-6 z-20 flex flex-col justify-end bg-white/10 backdrop-blur-md border-t border-white/20">
              <h4
                className="text-[17px] md:text-[19px] font-bold text-white mb-1.5 leading-snug"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {tour.name}
              </h4>
              <p
                className="text-white/95 text-[13px] mb-3 font-medium"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {tour.duration} &middot; PKR {tour.price}
              </p>

              <div className="flex items-center gap-1.5 text-[12px] text-[#f2a93b] font-bold">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span style={{ fontFamily: 'var(--font-inter)' }}>{tour.date}</span>
              </div>

              <Link href={`/tours/${tour.id}`} className="w-full block mt-4">
                <button
                  type="button"
                  className="w-full border border-white/35 bg-white/10 hover:bg-white/20 transition-all rounded-full py-2.5 text-[13.5px] font-bold text-white text-center cursor-pointer"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}