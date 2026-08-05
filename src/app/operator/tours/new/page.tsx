'use client';

import Link from 'next/link';
import { useRequireOperator } from '@/lib/use-require-operator';
import TourForm from '../TourForm';

export default function NewTourPage() {
  const { user } = useRequireOperator();

  if (!user || user.role !== 'operator') return null;

  return (
    <div className="px-6 md:px-10 py-8">
      <Link
        href="/operator/tours"
        className="text-[13px] font-semibold text-[#8a8a85] hover:text-[#1b7a3d] transition-colors mb-2 inline-block"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        &larr; Tours
      </Link>
      <h1 className="text-[26px] font-bold text-[#3d3229] mb-8" style={{ fontFamily: 'var(--font-poppins)' }}>
        New Tour
      </h1>
      <TourForm mode="create" />
    </div>
  );
}
