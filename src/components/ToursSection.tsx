'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface Tour {
  id: number;
  name: string;
  location: string;
  duration: string;
  price: string;
  rating: string;
  image: string;
}

const CATEGORIES = ['All Tours', 'Trekking', 'Family', 'Solo', 'Adventure'];

const TOURS_DATA: Tour[] = [
  {
    id: 1,
    name: 'Fairy Meadows Trek',
    location: 'Gilgit-Baltistan',
    duration: '3 Days 2 Nights',
    price: 'PKR 24,500',
    rating: '4.9',
    image: '/assets/nature-1.jpg',
  },
  {
    id: 2,
    name: 'Hunza Valley Escape',
    location: 'Hunza, Gilgit-Baltistan',
    duration: '5 Days 4 Nights',
    price: 'PKR 38,900',
    rating: '4.8',
    image: '/assets/hunza-valley.jpg',
  },
  {
    id: 3,
    name: 'Skardu Lake Circuit',
    location: 'Skardu, GB',
    duration: '4 Days 3 Nights',
    price: 'PKR 31,200',
    rating: '4.9',
    image: '/assets/skardu-peek.jpg',
  },
  {
    id: 4,
    name: 'Naran Valley Getaway',
    location: 'Naran, KPK',
    duration: '3 Days 2 Nights',
    price: 'PKR 22,000',
    rating: '4.7',
    image: '/assets/nature-2.jpg',
  },
  {
    id: 5,
    name: 'Deosai Plains Camp',
    location: 'Deosai, Gilgit-Baltistan',
    duration: '6 Days 5 Nights',
    price: 'PKR 45,000',
    rating: '4.9',
    image: '/assets/nature-3.jpg',
  },
  {
    id: 6,
    name: 'Naltar Valley Explore',
    location: 'Naltar, Gilgit-Baltistan',
    duration: '4 Days 3 Nights',
    price: 'PKR 28,000',
    rating: '4.8',
    image: '/assets/nature-4.jpg',
  },
];

export default function ToursSection() {
  const [activeCategory, setActiveCategory] = useState('All Tours');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // Scroll width of one card + gap (370px + 32px)
    const scrollAmount = direction === 'left' ? -402 : 402;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#faf7f2] pt-24 pb-20 px-6 md:px-12 overflow-hidden">
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

      <div className="max-w-[1200px] mx-auto relative">
        {/* Category filter pills */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-all duration-200 cursor-pointer border ${
                  active
                    ? 'bg-[#1b7a3d] border-[#1b7a3d] text-white shadow-sm'
                    : 'bg-white border-[#ede8dc] text-[#3d3229] hover:bg-white/80'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Section Heading */}
        <div className="mb-8">
          <h2
            className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Latest Tours
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#ede8dc] shadow-[0px_4px_12px_rgba(0,0,0,0.06)] hover:border-[#1b7a3d] text-[#3d3229] hover:text-[#1b7a3d] transition-all items-center justify-center cursor-pointer select-none active:scale-95"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#ede8dc] shadow-[0px_4px_12px_rgba(0,0,0,0.06)] hover:border-[#1b7a3d] text-[#3d3229] hover:text-[#1b7a3d] transition-all items-center justify-center cursor-pointer select-none active:scale-95"
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-none py-4 px-2"
          >
            {TOURS_DATA.map((tour) => (
              <div
                key={tour.id}
                className="flex-shrink-0 w-[280px] md:w-[370px] bg-white rounded-[20px] overflow-hidden border border-[#ede8dc] hover:-translate-y-1.5 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full group cursor-pointer"
              >
                {/* Cover Photo */}
                <div className="relative w-full h-[240px] overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  {/* Rating pill overlay */}
                  <div
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur-[4px] rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm font-bold text-[12px] text-[#3d3229]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    <span className="text-[#f2a93b]">★</span>
                    <span>{tour.rating}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Location & Duration row */}
                  <div className="flex items-center justify-between gap-2 mb-3 text-[13px] text-[#8a8a85]">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[14px] flex-shrink-0">📍</span>
                      <span className="truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                        {tour.location}
                      </span>
                    </div>
                    <span className="flex-shrink-0" style={{ fontFamily: 'var(--font-inter)' }}>
                      {tour.duration}
                    </span>
                  </div>

                  {/* Tour Name */}
                  <h3
                    className="text-[19px] font-bold text-[#3d3229] leading-snug mb-4 flex-grow"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {tour.name}
                  </h3>

                  {/* Price section */}
                  <div className="flex items-baseline gap-1 mt-auto pt-4 border-t border-[#ede8dc]/80">
                    <span
                      className="text-[18px] font-bold text-[#1b7a3d]"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {tour.price}
                    </span>
                    <span
                      className="text-[12.5px] text-[#8a8a85]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      /person
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
