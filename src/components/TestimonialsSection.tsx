'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      '"Booked Fairy Meadows through Fernweh and the whole experience felt trustworthy from start to finish. The operator was verified, our guide was excellent, and everything matched exactly what was described in the app — no surprises along the way."',
    name: 'Ayesha K.',
    stars: '★★★★★',
    avatar: '/assets/avatar-ayesha.jpg',
  },
  {
    quote:
      '"Loved being able to message the operator directly before booking anything. Got all my questions answered about the route and gear beforehand, and there were genuinely no surprises once we were actually on the trip."',
    name: 'Bilal R.',
    stars: '★★★★☆',
    avatar: '/assets/avatar-bilal.jpg',
  },
  {
    quote:
      '"The trail map made planning our Skardu trip so much easier than I expected. We found routes and viewpoints we would never have known about otherwise, all mapped out clearly with real photos and directions."',
    name: 'Sana M.',
    stars: '★★★★★',
    avatar: '/assets/avatar-sana.jpg',
  },
  {
    quote:
      '"Submitted a trail near Kel Valley myself and it got verified within just a few days. It\'s genuinely satisfying to see it live on the map now, knowing other travelers will discover it because of that submission."',
    name: 'Hamza T.',
    stars: '★★★★★',
    avatar: '/assets/avatar-hamza.jpg',
  },
  {
    quote:
      '"Compared three different operators side by side before making a decision, and the ratings and reviews were spot on with what we actually experienced. Made choosing so much less stressful than usual."',
    name: 'Zara F.',
    stars: '★★★★☆',
    avatar: '/assets/avatar-zara.jpg',
  },
  {
    quote:
      '"First time booking a northern trip entirely online and it actually felt trustworthy the whole way through. Communication was clear, everything was as promised, and I\'ll definitely be using it again soon."',
    name: 'Usman A.',
    stars: '★★★★★',
    avatar: '/assets/avatar-usman.jpg',
  },
];

// Duplicate for seamless loop
const allCards = [...testimonials, ...testimonials];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    const heading = sectionRef.current?.querySelectorAll('.heading-reveal');
    if (heading?.length) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }
  }, { scope: sectionRef });

  // Infinite scroll — runs outside GSAP scope because it controls a tween continuously
  useEffect(() => {
    if (!trackRef.current) return;

    const cardWidth = 260 + 24; // card width + gap
    const totalSetWidth = testimonials.length * cardWidth;

    const tween = gsap.to(trackRef.current, {
      x: -totalSetWidth,
      duration: 28,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % totalSetWidth}px`,
      },
    });

    tweenRef.current = tween;

    return () => {
      tween.kill();
    };
  }, []);

  const pauseScroll = () => tweenRef.current?.pause();
  const resumeScroll = () => tweenRef.current?.resume();

  return (
    <section ref={sectionRef} className="w-full bg-white py-16 overflow-hidden">
      {/* Headings */}
      <div className="text-center mb-12 px-8">
        <p
          className="font-alex-brush text-[#8a8a85] text-[48px] leading-none mb-2 heading-reveal"
          style={{ fontFamily: 'var(--font-alex-brush)' }}
        >
          Reviews
        </p>
        <h2
          className="font-poppins font-bold text-[#3d3229] text-[32px] leading-none heading-reveal"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          What Travelers Say About Us
        </h2>
      </div>

      {/* Marquee track */}
      <div
        className="overflow-hidden"
        onMouseEnter={pauseScroll}
        onMouseLeave={resumeScroll}
      >
        <div ref={trackRef} className="testimonials-track px-[60px]">
          {allCards.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-white border border-[#ede8dc] rounded-[12px] overflow-hidden"
              style={{ width: 260, height: 360 }}
            >
              {/* Quote */}
              <p
                className="text-[11.5px] italic text-[#5d5d5a] leading-[1.58] px-6 pt-6 pb-4"
                style={{ fontFamily: 'var(--font-inter)', height: 244 }}
              >
                {t.quote}
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 px-6 pb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p
                    className="text-[13px] font-medium text-[#3d3229] leading-none mb-1"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[11px] text-[#f2a93b] leading-none"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {t.stars}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
