import HeroSection from '@/components/HeroSection';
import ToursSection from '@/components/ToursSection';
import OperatorsSection from '@/components/OperatorsSection';
import MapSection from '@/components/MapSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      {/* Hero + Nav (nav overlaid inside HeroSection) */}
      <HeroSection />

      {/* Latest Tours with category filters */}
      <ToursSection />

      {/* Best Operators Section */}
      <OperatorsSection />

      {/* Explore the Map Section */}
      <MapSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
