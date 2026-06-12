import ThemeToggle from "@/components/ThemeToggle";

const links = {
  email: "mailto:vandan.sharma06@gmail.com",
  github: "https://github.com/DevWizard-Vandan",
  linkedin: "https://linkedin.com/in/vandan-sharma-682536330",
  credly: "https://credly.com/vandan-sharma",
  resume: "/Vandan-Sharma-Resume.pdf"
};

const awards = [
  {
    index: "01",
    badge: "GLOBAL RANK 20",
    title: "OpenAI Parameter Golf",
    subtitle: "Record Track",
    detail:
      "Compressed a 26.5M parameter language model to a 10.9MB Zstandard artifact under the 16MB limit.",
    metrics: ["Score 1.2392", "8x H100 SXM", "Int6 STE QAT"],
    href: "https://github.com/DevWizard-Vandan/parameter-golf"
  },
  {
    index: "02",
    badge: "TOP 20% GLOBAL",
    title: "International Quant Championship 2026",
    subtitle: 'Stage 1 / Team "VaNam"',
    detail:
      "Advanced through Stage 1 of WorldQuant's flagship global quantitative research championship.",
    metrics: ["IQC 2026", "Quant research", "Global field"]
  },
  {
    index: "03",
    badge: "GOLD LEVEL",
    title: "WorldQuant BRAIN Challenge",
    subtitle: "Highest platform tier",
    detail:
      "Completed the Bronze to Silver to Gold progression on WorldQuant's global alpha research and recruiting platform. WorldQuant is a systematic hedge fund managing $10B+ AUM.",
    metrics: ["Alpha research", "Factor design", "Backtesting"]
  },
  {
    index: "04",
    badge: "CONSULTANT",
    title: "WorldQuant BRAIN Tutorial",
    subtitle: "Quantitative Finance Starter / Jun 2026",
    detail:
      "Completed the structured starter track and qualified as a BRAIN Research Consultant.",
    metrics: ["Quant finance", "Signals", "Research workflow"]
  }
];

const projects = [
  {
    name: "Titan",
    kind: "HFT Execution Engine",
    description:
      "A Rust limit-order-book engine engineered around deterministic, cache-conscious hot paths.",
    stats: ["12.8M matches/sec", "Sub-microsecond median", "P50 / P99 / P99.9"],
    highlights: [
      "Lock-free SPSC ring buffer",
      "Cache-aligned structs",
      "Zero-allocation hot paths",
      "HdrHistogram validation"
    ],
    tags: ["Rust", "Lock-free", "Zero-copy", "HdrHistogram"],
    href: "https://github.com/DevWizard-Vandan/Titan",
    featured: true
  },
  {
    name: "Vajra",
    kind: "Distributed Vector Database",
    description:
      "A fault-tolerant vector database with consensus, durable recovery, and approximate nearest-neighbor search built from first principles.",
    stats: ["99% Recall@1", "Custom Raft", "Zero data loss"],
    highlights: [
      "Leader election and log replication",
      "WAL crash recovery",
      "Partition and failover testing",
      "Titan fill-event ingestion"
    ],
    tags: ["Rust", "Raft", "WAL", "HNSW", "gRPC"],
    href: "https://github.com/DevWizard-Vandan/Vajra",
    featured: true
  },
  {
    name: "Parameter Golf",
    kind: "Model Compression / Competition",
    description:
      "A 26.5M parameter language model compressed with custom quantization-aware training and Zstandard.",
    stats: ["Score 1.2392", "Global Rank 20", "10.9MB artifact"],
    highlights: [
      "Straight-Through Estimator",
      "Int6 simulation",
      "PyTorch DDP",
      "8x H100 SXM training"
    ],
    tags: ["Python", "PyTorch", "QAT", "DDP", "Zstandard"],
    href: "https://github.com/DevWizard-Vandan/parameter-golf"
  },
  {
    name: "WhisperNet",
    kind: "Applied Acoustics & Telecoms Research",
    label: "RESEARCH / SECURITY",
    description:
      "A cross-platform software-defined acoustic modem built to study RF-style protocols at the signal level. The stealth layer is academic research, not a hacking tool.",
    stats: ["2,857 bps OFDM", "BER < 0.001", "41 unit tests"],
    highlights: [
      "BFSK and 34-subcarrier OFDM",
      "RS(255,223), interleaving, ARQ",
      "AES-256-GCM, HKDF, replay guard",
      "BFSK 33.3 bps / effective range 3-5m",
      "Psychoacoustic masking at -6.0dB SNR",
      "Python desktop and vanilla JS PWA",
      "Calculator unlock: 3.14159 ="
    ],
    tags: ["Python", "JavaScript", "DSP", "OFDM", "Reed-Solomon", "Web Audio"],
    href: "https://github.com/DevWizard-Vandan/whisper-net"
  },
  {
    name: "Radhe AI",
    kind: "Offline AI Study CLI",
    description:
      "A fully offline Rust CLI running quantized Qwen2.5-Coder 1.5B through a llama.cpp subprocess bridge.",
    stats: ["Zero cloud", "3 languages", "MIT licensed"],
    highlights: [
      "Two-tier echo stripping",
      "Mode-specific prompt compiler",
      "Code, fix, notes, quiz, and chat modes",
      "English, Hindi, and Hinglish"
    ],
    tags: ["Rust", "llama.cpp", "Qwen2.5", "CLI", "Offline AI"],
    href: "https://github.com/DevWizard-Vandan/radhe-ai"
  }
];

