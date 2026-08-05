'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';
import { useRequireAuth } from '@/lib/use-require-auth';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, apiUpload } from '@/lib/api';

const TABS = [
    'Public Profile',
    'Account Settings',
    'Notifications',
    'Payment Methods',
    'Privacy Policy',
];

export default function SettingsPage() {
    const { session, loading: authLoading } = useRequireAuth();
    const { signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Public Profile');
    const [loggingOut, setLoggingOut] = useState(false);

    if (authLoading) return null;
    if (!session) return null;

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await signOut();
        } finally {
            router.push('/login');
        }
    };

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

                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    {/* Sidebar */}
                    <div className="w-full md:w-[220px] md:shrink-0 flex flex-col gap-1">
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

                        <div className="h-px bg-[#ede8dc] my-3" />

                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={handleLogout}
                            className="text-left px-4 py-3 rounded-lg text-[15px] font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-60"
                            style={{ fontFamily: 'var(--font-inter)' }}
                        >
                            {loggingOut ? 'Logging out…' : 'Log Out'}
                        </button>
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

const E164_PATTERN = /^\+[1-9]\d{6,14}$/;

function PublicProfileForm() {
    const { user, refreshUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [fullName, setFullName] = useState(user?.full_name ?? '');
    const [phone, setPhone] = useState(user?.phone_number ?? '');
    const [photoUrl, setPhotoUrl] = useState<string | null>(user?.profile_photo_url ?? null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const syncedUserId = useRef<string | null>(null);

    useEffect(() => {
        if (!user || syncedUserId.current === user.id) return;
        syncedUserId.current = user.id;
        setFullName(user.full_name ?? '');
        setPhone(user.phone_number ?? '');
        setPhotoUrl(user.profile_photo_url);
    }, [user]);

    const handleSave = async () => {
        setError(null);
        setSaved(false);

        if (phone && !E164_PATTERN.test(phone.trim())) {
            setError('Enter a valid phone number in international format, e.g. +923001234567.');
            return;
        }

        setSaving(true);
        try {
            await apiFetch('/auth/me', {
                method: 'PATCH',
                body: {
                    full_name: fullName || undefined,
                    phone_number: phone || undefined,
                    profile_photo_url: photoUrl || undefined,
                },
            });
            await refreshUser();
            setSaved(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        setUploading(true);
        try {
            const result = await apiUpload<{ url: string }>('/media/upload', file, {
                purpose: 'profile_photo',
                kind: 'image',
            });
            setPhotoUrl(result.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload photo.');
        } finally {
            setUploading(false);
        }
    };

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
                    {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
                        </svg>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                />
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-5 py-2.5 cursor-pointer disabled:opacity-60"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    {uploading ? 'Uploading…' : 'Change Picture'}
                </button>
                <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="border border-[#ede8dc] bg-white text-[#3d3229] font-bold text-[14px] rounded-full px-5 py-2.5 cursor-pointer hover:border-[#d8d2c2] transition-colors"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    Delete Picture
                </button>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-5">
                <Field label="Full Name" value={fullName} onChange={setFullName} />
                <Field label="Email" value={user?.email ?? ''} disabled />
                <Field label="Phone Number" value={phone} onChange={setPhone} />

                {error && (
                    <p className="text-[13px] text-red-500" style={{ fontFamily: 'var(--font-inter)' }}>
                        {error}
                    </p>
                )}
                {saved && (
                    <p className="text-[13px] text-[#1b7a3d]" style={{ fontFamily: 'var(--font-inter)' }}>
                        Changes saved.
                    </p>
                )}

                <button
                    type="button"
                    disabled={saving}
                    onClick={handleSave}
                    className="w-fit bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[15px] rounded-full px-8 py-3 mt-2 cursor-pointer disabled:opacity-60"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    disabled,
}: {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
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
                value={value}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-4 py-3 text-[15px] text-[#3d3229] outline-none focus:border-[#1b7a3d] transition-colors disabled:opacity-60"
                style={{ fontFamily: 'var(--font-inter)' }}
            />
        </div>
    );
}
