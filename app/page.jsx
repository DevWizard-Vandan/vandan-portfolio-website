import PortfolioPage from "@/components/PortfolioPage";

const sameAs = [
  "https://github.com/DevWizard-Vandan",
  "https://www.linkedin.com/in/vandan-sharma-682536330"
];

const projectWorks = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Titan",
    codeRepository: "https://github.com/DevWizard-Vandan/Titan",
    programmingLanguage: "Rust",
    description: "Ultra low-latency matching engine with lock-free and cache-aware hot paths."
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Vajra",
    codeRepository: "https://github.com/DevWizard-Vandan/Vajra",
    programmingLanguage: "Rust",
    description: "Distributed vector database with Raft consensus and HNSW-style search."
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Parameter Golf",
    codeRepository: "https://github.com/DevWizard-Vandan/parameter-golf",
    programmingLanguage: "Python",
    description: "Model compression experiment for reducing a weight artifact while preserving quality."
  }
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
    },
    ...projectWorks
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
