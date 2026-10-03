import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/projects";
export const metadata: Metadata = {
  title: "About",
  description:
    "Vandan Sharma — CSE (AI & ML) student at VIT Pune, exploring distributed systems, physical signals, and adaptive computation.",
};
export default function About() {
  return (
    <main id="main" className="document-page about-page">
      <div className="document-hero">
        <p className="eyebrow">VANDAN SHARMA / PUNE, INDIA</p>
        <h1>
          Curious about
          <br />
          <em>what holds up.</em>
        </h1>
        <p>
          I build systems and investigate the assumptions underneath them—from
          networks that disconnect to signals that distort and models that need
          better representations.
        </p>
      </div>
      <section className="about-grid">
        <div className="about-coordinate">
          <span className="eyebrow">CURRENTLY</span>
          <h2>CSE · AI & ML</h2>
          <p>
            Vishwakarma Institute of Technology, Pune
            <br />
            Expected graduation · 2028
          </p>
          <span className="eyebrow">ENGINEERING FOCUS</span>
          <p>
            Distributed infrastructure
            <br />
            Applied signal processing
            <br />
            Evidence and causal systems
            <br />
            Program synthesis & representation learning
          </p>
        </div>
        <div>
          <h2>Build. Inspect. Revise.</h2>
          <p>
            I’m interested in engineering where a constraint changes the
            architecture: connectivity, compute, noise, uncertainty, or an
            incomplete representation of the problem.
          </p>
          <p>
            That interest runs through INDRA, Whisper-Net, LITHOS, Kāryaphala,
            and DCPA → PRAXIS. Some are implemented prototypes; others are
            controlled research experiments. The distinction matters.
          </p>
          <p>
            Whisper-Net is collaborative research with a six-author team,
            accepted at WiCOMM 2026.
          </p>
          <p>
            This website is also a systems exercise: make a complex idea
            interactive, keep the text readable, and make the experience useful
            when motion or 3D is unavailable.
          </p>
          <Link className="case-link" href="/work">
            Look inside the work <span>↗</span>
          </Link>
        </div>
      </section>
      <section className="about-contact">
        <p className="eyebrow">LET’S TALK</p>
        <h2>
          Bring a hard problem.
          <br />
          We’ll start with a question.
        </h2>
        <a className="email-link" href={`mailto:${profile.email}`}>
          {profile.email} ↗
        </a>
        <div className="evidence-links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href="/Vandan-Sharma-Resume.pdf">Download résumé ↗</a>
        </div>
      </section>
    </main>
  );
}
