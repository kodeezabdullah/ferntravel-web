'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    num: '01',
    title: 'VERIFIED OPERATORS',
    detail: 'Every operator on Fernweh is vetted and reviewed, so you book with full confidence.',
    image: '/assets/nature-1.jpg',
  },
  {
    num: '02',
    title: 'TRAIL MAP',
    detail: 'Detailed route maps for every trek — with waypoints, difficulty, and real photos.',
    image: '/assets/nature-2.jpg',
  },
  {
    num: '03',
    title: 'DIRECT MESSAGING',
    detail: 'Chat directly with your operator before committing. No middlemen, no surprises.',
    image: '/assets/nature-3.jpg',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Scroll-triggered entrance
  useGSAP(() => {
    const cardEls = cardRefs.current.filter(Boolean);
    if (!cardEls.length) return;
    gsap.fromTo(
      cardEls,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );
  }, { scope: sectionRef });

  const handleEnter = (i: number) => {
    setHoveredIdx(i);
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === i) {
        // Hovered card — scale up, move toward viewer
        gsap.to(el, {
          scale: 1.08,
          zIndex: 10,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
      } else {
        // Other cards — shrink and dim
        gsap.to(el, {
          scale: 0.93,
          opacity: 0.45,
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    });
  };

  const handleLeave = () => {
    setHoveredIdx(null);
    cardRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        scale: 1,
        opacity: 1,
        zIndex: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  };

  return (
    <section ref={sectionRef} className="w-full bg-[#0f4d28] py-16 px-[80px]">
      <h2
        className="font-anton text-white text-[34px] mb-10 tracking-wide"
        style={{ fontFamily: 'var(--font-anton)' }}
      >
        WHY FERNWEH
      </h2>

      <div className="flex gap-7 justify-center items-center">
        {cards.map((card, i) => {
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={card.num}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="feature-card relative overflow-hidden rounded-[10px] cursor-pointer flex-shrink-0"
              style={{
                width: '280px',
                height: '400px',
                background: '#c7e0cf',
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
              }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            >
              {/* Circle image — top-right corner, appears on hover */}
              <div
                className="absolute rounded-full overflow-hidden pointer-events-none"
                style={{
                  width: 200,
                  height: 200,
                  top: -35,
                  right: -35,
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'scale(1)' : 'scale(0.6)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  zIndex: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                  loading="eager"
                />
              </div>

              {/* Text — locked to left 40% so it never touches the circle */}
              <div
                className="absolute inset-0 z-10 flex flex-col justify-between p-6"
                style={{ width: '40%' }}
              >
                {/* Number */}
                <p
                  className="font-anton text-[34px] text-[rgba(27,122,61,0.35)] leading-none"
                  style={{ fontFamily: 'var(--font-anton)' }}
                >
                  {card.num}
                </p>

                {/* Description — fades in on hover */}
                <p
                  className="text-[11px] text-[#3d5c42] leading-[1.65]"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.25s ease 0.08s, transform 0.25s ease 0.08s',
                  }}
                >
                  {card.detail}
                </p>

                {/* Title + CTA — always visible, pinned to bottom */}
                <div>
                  <p
                    className="font-anton text-[#055041] text-[16px] leading-[1.3] mb-3"
                    style={{ fontFamily: 'var(--font-anton)' }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="font-anton text-[#1b7a3d] text-[9.5px] tracking-wide"
                    style={{ fontFamily: 'var(--font-anton)' }}
                  >
                    SEE DETAILS →
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
