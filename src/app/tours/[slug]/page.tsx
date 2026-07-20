'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';

/* ─── Data ─────────────────────────────────────────── */

interface JourneyStop {
  time: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Review {
  name: string;
  initials: string;
  rating: number;
  quote: string;
}

interface TourData {
  name: string;
  operatorName: string;
  rating: number;
  reviewCount: number;
  price: string;
  images: string[];
  overview: string;
  journey: JourneyStop[];
  included: string[];
  notIncluded: string[];
  faqs: FAQ[];
  reviews: Review[];
}

const TOURS: Record<string, TourData> = {
  'fairy-meadows-3-day-trek': {
    name: 'Fairy Meadows 3-Day Trek',
    operatorName: 'Northern Trails Co.',
    rating: 4.9,
    reviewCount: 340,
    price: '24,500',
    images: [
      '/assets/hero-bg.jpg',
      '/assets/hunza-valley.jpg',
      '/assets/nature-1.jpg',
      '/assets/skardu-peek.jpg',
    ],
    overview:
      'A scenic trek through alpine meadows with breathtaking views of Nanga Parbat. This all-inclusive experience includes guided trails, camping under the stars, and authentic local meals along the way — everything handled by verified operators.',
    journey: [
      {
        time: '06:00',
        title: 'Hotel Pickup & Introduction',
        description: 'Meet your guide and fellow trekkers in Islamabad.',
      },
      {
        time: '09:30',
        title: 'Our Village & Blue Domes',
        description: 'Scenic drive along the Karakoram Highway.',
      },
      {
        time: '13:00',
        title: 'Overlook Cabana View',
        description: 'Lunch stop with panoramic valley views.',
      },
      {
        time: '16:30',
        title: 'Fast Beach Stop',
        description: 'Rest and refresh by the riverside.',
      },
      {
        time: '18:00',
        title: 'Return Base',
        description: 'Arrival at Fairy Meadows base camp for the night.',
      },
    ],
    included: [
      'Professional guide & staff',
      'Camping equipment',
      'All meals during trek',
      '4×4 jeep transport',
    ],
    notIncluded: [
      'Personal travel insurance',
      'Alcoholic beverages',
      'Tips & gratuities',
    ],
    faqs: [
      {
        question: 'Can I customize the itinerary?',
        answer:
          'Yes, private group bookings can request custom itinerary adjustments. Contact the operator after booking to discuss your preferences.',
      },
      {
        question: 'Is hotel pickup included?',
        answer:
          'Pickup is included from designated hotel zones in Islamabad. If you are staying outside these zones, contact us in advance to arrange transport.',
      },
      {
        question: 'What is the cancellation policy?',
        answer:
          'Full refunds are available up to 7 days before departure. Cancellations within 7 days receive a 50% refund. No-shows are non-refundable.',
      },
      {
        question: 'What should I bring?',
        answer:
          'Sturdy trekking shoes, warm layers (temperatures drop at night), sunscreen, a personal first-aid kit, and a valid CNIC or passport. A packing list will be shared upon booking confirmation.',
      },
    ],
    reviews: [
      {
        name: 'Sarah K.',
        initials: 'SK',
        rating: 5,
        quote:
          'The most magical experience of my life. Waking up to views of Nanga Parbat from a meadow camp is something I will never forget. Highly recommend Northern Trails Co.!',
      },
      {
        name: 'David R.',
        initials: 'DR',
        rating: 5,
        quote:
          'Everything was perfectly organized — the guide was fantastic, meals were delicious, and the route was stunning. Will definitely book again.',
      },
    ],
  },
};

const TOUR_NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Tours', href: '/tours' },
  { label: 'Operators', href: '/operators' },
  { label: 'Explore Map', href: '#' },
  { label: 'My Bookings', href: '/my-bookings' },
];

/* ─── FAQ Accordion ─────────────────────────────────── */

