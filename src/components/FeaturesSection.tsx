'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { num: '01', title: 'VERIFIED OPERATORS', detail: 'Every operator on Fernweh is vetted and reviewed, so you book with full confidence.' },
  { num: '02', title: 'TRAIL MAP', detail: 'Detailed route maps for every trek — with waypoints, difficulty, and real photos.' },
  { num: '03', title: 'DIRECT MESSAGING', detail: 'Chat directly with your operator before committing. No middlemen, no surprises.' },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useGSAP(() => {
    const cardEls = sectionRef.current?.querySelectorAll('.feature-card');
    if (!cardEls?.length) return;
    gsap.fromTo(
      cardEls,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-[#0f4d28] py-16 px-[80px]">
      <h2
        className="font-anton text-white text-[34px] mb-10 tracking-wide"
        style={{ fontFamily: 'var(--font-anton)' }}
      >
        WHY FERNWEH
      </h2>

      <div className="flex gap-7 justify-center">
        {cards.map((card, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <div
              key={card.num}
              className="feature-card relative overflow-hidden rounded-[10px] cursor-pointer flex-shrink-0"
              style={{
                width: isHovered ? '330px' : '280px',
                height: isHovered ? '440px' : '400px',
                background: '#c7e0cf',
                transition: 'width 0.25s ease, height 0.25s ease',
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Corner photo circle on hover */}
              {isHovered && (
                <div
                  className="absolute rounded-full overflow-hidden pointer-events-none"
                  style={{
                    width: 300,
                    height: 300,
                    top: -75,
                    right: -75,
                  }}
                >
                  <div className="w-full h-full bg-[#1b7a3d]/20 rounded-full" />
                </div>
              )}

              {/* Number */}
              <p
                className="absolute top-6 left-6 font-anton text-[34px] text-[rgba(27,122,61,0.35)]"
                style={{ fontFamily: 'var(--font-anton)' }}
              >
                {card.num}
              </p>

              {/* Description on hover */}
              {isHovered && (
                <p
                  className="absolute left-6 right-6 text-[12.5px] text-[#3d5c42] leading-[1.6]"
                  style={{ top: 90, fontFamily: 'var(--font-inter)' }}
                >
                  {card.detail}
                </p>
              )}

              {/* Title */}
              <p
                className="absolute left-6 right-6 font-anton text-[#055041] text-[20px] leading-[1.3]"
                style={{
                  bottom: isHovered ? 56 : 76,
                  fontFamily: 'var(--font-anton)',
                  transition: 'bottom 0.25s ease',
                }}
              >
                {card.title}
              </p>

              {/* CTA */}
              <p
                className="absolute left-6 bottom-6 font-anton text-[#1b7a3d] text-[10.5px] tracking-wide"
                style={{ fontFamily: 'var(--font-anton)' }}
              >
                SEE DETAILS →
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
