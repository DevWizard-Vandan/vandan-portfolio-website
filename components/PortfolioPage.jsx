"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ChapterNav from "@/components/ChapterNav";
import CursorTrail from "@/components/CursorTrail";

const InteractiveScene = dynamic(() => import("@/components/InteractiveScene"), {
  ssr: false,
  loading: () => <div className="scene-loading" aria-hidden="true" />
});

const links = {
  github: "https://github.com/DevWizard-Vandan",
  hftStackDemo: "https://devwizard-vandan.github.io/HFT-Stack/",
  hftStackAnimation: "https://devwizard-vandan.github.io/HFT-Stack/hft-animation.html",
  titanRepo: "https://github.com/DevWizard-Vandan/Titan",
  titanDemo: "https://devwizard-vandan.github.io/Titan",
  vajraRepo: "https://github.com/DevWizard-Vandan/Vajra",
  vajraDemo: "https://devwizard-vandan.github.io/Vajra",
  parameterGolf: "https://github.com/DevWizard-Vandan/parameter-golf",
  radheAi: "https://github.com/DevWizard-Vandan/radhe-ai",
  whisperNet: "https://github.com/DevWizard-Vandan/whisper-net",
  linkedin: "https://www.linkedin.com/in/vandan-sharma-682536330",
  credly: "https://credly.com/vandan-sharma",
  emailAddress: "vandan.sharma06@gmail.com",
  resume: "/Vandan-Sharma-Resume.pdf"
};

const heroPhrases = [
  "12.8M matches per second.",
  "WorldQuant Gold.",
  "OpenAI Parameter Golf rank 20.",
  "Raft consensus from scratch.",
  "Zero allocations on the hot path.",
  "Built for pressure."
];

const signals = [
  { label: "OpenAI", detail: "Rank 20", targetId: "awards" },
  { label: "WorldQuant", detail: "Gold level", targetId: "awards" },
  { label: "HFT Stack", detail: "12.8M matches/sec", targetId: "stack" },
  { label: "Research", detail: "Patent + paper", targetId: "research" }
];

const finalCards = [
  ["Target", "Systems engineering, applied AI research, and quantitative research internships."],
  ["Focus", "Rust systems, distributed search, model compression, quant research, and applied DSP."],
  ["Review path", "Start with awards, inspect HFT Stack, then scan projects and research proof."]
];

const awards = [
  {
    badge: "Global Rank 20",
    title: "OpenAI Parameter Golf - Record Track",
    copy:
      "Score 1.2392 with a 10.9MB Zstandard artifact, compressing a 26.5M parameter language model under the 16MB limit.",
    stats: ["8x H100 SXM", "Int6 STE QAT", "PyTorch DDP"],
    href: links.parameterGolf
  },
  {
    badge: "Top 20% Global",
    title: "International Quant Championship 2026",
    copy:
      'Stage 1 with Team "VaNam" in WorldQuant\'s flagship global quantitative research championship.',
    stats: ["IQC 2026", "Quant research", "Global field"]
  },
  {
    badge: "Gold Level",
    title: "WorldQuant BRAIN Challenge",
    copy:
      "Highest platform tier after Bronze to Silver to Gold progression on WorldQuant's alpha research and recruiting platform.",
    stats: ["Alpha research", "Factor modeling", "$10B+ AUM firm"]
  },
  {
    badge: "Consultant",
    title: "WorldQuant BRAIN Tutorial",
    copy:
      "Completed the Quantitative Finance Starter track in Jun 2026 and qualified as a BRAIN Research Consultant.",
    stats: ["Backtesting", "Signals", "Research workflow"]
  }
];

const skillGroups = [
  ["Languages", ["Rust", "Python", "C", "TypeScript/JavaScript", "Java", "C++"]],
  ["AI/ML", ["Transformer Architecture", "Fine-tuning", "Multi-Agent Systems", "QAT"]],
  ["Systems", ["Lock-free DS", "Cache Alignment", "Zero-copy Protocols", "Async I/O"]],
  ["Distributed", ["Raft Consensus", "WAL", "Replication", "Fault Tolerance"]],
  ["Quant/Finance", ["Alpha Research", "Factor Modeling", "Backtesting"]],
  ["Cloud/DevOps", ["GCP", "Kubernetes", "Docker", "CI/CD"]],
  ["Frontend", ["Next.js", "React", "Tailwind CSS"]]
];

