import PortfolioPage from "@/components/PortfolioPage";

const sameAs = [
  "https://github.com/DevWizard-Vandan",
  "https://www.linkedin.com/in/vandan-sharma-682536330"
];

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Vandan Sharma",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://vandan-sharma.dev",
      sameAs,
      jobTitle: "Systems Engineer & Applied AI Researcher",
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Vishwakarma Institute of Technology"
      },
      knowsAbout: [
        "Low-latency systems",
        "Distributed systems",
        "Vector search",
        "Rust",
        "Applied AI"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "GreenLoop",
      creator: { "@type": "Person", name: "Vandan Sharma" },
      description: "Published patent work in sustainable applied AI systems."
    },
    {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      name: "Cursor",
      author: { "@type": "Person", name: "Vandan Sharma" },
      description: "Peer-reviewed research paper. DOI can be added when available."
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioPage />
    </>
  );
}
