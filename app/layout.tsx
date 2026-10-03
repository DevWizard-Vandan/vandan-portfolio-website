import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://vandan-portfolio-website.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vandan Sharma — Systems & Applied AI",
    template: "%s · Vandan Sharma",
  },
  description:
    "An interactive laboratory of distributed systems, acoustic communications, evidence infrastructure, and program synthesis. Featuring Whisper-Net, accepted at WiCOMM 2026.",
  openGraph: {
    title: "Vandan Sharma — Engineering the invisible",
    description:
      "Systems & Applied AI. Explore the systems, signals, and research behind the work.",
    type: "website",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  themeColor: "#080d12",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <noscript>
          <style>{`.header-controls,.lab-controls,.lab-topline button {display:none!important;}`}</style>
          <div className="noscript-notice">
            Interactive experiments require JavaScript. You can read every case
            study and download the research manuscript.
            <nav aria-label="Navigation without JavaScript">
              <a href="/work">Selected work</a>
              <a href="/research">Research</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </noscript>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