const chapters = [
  {
    id: "hero",
    marker: "00 / ignition",
    title: "Vandan Sharma",
    copy:
      "Based in Pune. VIT Pune CSE (AI & ML), expected 2028. Systems engineering, applied AI, and quantitative research work built for pressure: fast paths, distributed memory, compressed weights, and proof that survives a close read.",
    cta: true,
    wide: true,
    navLabel: "Ignition",
    typewriter: true
  },
  {
    id: "awards",
    marker: "01 / social proof",
    title: "Competitions & Awards",
    meta: "OPENAI / WORLDQUANT / QUANT RESEARCH",
    copy:
      "External signal from model compression and quantitative research competitions. This is the fastest read on where the work has already been stress-tested.",
    bullets: ["OpenAI rank 20", "IQC top 20% globally", "WorldQuant Gold"],
    navLabel: "Awards",
    awards
  },
  {
    id: "stack",
    marker: "02 / unified infrastructure",
    title: "HFT Stack",
    meta: "RUST / RAFT / LOCK-FREE / HNSW",
    copy:
      "A complete HFT infrastructure built from first principles. Titan matches 12.8M orders/sec and feeds fill events into Vajra for real-time pattern recognition - two independent Raft clusters operating as one fault-tolerant stack.",
    bullets: ["12.8M matches/sec", "dual Raft consensus", "zero-alloc hot path"],
    links: [{ href: links.hftStackDemo, label: "Open unified demo ->" }],
    navLabel: "HFT Stack",
    backgroundIframe: links.hftStackAnimation
  },
  {
    id: "titan",
    marker: "03 / execution",
    title: "Titan",
    meta: "Rust / lock-free / cache-aware",
    copy:
      "A limit-order-book engine shaped around deterministic hot paths, cache-aligned order structs, SPSC rings, zero-allocation execution, and measured latency instead of hopeful claims.",
    bullets: ["12.8M matches/sec", "sub-microsecond median latency", "P50/P99/P99.9 validation"],
    links: [
      { href: links.titanRepo, label: "Open repository" },
      { href: links.titanDemo, label: "Live demo ->" }
    ],
    navLabel: "Titan"
  },
  {
    id: "vajra",
    marker: "04 / memory",
    title: "Vajra",
    meta: "Rust / Raft / HNSW / async",
    copy:
      "A distributed vector database with leader election, log replication, write-ahead recovery, and graph search. Titan fill events feed into Vajra for real-time pattern recognition across two Raft clusters.",
    bullets: ["99% Recall@1", "custom Raft consensus", "zero data loss under partitions"],
    links: [
      { href: links.vajraRepo, label: "Open repository" },
      { href: links.vajraDemo, label: "Live demo ->" }
    ],
    navLabel: "Vajra"
  },
  {
    id: "golf",
    marker: "05 / compression",
    title: "Parameter Golf",
    meta: "PyTorch / CUDA / quantization",
    copy:
      "OpenAI Parameter Golf record-track work: a 26.5M parameter language model compressed to a 10.9MB artifact with custom QAT, Int6 simulation, and 8x H100 DDP training.",
    bullets: ["Score 1.2392", "Global Rank 20", "10.9MB artifact"],
    links: [{ href: links.parameterGolf, label: "Open repository" }],
    navLabel: "Parameter Golf"
  },
  {
    id: "radhe",
    marker: "06 / offline ai",
    title: "Radhe AI",
    meta: "Rust / llama.cpp / Qwen2.5-Coder / offline",
    copy:
      "A fully offline Rust CLI that runs quantized Qwen2.5-Coder 1.5B through a llama.cpp subprocess bridge, with a mode-specific prompt compiler for code generation, bug-fixing, notes, quizzes, and REPL-style study.",
    bullets: ["zero cloud dependency", "English / Hindi / Hinglish", "MIT licensed"],
    links: [{ href: links.radheAi, label: "Open repository" }],
    navLabel: "Radhe AI"
  },
  {
    id: "whispernet",
    marker: "07 / signal research",
    title: "WhisperNet",
    meta: "Research / Security / Applied Acoustics & Telecoms",
    copy:
      "A cross-platform software-defined acoustic modem built as an applied DSP and telecommunications deep dive. It implements PHY, MAC, crypto, and academic stealth layers to understand RF-style protocols at the signal level, not as a hacking tool.",
    bullets: ["BFSK 33.3 bps / OFDM 2,857 bps", "AES-256-GCM + HKDF", "41 physics/math tests"],
    links: [{ href: links.whisperNet, label: "Open repository" }],
    navLabel: "WhisperNet",
    detailItems: [
      "34 OFDM subcarriers, RS(255,223), 16x16 interleaver, repetition-3, ARQ + CRC-16",
      "Replay guard via sequence numbers and timestamps; psychoacoustic masking at -6.0dB SNR",
      "Python desktop plus zero-dependency vanilla JS PWA disguised as a CASIO calculator"
    ]
  },
  {
    id: "research",
    marker: "08 / proof",
    title: "GreenLoop + Cursor",
    meta: "published patent / peer-reviewed paper",
    copy:
      "GreenLoop marks the patent track. Predictive Cursor marks the paper track. Both sit here because credentials should arrive before curiosity has to work.",
    bullets: ["published patent", "peer-reviewed paper", "metadata links ready when public"],
    navLabel: "Research",
    proofItems: [
      {
        id: "greenloop-proof",
        label: "Patent",
        title: "GreenLoop",
        copy:
          "IoT-enabled smart composting unit using ESP32 hardware with temperature, humidity, and weight sensors. Published 2026."
      },
      {
        id: "cursor-proof",
        label: "Paper",
        title: "Predictive Cursor System",
        copy:
          "Published in iJRASET, Vol. 12, Nov. 2025, complementing the systems work with public technical writing and evaluation."
      }
    ]
  },
  {
    id: "skills",
    marker: "09 / capabilities",
    title: "Skill Stack",
    meta: "systems / ai / distributed / quant / cloud",
    copy:
      "Grouped by the problems they solve rather than a flat keyword cloud.",
    navLabel: "Skills",
    skills: skillGroups
  },
  {
    id: "contact",
    marker: "10 / signal",
    title: "Build with rigor. Ship with taste.",
    copy:
      "Based in Pune. Studying CSE (AI & ML) at VIT Pune. Open to high-intensity internships at AI labs, quantitative research groups, infrastructure teams, and HFT teams.",
    final: true
  }
];

