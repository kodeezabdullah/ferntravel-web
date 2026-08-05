'use client';

import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';
import { useRequireAuth } from '@/lib/use-require-auth';
import { apiFetch, ApiError } from '@/lib/api';
import type { OperatorDetail, Tour } from '@/types/api';

const FALLBACK_IMAGE = '/assets/hero-bg.jpg';

/* ─── Sub-components ────────────────────────────────── */

function FAQAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
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
                className={`flex-shrink-0 text-[#1b7a3d] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-3' : 'max-h-0'
                }`}
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

export default function OperatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { session, loading: authLoading } = useRequireAuth();

  const [operator, setOperator] = useState<OperatorDetail | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    Promise.all([
      apiFetch<OperatorDetail>(`/operators/${slug}`),
      apiFetch<Tour[]>(`/operators/${slug}/tours`).catch(() => []),
    ])
      .then(([operatorData, tourData]) => {
        if (cancelled) return;
        setOperator(operatorData);
        setTours(tourData);
        setSelectedImage(operatorData.cover_image_url || FALLBACK_IMAGE);
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

  if (authLoading || (session && loading)) {
    return (
      <main className="min-h-screen bg-[#faf7f2]">
        <LightNavbar />
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 text-center">
          <p className="text-[#8a8a85] text-[15px]" style={{ fontFamily: 'var(--font-inter)' }}>
            Loading operator…
          </p>
        </div>
        <HomeFooter />
      </main>
    );
  }

  if (!session) return null;

  if (notFound || !operator) {
    return (
      <main className="min-h-screen bg-[#faf7f2]">
        <LightNavbar />
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 text-center">
          <p
            className="text-[#3d3229] text-[20px] font-semibold"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Operator not found.
          </p>
        </div>
        <HomeFooter />
      </main>
    );
  }

  const allImages = [
    operator.cover_image_url || FALLBACK_IMAGE,
    ...(operator.gallery_image_urls ?? []),
  ];
  const specialties = operator.specialties ?? [];
  const languages = operator.languages ?? [];
  const faqs = operator.faqs ?? [];
  const reviews = operator.reviews ?? [];

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen">
      <LightNavbar />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
        {/* Breadcrumb */}
        <div
          className="text-[#8a8a85] text-[13px] mb-5 flex items-center gap-1 flex-wrap"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <span>Home</span>
          <span className="text-[11px]">&rsaquo;</span>
          <span>Operators</span>
          <span className="text-[11px]">&rsaquo;</span>
          <span className="text-[#3d3229] font-medium">{operator.operator_name}</span>
        </div>

        {/* Page title row */}
        <div className="mb-8">
          <h1
            className="text-[30px] md:text-[38px] font-bold text-[#3d3229] mb-1"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {operator.operator_name}
          </h1>
          <div
            className="flex flex-wrap items-center gap-3 text-[14px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <span className="text-[#8a8a85] flex items-center gap-1">
              <span>📍</span> {operator.region}
            </span>
            <span className="text-[#8a8a85]">·</span>
            <span className="flex items-center gap-1 font-semibold text-[#3d3229]">
              <span className="text-[#f2a93b]">★</span>
              {(operator.rating ?? 0).toFixed(1)}
              <span className="font-normal text-[#8a8a85]">
                ({operator.review_count ?? 0} reviews)
              </span>
            </span>
            {operator.verified && (
              <>
                <span className="text-[#8a8a85]">·</span>
                <span className="text-[#1b7a3d] font-semibold">✓ Verified Operator</span>
              </>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="md:col-span-8 flex flex-col gap-10">
            {/* Hero image + gallery */}
            <div>
              <div className="relative w-full h-[360px] md:h-[440px] rounded-2xl overflow-hidden mb-3">
                <Image
                  src={selectedImage || FALLBACK_IMAGE}
                  alt={operator.operator_name}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative h-[110px] rounded-xl overflow-hidden cursor-pointer ${selectedImage === img
                        ? 'ring-3 ring-[#1b7a3d] ring-offset-2'
                        : ''
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <div>
              <h2
                className="text-[22px] font-bold text-[#3d3229] mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                About {operator.operator_name}
              </h2>
              <p
                className="text-[15px] text-[#5d5d5a] leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {operator.bio}
              </p>
            </div>

            {/* Popular Tours — timeline style */}
            {tours.length > 0 && (
              <div>
                <h2
                  className="text-[22px] font-bold text-[#3d3229] mb-6"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Popular Tours
                </h2>
                <div className="relative pl-5">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#c8e6d0]" />

                  <div className="flex flex-col gap-6">
                    {tours.map((tour) => (
                      <Link
                        key={tour.id}
                        href={`/tours/${tour.id}`}
                        className="relative flex gap-6 items-start hover:opacity-90"
                      >
                        {/* Green dot */}
                        <div className="absolute left-[-13px] mt-1.5 w-3 h-3 rounded-full bg-[#1b7a3d] border-2 border-white shadow-sm flex-shrink-0" />

                        {/* Price */}
                        <span
                          className="text-[15px] font-bold text-[#1b7a3d] w-[120px] flex-shrink-0"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          PKR {tour.cost.toLocaleString('en-PK')}
                        </span>

                        {/* Name + detail */}
                        <div className="min-w-0">
                          <p
                            className="text-[15px] font-bold text-[#3d3229] mb-0.5"
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            {tour.tour_name}
                          </p>
                          <p
                            className="text-[13px] text-[#8a8a85]"
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            {tour.duration}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Specialties + Languages */}
            {(specialties.length > 0 || languages.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h2
                    className="text-[18px] font-bold text-[#3d3229] mb-4"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    Specialties
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {specialties.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[14px] text-[#5d5d5a]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#1b7a3d] flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2
                    className="text-[18px] font-bold text-[#3d3229] mb-4"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    Languages Spoken
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {languages.map((lang, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[14px] text-[#5d5d5a]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#f2a93b] flex-shrink-0" />
                        {lang}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* FAQ Accordion */}
            {faqs.length > 0 && (
              <div>
                <h2
                  className="text-[22px] font-bold text-[#3d3229] mb-4"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Frequently Asked Questions
                </h2>
                <FAQAccordion faqs={faqs} />
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2
                className="text-[22px] font-bold text-[#3d3229] mb-6"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Traveler Reviews
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
                      {/* Avatar + name */}
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
                              <span key={j} className="text-[#f2a93b] text-[13px]">
                                ★
                              </span>
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
                <h3
                  className="text-[17px] font-bold text-[#3d3229] mb-5"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Operator Profile
                </h3>

                {/* Stats rows */}
                <div className="flex flex-col divide-y divide-[#ede8dc]">
                  {[
                    { label: 'Tours Hosted', value: `${operator.tours_hosted ?? tours.length}` },
                    { label: 'Service Region', value: operator.service_region },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between py-3"
                    >
                      <span
                        className="text-[13.5px] text-[#8a8a85]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {stat.label}
                      </span>
                      <span
                        className="text-[13.5px] font-semibold text-[#3d3229]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified banner */}
              {operator.verified && (
                <div className="bg-[#c8e6d0] px-6 py-3 flex items-center gap-2">
                  <span className="text-[#1b7a3d] text-[14px] font-bold" style={{ fontFamily: 'var(--font-inter)' }}>
                    ✓ Verified by Fernweh
                  </span>
                </div>
              )}

              {/* Message button */}
              <div className="p-6 pt-4">
                <Link href={`/chat?operator=${operator.id}`} className="w-full block">
                  <button
                    type="button"
                    className="w-full bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white font-bold text-[14px] rounded-full py-3.5 cursor-pointer"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Message Operator
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