function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-[#ede8dc]">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="py-4">
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
            >
              <span
                className="text-[15px] font-semibold text-[#3d3229]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {faq.question}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`flex-shrink-0 text-[#1b7a3d] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-3' : 'max-h-0'}`}
            >
              <p
                className="text-[14px] text-[#5d5d5a] leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────── */

export default function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const tour = TOURS[slug];

  const [selectedImage, setSelectedImage] = useState(0);

  if (!tour) {
    return (
      <main className="min-h-screen bg-[#faf7f2]">
        <LightNavbar links={TOUR_NAV_LINKS} />
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 text-center">
          <p
            className="text-[#3d3229] text-[20px] font-semibold"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Tour not found.
          </p>
        </div>
        <HomeFooter />
      </main>
    );
  }

  // Sidebar price calculation (2 travelers hardcoded for display)
  const priceNum = parseInt(tour.price.replace(/,/g, ''), 10);
  const totalPrice = (priceNum * 2).toLocaleString('en-PK');

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen">
      <LightNavbar links={TOUR_NAV_LINKS} />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
        {/* Breadcrumb */}
        <div
          className="text-[#8a8a85] text-[13px] mb-5 flex items-center gap-1 flex-wrap"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <span>Home</span>
          <span className="text-[11px]">&rsaquo;</span>
          <span>Tours</span>
          <span className="text-[11px]">&rsaquo;</span>
          <span className="text-[#3d3229] font-medium">{tour.name}</span>
        </div>

        {/* Page title row */}
        <div className="mb-8">
          <h1
            className="text-[30px] md:text-[38px] font-bold text-[#3d3229] leading-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {tour.name}
          </h1>
          <div
            className="flex flex-wrap items-center gap-2 text-[14px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <span className="text-[#5d5d5a]">by</span>
            <span className="font-semibold text-[#3d3229]">{tour.operatorName}</span>
            <span className="text-[#8a8a85]">·</span>
            <span className="flex items-center gap-1 font-semibold text-[#3d3229]">
              <span className="text-[#f2a93b]">★</span>
              {tour.rating}
              <span className="font-normal text-[#8a8a85]">({tour.reviewCount} reviews)</span>
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="md:col-span-8 flex flex-col gap-10">
            {/* Interactive image gallery */}
            <div>
              {/* Main image */}
              <div className="relative w-full h-[360px] md:h-[440px] rounded-2xl overflow-hidden mb-3">
                <Image
                  src={tour.images[selectedImage]}
                  alt={`${tour.name} — image ${selectedImage + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                  unoptimized
                  priority
                />
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {tour.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-[80px] md:h-[100px] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${selectedImage === i
                        ? 'border-[#1b7a3d] ring-2 ring-[#1b7a3d]/30'
                        : 'border-transparent hover:border-[#ede8dc]'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div>
              <h2
                className="text-[22px] font-bold text-[#3d3229] mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Experience Overview
              </h2>
              <p
                className="text-[15px] text-[#5d5d5a] leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {tour.overview}
              </p>
            </div>

            {/* Journey timeline */}
            <div>
              <h2
                className="text-[22px] font-bold text-[#3d3229] mb-6"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Your Journey
              </h2>
              <div className="relative pl-5">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#c8e6d0]" />
                <div className="flex flex-col gap-6">
                  {tour.journey.map((stop, i) => (
                    <div key={i} className="relative flex gap-6 items-start">
                      {/* Green dot */}
                      <div className="absolute left-[-13px] mt-1.5 w-3 h-3 rounded-full bg-[#1b7a3d] border-2 border-white shadow-sm flex-shrink-0" />
                      {/* Time */}
                      <span
                        className="text-[14px] font-bold text-[#1b7a3d] w-[60px] flex-shrink-0 pt-0.5"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {stop.time}
                      </span>
                      {/* Title + description */}
                      <div className="min-w-0">
                        <p
                          className="text-[15px] font-bold text-[#3d3229] mb-0.5"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          {stop.title}
                        </p>
                        <p
                          className="text-[13px] text-[#8a8a85]"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          {stop.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Included / Not Included */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2
                  className="text-[18px] font-bold text-[#3d3229] mb-4"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  What&apos;s Included
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {tour.included.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[14px] text-[#5d5d5a]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#1b7a3d] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2
                  className="text-[18px] font-bold text-[#3d3229] mb-4"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Not Included
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {tour.notIncluded.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[14px] text-[#5d5d5a]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2
                className="text-[22px] font-bold text-[#3d3229] mb-4"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={tour.faqs} />
            </div>

            {/* Reviews */}
            <div>
              <h2
                className="text-[22px] font-bold text-[#3d3229] mb-6"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Guest Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.reviews.map((rev, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-[#ede8dc] p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-[#1b7a3d] text-white font-bold text-[13px] flex items-center justify-center flex-shrink-0"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {rev.initials}
                      </div>
                      <div>
                        <p
                          className="text-[14px] font-bold text-[#3d3229]"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          {rev.name}
                        </p>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: rev.rating }).map((_, j) => (
                            <span key={j} className="text-[#f2a93b] text-[13px]">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-[13.5px] text-[#5d5d5a] leading-relaxed italic"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="md:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#ede8dc] shadow-[0px_8px_24px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-6">
                {/* Price + Rating row */}
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p
                      className="text-[12px] text-[#8a8a85] mb-0.5"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      Starting from
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="text-[26px] font-bold text-[#1b7a3d]"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        PKR {tour.price}
                      </span>
                      <span
                        className="text-[12px] text-[#8a8a85]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        / person
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#faf7f2] rounded-full px-2.5 py-1 mt-1">
                    <span className="text-[#f2a93b] text-[13px]">★</span>
                    <span
                      className="text-[12px] font-bold text-[#3d3229]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {tour.rating}
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-[#ede8dc] my-5" />

                {/* Date field */}
                <div className="mb-4">
                  <p
                    className="text-[12px] font-semibold text-[#8a8a85] mb-2 uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Date
                  </p>
                  <div
                    className="flex items-center justify-between bg-[#faf7f2] border border-[#ede8dc] rounded-xl px-4 py-3"
                  >
                    <span
                      className="text-[14px] font-medium text-[#3d3229]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      18 Jul 2026
                    </span>
                    <span
                      className="text-[12px] text-[#1b7a3d] font-semibold"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      8 seats left
                    </span>
                  </div>
                </div>

                {/* Travelers field */}
                <div className="mb-5">
                  <p
                    className="text-[12px] font-semibold text-[#8a8a85] mb-2 uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Travelers
                  </p>
                  <div className="bg-[#faf7f2] border border-[#ede8dc] rounded-xl px-4 py-3">
                    <span
                      className="text-[14px] font-medium text-[#3d3229]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      2 Adults
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-[#ede8dc] mb-5" />

                {/* Total */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-[13.5px] text-[#5d5d5a]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Total (2 travelers)
                  </span>
                  <span
                    className="text-[17px] font-bold text-[#3d3229]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    PKR {totalPrice}
                  </span>
                </div>

                {/* Book button */}
                <Link href="/my-bookings" className="w-full block">
                  <button
                    type="button"
                    className="w-full bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white font-bold text-[14px] rounded-full py-3.5 cursor-pointer"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Book This Experience
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <HomeFooter />
      </div>
    </main>
  );
}
