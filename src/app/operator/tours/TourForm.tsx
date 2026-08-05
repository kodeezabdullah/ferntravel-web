'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiFetch, apiUpload } from '@/lib/api';
import type { GroupDiscountRule, ItineraryStep, OperatorTour, Departure } from '@/types/api';

interface TourFormProps {
  mode: 'create' | 'edit';
  tourId?: string;
  initial?: OperatorTour;
  departures?: Departure[];
  onDeparturesChange?: () => void;
}

export default function TourForm({ mode, tourId, initial, departures, onDeparturesChange }: TourFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [tourName, setTourName] = useState(initial?.tour_name ?? '');
  const [destination, setDestination] = useState(initial?.destination ?? '');
  const [duration, setDuration] = useState(initial?.duration ?? '');
  const [cost, setCost] = useState(initial ? String(initial.cost) : '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initial?.cover_image_url ?? null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initial?.gallery_image_urls ?? []);
  const [itinerary, setItinerary] = useState<ItineraryStep[]>(initial?.itinerary ?? []);
  const [discounts, setDiscounts] = useState<GroupDiscountRule[]>(initial?.group_discount_rules ?? []);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newDepartureDate, setNewDepartureDate] = useState('');
  const [newDepartureSeats, setNewDepartureSeats] = useState('');
  const [addingDeparture, setAddingDeparture] = useState(false);

  const buildBody = () => ({
    tour_name: tourName.trim(),
    destination: destination.trim(),
    duration: duration.trim() || undefined,
    cost: Number(cost),
    description: description.trim() || undefined,
    cover_image_url: coverImageUrl || undefined,
    gallery_image_urls: galleryUrls,
    itinerary: itinerary
      .filter((step) => step.title.trim())
      .map((step, i) => ({ ...step, order: i, title: step.title.trim() })),
    group_discount_rules: discounts.length > 0 ? discounts : undefined,
  });

  const validate = () => {
    if (!tourName.trim()) return 'Tour name is required.';
    if (!destination.trim()) return 'Destination is required.';
    if (!cost || Number.isNaN(Number(cost)) || Number(cost) < 0) return 'Enter a valid price.';
    return null;
  };

  const hasDepartures = (departures?.length ?? 0) > 0;

  const handleSave = async (status: 'draft' | 'published') => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (mode === 'create') {
        // A tour needs at least one departure before it can be published, and departures can
        // only be added once the tour exists — so creation always saves as a draft, and the
        // operator publishes from the edit page after adding a departure there.
        const tour = await apiFetch<OperatorTour>('/operator/tours', {
          method: 'POST',
          body: buildBody(),
        });
        router.push(`/operator/tours/${tour.id}/edit`);
      } else if (tourId) {
        if (status === 'published' && !hasDepartures) {
          setError('Add at least one departure date before publishing.');
          setSaving(false);
          return;
        }
        await apiFetch(`/operator/tours/${tourId}`, {
          method: 'PATCH',
          body: { ...buildBody(), status },
        });
        router.push('/operator/tours');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tour.');
    } finally {
      setSaving(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const result = await apiUpload<{ url: string }>('/media/upload', file, {
        purpose: 'tour_image',
        kind: 'image',
      });
      setCoverImageUrl(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload cover image.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    try {
      const result = await apiUpload<{ url: string }>('/media/upload', file, {
        purpose: 'tour_image',
        kind: 'image',
      });
      setGalleryUrls((prev) => [...prev, result.url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const addItineraryStep = () => {
    setItinerary((prev) => [...prev, { order: prev.length, title: '', description: '' }]);
  };

  const updateItineraryStep = (index: number, patch: Partial<ItineraryStep>) => {
    setItinerary((prev) => prev.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  };

  const removeItineraryStep = (index: number) => {
    setItinerary((prev) =>
      prev.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i })),
    );
  };

  const addDiscount = () => {
    setDiscounts((prev) => [...prev, { min_people: 2, discount_pct: 5 }]);
  };

  const updateDiscount = (index: number, patch: Partial<GroupDiscountRule>) => {
    setDiscounts((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const removeDiscount = (index: number) => {
    setDiscounts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDeparture = async () => {
    if (!tourId || !newDepartureDate || !newDepartureSeats) return;
    setAddingDeparture(true);
    try {
      await apiFetch(`/operator/tours/${tourId}/departures`, {
        method: 'POST',
        body: {
          departure_date: newDepartureDate,
          seats_total: Number(newDepartureSeats),
        },
      });
      setNewDepartureDate('');
      setNewDepartureSeats('');
      onDeparturesChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add departure.');
    } finally {
      setAddingDeparture(false);
    }
  };

  return (
    <div className="max-w-[800px] flex flex-col gap-8">
      {error && (
        <p className="text-[13px] text-red-500 bg-red-50 rounded-lg px-4 py-3" style={{ fontFamily: 'var(--font-inter)' }}>
          {error}
        </p>
      )}

      {/* Basic Info */}
      <Section title="Basic Info">
        <Field label="Tour Name" value={tourName} onChange={setTourName} required />
        <Field label="Destination" value={destination} onChange={setDestination} required placeholder="e.g. Fairy Meadows, Gilgit-Baltistan" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Duration" value={duration} onChange={setDuration} placeholder="e.g. 3D/2N" />
          <Field label="Price per person (PKR)" value={cost} onChange={setCost} required type="number" />
        </div>
        <Field label="Description" value={description} onChange={setDescription} textarea />
      </Section>

      {/* Cover + gallery */}
      <Section title="Photos">
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-semibold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            {coverImageUrl && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <Image src={coverImageUrl} alt="Cover" fill className="object-cover" unoptimized />
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            <button
              type="button"
              disabled={uploadingCover}
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[13px] rounded-full px-5 py-2.5 cursor-pointer disabled:opacity-60"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {uploadingCover ? 'Uploading…' : coverImageUrl ? 'Change Cover' : 'Upload Cover'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <label className="text-[13px] font-semibold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
            Gallery
          </label>
          <div className="flex flex-wrap gap-3">
            {galleryUrls.map((url, i) => (
              <div key={url + i} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 group">
                <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => setGalleryUrls((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 bg-black/50 text-white text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />
            <button
              type="button"
              disabled={uploadingGallery}
              onClick={() => galleryInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-[#ede8dc] hover:border-[#1b7a3d] flex items-center justify-center text-[#8a8a85] hover:text-[#1b7a3d] transition-colors cursor-pointer disabled:opacity-60"
            >
              {uploadingGallery ? '…' : '+'}
            </button>
          </div>
        </div>
      </Section>

      {/* Itinerary builder */}
      <Section title="Itinerary" action={{ label: '+ Add Step', onClick: addItineraryStep }}>
        {itinerary.length === 0 ? (
          <p className="text-[13.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            No steps yet — add the first one.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {itinerary.map((step, i) => (
              <div key={i} className="flex gap-3 items-start bg-[#faf7f2] rounded-xl p-3">
                <span className="w-6 h-6 rounded-full bg-[#1b7a3d] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-1">
                  {i + 1}
                </span>
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateItineraryStep(i, { title: e.target.value })}
                    placeholder="Step title"
                    className="bg-white border border-[#ede8dc] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#1b7a3d]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                  <textarea
                    value={step.description ?? ''}
                    onChange={(e) => updateItineraryStep(i, { description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                    className="bg-white border border-[#ede8dc] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#1b7a3d] resize-none"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItineraryStep(i)}
                  className="text-red-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                  aria-label="Remove step"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Group discounts */}
      <Section title="Group Discounts" action={{ label: '+ Add Tier', onClick: addDiscount }}>
        {discounts.length === 0 ? (
          <p className="text-[13.5px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            No group discounts configured.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {discounts.map((d, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#faf7f2] rounded-xl p-3">
                <span className="text-[13px] text-[#5d5d5a]" style={{ fontFamily: 'var(--font-inter)' }}>
                  5+ people:
                </span>
                <input
                  type="number"
                  value={d.min_people}
                  onChange={(e) => updateDiscount(i, { min_people: Number(e.target.value) })}
                  className="w-20 bg-white border border-[#ede8dc] rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[#1b7a3d]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                />
                <span className="text-[13px] text-[#5d5d5a]">people →</span>
                <input
                  type="number"
                  value={d.discount_pct}
                  onChange={(e) => updateDiscount(i, { discount_pct: Number(e.target.value) })}
                  className="w-20 bg-white border border-[#ede8dc] rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[#1b7a3d]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                />
                <span className="text-[13px] text-[#5d5d5a]">% off</span>
                <button
                  type="button"
                  onClick={() => removeDiscount(i)}
                  className="ml-auto text-red-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Departures (edit mode only, tour must exist) */}
      {mode === 'edit' && tourId && (
        <Section title="Departure Dates">
          {departures && departures.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {departures.map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-[#faf7f2] rounded-xl px-4 py-2.5">
                  <span className="text-[13.5px] font-semibold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {d.departure_date}
                  </span>
                  <span className="text-[13px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {d.seats_available}/{d.seats_total} seats available
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-[#3d3229] mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                Date
              </label>
              <input
                type="date"
                value={newDepartureDate}
                onChange={(e) => setNewDepartureDate(e.target.value)}
                className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-3 py-2.5 text-[13.5px] outline-none focus:border-[#1b7a3d]"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>
            <div className="w-32">
              <label className="block text-[12px] font-semibold text-[#3d3229] mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                Total Seats
              </label>
              <input
                type="number"
                value={newDepartureSeats}
                onChange={(e) => setNewDepartureSeats(e.target.value)}
                className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-3 py-2.5 text-[13.5px] outline-none focus:border-[#1b7a3d]"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>
            <button
              type="button"
              disabled={addingDeparture || !newDepartureDate || !newDepartureSeats}
              onClick={handleAddDeparture}
              className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[13px] rounded-xl px-5 py-2.5 cursor-pointer disabled:opacity-60"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {addingDeparture ? 'Adding…' : 'Add'}
            </button>
          </div>
        </Section>
      )}

      {/* Save actions */}
      <div className="flex items-center gap-3 sticky bottom-0 bg-[#faf7f2] py-4 border-t border-[#ede8dc] -mx-6 px-6 md:-mx-10 md:px-10">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave('draft')}
          className="border-2 border-[#ede8dc] text-[#3d3229] hover:border-[#1b7a3d] transition-colors font-bold text-[14px] rounded-full px-6 py-3 cursor-pointer disabled:opacity-60"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {saving ? 'Saving…' : 'Save as Draft'}
        </button>
        {mode === 'edit' && (
          <button
            type="button"
            disabled={saving || !hasDepartures}
            title={!hasDepartures ? 'Add a departure date before publishing' : undefined}
            onClick={() => handleSave('published')}
            className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full px-6 py-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        )}
      </div>
      {mode === 'create' && (
        <p className="text-[12.5px] text-[#8a8a85] -mt-4" style={{ fontFamily: 'var(--font-inter)' }}>
          Save your tour first, then add a departure date to publish it.
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#ede8dc] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
          {title}
        </h2>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-[13px] font-bold text-[#1b7a3d] hover:opacity-80 cursor-pointer"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {action.label}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
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
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  type?: string;
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
          rows={4}
          className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-4 py-3 text-[14px] text-[#3d3229] outline-none focus:border-[#1b7a3d] transition-colors resize-none"
          style={{ fontFamily: 'var(--font-inter)' }}
        />
      ) : (
        <input
          type={type}
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
