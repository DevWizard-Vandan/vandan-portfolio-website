import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Laboratory from "@/components/Laboratory";
import { type SceneId } from "@/components/lab-state";
import { projects, coauthors } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project?.name || "Project", description: project?.summary };
}
export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const index = projects.indexOf(project),
    next = projects[(index + 1) % projects.length];
  return (
    <main id="main" className="document-page case-study">
      <div className="document-hero">
        <Link className="back-link" href="/work">
          ← Selected work
        </Link>
        <p className="eyebrow">
          0{index + 1} / {project.discipline}
        </p>
        <h1>{project.name}</h1>
        <p className="case-headline">{project.headline.replace("\n", " ")}</p>
        <div className="case-meta">
          <span className="evidence-status">
            <i className="status-light" />
            {project.status}
          </span>
          <div className="technology-list">
            {project.technologies.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="case-introduction">
        <h2>{project.question}</h2>
        <p>{project.summary}</p>
      </div>
      <section className="case-lab" aria-labelledby="experiment-heading">
        <div className="case-section-heading">
          <p className="eyebrow">01 / INTERACTIVE EXPLANATION</p>
          <h2 id="experiment-heading">Open the mechanism.</h2>
          <p>
            A small model to explore the idea. All object interactions have
            equivalent controls below.
          </p>
        </div>
        <Laboratory id={project.slug as SceneId} compact />
      </section>
      <section className="case-text-section">
        <p className="eyebrow">02 / SYSTEM DESIGN</p>
        <div>
          <h2>How it fits together.</h2>
          <p>{project.approach}</p>
          <ol className="architecture-list">
            {project.architecture.map((step, i) => (
              <li key={step}>
                <span>0{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="case-text-section">
        <p className="eyebrow">03 / EVIDENCE</p>
        <div>
          <h2>What the materials establish.</h2>
          <p>{project.evidence}</p>
          {slug === "whisper-net" && (
            <>
              <p className="credit-label">Research coauthors</p>
              <p>{coauthors.join(" · ")}</p>
              <Link className="secondary-link" href="/research">
                Publication status and manuscript →
              </Link>
            </>
          )}
          {project.links.length > 0 && (
            <div className="evidence-links">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  className="case-link"
                  href={link.href}
                  target={link.href.startsWith("https") ? "_blank" : undefined}
                  rel={link.href.startsWith("https") ? "noreferrer" : undefined}
                >
                  {link.label}
                  <span>↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="case-text-section boundary-section">
        <p className="eyebrow">04 / SCOPE & LIMITATIONS</p>
        <div>
          <h2>Where the claim stops.</h2>
          <p>{project.boundary}</p>
          <p className="audit-date">
            Evidence reviewed · October 2026. Historical results are identified
            as such; this portfolio is not a new benchmark run.
          </p>
        </div>
      </section>
      <blockquote className="takeaway">“{project.takeaway}”</blockquote>
      <div className="next-project">
        <span className="eyebrow">NEXT INVESTIGATION</span>
        <Link href={`/work/${next.slug}`}>
          {next.name}
          <span>↗</span>
        </Link>
      </div>
    </main>
  );
}
