'use client';

import { useState } from 'react';
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
];

export default function ToursSection() {
  const [activeCategory, setActiveCategory] = useState('All Tours');

  return (
    <section className="w-full bg-[#faf7f2] pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
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

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TOURS_DATA.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-[20px] overflow-hidden border border-[#ede8dc] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col h-full"
            >
              {/* Cover Photo */}
              <div className="relative w-full h-[240px] overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
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
    </section>
  );
}
