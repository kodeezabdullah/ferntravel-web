'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EntranceTicketSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ticketRef.current || !textRef.current) return;

    // Text fades up
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );

    // Ticket: starts flat → tilts to +18deg on scroll
    gsap.fromTo(
      ticketRef.current,
      { rotation: 0, opacity: 0, y: 20 },
      {
        rotation: 18,
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#faf7f2] py-[100px] px-[100px] flex items-center justify-between overflow-hidden"
      style={{ minHeight: 480 }}
    >
      {/* Left — text content */}
      <div ref={textRef} className="max-w-[500px]">
        <p
          className="text-[#1b7a3d] text-[12px] font-semibold tracking-[0.72px] mb-4"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          TRAIL ACCESS
        </p>
        <h2
          className="font-anton text-[#3d3229] text-[46px] leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-anton)' }}
        >
          FAIRY MEADOWS<br />TREK PASS
        </h2>
        <p
          className="text-[13.5px] text-[#8a8a85] leading-[1.6] mb-10 max-w-[440px]"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Every registered trail comes with a verified route, difficulty rating, and directions from Islamabad or Lahore — all confirmed before you set out.
        </p>
        <button className="bg-[#1b7a3d] hover:bg-[#155f30] transition-colors text-white text-[13px] font-semibold rounded-full px-8 h-[50px]">
          View on App
        </button>
      </div>

      {/* Right — tilted ticket */}
      <div className="relative flex-shrink-0 w-[536px] h-[394px] flex items-center justify-center">
        <div
          ref={ticketRef}
          className="ticket-shadow rounded-2xl overflow-hidden"
          style={{ width: 480, height: 260, transformOrigin: 'center center' }}
        >
          <Image
            src="/assets/ticket.png"
            alt="Fairy Meadows Trek Pass"
            width={480}
            height={260}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
