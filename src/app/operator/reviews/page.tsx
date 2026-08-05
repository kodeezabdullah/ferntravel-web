'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import type { OperatorReview } from '@/types/api';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? '#f2a93b' : 'none'}
          stroke={i < rating ? '#f2a93b' : '#c8c2b0'}
          strokeWidth="2"
        >
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function ReviewCard({ review, onReplied }: { review: OperatorReview; onReplied: (r: OperatorReview) => void }) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await apiFetch<OperatorReview>(`/operator/reviews/${review.id}/reply`, {
        method: 'POST',
        body: { reply: trimmed },
      });
      onReplied(updated);
      setReplying(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ede8dc] p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1b7a3d] text-white flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-inter)' }}>
              {review.reviewer_name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-inter)' }}>
              {review.reviewer_name}
            </p>
            <p className="text-[12px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>

      <p className="text-[14px] text-[#3d3229] leading-relaxed mt-3" style={{ fontFamily: 'var(--font-inter)' }}>
        {review.comment}
      </p>

      {review.operator_reply ? (
        <div className="mt-4 bg-[#f5f1e8] rounded-xl p-4 border-l-[3px] border-[#1b7a3d]">
          <p className="text-[12px] font-bold text-[#1b7a3d] mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
            Your reply
          </p>
          <p className="text-[13.5px] text-[#3d3229] leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
            {review.operator_reply}
          </p>
        </div>
      ) : replying ? (
        <div className="mt-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a public reply…"
            rows={3}
            className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-xl px-4 py-3 text-[14px] text-[#3d3229] outline-none focus:border-[#1b7a3d] transition-colors resize-none"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
          {error && (
            <p className="text-[12px] text-red-500 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
              {error}
            </p>
          )}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[13px] rounded-full px-5 py-2 cursor-pointer disabled:opacity-60"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {submitting ? 'Posting…' : 'Post Reply'}
            </button>
            <button
              type="button"
              onClick={() => {
                setReplying(false);
                setError(null);
              }}
              className="text-[#8a8a85] hover:text-[#3d3229] transition-colors font-semibold text-[13px] px-3 py-2 cursor-pointer"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setReplying(true)}
          className="mt-3 text-[13px] font-bold text-[#1b7a3d] hover:text-[#146030] transition-colors cursor-pointer"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Reply
        </button>
      )}
    </div>
  );
}

export default function OperatorReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<OperatorReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiFetch<OperatorReview[]>('/operator/reviews')
      .then((data) => {
        if (!cancelled) setReviews(data);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  if (!user || user.role !== 'operator') return null;

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Reviews
          </h1>
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            {reviews.length} total{avgRating && ` · ${avgRating} average rating`}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Loading…
        </p>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede8dc] p-10 text-center">
          <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
            No reviews yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onReplied={(updated) =>
                setReviews((prev) => prev.map((rv) => (rv.id === updated.id ? updated : rv)))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
