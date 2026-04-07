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

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const links = {
  github: "https://github.com/DevWizard-Vandan",
  titan: "https://github.com/DevWizard-Vandan/Titan",
  linkedin: "https://www.linkedin.com/in/vandan-sharma-682536330",
  email: "mailto:vandan.sharma06@gmail.com",
  resume: "/Vandan-Sharma-Resume.pdf"
};

const stats = [
  { label: "Published patent", detail: "GreenLoop" },
  { label: "Peer-reviewed paper", detail: "Cursor" },
  { label: "12.8M matches/sec", detail: "Titan hot path" },
  { label: "8x H100 run", detail: "Applied AI training" }
];

const projects = [
  {
    title: "Titan",
    subtitle: "Ultra low-latency matching engine",
    stack: "Rust / lock-free / cache-aware",
    visual: "titan",
    href: links.titan,
    bullets: [
      "12.8M matches/sec with sub-microsecond median latency.",
      "Cache-aligned order structs, SPSC ring buffers, and zero-allocation hot paths."
    ]
  },
  {
    title: "Vajra",
    subtitle: "Distributed vector database",
    stack: "Rust / Raft / HNSW / async",
    visual: "vajra",
    href: links.github,
    bullets: [
      "Fault-tolerant ANN search with custom Raft consensus and WAL recovery.",
      "Validated with node-failure and network-partition chaos tests."
    ]
  },
  {
    title: "Parameter Golf",
    subtitle: "Model compression study",
    stack: "PyTorch / CUDA / quantization",
    visual: "compression",
    href: links.github,
    bullets: [
      "Compressed a 16MB weight artifact to 10.9MB while preserving task quality.",
      "Ran experiments on an 8x H100 training setup with reproducible sweeps."
    ]
  }
];

const skillGroups = [
  {
    name: "Systems",
    skills: ["Lock-free data structures", "Raft", "WAL", "Async I/O", "gRPC"]
  },
  {
    name: "AI/ML",
    skills: ["HNSW", "PyTorch", "ANN search", "Compression", "Evaluation"]
  },
  {
    name: "Languages",
    skills: ["Rust", "Java", "Python", "C++", "TypeScript"]
  },
  {
    name: "Cloud",
    skills: ["Linux", "Docker", "PostgreSQL", "MinIO", "Git"]
  }
];

const research = [
  {
    type: "Patent",
    title: "GreenLoop",
    label: "Published patent",
    copy:
      "Sustainable applied AI systems work focused on resource-aware optimization. Filing metadata can be linked as soon as the public record is available."
  },
  {
    type: "Paper",
    title: "Cursor",
    label: "Peer-reviewed research",
    copy:
      "Research on developer interaction loops and code-aware assistance. DOI and publisher link can be added when finalized."
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
      gsap.utils.toArray(".gsap-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <motion.div className="scroll-progress" style={{ scaleX }} />

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="grain" aria-hidden="true" />
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.p className="eyebrow" variants={fadeUp}>
            Systems engineer / applied AI researcher
          </motion.p>
          <motion.h1 id="hero-title" variants={fadeUp}>
            Vandan Sharma
          </motion.h1>
          <motion.p className="hero-subtitle" variants={fadeUp}>
            I build fast, inspectable systems: matching engines, vector databases,
            compression experiments, and research artifacts that can stand up to
            close technical review.
          </motion.p>
          <motion.div className="hero-badges" variants={fadeUp}>
            <span>Patent holder</span>
            <span>Published researcher</span>
          </motion.div>
          <motion.div className="hero-actions" variants={fadeUp}>
            <a href="#projects" className="button primary">
              View projects
            </a>
            <a href={links.resume} className="button secondary" download>
              Download resume
            </a>
          </motion.div>
        </motion.div>
        <div className="hero-visual" aria-hidden="true">
          <InteractiveScene variant="hero" />
        </div>
      </section>

      <section className="credibility-bar" aria-label="Credibility highlights">
        {stats.map((stat) => (
          <article className="stat-pill" key={stat.label}>
            <strong>{stat.label}</strong>
            <span>{stat.detail}</span>
          </article>
        ))}
      </section>

      <section className="content-section about-section gsap-reveal" id="about">
        <p className="section-kicker">About</p>
        <div className="about-grid">
          <h2>Second-year CSE (AI & ML) student at VIT Pune, building closer to the metal than most portfolios imply.</h2>
          <p>
            My work sits at the point where systems discipline meets applied AI:
            deterministic Rust hot paths, distributed search infrastructure,
            benchmarked compression experiments, and research that is legible to
            reviewers. The short version for a recruiter: I like hard constraints,
            measurable outputs, and code that explains itself under pressure.
          </p>
        </div>
      </section>

      <section className="content-section projects-section" id="projects" aria-labelledby="projects-title">
        <div className="section-heading gsap-reveal">
          <p className="section-kicker">Selected projects</p>
          <h2 id="projects-title">Interactive artifacts for real systems work.</h2>
        </div>

        <div className="project-list">
          {projects.map((project, index) => (
            <motion.article
              className="project-card"
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.32 }}
              variants={fadeUp}
              transition={{ duration: 0.55, delay: index * 0.1 }}
            >
              <div className="project-copy">
                <p className="project-stack">{project.stack}</p>
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
                <ul>
                  {project.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <a href={project.href} target="_blank" rel="noreferrer" className="text-link">
                  View code
                </a>
              </div>
              <div className="project-visual" aria-label={`${project.title} interactive visual`}>
                <InteractiveScene variant={project.visual} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="content-section skills-section gsap-reveal" aria-labelledby="skills-title">
        <div className="section-heading">
          <p className="section-kicker">Skills</p>
          <h2 id="skills-title">Clusters, not a laundry list.</h2>
        </div>
        <div className="skills-grid">
          <div className="skill-orbit" aria-hidden="true">
            <InteractiveScene variant="skills" />
          </div>
          <div className="skill-groups">
            {skillGroups.map((group) => (
              <article className="skill-group" key={group.name}>
                <h3>{group.name}</h3>
                <div className="skill-pills">
                  {group.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section research-section" aria-labelledby="research-title">
        <div className="section-heading gsap-reveal">
          <p className="section-kicker">Research and patents</p>
          <h2 id="research-title">Credibility that survives a quick scan.</h2>
        </div>
        <div className="research-grid">
          {research.map((item) => (
            <article className="research-card gsap-reveal" key={item.title}>
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p className="research-label">{item.label}</p>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section experience-section gsap-reveal" aria-labelledby="experience-title">
        <p className="section-kicker">Experience</p>
        <h2 id="experience-title">Engineering practice in public and program settings.</h2>
        <div className="timeline">
          <article>
            <span className="timeline-dot" />
            <p>2025</p>
            <h3>TechSaksham</h3>
            <p>Applied learning and project work across AI and engineering fundamentals.</p>
          </article>
          <article>
            <span className="timeline-dot" />
            <p>2025</p>
            <h3>GirlScript Summer of Code</h3>
            <p>Open-source contribution through pull requests, review, and async collaboration.</p>
          </article>
        </div>
      </section>

      <footer className="footer" id="contact">
        <p>Vandan Sharma</p>
        <nav aria-label="Contact links">
          <a href={links.email}>Email</a>
          <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={links.resume} download>Resume</a>
        </nav>
      </footer>
    </main>
  );
}
