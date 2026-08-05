'use client';

import { useState, useEffect, useRef } from 'react';
import { useRequireOperator } from '@/lib/use-require-operator';
import { apiFetch } from '@/lib/api';
import type { Thread, Message } from '@/types/api';

function Avatar() {
  return (
    <div className="w-[44px] h-[44px] rounded-full bg-[#1b7a3d] flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
      </svg>
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function OperatorMessagesPage() {
  const { session, user } = useRequireOperator();

  const [activeView, setActiveView] = useState<'list' | 'thread'>('list');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [threadsVersion, setThreadsVersion] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    apiFetch<Thread[]>('/threads?limit=50')
      .then((data) => {
        if (!cancelled) setThreads(data);
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
  }, [session, threadsVersion]);

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

  if (!user || user.role !== 'operator') return null;

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
      // leave the draft in place so the operator can retry
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="px-6 md:px-10 pt-8 pb-4 shrink-0">
        <h1 className="text-[26px] font-bold text-[#3d3229]" style={{ fontFamily: 'var(--font-poppins)' }}>
          Messages
        </h1>
        <p className="text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
          Conversations with travelers
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden border-t border-[#ede8dc]">
        {/* Conversation list */}
        <div className={`w-full md:w-[360px] border-r border-[#ede8dc] flex-col shrink-0 bg-white ${activeView === 'list' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex-1 overflow-y-auto">
            {!threadsLoading && threads.length === 0 && (
              <p className="px-6 py-6 text-[14px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
                No conversations yet.
              </p>
            )}
            {threads.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelectThread(t.id)}
                className={`flex items-start gap-3 px-5 py-3.5 border-b border-[#f5f1e8] cursor-pointer ${
                  selectedThreadId === t.id ? 'bg-[#e8f2ec]' : 'hover:bg-[#faf7f2]'
                }`}
              >
                <Avatar />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[#3d3229] text-[14px] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                      {t.is_support ? 'Fernweh Support' : 'Traveler'}
                    </span>
                    {t.last_message_at && (
                      <span className="text-[11px] text-[#8a8a85] shrink-0 ml-2">{formatTime(t.last_message_at)}</span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#8a8a85] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
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

        {/* Thread panel */}
        <div className={`flex-1 flex-col relative bg-[#faf7f2] ${activeView === 'thread' ? 'flex w-full' : 'hidden md:flex'}`}>
          {!selectedThread ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[15px] text-[#8a8a85]" style={{ fontFamily: 'var(--font-inter)' }}>
                Select a conversation to start chatting.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-[#ede8dc] shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  aria-label="Back to conversations"
                  className="md:hidden text-[#3d3229] hover:text-[#1b7a3d] transition-colors p-1 cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <Avatar />
                <h3 className="font-bold text-[#3d3229] text-[15px]" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {selectedThread.is_support ? 'Fernweh Support' : 'Traveler'}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-4">
                {messages.length === 0 && (
                  <div className="text-center text-[13px] text-[#8a8a85] my-2" style={{ fontFamily: 'var(--font-inter)' }}>
                    No messages yet.
                  </div>
                )}
                {messages.map((m) => (
                  <MessageBubble key={m.id} sent={m.sender_id === session?.user.id} time={formatTime(m.created_at)}>
                    {m.content ?? (m.attachment_url ? '📎 Attachment' : '')}
                  </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-t border-[#ede8dc] shrink-0 bg-white">
                <div className="flex-1 flex items-center bg-[#f5f1e8] border border-[#ede8dc] rounded-full px-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                    placeholder="Type a message…"
                    className="flex-1 bg-transparent py-2.5 text-[14px] outline-none"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="w-10 h-10 rounded-full bg-[#1b7a3d] flex items-center justify-center cursor-pointer hover:bg-[#146030] transition-colors shrink-0 disabled:opacity-60"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ children, sent, time }: { children: React.ReactNode; sent: boolean; time: string }) {
  return (
    <div className={`flex flex-col ${sent ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[420px] rounded-2xl px-5 py-3 text-[14px] leading-relaxed ${
          sent ? 'bg-[#1b7a3d] text-white' : 'bg-white text-[#3d3229] border border-[#ede8dc]'
        }`}
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {children}
      </div>
      <span className="text-[11px] text-[#8a8a85] mt-1 px-1">{time}</span>
    </div>
  );
}
