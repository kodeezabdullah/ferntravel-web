import HeroSection from '@/components/HeroSection';
import ToursSection from '@/components/ToursSection';
import FeaturesSection from '@/components/FeaturesSection';
import EntranceTicketSection from '@/components/EntranceTicketSection';
import WordmarkSection from '@/components/WordmarkSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      {/* Hero + Nav (nav overlaid inside HeroSection) */}
      <HeroSection />

      {/* Latest Tours with category filters */}
      <ToursSection />

      {/* Why Fernweh */}
      <FeaturesSection />

      {/* Entrance Ticket */}
      <EntranceTicketSection />

      {/* Wordmark photo-clip */}
      <WordmarkSection />

      {/* Testimonials infinite scroll */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