const chapterNavItems = chapters
  .filter((chapter) => chapter.navLabel)
  .map((chapter) => ({
    id: chapter.id,
    label: chapter.navLabel,
    markerLabel: `${chapter.marker.split(" / ")[0]} ${chapter.navLabel}`
  }));

function HeroTypeLine({ phrases, disabled }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(phrases[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (disabled) {
      setDisplayText(phrases[0]);
      setPhraseIndex(0);
      setIsDeleting(false);
      return undefined;
    }

    const currentPhrase = phrases[phraseIndex];
    let timeoutId = 0;

    if (!isDeleting && displayText === currentPhrase) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && displayText === "") {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((currentIndex) => (currentIndex + 1) % phrases.length);
      }, 220);
    } else {
      const nextText = isDeleting
        ? currentPhrase.slice(0, displayText.length - 1)
        : currentPhrase.slice(0, displayText.length + 1);

      timeoutId = window.setTimeout(() => setDisplayText(nextText), isDeleting ? 34 : 58);
    }

    return () => window.clearTimeout(timeoutId);
  }, [disabled, displayText, isDeleting, phraseIndex, phrases]);

  return (
    <p className="hero-type-line" aria-live="off">
      <span>{displayText}</span>
      {!disabled && <span className="type-caret" aria-hidden="true" />}
    </p>
  );
}

