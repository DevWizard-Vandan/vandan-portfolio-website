import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vandan-portfolio-website.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vandan Sharma | Systems, Applied AI & Quant Research",
  description:
    "Portfolio of Vandan Sharma, a VIT Pune CSE (AI & ML) student building low-latency systems, distributed infrastructure, applied AI, and quantitative research.",
  keywords: [
    "Vandan Sharma",
    "systems engineer",
    "applied AI researcher",
    "quantitative research",
    "HFT",
    "Rust",
    "matching engine",
    "vector database",
    "OpenAI Parameter Golf",
    "WorldQuant",
    "portfolio"
  ],
  authors: [{ name: "Vandan Sharma" }],
  creator: "Vandan Sharma",
  openGraph: {
    title: "Vandan Sharma | Systems, Applied AI & Quant Research",
    description:
      "Low-latency Rust, distributed systems, model compression, and quantitative research. Built for pressure.",
    url: siteUrl,
    siteName: "Vandan Sharma Portfolio",
    type: "profile",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vandan Sharma | Systems, Applied AI & Quant Research",
    description:
      "Low-latency Rust, distributed systems, model compression, and quantitative research."
  },
  alternates: {
    canonical: siteUrl
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem("portfolio-theme");
                const theme = saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
              } catch {}
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
