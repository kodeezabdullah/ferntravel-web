'use client';

import { useEffect, useState } from 'react';
import { useRequireOperator } from '@/lib/use-require-operator';
import { apiFetch, apiFetchRaw } from '@/lib/api';
import type { OperatorBooking, BookingStatus } from '@/types/api';

const TABS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-[#fdf0dd] text-[#c98a2e]',
  confirmed: 'bg-[#e8f2ec] text-[#1b7a3d]',
  cancelled: 'bg-[#fbe8e6] text-[#c0392b]',
};

function ManualBookingModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [customerEmail, setCustomerEmail] = useState('');
  const [departureId, setDepartureId] = useState('');
  const [seatsRequested, setSeatsRequested] = useState('1');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('pending');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!customerEmail.trim() || !departureId.trim()) {
      setError('Customer email and departure ID are required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/operator/bookings/manual', {
        method: 'POST',
        body: {
          customer_email: customerEmail.trim(),
          departure_id: departureId.trim(),
          seats_requested: Number(seatsRequested),
          payment_status: paymentStatus,
        },
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to add booking. The customer must already have a Fernweh account.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[440px] shadow-2xl">
        <h2 className="text-[18px] font-bold text-[#3d3229] mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
          Add Manual Booking
        </h2>
        <p className="text-[12.5px] text-[#8a8a85] mb-5" style={{ fontFamily: 'var(--font-inter)' }}>
          For bookings taken by phone or WhatsApp. The customer must already have an account.
        </p>

        <div className="flex flex-col gap-3">
          <ModalField label="Customer Email" value={customerEmail} onChange={setCustomerEmail} placeholder="customer@example.com" />
          <ModalField label="Departure ID" value={departureId} onChange={setDepartureId} placeholder="From the tour's departure list" />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Seats" value={seatsRequested} onChange={setSeatsRequested} type="number" />
            <div>
              <label className="block text-[12px] font-semibold text-[#3d3229] mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                Payment
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'pending')}
                className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-3 py-2.5 text-[13.5px] outline-none focus:border-[#1b7a3d]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-[12.5px] text-red-500" style={{ fontFamily: 'var(--font-inter)' }}>
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-[#ede8dc] text-[#3d3229] font-bold text-[13.5px] rounded-full py-2.5 cursor-pointer"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-1 bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[13.5px] rounded-full py-2.5 cursor-pointer disabled:opacity-60"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {submitting ? 'Adding…' : 'Add Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#3d3229] mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-3 py-2.5 text-[13.5px] outline-none focus:border-[#1b7a3d]"
        style={{ fontFamily: 'var(--font-inter)' }}
      />
    </div>
  );
}

export default function OperatorBookingsPage() {
  const { user } = useRequireOperator();
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const [bookings, setBookings] = useState<OperatorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [showManualModal, setShowManualModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'operator') return;
    let cancelled = false;
    const statusParam = activeTab === 'all' ? '' : `?status=${activeTab}`;
    apiFetch<OperatorBooking[]>(`/operator/bookings${statusParam}${statusParam ? '&' : '?'}limit=100`)
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
  }, [user, activeTab, version]);

  const handleUpdateStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setUpdatingId(bookingId);
    try {
      await apiFetch(`/operator/bookings/${bookingId}`, { method: 'PATCH', body: { status } });
      setVersion((v) => v + 1);
    } catch {
      // leave list unchanged on failure
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await apiFetchRaw('/operator/bookings/export');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookings.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // no-op — export failure isn't destructive, user can retry
    } finally {
      setExporting(false);
    }
  };

  if (!user || user.role !== 'operator') return null;

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Bookings
          </h1>
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            {bookings.length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={exporting}
            onClick={handleExport}
            className="border border-[#ede8dc] hover:border-[#1b7a3d] text-[#3d3229] hover:text-[#1b7a3d] transition-colors font-bold text-[13.5px] rounded-full px-5 py-2.5 cursor-pointer disabled:opacity-60"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {exporting ? 'Exporting…' : '↓ Export CSV'}
          </button>
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[13.5px] rounded-full px-5 py-2.5 cursor-pointer"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            + Add Manual Booking
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-5 py-2 text-[13.5px] font-bold transition-all cursor-pointer ${
              activeTab === tab.value
                ? 'bg-[#1b7a3d] text-white'
                : 'bg-white border border-[#ede8dc] text-[#3d3229] hover:border-[#d8d2c2]'
            }`}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Loading…
        </p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede8dc] p-10 text-center">
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            No bookings in this category yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ede8dc] overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#ede8dc] text-left">
                {['Customer', 'Tour', 'Departure', 'Seats', 'Payment', 'Source', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11.5px] font-bold text-[#8a8a85] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-[#ede8dc] last:border-0">
                  <td className="px-4 py-3 text-[13.5px] font-semibold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {b.customer_name}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#5d5d5a]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {b.tour_name}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#5d5d5a]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {b.departure_date}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#5d5d5a]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {b.seats_requested}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#5d5d5a] capitalize" style={{ fontFamily: 'var(--font-inter)' }}>
                    {b.payment_status}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        b.source === 'manual' ? 'bg-[#e8e4f5] text-[#6b4fbb]' : 'bg-[#e8f2ec] text-[#1b7a3d]'
                      }`}
                    >
                      {b.source === 'manual' ? 'Manual' : 'App'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11.5px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[b.status]}`}
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={updatingId === b.id}
                          onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                          className="text-[12px] font-bold text-[#1b7a3d] hover:opacity-70 cursor-pointer disabled:opacity-40"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === b.id}
                          onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                          className="text-[12px] font-bold text-red-500 hover:opacity-70 cursor-pointer disabled:opacity-40"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showManualModal && (
        <ManualBookingModal
          onClose={() => setShowManualModal(false)}
          onCreated={() => setVersion((v) => v + 1)}
        />
      )}
    </div>
  );
}
