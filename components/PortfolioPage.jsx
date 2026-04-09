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
  linkedin: "https://www.linkedin.com/in/vandan-sharma-682536330",
  emailAddress: "vandan.sharma06@gmail.com",
  resume: "/Vandan-Sharma-Resume.pdf"
};

const heroPhrases = [
  "12.8M matches per second.",
  "Raft consensus from scratch.",
  "Zero allocations on the hot path.",
  "Built for pressure."
];

const signals = [
  { label: "Patent", detail: "GreenLoop", targetId: "greenloop-proof" },
  { label: "Paper", detail: "Cursor", targetId: "cursor-proof" },
  { label: "HFT Stack", detail: "12.8M matches/sec", targetId: "stack" },
  { label: "Scale", detail: "8x H100 run", targetId: "golf" }
];

const finalCards = [
  ["Target", "High-intensity engineering internships at AI labs and infrastructure teams."],
  ["Focus", "Rust systems, distributed search, model compression, and applied AI evaluation."],
  ["Review path", "Start with HFT Stack, open Titan, then scan the proof rail before the resume."]
];

const chapters = [
  {
    id: "hero",
    marker: "00 / ignition",
    title: "Vandan Sharma",
    copy:
      "Systems engineering, applied AI, and research work built for pressure: fast paths, distributed memory, compressed weights, and proof that survives a close read.",
    cta: true,
    wide: true,
    navLabel: "Ignition",
    typewriter: true
  },
  {
    id: "stack",
    marker: "01 / unified infrastructure",
    title: "HFT Stack",
    meta: "RUST · RAFT · LOCK-FREE · HNSW",
    copy:
      "A complete HFT infrastructure built from first principles. Titan matches 12.8M orders/sec and feeds fill events into Vajra for real-time pattern recognition - two independent Raft clusters operating as one fault-tolerant stack.",
    bullets: ["12.8M matches/sec", "dual Raft consensus", "zero-alloc hot path"],
    links: [{ href: links.hftStackDemo, label: "Open unified demo →" }],
    navLabel: "HFT Stack",
    backgroundIframe: links.hftStackAnimation
  },
  {
    id: "titan",
    marker: "02 / execution",
    title: "Titan",
    meta: "Rust / lock-free / cache-aware",
    copy:
      "A limit-order-book engine shaped around deterministic hot paths, cache-aligned order structs, SPSC rings, and measured latency instead of hopeful claims.",
    bullets: ["12.8M matches/sec", "sub-microsecond median latency", "zero-allocation hot path"],
    links: [
      { href: links.titanRepo, label: "Open repository" },
      { href: links.titanDemo, label: "Live demo →" }
    ],
    navLabel: "Titan"
  },
  {
    id: "vajra",
    marker: "03 / memory",
    title: "Vajra",
    meta: "Rust / Raft / HNSW / async",
    copy:
      "A distributed vector database with leader election, log replication, write-ahead recovery, and graph search that keeps returning useful neighbors under failure.",
    bullets: ["custom Raft consensus", "HNSW search", "chaos-tested failover"],
    links: [
      { href: links.vajraRepo, label: "Open repository" },
      { href: links.vajraDemo, label: "Live demo →" }
    ],
    navLabel: "Vajra"
  },
  {
    id: "golf",
    marker: "04 / compression",
    title: "Parameter Golf",
    meta: "PyTorch / CUDA / quantization",
    copy:
      "An experiment in smaller models and sharper measurement: compressing a 16MB weight artifact to 10.9MB with reproducible sweeps on an 8x H100 training run.",
    bullets: ["16MB to 10.9MB", "8x H100 sweep", "quality-preserving compression"],
    links: [{ href: links.parameterGolf, label: "Open repository" }],
    navLabel: "Parameter Golf"
  },
  {
    id: "research",
    marker: "05 / proof",
    title: "GreenLoop + Cursor",
    meta: "published patent / peer-reviewed paper",
    copy:
      "GreenLoop marks the patent track. Cursor marks the paper track. Both sit above the fold because credentials should arrive before curiosity has to work.",
    bullets: ["published patent", "peer-reviewed paper", "metadata links ready when public"],
    navLabel: "Research",
    proofItems: [
      {
        id: "greenloop-proof",
        label: "Patent",
        title: "GreenLoop",
        copy:
          "Published patent work in sustainable applied AI systems, positioned here as direct proof that the engineering story already has external validation."
      },
      {
        id: "cursor-proof",
        label: "Paper",
        title: "Cursor",
        copy:
          "Peer-reviewed research that complements the systems work with public signal, technical writing, and work that holds up under close review."
      }
    ]
  },
  {
    id: "contact",
    marker: "06 / signal",
    title: "Build with rigor. Ship with taste.",
    copy:
      "Based in Pune. Studying CSE (AI & ML) at Vishwakarma Institute of Technology. Open to high-intensity internship work at labs and engineering teams.",
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

      timeoutId = window.setTimeout(
        () => setDisplayText(nextText),
        isDeleting ? 34 : 58
      );
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
  }, [chapterNavItems]);

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

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(links.emailAddress);
      } else {
        throw new Error("Clipboard API unavailable");
      }

      setCopiedEmail(true);

      if (copyResetRef.current) {
        window.clearTimeout(copyResetRef.current);
      }

      copyResetRef.current = window.setTimeout(() => {
        setCopiedEmail(false);
      }, 2000);
    } catch (error) {
      window.location.href = `mailto:${links.emailAddress}`;
    }
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
          <a href="#research">Proof</a>
          <a href={links.resume} download>Resume</a>
        </div>
      </nav>

      {copiedEmail && (
        <div className="copy-toast" role="status" aria-live="polite">
          Copied ✓
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
              <h1 id={`${chapter.id}-title`}>{chapter.title}</h1>

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
                    <a href={links.resume} className="button secondary" download>Download resume</a>
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
                    <button
                      type="button"
                      className="contact-action"
                      onClick={handleCopyEmail}
                    >
                      {copiedEmail ? "Copied ✓" : "Copy email"}
                    </button>
                    <a className="contact-action" href={links.github} target="_blank" rel="noreferrer">GitHub</a>
                    <a className="contact-action" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    <a className="contact-action" href={links.resume} download>Resume</a>
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