export default function PortfolioPage() {
  const prefersReducedMotion = useReducedMotion();
  const copyResetRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [activeChapter, setActiveChapter] = useState(chapterNavItems[0].id);
  const [copiedEmail, setCopiedEmail] = useState(false);
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

  useEffect(() => {
    const updateActiveChapter = () => {
      const viewportMiddle = window.innerHeight * 0.45;
      let nextChapterId = chapterNavItems[0]?.id ?? "hero";
      let nearestDistance = Number.POSITIVE_INFINITY;

      chapterNavItems.forEach((item) => {
        const element = document.getElementById(item.id);

        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportMiddle);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nextChapterId = item.id;
        }
      });

      setActiveChapter((currentChapter) =>
        currentChapter === nextChapterId ? currentChapter : nextChapterId
      );
    };

    let animationFrame = 0;

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveChapter);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(
    () => () => {
      if (copyResetRef.current) {
        window.clearTimeout(copyResetRef.current);
      }
    },
    []
  );

  const scrollToId = (id) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  const handleEmail = async () => {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(links.emailAddress);
        copied = true;
      }
    } catch (error) {
      copied = false;
    }

    if (copied) {
      setCopiedEmail(true);

      if (copyResetRef.current) {
        window.clearTimeout(copyResetRef.current);
      }

      copyResetRef.current = window.setTimeout(() => {
        setCopiedEmail(false);
      }, 2000);
    }

    window.location.href = `mailto:${links.emailAddress}`;
  };

  return (
    <main className="cinema-shell">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <CursorTrail />
      <div className="stage" aria-hidden="true">
        <InteractiveScene />
      </div>
      <div className="stage-vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <ChapterNav items={chapterNavItems} activeId={activeChapter} onNavigate={scrollToId} />

      <nav className="topline" aria-label="Primary">
        <a href="#hero" className="brand-lockup">VS</a>
        <div>
          <a href="#stack">Work</a>
          <a href="#awards">Awards</a>
          <a href="#research">Proof</a>
          <a href="#skills">Skills</a>
          <a href={links.resume} download>Resume</a>
        </div>
      </nav>

      {copiedEmail && (
        <div className="copy-toast" role="status" aria-live="polite">
          Email copied
        </div>
      )}

      <div className="scroll-script">
        {chapters.map((chapter) => (
          <section
            className={[
              "chapter",
              `chapter-${chapter.id}`,
              chapter.wide ? "chapter-wide" : "",
              chapter.backgroundIframe ? "chapter-has-media" : ""
            ].join(" ").trim()}
            id={chapter.id}
            key={chapter.id}
            aria-labelledby={`${chapter.id}-title`}
          >
            {chapter.backgroundIframe && (
              <div className="chapter-media" aria-hidden="true">
                <iframe
                  src={chapter.backgroundIframe}
                  title={`${chapter.title} background animation`}
                  loading="lazy"
                  tabIndex={-1}
                />
                <div className="chapter-media-overlay" />
              </div>
            )}

            <motion.article
              className="chapter-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.42 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="chapter-marker">{chapter.marker}</p>
              {chapter.id === "hero" ? (
                <h1 id={`${chapter.id}-title`}>{chapter.title}</h1>
              ) : (
                <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
              )}

              {chapter.typewriter && (
                <HeroTypeLine phrases={heroPhrases} disabled={prefersReducedMotion} />
              )}

              {chapter.meta && <p className="chapter-meta">{chapter.meta}</p>}
              <p className="chapter-copy">{chapter.copy}</p>

              {chapter.bullets && (
                <div className="signal-list">
                  {chapter.bullets.map((bullet) => (
                    <span key={bullet}>{bullet}</span>
                  ))}
                </div>
              )}

              {chapter.proofItems && (
                <div className="proof-cluster">
                  {chapter.proofItems.map((proofItem) => (
                    <article className="proof-card" id={proofItem.id} key={proofItem.id}>
                      <span>{proofItem.label}</span>
                      <h2>{proofItem.title}</h2>
                      <p>{proofItem.copy}</p>
                    </article>
                  ))}
                </div>
              )}

              {chapter.awards && (
                <div className="award-cluster">
                  {chapter.awards.map((award) => {
                    const awardCard = (
                      <>
                        <span>{award.badge}</span>
                        <h3>{award.title}</h3>
                        <p>{award.copy}</p>
                        <div className="mini-signal-list">
                          {award.stats.map((stat) => (
                            <strong key={stat}>{stat}</strong>
                          ))}
                        </div>
                      </>
                    );

                    return award.href ? (
                      <a
                        className="award-proof-card"
                        href={award.href}
                        target="_blank"
                        rel="noreferrer"
                        key={award.title}
                      >
                        {awardCard}
                      </a>
                    ) : (
                      <article className="award-proof-card" key={award.title}>
                        {awardCard}
                      </article>
                    );
                  })}
                </div>
              )}

              {chapter.detailItems && (
                <div className="detail-stack">
                  {chapter.detailItems.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              )}

              {chapter.skills && (
                <div className="skills-cluster">
                  {chapter.skills.map(([group, skills]) => (
                    <article className="skill-card" key={group}>
                      <span>{group}</span>
                      <p>{skills.join(" / ")}</p>
                    </article>
                  ))}
                </div>
              )}

              {chapter.cta && (
                <>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="button primary"
                      onClick={() => scrollToId("stack")}
                    >
                      Begin the signal
                    </button>
                    <a href={links.resume} className="button secondary" download>
                      Download resume
                    </a>
                  </div>
                  <section className="proof-rail" aria-label="Credibility highlights">
                    {signals.map((signal) => (
                      <button
                        type="button"
                        className="proof-rail-item"
                        key={signal.label}
                        onClick={() => scrollToId(signal.targetId)}
                      >
                        <span>{signal.label}</span>
                        <strong>{signal.detail}</strong>
                      </button>
                    ))}
                  </section>
                </>
              )}

              {chapter.links && (
                <div className="chapter-links">
                  {chapter.links.map((chapterLink) => (
                    <a
                      href={chapterLink.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-link"
                      key={`${chapter.id}-${chapterLink.label}`}
                    >
                      {chapterLink.label}
                    </a>
                  ))}
                </div>
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
                    <button type="button" className="contact-action" onClick={handleEmail}>
                      {copiedEmail ? "Email copied" : "Email"}
                    </button>
                    <a className="contact-action" href={links.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                    <a className="contact-action" href={links.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                    <a className="contact-action" href={links.credly} target="_blank" rel="noreferrer">
                      Credly
                    </a>
                    <a className="contact-action" href={links.resume} download>
                      Resume
                    </a>
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
