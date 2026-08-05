'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/use-require-auth';
import { apiFetch } from '@/lib/api';
import type { Thread, Message } from '@/types/api';

const FILTERS = ['All', 'Unread', 'Operators', 'Support'];

function Avatar() {
    return (
        <div className="w-[52px] h-[52px] rounded-full bg-[#1b7a3d] flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
            </svg>
        </div>
    );
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ChatPage() {
    return (
        <Suspense fallback={null}>
            <ChatPageInner />
        </Suspense>
    );
}

function ChatPageInner() {
    const { session, loading: authLoading } = useRequireAuth();
    const searchParams = useSearchParams();
    const operatorParam = searchParams.get('operator');
    const threadParam = searchParams.get('thread');

    const [activeFilter, setActiveFilter] = useState('All');
    const [message, setMessage] = useState('');
    const [activeView, setActiveView] = useState<'list' | 'thread'>('list');
    const [threads, setThreads] = useState<Thread[]>([]);
    const [threadsLoading, setThreadsLoading] = useState(true);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [threadsVersion, setThreadsVersion] = useState(0);

    useEffect(() => {
        if (!session) return;
        let cancelled = false;
        apiFetch<Thread[]>('/threads?limit=50')
            .then((data) => {
                if (cancelled) return;
                setThreads(data);
                if (threadParam && data.some((t) => t.id === threadParam)) {
                    setSelectedThreadId(threadParam);
                    setActiveView('thread');
                } else if (operatorParam) {
                    const match = data.find((t) => t.operator_id === operatorParam);
                    if (match) {
                        setSelectedThreadId(match.id);
                        setActiveView('thread');
                    }
                }
            })
            .catch(() => {
                if (!cancelled) setThreads([]);
            })
            .finally(() => {
                if (!cancelled) setThreadsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [session, operatorParam, threadParam, threadsVersion]);

    useEffect(() => {
        if (!selectedThreadId) return;
        let cancelled = false;
        apiFetch<Message[]>(`/threads/${selectedThreadId}/messages?limit=100`)
            .then((data) => {
                if (!cancelled) setMessages(data);
            })
            .catch(() => {
                if (!cancelled) setMessages([]);
            });
        apiFetch(`/threads/${selectedThreadId}/read`, { method: 'PATCH' }).catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [selectedThreadId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;

    const handleSelectThread = (id: string) => {
        setSelectedThreadId(id);
        setActiveView('thread');
    };

    const handleSend = async () => {
        const content = message.trim();
        if (!content || !selectedThreadId || sending) return;
        setSending(true);
        try {
            const sent = await apiFetch<Message>(`/threads/${selectedThreadId}/messages`, {
                method: 'POST',
                body: { content },
            });
            setMessages((prev) => [...prev, sent]);
            setMessage('');
            setThreadsVersion((v) => v + 1);
        } catch {
            // leave the draft in place so the user can retry
        } finally {
            setSending(false);
        }
    };

    if (authLoading) return null;
    if (!session) return null;

    return (
        <main className="h-screen flex flex-col bg-white">
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#ede8dc] shrink-0">
                <h1 className="text-[22px] font-bold text-[#1b7a3d]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Fernweh
                </h1>
                <a href="/home" className="text-[#8a8a85] text-[14px] font-medium hover:text-[#3d3229] transition-colors" style={{ fontFamily: 'var(--font-inter)' }}>
                    Back to Home
                </a>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Conversation List Sidebar */}
                <div className={`w-full md:w-[380px] border-r border-[#ede8dc] flex-col shrink-0 ${activeView === 'list' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="flex items-center justify-between px-6 pt-6 pb-4">
                        <h2 className="text-[24px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
                            Messages
                        </h2>
                    </div>

                    <div className="px-6 mb-4">
                        <input type="text" placeholder="Search conversations" className="w-full bg-[#f5f1e8] border border-[#ede8dc] rounded-full px-4 py-2.5 text-[14px] outline-none focus:border-[#1b7a3d] transition-colors" style={{ fontFamily: 'var(--font-inter)' }} />
                    </div>

                    <div className="flex gap-2 px-6 mb-4 overflow-x-auto">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setActiveFilter(f)}
                                className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-bold transition-all cursor-pointer ${activeFilter === f ? 'bg-[#1b7a3d] text-white' : 'bg-white border border-[#ede8dc] text-[#3d3229]'}`}
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {!threadsLoading && threads.length === 0 && (
                            <p className="px-6 py-4 text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
                                No conversations yet.
                            </p>
                        )}
                        {threads
                            .filter((t) => {
                                if (activeFilter === 'Unread') return (t.unread_count ?? 0) > 0;
                                if (activeFilter === 'Operators') return !t.is_support;
                                if (activeFilter === 'Support') return t.is_support;
                                return true;
                            })
                            .map((t) => (
                                <div
                                    key={t.id}
                                    onClick={() => handleSelectThread(t.id)}
                                    className={`flex items-start gap-3 px-6 py-3.5 border-b border-[#f5f1e8] cursor-pointer ${selectedThreadId === t.id ? 'bg-[#e8f2ec]' : 'hover:bg-[#faf7f2]'}`}
                                >
                                    <div className="relative">
                                        <Avatar />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="font-bold text-[#3d3229] text-[15px] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                                                {t.is_support ? 'Fernweh Support' : (t.operator_name ?? 'Operator')}
                                            </span>
                                            {t.last_message_at && (
                                                <span className="text-[12px] text-[#8a8a85] shrink-0 ml-2">
                                                    {formatTime(t.last_message_at)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[13.5px] text-[#8a8a85] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                                            {t.last_message_preview ?? ''}
                                        </p>
                                    </div>
                                    {!!t.unread_count && (
                                        <span className="w-5 h-5 rounded-full bg-[#f2a93b] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                            {t.unread_count}
                                        </span>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Chat Thread Panel */}
                <div className={`flex-1 flex-col relative ${activeView === 'thread' ? 'flex w-full' : 'hidden md:flex'}`}>
                    {!selectedThread ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-[15px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
                                Select a conversation to start chatting.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#ede8dc] shrink-0">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveView('list')}
                                        aria-label="Back to conversations"
                                        className="md:hidden text-[#3d3229] hover:text-[#1b7a3d] transition-colors p-1 cursor-pointer"
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div className="relative">
                                        <Avatar />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#3d3229] text-[16px] md:text-[17px]" style={{ fontFamily: 'var(--font-poppins)' }}>
                                            {selectedThread.is_support ? 'Fernweh Support' : (selectedThread.operator_name ?? 'Operator')}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
                                <span className="text-[80px] font-black" style={{ fontFamily: 'var(--font-anton)' }}>
                                    FERNWEH
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-4 z-10 relative">
                                {messages.length === 0 && (
                                    <div className="text-center text-[13px] text-[#8a8a85] my-2" style={{ fontFamily: 'var(--font-inter)' }}>
                                        No messages yet — say hello!
                                    </div>
                                )}
                                {messages.map((m) => (
                                    <MessageBubble
                                        key={m.id}
                                        sent={m.sender_id === session.user.id}
                                        time={formatTime(m.created_at)}
                                    >
                                        {m.content ?? (m.attachment_url ? '📎 Attachment' : '')}
                                    </MessageBubble>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-8 py-4 border-t border-[#ede8dc] shrink-0 z-10">
                                <div className="flex-1 flex items-center bg-[#f5f1e8] border border-[#ede8dc] rounded-full px-4">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSend();
                                        }}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent py-3 text-[14px] md:text-[15px] outline-none"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={sending || !message.trim()}
                                    className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#1b7a3d] flex items-center justify-center cursor-pointer hover:bg-[#146030] transition-colors shrink-0 disabled:opacity-60"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

function MessageBubble({
    children,
    sent,
    time,
}: {
    children: React.ReactNode;
    sent: boolean;
    time: string;
}) {
    return (
        <div className={`flex flex-col ${sent ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[420px] rounded-2xl px-5 py-3 text-[14.5px] leading-relaxed ${sent ? 'bg-[#1b7a3d] text-white' : 'bg-[#f5f1e8] text-[#3d3229]'}`} style={{ fontFamily: 'var(--font-inter)' }}>
                {children}
            </div>
            <span className="text-[11px] text-[#8a8a85] mt-1 px-1">{time}</span>
        </div>
    );
}
