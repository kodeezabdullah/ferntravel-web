'use client';

import { useState } from 'react';

interface Conversation {
    name: string;
    time: string;
    preview: string;
    unread?: number;
    online?: boolean;
}

const CONVERSATIONS: Conversation[] = [
    { name: 'Northern Trails Co.', time: '2:41 PM', preview: 'Your booking for Fairy Meadows is confirmed! ✅', unread: 2, online: true },
    { name: 'Karakoram Adventures', time: '1:15 PM', preview: 'You: Is the Hunza trip still available for Aug?', online: true },
    { name: 'Fernweh Support', time: '11:02 AM', preview: 'Let us know if you need any help 🙂' },
    { name: 'Summit Seekers PK', time: 'Yesterday', preview: 'Great! See you at the meeting point.' },
    { name: 'Wild Valley Treks', time: 'Yesterday', preview: 'Photo attached 📷', unread: 1, online: true },
    { name: 'Ahmed (Guide)', time: 'Mon', preview: 'Weather looks clear for tomorrow' },
];

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

export default function ChatPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [message, setMessage] = useState('');
    const [activeView, setActiveView] = useState<'list' | 'thread'>('list');

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
                        <button type="button" className="w-9 h-9 rounded-full bg-[#1b7a3d] flex items-center justify-center cursor-pointer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                        </button>
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
                        {CONVERSATIONS.map((c, i) => (
                            <div
                                key={c.name}
                                onClick={() => setActiveView('thread')}
                                className={`flex items-start gap-3 px-6 py-3.5 border-b border-[#f5f1e8] cursor-pointer ${i === 0 ? 'bg-[#e8f2ec]' : 'hover:bg-[#faf7f2]'}`}
                            >
                                <div className="relative">
                                    <Avatar />
                                    {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1b7a3d] border-2 border-white rounded-full" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-bold text-[#3d3229] text-[15px] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                                            {c.name}
                                        </span>
                                        <span className="text-[12px] text-[#8a8a85] shrink-0 ml-2">{c.time}</span>
                                    </div>
                                    <p className="text-[13.5px] text-[#8a8a85] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                                        {c.preview}
                                    </p>
                                </div>
                                {c.unread && (
                                    <span className="w-5 h-5 rounded-full bg-[#f2a93b] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                        {c.unread}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Thread Panel */}
                <div className={`flex-1 flex-col relative ${activeView === 'thread' ? 'flex w-full' : 'hidden md:flex'}`}>
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
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1b7a3d] border-2 border-white rounded-full" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#3d3229] text-[16px] md:text-[17px]" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    Northern Trails Co.
                                </h3>
                                <p className="text-[12px] md:text-[13px] text-[#1b7a3d]" style={{ fontFamily: 'var(--font-inter)' }}>
                                    Online &middot; Fairy Meadows 3-Day Trek
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 md:gap-3">
                            {['call', 'video', 'info'].map((icon) => (
                                <button key={icon} type="button" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#f5f1e8] flex items-center justify-center cursor-pointer hover:bg-[#ede8dc] transition-colors">
                                    <span className="text-[15px] md:text-[16px]">{icon === 'call' ? '📞' : icon === 'video' ? '🎥' : 'ℹ️'}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
                        <span className="text-[80px] font-black" style={{ fontFamily: 'var(--font-anton)' }}>
                            FERNWEH
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-4 z-10 relative">
                        <div className="text-center text-[13px] text-[#8a8a85] my-2" style={{ fontFamily: 'var(--font-inter)' }}>
                            Today
                        </div>

                        <MessageBubble sent={false} time="2:20 PM">
                            Assalam-o-Alaikum! I&apos;m interested in the Fairy Meadows 3-Day Trek for early August.
                        </MessageBubble>

                        <MessageBubble sent time="2:20 PM">
                            Walaikum Assalam! Great choice 🏔️ We have availability starting Aug 2nd.
                        </MessageBubble>

                        <MessageBubble sent={false} time="2:25 PM">
                            Perfect, can I book for 2 people?
                        </MessageBubble>

                        <MessageBubble sent time="2:25 PM">
                            Yes, absolutely! Let me send you the booking summary.
                        </MessageBubble>

                        <div className="self-end max-w-[360px] bg-[#1b7a3d] rounded-2xl p-1">
                            <div className="bg-white rounded-xl p-5">
                                <h4 className="font-bold text-[#3d3229] text-[16px] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    Fairy Meadows 3-Day Trek
                                </h4>
                                <p className="text-[13.5px] text-[#5d5d5a] mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                                    📅 02 Aug 2026 &nbsp;&middot;&nbsp; 👥 2 Adults
                                </p>
                                <p className="text-[19px] font-bold text-[#1b7a3d] mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                                    Total: PKR 49,000
                                </p>
                                <button type="button" className="w-full bg-[#1b7a3d] hover:bg-[#146030] transition-colors text-white font-bold text-[14px] rounded-full py-2.5 cursor-pointer" style={{ fontFamily: 'var(--font-inter)' }}>
                                    Confirm Booking
                                </button>
                            </div>
                        </div>

                        <MessageBubble sent={false} time="2:30 PM">
                            That looks great, confirming now! 🎒
                        </MessageBubble>

                        <MessageBubble sent time="2:30 PM">
                            Awesome! Booking confirmed ✅ We&apos;ll send pickup details a day before. See you on the trail!
                        </MessageBubble>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 px-4 md:px-8 py-4 border-t border-[#ede8dc] shrink-0 z-10">
                        <button type="button" className="text-[20px] cursor-pointer">📎</button>
                        <div className="flex-1 flex items-center bg-[#f5f1e8] border border-[#ede8dc] rounded-full px-4">
                            <span className="text-[18px] mr-2">🙂</span>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent py-3 text-[14px] md:text-[15px] outline-none"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            />
                        </div>
                        <button type="button" className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#1b7a3d] flex items-center justify-center cursor-pointer hover:bg-[#146030] transition-colors shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
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