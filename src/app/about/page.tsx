import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';

const VALUES = [
    {
        title: 'Verified Operators',
        body: 'Every tour operator on Fernweh goes through a verification process before they can list a single trip. We check credentials, safety practices, and track record so you can book with confidence.',
    },
    {
        title: 'Built for Northern Pakistan',
        body: 'From Hunza to Fairy Meadows, Skardu to Naran, we focus on the trails, valleys, and mountains that make Northern Pakistan one of the most breathtaking places on earth — and we work with the people who know them best.',
    },
    {
        title: 'Travelers First',
        body: 'Transparent pricing, real reviews, and direct communication with operators. No hidden fees, no guesswork — just the information you need to plan your next adventure.',
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#faf7f2]">
            <LightNavbar />

            <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
                {/* Breadcrumb */}
                <div
                    className="text-[#8a8a85] text-[13px] mb-4 flex items-center gap-1"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    <span>Home</span>
                    <span className="text-[11px]">&rsaquo;</span>
                    <span className="text-[#3d3229] font-medium">About Us</span>
                </div>

                {/* Heading */}
                <h1
                    className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-6"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                >
                    About Fernweh
                </h1>

                {/* Intro / mission */}
                <div className="max-w-[800px] mb-16">
                    <p
                        className="text-[16px] md:text-[18px] text-[#5d5d5a] leading-relaxed"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    >
                        Fernweh — a German word meaning &ldquo;a longing for far-off places&rdquo; — was built
                        to make it simple to discover and book verified trek operators, trail maps, and
                        destinations across Northern Pakistan. We connect travelers with trusted local
                        operators, so every trip from Hunza Valley to Deosai starts with confidence, not
                        uncertainty.
                    </p>
                </div>

                {/* Values */}
                <div className="max-w-[900px] flex flex-col gap-10 mb-16">
                    {VALUES.map((value) => (
                        <div key={value.title}>
                            <h2
                                className="text-[20px] font-bold text-[#1b7a3d] mb-2"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            >
                                {value.title}
                            </h2>
                            <p
                                className="text-[14.5px] text-[#5d5d5a] leading-relaxed"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                {value.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <HomeFooter />
        </main>
    );
}
