import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vandan-sharma.dev";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vandan Sharma - Systems Engineer & Applied AI Researcher",
  description:
    "Vandan Sharma builds low-latency systems and applied AI research artifacts, including Titan, Vajra, Parameter Golf, a published patent, and peer-reviewed research.",
  keywords: [
    "Vandan Sharma",
    "systems engineer",
    "applied AI researcher",
    "Rust",
    "matching engine",
    "vector database",
    "portfolio"
  ],
  authors: [{ name: "Vandan Sharma" }],
  creator: "Vandan Sharma",
  openGraph: {
    title: "Vandan Sharma - Systems Engineer & Applied AI Researcher",
    description:
      "Patent holder, published researcher, and builder of high-performance systems.",
    url: siteUrl,
    siteName: "Vandan Sharma Portfolio",
    type: "profile"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vandan Sharma - Systems Engineer & Applied AI Researcher",
    description:
      "Patent holder, published researcher, and builder of high-performance systems."
  },
  alternates: {
    canonical: siteUrl
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
