'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';

interface FAQ {
    question: string;
    answer: string;
}

const FAQS: FAQ[] = [
    {
        question: 'How do I book a tour?',
        answer:
            'Browse tours on the Tours page, open the one you like, choose a departure date and number of travelers, then tap "Book This Experience." Your booking will appear under My Bookings with a status of Pending until the operator confirms it.',
    },
    {
        question: 'How do I cancel or change a booking?',
        answer:
            'Message the operator directly from your booking in My Bookings — they can update or cancel a booking on their end. Refund and rescheduling terms vary by operator and tour.',
    },
    {
        question: 'How are operators verified?',
        answer:
            'Every operator on Fernweh applies for approval and is reviewed by our team before they can list tours. Verified operators show a green "Verified" badge on their profile.',
    },
    {
        question: 'How do I become an operator?',
        answer:
            'Sign up for an account, then apply through operator registration. Your account keeps normal traveler access until an admin approves your application — approved operators get access to their own tour and booking management tools.',
    },
    {
        question: 'How do I update my profile or phone number?',
        answer:
            'Go to Settings → Public Profile to update your name, phone number, and profile photo. Your email is tied to your login and can’t be changed from this page.',
    },
    {
        question: 'Is my payment information safe?',
        answer:
            'Fernweh does not store your payment card details. Payment and confirmation details are handled directly between you and the tour operator for each booking.',
    },
];

function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <div className="flex flex-col divide-y divide-[#ede8dc]">
            {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                    <div key={idx} className="py-4">
                        <button
                            type="button"
                            onClick={() => setOpenIdx(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
                        >
                            <span
                                className="text-[15px] font-semibold text-[#3d3229]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                {faq.question}
                            </span>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`flex-shrink-0 text-[#1b7a3d] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-60 mt-3' : 'max-h-0'}`}
                        >
                            <p
                                className="text-[14px] text-[#5d5d5a] leading-relaxed"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function SupportPage() {
    const { session } = useAuth();
    const router = useRouter();
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStartConversation = async () => {
        if (!session) {
            router.push('/login');
            return;
        }
        setError(null);
        setStarting(true);
        try {
            const thread = await apiFetch<{ id: string }>('/threads/support', { method: 'POST' });
            router.push(`/chat?thread=${thread.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start a conversation.');
        } finally {
            setStarting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#faf7f2]">
            <LightNavbar />

            <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
                {/* Breadcrumb */}
                <div
                    className="text-[#8a8a85] text-[13px] mb-4 flex items-center gap-1"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    <span>Home</span>
                    <span className="text-[11px]">&rsaquo;</span>
                    <span className="text-[#3d3229] font-medium">Support</span>
                </div>

                {/* Heading */}
                <h1
                    className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                >
                    How can we help?
                </h1>
                <p
                    className="text-[#8a8a85] text-[15px] mb-12"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    Answers to common questions, or reach our team directly
                </p>

                {/* FAQ */}
                <div className="max-w-[800px] mb-16">
                    <h2
                        className="text-[20px] font-bold text-[#3d3229] mb-4"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        Frequently Asked Questions
                    </h2>
                    <FAQAccordion faqs={FAQS} />
                </div>

                {/* Contact CTA */}
                <div className="max-w-[800px] bg-white border border-[#ede8dc] rounded-2xl p-8 flex flex-col items-start gap-4">
                    <h2
                        className="text-[20px] font-bold text-[#3d3229]"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        Still need help?
                    </h2>
                    <p
                        className="text-[14.5px] text-[#5d5d5a] leading-relaxed"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    >
                        Start a conversation with our support team and we&apos;ll get back to you as soon
                        as possible.
                    </p>

                    {error && (
                        <p className="text-[13px] text-red-500" style={{ fontFamily: 'var(--font-inter)' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="button"
                        disabled={starting}
                        onClick={handleStartConversation}
                        className="bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white font-bold text-[14px] rounded-full px-8 py-3.5 cursor-pointer disabled:opacity-60"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    >
                        {starting ? 'Starting…' : 'Start a Conversation'}
                    </button>
                </div>
            </div>

            <HomeFooter />
        </main>
    );
}
