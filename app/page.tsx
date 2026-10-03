import Link from "next/link";
import Experience from "@/components/Experience";
import InlineLaboratory from "@/components/InlineLaboratory";
import { type SceneId } from "@/components/lab-state";
import { projects, supporting, profile } from "@/lib/projects";

export default function Home() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://vandan-portfolio-website.vercel.app",
    sameAs: [profile.github, profile.linkedin],
    jobTitle: "Systems and Applied AI Engineer",
  };
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\\u003c"),
        }}
      />
      <Experience>
        <section
          className="chapter hero"
          id="specimen"
          aria-labelledby="hero-title"
        >
          <div className="chapter-copy">
            <p className="eyebrow">
              <span className="status-light" /> A FIELD GUIDE TO INVISIBLE
              SYSTEMS
            </p>
            <h1 id="hero-title">
              Engineering
              <br />
              the{" "}
              <em>
                invisible<span className="hero-period">.</span>
              </em>
            </h1>
            <p className="hero-intro">
              I’m Vandan. I build systems that connect,
              <br className="desktop-break" /> communicate, and reason under
              constraints.
            </p>
            <div className="hero-index" aria-label="Five selected projects">
              <span>05</span>
              <p>
                DISTRIBUTED SYSTEMS / PHYSICAL SIGNALS
                <br />
                <strong>Adaptive computation.</strong>
              </p>
            </div>
            <div className="hero-actions">
              <a className="primary-link" href="#indra">
                Enter the laboratory <span>↘</span>
              </a>
              <Link className="secondary-link" href="/research">
                View research ↗
              </Link>
            </div>
            <Link className="acceptance-note" href="/research">
              <span className="acceptance-icon">↗</span>
              <span>
                <strong>Whisper-Net · WiCOMM 2026</strong>
                <span>Accepted at an IEEE conference · Paper 161</span>
              </span>
            </Link>
          </div>
          <InlineLaboratory id="specimen" />
          <div className="hero-baseline">
            <span>01 — 05 / SELECTED SYSTEMS</span>
            <span>SCROLL TO EXPLORE ↓</span>
            <span>INTERACTIVE BY DESIGN</span>
          </div>
        </section>
        {projects.map((project, i) => (
          <section
            className="chapter project-chapter"
            id={project.slug}
            key={project.slug}
            aria-labelledby={`${project.slug}-title`}
          >
            <div className="chapter-copy">
              <p className="eyebrow">
                <span className="chapter-number">0{i + 1}</span>{" "}
                {project.discipline.toUpperCase()}
              </p>
              <div className="project-name">{project.name}</div>
              <h2 id={`${project.slug}-title`}>
                {project.headline.split("\n").map((line, j) => (
                  <span key={line} className={j === 1 ? "soft-line" : ""}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="chapter-summary">{project.summary}</p>
              <div className="technology-list">
                {project.technologies.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <p className="evidence-status">
                <span className="status-light" />
                {project.status}
              </p>
              <Link className="case-link" href={`/work/${project.slug}`}>
                Read the case study <span>↗</span>
              </Link>
              <div className="chapter-footnote">
                <span>WHAT TO EXPLORE</span>
                <p>
                  {
                    [
                      "Disconnect the bridge. Inspect a peer. Watch what stays local.",
                      "Follow a sample message through five transformations.",
                      "Change the channel. Compare the incident and recovered traces.",
                      "Challenge an observation. See when the system abstains.",
                      "Compare the experiments. Keep each benchmark in its own context.",
                    ][i]
                  }
                </p>
              </div>
            </div>
            <InlineLaboratory id={project.slug as SceneId} />
          </section>
        ))}
      </Experience>
      <section id="more-work" className="wide-section supporting-section">
        <div className="section-heading">
          <p className="eyebrow">06 / FURTHER EXPLORATIONS</p>
          <h2>
            A wider field
            <br />
            of experiments.
          </h2>
          <p>
            From native inference to mobile sensing.
            <br />A selection from the workbench.
          </p>
        </div>
        <div className="supporting-list">
          {supporting.map((p, i) => (
            <Link
              href={`/work#${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="supporting-row"
              key={p.name}
            >
              <span className="row-number">0{i + 1}</span>
              <h3>{p.name}</h3>
              <span>{p.area}</span>
              <span className="row-arrow">↗</span>
            </Link>
          ))}
        </div>
        <Link className="case-link" href="/work">
          Explore the complete selection <span>↗</span>
        </Link>
      </section>
      <section className="wide-section research-feature" id="research">
        <div>
          <p className="eyebrow">RESEARCH / WiCOMM 2026</p>
          <h2>
            From the lab.
            <br />
            <em>Into the conversation.</em>
          </h2>
          <p>
            Whisper-Net has been accepted at WiCOMM 2026, an IEEE conference. An
            acoustic communications investigation, built and written with a
            six-author team.
          </p>
          <Link className="case-link" href="/research">
            Read the research <span>↗</span>
          </Link>
        </div>
        <div
          className="paper-object"
          aria-label="Whisper-Net accepted research paper"
        >
          <span className="paper-rule" />
          <span className="paper-identifier">IEEE CONFERENCE / PAPER 161</span>
          <h3>WhisperNet</h3>
          <p>
            Covert near-ultrasonic
            <br />
            software-defined acoustic
            <br />
            communication.
          </p>
          <span className="paper-status">↗ ACCEPTED · WiCOMM 2026</span>
          <span className="paper-date">RESEARCH MANUSCRIPT / 2026</span>
        </div>
      </section>
      <section className="wide-section closing-section" id="contact">
        <p className="eyebrow">ABOUT / THE NEXT QUESTION</p>
        <h2>
          Built with curiosity.
          <br />
          Tested against reality.
        </h2>
        <div className="closing-grid">
          <p>
            I’m a CSE student focused on AI & ML at VIT Pune. My work spans Rust
            infrastructure, communication systems, and experiments in machine
            reasoning. I’m drawn to problems where the constraints shape the
            design.
          </p>
          <div>
            <p className="contact-label">Have a difficult problem in mind?</p>
            <a className="contact-link" href={`mailto:${profile.email}`}>
              Let’s explore it. ↗
            </a>
            <Link className="secondary-link" href="/about">
              More about me →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
