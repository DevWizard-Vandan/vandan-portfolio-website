import type { Metadata } from "next";
import Link from "next/link";
import { coauthors, paperTitle, profile } from "@/lib/projects";
export const metadata: Metadata = {
  title: "Research",
  description:
    "Whisper-Net — accepted at WiCOMM 2026, an IEEE conference. Manuscript, coauthors, research context, and verified publication status.",
};
export default function Research() {
  return (
    <main id="main" className="document-page research-page">
      <div className="document-hero">
        <p className="eyebrow">RESEARCH / SIGNALS & SYSTEMS</p>
        <h1>
          Questions that
          <br />
          <em>leave the lab.</em>
        </h1>
        <p>
          Research with a visible signal path, a defined measurement scope, and
          a clear account of what comes next.
        </p>
      </div>
      <section className="research-paper">
        <div className="research-paper-heading">
          <span className="acceptance-pill">ACCEPTED / IEEE CONFERENCE</span>
          <span className="eyebrow">WiCOMM 2026 · PAPER 161</span>
          <h2>{paperTitle}</h2>
          <p className="authors">{coauthors.join(" · ")}</p>
        </div>
        <div className="paper-abstract">
          <p>
            Whisper-Net investigates covert near-ultrasonic communication using
            commodity audio hardware. The design combines layered encryption,
            adaptive modulation, error correction, and psychoacoustic masking in
            a software-defined acoustic pipeline.
          </p>
          <p>
            The manuscript and source provide the technical story. Reported
            performance depends on the configuration and evidence type;
            analytical plots are distinguished from hardware measurements.
          </p>
          <div className="evidence-links">
            <a className="primary-link" href="/evidence/whisper-net-paper.pdf">
              Read the manuscript <span>↗</span>
            </a>
            <Link className="case-link" href="/work/whisper-net">
              Explore the system <span>↗</span>
            </Link>
            <a className="secondary-link" href={`mailto:${profile.email}`}>
              Discuss the research ↗
            </a>
          </div>
        </div>
      </section>
      <section className="research-status">
        <p className="eyebrow">VERIFIED STATUS / 02 OCTOBER 2026</p>
        <ol>
          <li>
            <span>10 SEP</span>
            <div>
              <h3>Paper accepted</h3>
              <p>
                The Microsoft CMT notification confirms acceptance of Paper 161
                at WiCOMM 2026.
              </p>
            </div>
            <span className="timeline-mark">✓</span>
          </li>
          <li>
            <span>30 SEP</span>
            <div>
              <h3>IEEE agreement completed</h3>
              <p>
                The electronic copyright agreement identifies WiCOMM2026-161 and
                the six-author research team.
              </p>
            </div>
            <span className="timeline-mark">✓</span>
          </li>
          <li>
            <span>01 OCT</span>
            <div>
              <h3>Presentation registration confirmed</h3>
              <p>
                The organizer’s registration confirmation was included in the
                evidence review.
              </p>
            </div>
            <span className="timeline-mark">✓</span>
          </li>
          <li className="pending">
            <span>NEXT</span>
            <div>
              <h3>Presentation & publication</h3>
              <p>
                Acceptance is established. Presentation and IEEE Xplore
                publication are not yet asserted by the reviewed materials.
              </p>
            </div>
            <span className="timeline-mark">○</span>
          </li>
        </ol>
        <p className="audit-date">
          Status records were checked privately. Personal correspondence is not
          exposed on this website.
        </p>
      </section>
      <section className="case-text-section">
        <p className="eyebrow">CONTINUING QUESTIONS</p>
        <div>
          <h2>Other research directions.</h2>
          <p>
            Adaptive communication in LITHOS. Evidence-aware causal systems in
            Kāryaphala. Representation formation in DCPA → PRAXIS. Each
            investigation has its own evidence and limitations.
          </p>
          <Link className="case-link" href="/work">
            Browse the investigations <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
