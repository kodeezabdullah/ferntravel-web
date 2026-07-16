import HomeHeroSection from '@/components/HomeHeroSection';
import ToursSection from '@/components/ToursSection';
import OperatorsSection from '@/components/OperatorsSection';
import MapSection from '@/components/MapSection';
import HomeFooter from '@/components/HomeFooter';

export default function HomePage() {
    return (
        <main>
            {/* Hero + Nav (nav overlaid inside HeroSection) */}
            <HomeHeroSection />

            {/* Latest Tours with category filters */}
            <ToursSection />

            {/* Best Operators Section */}
            <OperatorsSection />

            {/* Explore the Map Section */}
            <MapSection />

            {/* Footer */}
            <HomeFooter />
        </main>
    );
}
