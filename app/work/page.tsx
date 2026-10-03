import type { Metadata } from "next";
import ProjectIndex from "@/components/ProjectIndex";
export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Five flagship systems and a wider selection of experiments in infrastructure, communications, evidence, and applied AI.",
};
export default function Work() {
  return (
    <main id="main" className="document-page">
      <div className="document-hero">
        <p className="eyebrow">THE WORKBENCH / SELECTED PROJECTS</p>
        <h1>
          Systems worth
          <br />
          <em>looking inside.</em>
        </h1>
        <p>
          Five detailed investigations. A wider field of experiments. Each with
          its own scope, evidence, and unanswered questions.
        </p>
      </div>
      <ProjectIndex />
    </main>
  );
}
