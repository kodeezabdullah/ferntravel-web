'use client';

import { useEffect, useState } from 'react';
import { useRequireOperator } from '@/lib/use-require-operator';
import { useOperatorStatus } from '@/lib/use-operator-status';
import { apiFetch } from '@/lib/api';
import type { OperatorProfile, MessageTemplate } from '@/types/api';

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#3d3229] mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
        {label}
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

function ProfileSection({ profile }: { profile: OperatorProfile }) {
  const [operatorName, setOperatorName] = useState(profile.operator_name);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [region, setRegion] = useState(profile.region ?? '');
  const [serviceRegion, setServiceRegion] = useState(profile.service_region ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await apiFetch('/operator/me', {
        method: 'PATCH',
        body: {
          operator_name: operatorName.trim(),
          bio: bio.trim() || undefined,
          region: region.trim() || undefined,
          service_region: serviceRegion.trim() || undefined,
        },
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ede8dc] p-6">
      <h2 className="text-[16px] font-bold text-[#3d3229] mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
        Business Profile
      </h2>
      <div className="flex flex-col gap-4">
        <Field label="Business Name" value={operatorName} onChange={setOperatorName} />
        <Field label="Bio" value={bio} onChange={setBio} textarea />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Region" value={region} onChange={setRegion} />
          <Field label="Service Region" value={serviceRegion} onChange={setServiceRegion} />
        </div>

        {error && (
          <p className="text-[13px] text-red-500" style={{ fontFamily: 'var(--font-inter)' }}>
            {error}
          </p>
        )}
        {saved && (
          <p className="text-[13px] text-[#1b7a3d] font-semibold" style={{ fontFamily: 'var(--font-inter)' }}>
            Changes saved.
          </p>
        )}

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="self-start bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-6 py-2.5 cursor-pointer disabled:opacity-60"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function TemplatesSection() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<MessageTemplate[]>('/operator/message-templates')
      .then((data) => {
        if (!cancelled) setTemplates(data);
      })
      .catch(() => {
        if (!cancelled) setTemplates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await apiFetch<MessageTemplate>('/operator/message-templates', {
        method: 'POST',
        body: { title: newTitle.trim(), body: newBody.trim() },
      });
      setTemplates((prev) => [created, ...prev]);
      setNewTitle('');
      setNewBody('');
      setShowNew(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await apiFetch(`/operator/message-templates/${id}`, { method: 'DELETE' });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // leave the list unchanged on failure
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ede8dc] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
          Message Templates
        </h2>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="text-[13px] font-bold text-[#1b7a3d] hover:text-[#146030] transition-colors cursor-pointer"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {showNew ? 'Cancel' : '+ New Template'}
        </button>
      </div>

      {showNew && (
        <div className="flex flex-col gap-3 mb-4 p-4 bg-[#faf7f2] rounded-xl">
          <Field label="Title" value={newTitle} onChange={setNewTitle} placeholder="e.g. Booking Confirmed" />
          <Field label="Message" value={newBody} onChange={setNewBody} textarea placeholder="Write the canned reply…" />
          {error && (
            <p className="text-[12px] text-red-500" style={{ fontFamily: 'var(--font-inter)' }}>
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={submitting}
            onClick={handleCreate}
            className="self-start bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[13px] rounded-full px-5 py-2 cursor-pointer disabled:opacity-60"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {submitting ? 'Saving…' : 'Save Template'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-[13.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Loading…
        </p>
      ) : templates.length === 0 ? (
        <p className="text-[13.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          No templates yet — save canned replies for common questions.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-[#ede8dc]">
          {templates.map((t) => (
            <div key={t.id} className="py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
                  {t.title}
                </p>
                <p className="text-[13px] text-[#8a8a85] mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                  {t.body}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="text-[12px] font-semibold text-red-500 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OperatorSettingsPage() {
  const { user } = useRequireOperator();
  const status = useOperatorStatus();

  if (!user || user.role !== 'operator') return null;
  if (status.kind !== 'registered') return null;

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
          Settings
        </h1>
        <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Manage your business profile and saved replies
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-[720px]">
        <ProfileSection profile={status.profile} />
        <TemplatesSection />
      </div>
    </div>
  );
}
