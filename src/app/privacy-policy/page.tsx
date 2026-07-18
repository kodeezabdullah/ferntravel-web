import LightNavbar from '@/components/LightNavbar';
import HomeFooter from '@/components/HomeFooter';

const SECTIONS = [
    {
        title: '1. Introduction',
        body: `Fernweh Travels ("we", "our", "us") respects your privacy and is committed to protecting the personal information you share with us while using our website and mobile application. This policy explains what we collect, why we collect it, and how we use it.`,
    },
    {
        title: '2. Information We Collect',
        body: `We collect information you provide directly, such as your name, email address, phone number, and payment details when you create an account or make a booking. We also collect usage data, device information, and location data (with your permission) to improve our services.`,
    },
    {
        title: '3. How We Use Your Information',
        body: `Your information is used to process bookings, communicate with tour operators, send booking confirmations and updates, improve our platform, and provide customer support. We do not sell your personal information to third parties.`,
    },
    {
        title: '4. Sharing With Operators',
        body: `When you book a tour, relevant details (name, contact number, travel dates, number of travelers) are shared with the verified operator to fulfill your booking. Operators are contractually required to handle your data responsibly.`,
    },
    {
        title: '5. Data Security',
        body: `We use industry-standard encryption and security practices to protect your data. However, no method of transmission over the internet is 100% secure, and we encourage users to use strong passwords and keep account credentials confidential.`,
    },
    {
        title: '6. Your Rights',
        body: `You may access, update, or request deletion of your personal information at any time through your account settings, or by contacting our support team. You may also opt out of marketing communications at any time.`,
    },
    {
        title: '7. Cookies & Tracking',
        body: `We use cookies and similar technologies to remember your preferences, keep you logged in, and understand how you use our platform. You can control cookie preferences through your browser settings.`,
    },
    {
        title: '8. Changes to This Policy',
        body: `We may update this Privacy Policy from time to time. Material changes will be communicated via email or an in-app notice. Continued use of Fernweh after changes take effect constitutes acceptance of the revised policy.`,
    },
    {
        title: '9. Contact Us',
        body: `If you have questions about this Privacy Policy or how we handle your data, please reach out to our support team through the Help Center or at privacy@fernwehtravels.pk.`,
    },
];

export default function PrivacyPolicyPage() {
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
                    <span className="text-[#3d3229] font-medium">Privacy Policy</span>
                </div>

                {/* Heading */}
                <h1
                    className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                >
                    Privacy Policy
                </h1>
                <p
                    className="text-[#8a8a85] text-[14px] mb-12"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    Last updated: July 15, 2026
                </p>

                {/* Sections */}
                <div className="max-w-[900px] flex flex-col gap-10">
                    {SECTIONS.map((section) => (
                        <div key={section.title}>
                            <h2
                                className="text-[20px] font-bold text-[#3d3229] mb-3"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            >
                                {section.title}
                            </h2>
                            <p
                                className="text-[15px] text-[#5d5d5a] leading-relaxed"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                {section.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <HomeFooter />
        </main>
    );
}