const skillGroups = [
  ["Languages", ["Rust", "Python", "C", "TypeScript / JavaScript", "Java", "C++"]],
  ["AI / ML", ["Transformer Architecture", "Fine-tuning", "Multi-Agent Systems", "QAT"]],
  ["Systems", ["Lock-free DS", "Cache Alignment", "Zero-copy Protocols", "Async I/O"]],
  ["Distributed", ["Raft Consensus", "WAL", "Replication", "Fault Tolerance"]],
  ["Quant / Finance", ["Alpha Research", "Factor Modeling", "Backtesting"]],
  ["Cloud / DevOps", ["GCP", "Kubernetes", "Docker", "CI/CD"]],
  ["Frontend", ["Next.js", "React", "Tailwind CSS"]]
];

function ArrowIcon() {
  return <span aria-hidden="true">-&gt;</span>;
}

function SectionHeading({ eyebrow, title, copy, id }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Vandan Sharma, home">
          <span className="brand-mark">VS</span>
          <span className="brand-copy">
            <strong>Vandan Sharma</strong>
            <small>systems / ai / quant</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#awards">Awards</a>
          <a href="#projects">Projects</a>
          <a href="#research">Research</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <a className="header-resume" href={links.resume} download>
            Resume
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main id="main-content">
        <section className="hero section-shell" id="top" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                Pune, India / VIT Pune / B.Tech CSE (AI & ML) / 2028
              </p>
              <h1 id="hero-title">
                I build systems that stay <span>fast under pressure.</span>
              </h1>
              <p className="hero-lede">
                Systems engineer, applied AI researcher, and quantitative research builder
                working across low-latency Rust, distributed infrastructure, and model
                compression.
              </p>
              <p className="hero-positioning">
                WorldQuant Gold. IQC 2026 Top 20%. OpenAI Parameter Golf peak Global Rank 20.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#projects">
                  Inspect the work <ArrowIcon />
                </a>
                <a className="button button-secondary" href={links.resume} download>
                  Download resume
                </a>
              </div>
            </div>

            <aside className="terminal-panel" aria-label="Selected engineering metrics">
              <div className="terminal-bar">
                <span />
                <span />
                <span />
                <p>vandan@portfolio:~</p>
              </div>
              <div className="terminal-body">
                <p>
                  <span className="prompt">$</span> profile --proof-first
                </p>
                <dl>
                  <div>
                    <dt>Titan</dt>
                    <dd>12.8M matches/sec</dd>
                  </div>
                  <div>
                    <dt>Parameter Golf</dt>
                    <dd>1.2392 / rank 20</dd>
                  </div>
                  <div>
                    <dt>Vajra</dt>
                    <dd>Raft + WAL + HNSW</dd>
                  </div>
                  <div>
                    <dt>WorldQuant</dt>
                    <dd>Gold / IQC top 20%</dd>
                  </div>
                </dl>
                <p className="terminal-status">
                  <span className="status-dot" /> open_to: systems / applied_ai / quant
                </p>
              </div>
            </aside>
          </div>

          <div className="proof-strip" aria-label="Quick facts">
            <div>
              <strong>8.8 / 10</strong>
              <span>CGPA</span>
            </div>
            <div>
              <strong>12.8M</strong>
              <span>matches / sec</span>
            </div>
            <div>
              <strong>10.9MB</strong>
              <span>compressed LM</span>
            </div>
            <div>
              <strong>Gold</strong>
              <span>WorldQuant BRAIN</span>
            </div>
          </div>
        </section>

        <section className="section-shell about" id="about" aria-labelledby="about-title">
          <SectionHeading
            eyebrow="00 / About"
            title="Engineering depth, research range."
            id="about-title"
          />
          <div className="about-grid">
            <p className="about-statement">
              I am a second-year B.Tech student at VIT Pune, focused on understanding hard
              systems from first principles and then proving the result with benchmarks,
              failure tests, or reproducible artifacts.
            </p>
            <div className="about-details">
              <p>
                My current targets are systems engineering, applied AI research, and
                quantitative research roles.
              </p>
              <p>
                I am open to high-intensity internships at AI labs such as Anthropic and
                Google DeepMind, and at infrastructure or HFT teams where performance is a
                product requirement.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell" id="awards" aria-labelledby="awards-title">
          <SectionHeading
            eyebrow="01 / Competitions & Awards"
            title="External signal, earned under competition."
            copy="The strongest evidence first: global rankings, research progression, and quantitative work."
            id="awards-title"
          />
          <div className="awards-grid">
            {awards.map((award) => {
              const content = (
                <>
                  <div className="award-topline">
                    <span className="award-index">{award.index}</span>
                    <span className="rank-badge">{award.badge}</span>
                  </div>
                  <p className="card-kicker">{award.subtitle}</p>
                  <h3>{award.title}</h3>
                  <p>{award.detail}</p>
                  <ul className="metric-list" aria-label={`${award.title} highlights`}>
                    {award.metrics.map((metric) => (
                      <li key={metric}>{metric}</li>
                    ))}
                  </ul>
                  {award.href && (
                    <span className="card-link">
                      View repository <ArrowIcon />
                    </span>
                  )}
                </>
              );

              return award.href ? (
                <a
                  className="award-card"
                  href={award.href}
                  target="_blank"
                  rel="noreferrer"
                  key={award.title}
                >
                  {content}
                </a>
              ) : (
                <article className="award-card" key={award.title}>
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-shell" id="projects" aria-labelledby="projects-title">
          <SectionHeading
            eyebrow="02 / Selected Projects"
            title="Built from the hot path outward."
            copy="Every project card exposes the stack, the measurable result, and the repository."
            id="projects-title"
          />

          <article className="stack-callout">
            <div>
              <p className="card-kicker">Unified fault-tolerant stack</p>
              <h3>Titan -&gt; Vajra</h3>
            </div>
            <p>
              Titan fill events feed directly into Vajra for real-time pattern recognition:
              two Raft clusters operating as one systems stack, joining deterministic
              execution with distributed memory.
            </p>
          </article>

          <div className="projects-grid">
            {projects.map((project) => (
              <article
                className={`project-card ${project.featured ? "project-featured" : ""}`}
                key={project.name}
              >
                <div className="project-heading">
                  <div>
                    {project.label && <span className="research-label">{project.label}</span>}
                    <p className="card-kicker">{project.kind}</p>
                    <h3>{project.name}</h3>
                  </div>
                  <a
                    className="repo-link"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.name} repository on GitHub`}
                  >
                    GitHub <ArrowIcon />
                  </a>
                </div>

                <p className="project-description">{project.description}</p>

                <ul className="project-stats" aria-label={`${project.name} key statistics`}>
                  {project.stats.map((stat) => (
                    <li key={stat}>{stat}</li>
                  ))}
                </ul>

                <ul className="project-highlights">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>

                <div className="tag-list" aria-label={`${project.name} technologies`}>
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell" id="research" aria-labelledby="research-title">
          <SectionHeading
            eyebrow="03 / Research & Patents"
            title="Published work beyond the repository."
            id="research-title"
          />
          <div className="research-grid">
            <article className="research-card">
              <div className="research-type">
                <span>Patent</span>
                <strong>Published 2026</strong>
              </div>
              <h3>GreenLoop</h3>
              <p>
                An IoT-enabled smart composting unit using ESP32 hardware and temperature,
                humidity, and weight sensors to monitor the composting process.
              </p>
              <div className="tag-list">
                <span>ESP32</span>
                <span>IoT</span>
                <span>Embedded Systems</span>
                <span>Sustainability</span>
              </div>
            </article>
            <article className="research-card">
              <div className="research-type">
                <span>Paper</span>
                <strong>iJRASET / Vol. 12 / Nov 2025</strong>
              </div>
              <h3>Predictive Cursor System</h3>
              <p>
                Published research on a predictive cursor system, combining interaction
                design with applied machine learning and technical evaluation.
              </p>
              <div className="tag-list">
                <span>Applied ML</span>
                <span>HCI</span>
                <span>Prediction</span>
                <span>Research Writing</span>
              </div>
            </article>
          </div>
        </section>

        <section className="section-shell" id="skills" aria-labelledby="skills-title">
          <SectionHeading
            eyebrow="04 / Capabilities"
            title="A stack organized by the problems it solves."
            id="skills-title"
          />
          <div className="skills-grid">
            {skillGroups.map(([group, skills]) => (
              <article className="skill-group" key={group}>
                <h3>{group}</h3>
                <ul>
                  {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell contact-section" id="contact" aria-labelledby="contact-title">
          <p className="eyebrow">05 / Contact</p>
          <h2 id="contact-title">Bring me the problem that needs benchmarks, traces, and rigor.</h2>
          <p>
            Open to high-intensity internships in systems engineering, applied AI research,
            quantitative research, infrastructure, and HFT.
          </p>
          <div className="contact-actions">
            <a className="button button-primary" href={links.email}>
              Email me <ArrowIcon />
            </a>
            <a className="button button-secondary" href={links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="button button-secondary" href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Vandan Sharma / Pune / Built for pressure.</p>
        <nav aria-label="Footer navigation">
          <a href={links.email}>Email</a>
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={links.credly} target="_blank" rel="noreferrer">
            Credly
          </a>
        </nav>
      </footer>
    </>
  );
}
