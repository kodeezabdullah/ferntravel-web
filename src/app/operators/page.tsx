import HomeNavbar from '@/components/HomeNavbar';
import HomeFooter from '@/components/HomeFooter';
import OperatorTourRow from '@/components/OperatorTourRow';
import { Tour } from '@/components/DestinationTourRow';
import Image from 'next/image';

const NORTHERN_TOURS: Tour[] = [
  {
    name: 'Northern Weekend Escape',
    duration: '3 Days 2 Nights',
    price: '18,500',
    date: '18 Jul 2026',
    rating: 4.8,
    image: '/assets/nature-1.jpg',
  },
  {
    name: 'Northern Valley Trek',
    duration: '3 Days 2 Nights',
    price: '22,000',
    date: '22 Jul 2026',
    rating: 4.8,
    image: '/assets/nature-2.jpg',
  },
  {
    name: 'Northern Adventure Tour',
    duration: '3 Days 2 Nights',
    price: '27,900',
    date: '27 Jul 2026',
    rating: 4.8,
    image: '/assets/nature-3.jpg',
  },
];

const KARAKORAM_TOURS: Tour[] = [
  {
    name: 'Karakoram Weekend Escape',
    duration: '3 Days 2 Nights',
    price: '18,500',
    date: '22 Jul 2026',
    rating: 4.8,
    image: '/assets/nature-4.jpg',
  },
  {
    name: 'Karakoram Valley Trek',
    duration: '3 Days 2 Nights',
    price: '22,000',
    date: '27 Jul 2026',
    rating: 4.8,
    image: '/assets/nature-5.jpg',
  },
  {
    name: 'Karakoram Adventure Tour',
    duration: '3 Days 2 Nights',
    price: '27,900',
    date: '02 Aug 2026',
    rating: 4.8,
    image: '/assets/hunza-valley.jpg',
  },
];

const SUMMIT_TOURS: Tour[] = [
  {
    name: 'Summit Weekend Escape',
    duration: '3 Days 2 Nights',
    price: '18,500',
    date: '18 Jul 2026',
    rating: 4.9,
    image: '/assets/nature-5.jpg',
  },
  {
    name: 'Summit Valley Trek',
    duration: '3 Days 2 Nights',
    price: '22,000',
    date: '22 Jul 2026',
    rating: 4.9,
    image: '/assets/hunza-valley.jpg',
  },
  {
    name: 'Summit Adventure Tour',
    duration: '3 Days 2 Nights',
    price: '27,900',
    date: '27 Jul 2026',
    rating: 4.9,
    image: '/assets/nature-1.jpg',
  },
];

const WILD_VALLEY_TOURS: Tour[] = [
  {
    name: 'Wild Weekend Escape',
    duration: '3 Days 2 Nights',
    price: '18,500',
    date: '18 Jul 2026',
    rating: 4.7,
    image: '/assets/nature-2.jpg',
  },
  {
    name: 'Wild Valley Trek',
    duration: '3 Days 2 Nights',
    price: '22,000',
    date: '22 Jul 2026',
    rating: 4.7,
    image: '/assets/nature-3.jpg',
  },
  {
    name: 'Wild Adventure Tour',
    duration: '3 Days 2 Nights',
    price: '27,900',
    date: '27 Jul 2026',
    rating: 4.7,
    image: '/assets/nature-4.jpg',
  },
];

export default function OperatorsPage() {
  return (
    <main className="w-full bg-[#faf7f2] min-h-screen">
      {/* Navbar */}
      <HomeNavbar triggerEntrance={true} />

      {/* Hero Banner (darker/greener) */}
      <section className="relative w-full h-[380px] md:h-[420px] overflow-hidden flex items-center px-6 md:px-16">
        {/* Background photo */}
        <Image
          src="/assets/hero-bg.jpg"
          alt="Trusted Operators scenery"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />

        {/* Darker/greener overlay */}
        <div className="absolute inset-0 bg-[#072411]/65 z-10" />

        {/* Hero content */}
        <div className="relative z-20 max-w-[600px]">
          <p
            className="text-[#f2a93b] font-medium text-[13px] md:text-[14px] tracking-[4px] uppercase mb-3 italic"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            TRUSTED PARTNERS
          </p>
          <h1
            className="text-white text-[36px] md:text-[56px] font-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            Meet Our Verified Operators
          </h1>
          <p
            className="text-white/85 text-[15px] md:text-[17px] italic max-w-[500px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Handpicked, background-checked tour operators across Pakistan.
          </p>
        </div>
      </section>

      {/* Main Page Content */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <div
          className="text-[#8a8a85] text-[13px] mb-4 flex items-center gap-1"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <span>Home</span>
          <span className="text-[11px]">&rsaquo;</span>
          <span className="text-[#3d3229] font-medium">Operators</span>
        </div>

        {/* Heading */}
        <div className="mb-12">
          <h2
            className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            All Operators
          </h2>
          <p
            className="text-[#8a8a85] text-[15px] md:text-[16px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Browse operators and their upcoming tours
          </p>
        </div>

        {/* Operators rows */}
        <OperatorTourRow
          operatorName="Northern Trails Co."
          tourCount={24}
          rating={4.9}
          tours={NORTHERN_TOURS}
          profileHref="/operators/northern-trails-co"
        />

        <OperatorTourRow
          operatorName="Karakoram Adventures"
          tourCount={18}
          rating={4.8}
          tours={KARAKORAM_TOURS}
          profileHref="/operators/northern-trails-co"
        />

        <OperatorTourRow
          operatorName="Summit Seekers PK"
          tourCount={31}
          rating={4.9}
          tours={SUMMIT_TOURS}
          profileHref="/operators/northern-trails-co"
        />

        <OperatorTourRow
          operatorName="Wild Valley Treks"
          tourCount={12}
          rating={4.7}
          tours={WILD_VALLEY_TOURS}
          profileHref="/operators/northern-trails-co"
        />

        {/* See More Button */}
        <div className="flex justify-center mt-12 mb-8">
          <button
            type="button"
            className="border border-[#1b7a3d] text-[#1b7a3d] hover:bg-[#1b7a3d] hover:text-white transition-all duration-300 rounded-full px-8 py-3 font-bold text-[14px] cursor-pointer"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            See More Operators
          </button>
        </div>
      </section>

      {/* Footer */}
      <HomeFooter />
    </main>
  );
}
