'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useOperatorStatus } from '@/lib/use-operator-status';
import { apiFetch } from '@/lib/api';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/operator', enabled: true },
  { label: 'Tours', href: '/operator/tours', enabled: true },
  { label: 'Bookings', href: '/operator/bookings', enabled: true },
  { label: 'Messages', href: '/operator/messages', enabled: true },
  { label: 'Reviews', href: '/operator/reviews', enabled: true },
  { label: 'Analytics', href: '/operator/analytics', enabled: true },
];

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function TourIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-2 5-5 2 2-5z" />
    </svg>
  );
}

function BookingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 15v3M12 10v8M17 6v12" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const NAV_ICONS: Record<string, () => React.ReactNode> = {
  Dashboard: DashboardIcon,
  Tours: TourIcon,
  Bookings: BookingIcon,
  Messages: MessageIcon,
  Reviews: StarIcon,
  Analytics: AnalyticsIcon,
};

function RegistrationForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [operatorName, setOperatorName] = useState('');
  const [bio, setBio] = useState('');
  const [region, setRegion] = useState('');
  const [serviceRegion, setServiceRegion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!operatorName.trim()) {
      setError('Business name is required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/operator/register', {
        method: 'POST',
        body: {
          operator_name: operatorName.trim(),
          bio: bio.trim() || undefined,
          region: region.trim() || undefined,
          service_region: serviceRegion.trim() || undefined,
        },
      });
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[520px] mx-auto bg-white rounded-2xl border border-[#ede8dc] p-8 shadow-sm">
      <h1 className="text-[24px] font-bold text-[#3d3229] mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
        Become a Fernweh Operator
      </h1>
      <p className="text-[14px] text-[#8a8a85] mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
        Tell us about your business. Our team reviews every application before it goes live.
      </p>

      <div className="flex flex-col gap-4">
        <Field label="Business Name" value={operatorName} onChange={setOperatorName} required />
        <Field label="Bio" value={bio} onChange={setBio} textarea />
        <Field label="Region" value={region} onChange={setRegion} placeholder="e.g. Gilgit-Baltistan" />
        <Field label="Service Region" value={serviceRegion} onChange={setServiceRegion} placeholder="e.g. Hunza, Skardu" />

        {error && (
          <p className="text-[13px] text-red-500" style={{ fontFamily: 'var(--font-inter)' }}>
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-6 py-3 cursor-pointer disabled:opacity-60"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}

function ResubmitForm({ current, onSubmitted }: { current: { operator_name: string; bio: string | null; region: string | null; service_region: string | null }; onSubmitted: () => void }) {
  const [operatorName, setOperatorName] = useState(current.operator_name);
  const [bio, setBio] = useState(current.bio ?? '');
  const [region, setRegion] = useState(current.region ?? '');
  const [serviceRegion, setServiceRegion] = useState(current.service_region ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/operator/register/resubmit', {
        method: 'POST',
        body: {
          operator_name: operatorName.trim(),
          bio: bio.trim() || undefined,
          region: region.trim() || undefined,
          service_region: serviceRegion.trim() || undefined,
        },
      });
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resubmit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[520px] mx-auto bg-white rounded-2xl border border-[#ede8dc] p-8 shadow-sm">
      <h1 className="text-[24px] font-bold text-[#3d3229] mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
        Update &amp; Resubmit
      </h1>
      <p className="text-[14px] text-[#8a8a85] mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
        Your previous application was not approved. Review your details and resubmit for another review.
      </p>

      <div className="flex flex-col gap-4">
        <Field label="Business Name" value={operatorName} onChange={setOperatorName} required />
        <Field label="Bio" value={bio} onChange={setBio} textarea />
        <Field label="Region" value={region} onChange={setRegion} />
        <Field label="Service Region" value={serviceRegion} onChange={setServiceRegion} />

        {error && (
          <p className="text-[13px] text-red-500" style={{ fontFamily: 'var(--font-inter)' }}>
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-6 py-3 cursor-pointer disabled:opacity-60"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {submitting ? 'Resubmitting…' : 'Resubmit Application'}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#3d3229] mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-4 py-3 text-[14px] text-[#3d3229] outline-none focus:border-[#1b7a3d] transition-colors resize-none"
          style={{ fontFamily: 'var(--font-inter)' }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-4 py-3 text-[14px] text-[#3d3229] outline-none focus:border-[#1b7a3d] transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        />
      )}
    </div>
  );
}

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  const { session, user, loading: authLoading, signOut } = useAuth();
  const status = useOperatorStatus();
  const pathname = usePathname();
  const router = useRouter();

  if (authLoading || status.kind === 'loading') {
    return (
      <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <p className="text-[#8a8a85] text-[15px]" style={{ fontFamily: 'var(--font-inter)' }}>
          Loading…
        </p>
      </main>
    );
  }

  if (!session) {
    router.replace('/login');
    return null;
  }

  if (status.kind === 'unregistered') {
    return (
      <main className="min-h-screen bg-[#faf7f2] px-6 py-16">
        <RegistrationForm onSubmitted={status.refresh} />
      </main>
    );
  }

  const { profile } = status;

  if (profile.verification_status === 'pending') {
    return (
      <main className="min-h-screen bg-[#faf7f2] px-6 py-16">
        <div className="max-w-[520px] mx-auto bg-white rounded-2xl border border-[#ede8dc] p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-[#fdf0dd] flex items-center justify-center mx-auto mb-4">
            <span className="text-[24px]">⏳</span>
          </div>
          <h1 className="text-[22px] font-bold text-[#3d3229] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            Application Under Review
          </h1>
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Thanks for applying, <strong>{profile.operator_name}</strong>. Our team is reviewing your
            application — this usually takes 1–2 business days. We&apos;ll notify you once it&apos;s approved.
          </p>
        </div>
      </main>
    );
  }

  if (profile.verification_status === 'rejected') {
    return (
      <main className="min-h-screen bg-[#faf7f2] px-6 py-16">
        <ResubmitForm current={profile} onSubmitted={status.refresh} />
      </main>
    );
  }

  if (profile.verification_status === 'suspended') {
    return (
      <main className="min-h-screen bg-[#faf7f2] px-6 py-16">
        <div className="max-w-[520px] mx-auto bg-white rounded-2xl border border-[#ede8dc] p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-[#fbe8e6] flex items-center justify-center mx-auto mb-4">
            <span className="text-[24px]">⚠️</span>
          </div>
          <h1 className="text-[22px] font-bold text-[#3d3229] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            Account Suspended
          </h1>
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            Your operator account has been suspended. Contact Fernweh support for more information.
          </p>
        </div>
      </main>
    );
  }

  // approved
  return (
    <div className="min-h-screen bg-[#faf7f2] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[240px] shrink-0 flex-col bg-white border-r border-[#ede8dc] h-screen sticky top-0">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#ede8dc]">
          <Image src="/assets/logo-nav.png" alt="Fernweh logo" width={28} height={25} className="object-contain" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#1b7a3d] text-[17px] font-black tracking-[0.03em]" style={{ fontFamily: 'var(--font-poppins)' }}>
              Fernweh
            </span>
            <span className="text-[9px] font-bold text-[#8a8a85] uppercase tracking-wider bg-[#f5f1e8] px-1.5 py-0.5 rounded">
              Operator
            </span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col px-4 py-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = NAV_ICONS[item.label];
            if (!item.enabled) {
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#c8c2b0] cursor-not-allowed"
                  title="Coming soon"
                >
                  <Icon />
                  <span className="text-[14px] font-semibold" style={{ fontFamily: 'var(--font-inter)' }}>
                    {item.label}
                  </span>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                  isActive ? 'bg-[#1b7a3d] text-white' : 'text-[#5d5d5a] hover:bg-[#f5f1e8] hover:text-[#3d3229]'
                }`}
              >
                <Icon />
                <span className="text-[14px] font-semibold" style={{ fontFamily: 'var(--font-inter)' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#ede8dc]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-[#1b7a3d] text-white flex items-center justify-center shrink-0">
              <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-inter)' }}>
                {profile.operator_name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#3d3229] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                {profile.operator_name}
              </p>
              <p className="text-[11px] text-[#8a8a85] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <Link
            href="/operator/settings"
            className={`w-full flex items-center gap-2 px-2 py-2 mt-1 text-[13px] font-medium rounded-lg transition-colors ${
              pathname === '/operator/settings' ? 'text-[#1b7a3d] bg-[#e8f2ec]' : 'text-[#5d5d5a] hover:bg-[#f5f1e8]'
            }`}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <SettingsIcon />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => signOut().then(() => router.push('/login'))}
            className="w-full text-left px-2 py-2 mt-1 text-[13px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
