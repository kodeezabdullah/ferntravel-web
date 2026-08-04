import type { Metadata } from "next";
import { Anton, Alex_Brush, Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LoadingScreen from "@/components/LoadingScreen";
import PageTransition from "@/components/Pagetransition";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alex-brush",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Fernweh Travels — Explore Northern Pakistan",
  description:
    "Discover verified trek operators, trail maps, and destinations across Northern Pakistan. Plan your adventure with Fernweh.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${alexBrush.variable} ${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#faf7f2]">
        <LoadingScreen />
        <PageTransition>{children}</PageTransition>
        <Analytics />
      </body>
    </html>
  );
}
