'use client';

import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';
import { useRequireAuth } from '@/lib/use-require-auth';
import { apiFetch, ApiError } from '@/lib/api';
import type { TourDetail } from '@/types/api';

const FALLBACK_IMAGE = '/assets/hero-bg.jpg';

const TOUR_NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Tours', href: '/tours' },
  { label: 'Operators', href: '/operators' },
  { label: 'Explore Map', href: '#' },
  { label: 'My Bookings', href: '/my-bookings' },
];

/* ─── Page ──────────────────────────────────────────── */

export default function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { session, loading: authLoading } = useRequireAuth();

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    apiFetch<TourDetail>(`/tours/${slug}`)
      .then((data) => {
        if (cancelled) return;
        setTour(data);
        if (data.departures && data.departures.length > 0) {
          setSelectedDepartureId(data.departures[0].id);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, session]);

  const handleBook = async () => {
    if (!selectedDepartureId) return;
    setBookingError(null);
    setBooking(true);
    try {
      await apiFetch(`/tours/${slug}/book`, {
        method: 'POST',
        body: { departure_id: selectedDepartureId, seats_requested: seats },
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to book this tour.');
    } finally {
      setBooking(false);
    }
  };

  if (authLoading || (session && loading)) {
    return (
      <main className="min-h-screen bg-[#faf7f2]">
        <LightNavbar links={TOUR_NAV_LINKS} />
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 text-center">
          <p className="text-[#8a8a85] text-[15px]" style={{ fontFamily: 'var(--font-inter)' }}>
            Loading tour…
          </p>
        </div>
        <HomeFooter />
      </main>
    );
  }

  if (!session) return null;

  if (notFound || !tour) {
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

  const images = tour.gallery_image_urls?.length
    ? tour.gallery_image_urls
    : [tour.cover_image_url || FALLBACK_IMAGE];
  const selectedDeparture = tour.departures?.find((d) => d.id === selectedDepartureId) ?? null;
  const totalPrice = (tour.cost * seats).toLocaleString('en-PK');
  const included = tour.included ?? [];
  const notIncluded = tour.not_included ?? [];
  const reviews = tour.reviews ?? [];

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
          <span className="text-[#3d3229] font-medium">{tour.tour_name}</span>
        </div>

        {/* Page title row */}
        <div className="mb-8">
          <h1
            className="text-[30px] md:text-[38px] font-bold text-[#3d3229] leading-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {tour.tour_name}
          </h1>
          <div
            className="flex flex-wrap items-center gap-2 text-[14px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <span className="text-[#5d5d5a]">by</span>
            <span className="font-semibold text-[#3d3229]">{tour.operator_name ?? 'Operator'}</span>
            <span className="text-[#8a8a85]">·</span>
            <span className="flex items-center gap-1 font-semibold text-[#3d3229]">
              <span className="text-[#f2a93b]">★</span>
              {(tour.rating ?? 0).toFixed(1)}
              <span className="font-normal text-[#8a8a85]">({tour.review_count ?? 0} reviews)</span>
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
                  src={images[selectedImage] || FALLBACK_IMAGE}
                  alt={`${tour.tour_name} — image ${selectedImage + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                  unoptimized
                  priority
                />
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
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
              )}
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
                {tour.description}
              </p>
            </div>

            {/* Journey timeline */}
            {tour.itinerary && tour.itinerary.length > 0 && (
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
                    {tour.itinerary.map((stop, i) => (
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
            )}

            {/* Included / Not Included */}
            {(included.length > 0 || notIncluded.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h2
                    className="text-[18px] font-bold text-[#3d3229] mb-4"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    What&apos;s Included
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {included.map((item, i) => (
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
                    {notIncluded.map((item, i) => (
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
            )}

            {/* Reviews */}
            <div>
              <h2
                className="text-[22px] font-bold text-[#3d3229] mb-6"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Guest Reviews
              </h2>
              {reviews.length === 0 ? (
                <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
                  No reviews yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-2xl border border-[#ede8dc] p-5 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-[#1b7a3d] text-white font-bold text-[13px] flex items-center justify-center flex-shrink-0"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          {(rev.user_name ?? 'U').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="text-[14px] font-bold text-[#3d3229]"
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            {rev.user_name ?? 'Anonymous'}
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
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
                        PKR {tour.cost.toLocaleString('en-PK')}
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
                      {(tour.rating ?? 0).toFixed(1)}
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
                  {tour.departures && tour.departures.length > 0 ? (
                    <select
                      value={selectedDepartureId ?? ''}
                      onChange={(e) => setSelectedDepartureId(e.target.value)}
                      className="w-full bg-[#faf7f2] border border-[#ede8dc] rounded-xl px-4 py-3 text-[14px] font-medium text-[#3d3229] outline-none"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {tour.departures.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.departure_date} · {d.seats_available} seats left
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center justify-between bg-[#faf7f2] border border-[#ede8dc] rounded-xl px-4 py-3">
                      <span
                        className="text-[14px] font-medium text-[#8a8a85]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        No departures scheduled
                      </span>
                    </div>
                  )}
                </div>

                {/* Travelers field */}
                <div className="mb-5">
                  <p
                    className="text-[12px] font-semibold text-[#8a8a85] mb-2 uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Travelers
                  </p>
                  <div className="flex items-center justify-between bg-[#faf7f2] border border-[#ede8dc] rounded-xl px-4 py-1">
                    <button
                      type="button"
                      onClick={() => setSeats((s) => Math.max(1, s - 1))}
                      className="text-[18px] text-[#3d3229] w-8 h-8 cursor-pointer"
                    >
                      −
                    </button>
                    <span
                      className="text-[14px] font-medium text-[#3d3229]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {seats} {seats === 1 ? 'Adult' : 'Adults'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSeats((s) =>
                          selectedDeparture
                            ? Math.min(selectedDeparture.seats_available, s + 1)
                            : s + 1,
                        )
                      }
                      className="text-[18px] text-[#3d3229] w-8 h-8 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="w-full h-px bg-[#ede8dc] mb-5" />

                {/* Total */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-[13.5px] text-[#5d5d5a]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Total ({seats} {seats === 1 ? 'traveler' : 'travelers'})
                  </span>
                  <span
                    className="text-[17px] font-bold text-[#3d3229]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    PKR {totalPrice}
                  </span>
                </div>

                {bookingError && (
                  <p className="text-[13px] text-red-500 mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                    {bookingError}
                  </p>
                )}

                {bookingSuccess ? (
                  <Link href="/my-bookings" className="w-full block">
                    <button
                      type="button"
                      className="w-full bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white font-bold text-[14px] rounded-full py-3.5 cursor-pointer"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      View My Bookings
                    </button>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={booking || !selectedDepartureId}
                    onClick={handleBook}
                    className="w-full bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white font-bold text-[14px] rounded-full py-3.5 cursor-pointer disabled:opacity-60"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {booking ? 'Booking…' : 'Book This Experience'}
                  </button>
                )}
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
