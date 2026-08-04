'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';

type StatusType = 'Confirmed' | 'Pending Payment' | 'Cancelled';

interface Booking {
    name: string;
    operator: string;
    date: string;
    travelers: string;
    price: string;
    status: StatusType;
    image: string;
}

const BOOKINGS: Booking[] = [
    {
        name: 'Fairy Meadows 3-Day Trek',
        operator: 'Northern Trails Co.',
        date: '02 Aug 2026',
        travelers: '2 Adults',
        price: '49,000',
        status: 'Confirmed',
        image: '/assets/nature-1.jpg',
    },
    {
        name: 'Hunza Valley Escape',
        operator: 'Karakoram Adventures',
        date: '18 Aug 2026',
        travelers: '1 Adult',
        price: '38,900',
        status: 'Pending Payment',
        image: '/assets/hunza-valley.jpg',
    },
    {
        name: 'Skardu Lake Circuit',
        operator: 'Summit Seekers PK',
        date: '05 Sep 2026',
        travelers: '4 Adults',
        price: '124,800',
        status: 'Confirmed',
        image: '/assets/nature-2.jpg',
    },
];

const STATUS_STYLES: Record<StatusType, string> = {
    Confirmed: 'bg-[#e8f2ec] text-[#1b7a3d]',
    'Pending Payment': 'bg-[#fdf0dd] text-[#c98a2e]',
    Cancelled: 'bg-[#fbe8e6] text-[#c0392b]',
};

const TABS = ['Upcoming', 'Past', 'Cancelled'];

export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState('Upcoming');

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
                <div className="flex flex-col gap-5">
                    {BOOKINGS.map((booking) => (
                        <div
                            key={booking.name}
                            className="flex items-center gap-6 bg-white border border-[#ede8dc] rounded-2xl p-4 shadow-sm"
                        >
                            <div className="relative w-[130px] h-[110px] rounded-xl overflow-hidden shrink-0">
                                <Image
                                    src={booking.image}
                                    alt={booking.name}
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
                                    {booking.name}
                                </h3>
                                <p
                                    className="text-[#8a8a85] text-[14px] mb-3"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                >
                                    by {booking.operator}
                                </p>
                                <div
                                    className="flex items-center gap-2 text-[13.5px] text-[#5d5d5a] mb-3"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                >
                                    <span>📅 {booking.date}</span>
                                    <span>·</span>
                                    <span>👥 {booking.travelers}</span>
                                </div>
                                <p
                                    className="text-[#1b7a3d] text-[19px] font-bold"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                >
                                    PKR {booking.price}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-4">
                                <span
                                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-bold ${STATUS_STYLES[booking.status]}`}
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                >
                                    <span className="text-[10px]">●</span>
                                    {booking.status}
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
                                    <Link href="/tours/fairy-meadows-3-day-trek">
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
            </div>

            <HomeFooter />
        </main>
    );
}