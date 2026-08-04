'use client';

import { useState } from 'react';
import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';

const TABS = [
    'Public Profile',
    'Account Settings',
    'Notifications',
    'Payment Methods',
    'Privacy Policy',
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('Public Profile');

    return (
        <main className="min-h-screen bg-[#faf7f2]">
            <LightNavbar />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
                <h1
                    className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-10"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                >
                    Settings
                </h1>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <div className="w-[220px] shrink-0 flex flex-col gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`text-left px-4 py-3 rounded-lg text-[15px] font-medium transition-all cursor-pointer ${activeTab === tab
                                        ? 'bg-[#e8f2ec] text-[#1b7a3d] border-l-[3px] border-[#1b7a3d]'
                                        : 'text-[#8a8a85] hover:text-[#3d3229] border-l-[3px] border-transparent'
                                    }`}
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 max-w-[900px]">
                        {activeTab === 'Public Profile' ? (
                            <PublicProfileForm />
                        ) : (
                            <div
                                className="text-[#8a8a85] text-[15px]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                {activeTab} coming soon.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <HomeFooter />
        </main>
    );
}

function PublicProfileForm() {
    return (
        <div>
            <h2
                className="text-[24px] font-bold text-[#3d3229] mb-6"
                style={{ fontFamily: 'var(--font-poppins)' }}
            >
                Public Profile
            </h2>

            {/* Avatar row */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-[70px] h-[70px] rounded-full bg-[#1b7a3d] flex items-center justify-center overflow-hidden">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
                    </svg>
                </div>
                <button
                    type="button"
                    className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-5 py-2.5 cursor-pointer"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    Change Picture
                </button>
                <button
                    type="button"
                    className="border border-[#ede8dc] bg-white text-[#3d3229] font-bold text-[14px] rounded-full px-5 py-2.5 cursor-pointer hover:border-[#d8d2c2] transition-colors"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    Delete Picture
                </button>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                    <Field label="First Name" defaultValue="Muhammad" />
                    <Field label="Last Name" defaultValue="Abdullah" />
                </div>
                <Field label="Email" defaultValue="abdullah@example.com" />
                <Field label="Phone Number" defaultValue="+92 300 1234567" />
                <Field label="Location" defaultValue="Sadiqabad, Punjab, Pakistan" />
                <div>
                    <label
                        className="block text-[14px] font-semibold text-[#3d3229] mb-1.5"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    >
                        Bio
                    </label>
                    <textarea
                        defaultValue="GeoAI Engineer & WebGIS Developer. Building Vektor — GIS tools for disaster intelligence and urban analytics."
                        rows={3}
                        className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-4 py-3 text-[15px] text-[#3d3229] outline-none focus:border-[#1b7a3d] transition-colors resize-none"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    />
                </div>

                <button
                    type="button"
                    className="w-fit bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[15px] rounded-full px-8 py-3 mt-2 cursor-pointer"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function Field({
    label,
    defaultValue,
}: {
    label: string;
    defaultValue: string;
}) {
    return (
        <div>
            <label
                className="block text-[14px] font-semibold text-[#3d3229] mb-1.5"
                style={{ fontFamily: 'var(--font-inter)' }}
            >
                {label}
            </label>
            <input
                type="text"
                defaultValue={defaultValue}
                className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-4 py-3 text-[15px] text-[#3d3229] outline-none focus:border-[#1b7a3d] transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
            />
        </div>
    );
}