"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const InteractiveScene = dynamic(() => import("@/components/InteractiveScene"), {
  ssr: false,
  loading: () => <div className="scene-loading" aria-hidden="true" />
});

const ProjectArtifact = dynamic(() => import("@/components/ProjectArtifact"), {
  ssr: false,
  loading: () => <div className="artifact-loading" aria-hidden="true" />
});

const links = {
  github: "https://github.com/DevWizard-Vandan",
  titan: "https://github.com/DevWizard-Vandan/Titan",
  vajra: "https://github.com/DevWizard-Vandan/Vajra",
  parameterGolf: "https://github.com/DevWizard-Vandan/parameter-golf",
  linkedin: "https://www.linkedin.com/in/vandan-sharma-682536330",
  email: "mailto:vandan.sharma06@gmail.com",
  resume: "/Vandan-Sharma-Resume.pdf"
};

const signals = [
  ["Patent", "GreenLoop"],
  ["Paper", "Cursor"],
  ["Titan", "12.8M matches/sec"],
  ["Scale", "8x H100 run"]
];

const finalCards = [
  ["Target", "High-intensity engineering internships at AI labs and infrastructure teams."],
  ["Focus", "Rust systems, distributed search, model compression, and applied AI evaluation."],
  ["Review path", "Start with Titan, scan the proof rail, then open the resume for the full record."]
];

const chapters = [
  {
    id: "hero",
    marker: "00 / ignition",
    title: "Vandan Sharma",
    copy:
      "Systems engineering, applied AI, and research work built for pressure: fast paths, distributed memory, compressed weights, and proof that survives a close read.",
    cta: true,
    wide: true
  },
  {
    id: "titan",
    marker: "01 / market clock",
    title: "Titan",
    meta: "Rust / lock-free / cache-aware",
    copy:
      "A limit-order-book engine shaped around deterministic hot paths, cache-aligned order structs, SPSC rings, and measured latency instead of hopeful claims.",
    bullets: ["12.8M matches/sec", "sub-microsecond median latency", "zero-allocation hot path"],
    artifact: "titan",
    artifactLabel: "Interactive 3D order book: bids, asks, and changing liquidity pressure.",
    href: links.titan,
    linkLabel: "Open repository"
  },
  {
    id: "vajra",
    marker: "02 / vector field",
    title: "Vajra",
    meta: "Rust / Raft / HNSW / async",
    copy:
      "A distributed vector database with leader election, log replication, write-ahead recovery, and graph search that keeps returning useful neighbors under failure.",
    bullets: ["custom Raft consensus", "HNSW search", "chaos-tested failover"],
    artifact: "vajra",
    artifactLabel: "Interactive 3D HNSW-style graph: connected vector nodes and search hub.",
    href: links.vajra,
    linkLabel: "Open repository"
  },
  {
    id: "golf",
    marker: "03 / compression chamber",
    title: "Parameter Golf",
    meta: "PyTorch / CUDA / quantization",
    copy:
      "An experiment in smaller models and sharper measurement: compressing a 16MB weight artifact to 10.9MB with reproducible sweeps on an 8x H100 training run.",
    bullets: ["16MB to 10.9MB", "8x H100 sweep", "quality-preserving compression"],
    artifact: "compression",
    artifactLabel: "Interactive 3D compression cube: a weight tensor shrinking under constraint.",
    href: links.parameterGolf,
    linkLabel: "Open repository"
  },
  {
    id: "research",
    marker: "04 / public proof",
    title: "GreenLoop + Cursor",
    meta: "published patent / peer-reviewed paper",
    copy:
      "GreenLoop marks the patent track. Cursor marks the paper track. Both sit above the fold because credentials should arrive before curiosity has to work.",
    bullets: ["published patent", "peer-reviewed paper", "metadata links ready when public"]
  },
  {
    id: "skills",
    marker: "05 / operating field",
    title: "Systems that speak AI",
    meta: "Rust / Java / Python / C++ / TypeScript",
    copy:
      "Lock-free data structures, Raft, WAL, async I/O, HNSW, PyTorch, Docker, PostgreSQL, MinIO, Linux, and enough product instinct to keep the surface legible.",
    bullets: ["systems", "AI/ML", "cloud", "languages"],
    artifact: "skills",
    artifactLabel: "Interactive 3D skill cluster: orbiting nodes grouped around systems and AI."
  },
  {
    id: "contact",
    marker: "06 / handoff",
    title: "Build with rigor. Ship with taste.",
    copy:
      "Based in Pune. Studying CSE (AI & ML) at Vishwakarma Institute of Technology. Open to high-intensity internship work at labs and engineering teams.",
    final: true
  }
];

export default function PortfolioPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 32,
    restDelta: 0.001
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".chapter-card").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42, filter: "blur(16px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 74%",
              end: "bottom 35%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="cinema-shell">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <div className="stage" aria-hidden="true">
        <InteractiveScene />
      </div>
      <div className="stage-vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <nav className="topline" aria-label="Primary">
        <a href="#hero" className="brand-lockup">VS</a>
        <div>
          <a href="#titan">Work</a>
          <a href="#research">Proof</a>
          <a href={links.resume} download>Resume</a>
        </div>
      </nav>

      <section className="proof-rail" aria-label="Credibility highlights">
        {signals.map(([label, detail]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{detail}</strong>
          </article>
        ))}
      </section>

      <div className="scroll-script">
        {chapters.map((chapter) => (
          <section
            className={`chapter chapter-${chapter.id} ${chapter.wide ? "chapter-wide" : ""}`}
            id={chapter.id}
            key={chapter.id}
            aria-labelledby={`${chapter.id}-title`}
          >
            <motion.article
              className="chapter-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.42 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="chapter-marker">{chapter.marker}</p>
              <h1 id={`${chapter.id}-title`}>{chapter.title}</h1>
              {chapter.meta && <p className="chapter-meta">{chapter.meta}</p>}
              <p className="chapter-copy">{chapter.copy}</p>

              {chapter.bullets && (
                <div className="signal-list">
                  {chapter.bullets.map((bullet) => (
                    <span key={bullet}>{bullet}</span>
                  ))}
                </div>
              )}

              {chapter.artifact && (
                <figure className="artifact-frame">
                  <ProjectArtifact variant={chapter.artifact} />
                  <figcaption>{chapter.artifactLabel}</figcaption>
                </figure>
              )}

              {chapter.cta && (
                <div className="hero-actions">
                  <a href="#titan" className="button primary">Begin the signal</a>
                  <a href={links.resume} className="button secondary" download>Download resume</a>
                </div>
              )}

              {chapter.href && (
                <a href={chapter.href} target="_blank" rel="noreferrer" className="text-link">
                  {chapter.linkLabel}
                </a>
              )}

              {chapter.final && (
                <>
                  <div className="final-deck">
                    {finalCards.map(([label, detail]) => (
                      <article className="final-card" key={label}>
                        <span>{label}</span>
                        <p>{detail}</p>
                      </article>
                    ))}
                  </div>
                  <div className="contact-grid">
                    <a href={links.email}>Email</a>
                    <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
                    <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href={links.resume} download>Resume</a>
                  </div>
                  <p className="final-note">
                    Send the hardest systems problem on your backlog. I will bring benchmarks,
                    traces, and taste.
                  </p>
                </>
              )}
            </motion.article>
          </section>
        ))}
      </div>
    </main>
  );
}
