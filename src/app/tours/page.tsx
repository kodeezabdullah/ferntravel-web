import HomeNavbar from '@/components/HomeNavbar';
import HomeFooter from '@/components/HomeFooter';
import DestinationTourRow, { Tour } from '@/components/DestinationTourRow';
import Image from 'next/image';

const NARAN_TOURS: Tour[] = [
  { name: 'Naran Kaghan Valley Discovery', duration: '3 Days 2 Nights', price: '18,500', date: '18 Jul 2026', rating: 4.8, image: '/assets/nature-1.jpg' },
  { name: 'Naran Kaghan Weekend Getaway', duration: '3 Days 2 Nights', price: '22,000', date: '22 Jul 2026', rating: 4.8, image: '/assets/nature-2.jpg' },
  { name: 'Naran Kaghan Adventure Trek', duration: '3 Days 2 Nights', price: '27,900', date: '27 Jul 2026', rating: 4.8, image: '/assets/nature-3.jpg' },
  { name: 'Naran Kaghan Family Escape', duration: '4 Days 3 Nights', price: '24,000', date: '02 Aug 2026', rating: 4.7, image: '/assets/nature-4.jpg' },
];

const KALAM_TOURS: Tour[] = [
  { name: 'Kalam Valley Discovery', duration: '3 Days 2 Nights', price: '18,500', date: '22 Jul 2026', rating: 4.8, image: '/assets/nature-4.jpg' },
  { name: 'Kalam Weekend Getaway', duration: '3 Days 2 Nights', price: '22,000', date: '27 Jul 2026', rating: 4.8, image: '/assets/nature-5.jpg' },
  { name: 'Kalam Adventure Trek', duration: '3 Days 2 Nights', price: '27,900', date: '02 Aug 2026', rating: 4.8, image: '/assets/hunza-valley.jpg' },
  { name: 'Kalam Family Escape', duration: '4 Days 3 Nights', price: '24,000', date: '18 Jul 2026', rating: 4.7, image: '/assets/nature-1.jpg' },
];

const SKARDU_TOURS: Tour[] = [
  { name: 'Skardu Valley Discovery', duration: '3 Days 2 Nights', price: '18,500', date: '27 Jul 2026', rating: 4.8, image: '/assets/nature-2.jpg' },
  { name: 'Skardu Weekend Getaway', duration: '3 Days 2 Nights', price: '22,000', date: '02 Aug 2026', rating: 4.8, image: '/assets/nature-3.jpg' },
  { name: 'Skardu Adventure Trek', duration: '3 Days 2 Nights', price: '27,900', date: '18 Jul 2026', rating: 4.8, image: '/assets/nature-4.jpg' },
  { name: 'Skardu Family Escape', duration: '4 Days 3 Nights', price: '24,000', date: '22 Jul 2026', rating: 4.7, image: '/assets/nature-5.jpg' },
];

const HUNZA_TOURS: Tour[] = [
  { name: 'Hunza Valley Discovery', duration: '3 Days 2 Nights', price: '18,500', date: '02 Aug 2026', rating: 4.8, image: '/assets/hunza-valley.jpg' },
  { name: 'Hunza Weekend Getaway', duration: '3 Days 2 Nights', price: '22,000', date: '18 Jul 2026', rating: 4.8, image: '/assets/nature-1.jpg' },
  { name: 'Hunza Adventure Trek', duration: '3 Days 2 Nights', price: '27,900', date: '22 Jul 2026', rating: 4.8, image: '/assets/nature-2.jpg' },
  { name: 'Hunza Family Escape', duration: '4 Days 3 Nights', price: '24,000', date: '27 Jul 2026', rating: 4.7, image: '/assets/nature-3.jpg' },
];

export default function ToursPage() {
  return (
    <main className="w-full bg-[#faf7f2] min-h-screen">
      {/* Navbar */}
      <HomeNavbar triggerEntrance={true} />

      {/* Shorter Hero Banner */}
      <section className="relative w-full h-[380px] md:h-[420px] overflow-hidden flex items-center px-6 md:px-16">
        {/* Background photo */}
        <Image
          src="/assets/hunza-valley.jpg"
          alt="Scenic Mountain Valley"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        {/* Hero content */}
        <div className="relative z-20 max-w-[600px]">
          <p
            className="text-[#f2a93b] font-medium text-[13px] md:text-[14px] tracking-[4px] uppercase mb-3 italic"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            EXPLORE PAKISTAN
          </p>
          <h1
            className="text-white text-[36px] md:text-[56px] font-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            Find Your Next Adventure
          </h1>
          <p
            className="text-white/85 text-[15px] md:text-[17px] italic max-w-[500px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Handpicked tours across every valley, from Naran to Hunza.
          </p>
        </div>
      </section>

      {/* Main page content area */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <div
          className="text-[#8a8a85] text-[13px] mb-4 flex items-center gap-1"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <span>Home</span>
          <span className="text-[11px]">&rsaquo;</span>
          <span className="text-[#3d3229] font-medium">All Tours</span>
        </div>

        {/* Page Heading */}
        <div className="mb-12">
          <h2
            className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            All Tours
          </h2>
          <p
            className="text-[#8a8a85] text-[15px] md:text-[16px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Browse verified tours by destination across Pakistan
          </p>
        </div>

        {/* Destinations Rows */}
        <DestinationTourRow destinationName="Naran Kaghan" tourCount={12} tours={NARAN_TOURS} />
        <DestinationTourRow destinationName="Kalam" tourCount={8} tours={KALAM_TOURS} />
        <DestinationTourRow destinationName="Skardu" tourCount={15} tours={SKARDU_TOURS} />
        <DestinationTourRow destinationName="Hunza Valley" tourCount={10} tours={HUNZA_TOURS} />
      </section>

      {/* Footer */}
      <HomeFooter />
    </main>
  );
}
