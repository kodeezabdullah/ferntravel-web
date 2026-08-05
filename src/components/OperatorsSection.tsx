'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { Operator } from '@/types/api';

export default function OperatorsSection() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Operator[]>('/operators?limit=4')
      .then((data) => {
        if (!cancelled) setOperators(data);
      })
      .catch(() => {
        if (!cancelled) setOperators([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full bg-[#faf7f2] pb-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Heading */}
        <div className="mb-10">
          <h2
            className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Best Operators
          </h2>
          <p
            className="text-[#8a8a85] text-[15px] md:text-[16px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Verified, top-rated tour operators across Pakistan
          </p>
        </div>

        {!loading && operators.length === 0 && (
          <p className="text-[#8a8a85] text-[15px]" style={{ fontFamily: 'var(--font-inter)' }}>
            No operators available right now.
          </p>
        )}

        {/* Operators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {operators.map((op) => (
            <Link
              key={op.id}
              href={`/operators/${op.id}`}
              className="bg-white rounded-[20px] p-6 border border-[#ede8dc] hover:-translate-y-1.5 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between h-full cursor-pointer"
            >
              <div>
                {/* Header row (Avatar + Verified badge) */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  {/* Circular dark green avatar placeholder with white person icon */}
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

                  {/* Verified badge */}
                  {op.verified && (
                    <span
                      className="bg-[#c8e6d0] text-[#1b7a3d] text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 select-none"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Operator Name */}
                <h3
                  className="text-[18px] font-bold text-[#3d3229] leading-snug mb-2"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {op.operator_name}
                </h3>

                {/* Stats */}
                <p
                  className="text-[13.5px] text-[#8a8a85] mb-6"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {op.tours_hosted ?? 0} tours &middot;{' '}
                  <span className="text-[#f2a93b]">★</span> {(op.rating ?? 0).toFixed(1)}
                </p>
              </div>

              {/* View Profile Link */}
              <div
                className="text-[#1b7a3d] font-bold text-[14px] flex items-center gap-1 hover:opacity-95 transition-opacity"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                View Profile &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
