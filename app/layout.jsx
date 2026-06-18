import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vandan-portfolio-website.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vandan Sharma - Systems, Applied AI & Quant Research",
  description:
    "Vandan Sharma builds low-latency systems, distributed infrastructure, applied AI artifacts, model compression work, and quantitative research proof.",
  keywords: [
    "Vandan Sharma",
    "systems engineer",
    "applied AI researcher",
    "quantitative research",
    "WorldQuant",
    "OpenAI Parameter Golf",
    "HFT",
    "Rust",
    "matching engine",
    "vector database",
    "portfolio"
  ],
  authors: [{ name: "Vandan Sharma" }],
  creator: "Vandan Sharma",
  openGraph: {
    title: "Vandan Sharma - Systems, Applied AI & Quant Research",
    description:
      "OpenAI Parameter Golf rank 20, WorldQuant Gold, patent holder, published researcher, and builder of high-performance systems.",
    url: siteUrl,
    siteName: "Vandan Sharma Portfolio",
    type: "profile"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vandan Sharma - Systems, Applied AI & Quant Research",
    description:
      "OpenAI Parameter Golf rank 20, WorldQuant Gold, and high-performance systems."
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
