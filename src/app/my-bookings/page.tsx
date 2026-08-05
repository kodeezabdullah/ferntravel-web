'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';
import { useRequireAuth } from '@/lib/use-require-auth';
import { apiFetch } from '@/lib/api';
import type { Booking, BookingStatus } from '@/types/api';

const FALLBACK_IMAGE = '/assets/nature-1.jpg';

const STATUS_STYLES: Record<BookingStatus, string> = {
    confirmed: 'bg-[#e8f2ec] text-[#1b7a3d]',
    pending: 'bg-[#fdf0dd] text-[#c98a2e]',
    cancelled: 'bg-[#fbe8e6] text-[#c0392b]',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
    confirmed: 'Confirmed',
    pending: 'Pending Payment',
    cancelled: 'Cancelled',
};

const TABS = ['Upcoming', 'Past', 'Cancelled'] as const;
type Tab = (typeof TABS)[number];

function isPast(booking: Booking) {
    return new Date(booking.departure_date).getTime() < Date.now();
}

export default function MyBookingsPage() {
    const { session, loading: authLoading } = useRequireAuth();
    const [activeTab, setActiveTab] = useState<Tab>('Upcoming');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;
        let cancelled = false;
        apiFetch<Booking[]>('/bookings/me?limit=50')
            .then((data) => {
                if (!cancelled) setBookings(data);
            })
            .catch(() => {
                if (!cancelled) setBookings([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [session]);

    if (authLoading || (session && loading)) {
        return (
            <main className="min-h-screen bg-[#faf7f2]">
                <LightNavbar />
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 text-center">
                    <p className="text-[#8a8a85] text-[15px]" style={{ fontFamily: 'var(--font-inter)' }}>
                        Loading bookings…
                    </p>
                </div>
                <HomeFooter />
            </main>
        );
    }

    if (!session) return null;

    const filtered = bookings.filter((b) => {
        if (activeTab === 'Cancelled') return b.status === 'cancelled';
        if (activeTab === 'Past') return b.status !== 'cancelled' && isPast(b);
        return b.status !== 'cancelled' && !isPast(b);
    });

    return (
        <main className="min-h-screen bg-[#faf7f2]">
            <LightNavbar />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
                <h1
                    className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                >
                    My Bookings
                </h1>
                <p
                    className="text-[#8a8a85] text-[15px] mb-8"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    Track and manage all your tour bookings
                </p>

                {/* Tabs */}
                <div className="flex gap-3 mb-10">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-full px-6 py-2.5 text-[14px] font-bold transition-all cursor-pointer ${activeTab === tab
                                    ? 'bg-[#1b7a3d] text-white'
                                    : 'bg-white border border-[#ede8dc] text-[#3d3229] hover:border-[#d8d2c2]'
                                }`}
                            style={{ fontFamily: 'var(--font-inter)' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Booking cards */}
                {filtered.length === 0 ? (
                    <p className="text-[#8a8a85] text-[15px]" style={{ fontFamily: 'var(--font-inter)' }}>
                        No bookings in this category yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-5">
                        {filtered.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center gap-6 bg-white border border-[#ede8dc] rounded-2xl p-4 shadow-sm"
                            >
                                <div className="relative w-[130px] h-[110px] rounded-xl overflow-hidden shrink-0">
                                    <Image
                                        src={booking.cover_image_url || FALLBACK_IMAGE}
                                        alt={booking.tour_name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3
                                        className="text-[19px] font-bold text-[#3d3229] mb-1"
                                        style={{ fontFamily: 'var(--font-poppins)' }}
                                    >
                                        {booking.tour_name}
                                    </h3>
                                    {booking.operator_name && (
                                        <p
                                            className="text-[#8a8a85] text-[14px] mb-3"
                                            style={{ fontFamily: 'var(--font-inter)' }}
                                        >
                                            by {booking.operator_name}
                                        </p>
                                    )}
                                    <div
                                        className="flex items-center gap-2 text-[13.5px] text-[#5d5d5a] mb-3"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                        <span>📅 {booking.departure_date}</span>
                                        <span>·</span>
                                        <span>
                                            👥 {booking.seats_requested}{' '}
                                            {booking.seats_requested === 1 ? 'Adult' : 'Adults'}
                                        </span>
                                    </div>
                                    {booking.total_price != null && (
                                        <p
                                            className="text-[#1b7a3d] text-[19px] font-bold"
                                            style={{ fontFamily: 'var(--font-inter)' }}
                                        >
                                            PKR {booking.total_price.toLocaleString('en-PK')}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-4">
                                    <span
                                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-bold ${STATUS_STYLES[booking.status]}`}
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                        <span className="text-[10px]">●</span>
                                        {STATUS_LABELS[booking.status]}
                                    </span>

                                    <div className="flex items-center gap-4">
                                        <Link href="/chat">
                                            <button
                                                type="button"
                                                className="flex items-center gap-1.5 text-[#3d3229] text-[14px] font-medium cursor-pointer hover:text-[#1b7a3d] transition-colors"
                                                style={{ fontFamily: 'var(--font-inter)' }}
                                            >
                                                💬 Message
                                            </button>
                                        </Link>
                                        <Link href={`/tours/${booking.tour_id}`}>
                                            <button
                                                type="button"
                                                className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-6 py-2.5 cursor-pointer"
                                                style={{ fontFamily: 'var(--font-inter)' }}
                                            >
                                                View Details
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <HomeFooter />
        </main>
    );
}
