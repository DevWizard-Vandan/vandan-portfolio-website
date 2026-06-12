import PortfolioPage from "@/components/PortfolioPage";

const sameAs = [
  "https://github.com/DevWizard-Vandan",
  "https://linkedin.com/in/vandan-sharma-682536330",
  "https://credly.com/vandan-sharma"
];

const projectWorks = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Titan",
    codeRepository: "https://github.com/DevWizard-Vandan/Titan",
    programmingLanguage: "Rust",
    description:
      "Ultra-low-latency matching engine achieving 12.8M matches per second with lock-free, cache-aware hot paths."
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Vajra",
    codeRepository: "https://github.com/DevWizard-Vandan/Vajra",
    programmingLanguage: "Rust",
    description:
      "Distributed vector database with custom Raft consensus, WAL recovery, and HNSW search."
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Parameter Golf",
    codeRepository: "https://github.com/DevWizard-Vandan/parameter-golf",
    programmingLanguage: "Python",
    description:
      "OpenAI Parameter Golf record-track entry scoring 1.2392 with a 10.9MB artifact."
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Radhe AI",
    codeRepository: "https://github.com/DevWizard-Vandan/radhe-ai",
    programmingLanguage: "Rust",
    description: "Fully offline AI study CLI powered by a quantized Qwen2.5-Coder model."
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "WhisperNet",
    codeRepository: "https://github.com/DevWizard-Vandan/whisper-net",
    programmingLanguage: ["Python", "JavaScript"],
    description:
      "Applied acoustics and telecommunications research project implementing a software-defined acoustic modem."
  }
];

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Vandan Sharma",
      url:
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://vandan-portfolio-website.vercel.app",
      email: "mailto:vandan.sharma06@gmail.com",
      sameAs,
      jobTitle: "Systems Engineer, Applied AI Researcher & Quant Researcher",
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Vishwakarma Institute of Technology, Pune"
      },
      knowsAbout: [
        "Low-latency systems",
        "Distributed systems",
        "Vector search",
        "Rust",
        "Applied AI",
        "Model compression",
        "Quantitative research"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "GreenLoop",
      creator: { "@type": "Person", name: "Vandan Sharma" },
      datePublished: "2026",
      description: "Published patent for an IoT-enabled smart composting unit."
    },
    {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      name: "Predictive Cursor System",
      author: { "@type": "Person", name: "Vandan Sharma" },
      datePublished: "2025-11",
      isPartOf: {
        "@type": "Periodical",
        name: "iJRASET",
        volumeNumber: "12"
      },
      description: "Published research paper on a predictive cursor system."
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
