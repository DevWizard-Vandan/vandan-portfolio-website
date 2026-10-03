"use client";
import Link from "next/link";
import { useState } from "react";
import { projects, supporting } from "@/lib/projects";
const categories = ["All", "Systems", "Signals", "AI + synthesis"];
export default function ProjectIndex() {
  const [category, setCategory] = useState("All");
  const filtered = projects.filter(
    (p) =>
      category === "All" ||
      (category === "Systems" && ["indra", "karyaphala"].includes(p.slug)) ||
      (category === "Signals" && ["whisper-net", "lithos"].includes(p.slug)) ||
      (category === "AI + synthesis" && p.slug === "dcpa-praxis"),
  );
  return (
    <>
      <div className="index-filter" role="group" aria-label="Filter projects">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
        <span aria-live="polite">{filtered.length} investigations</span>
      </div>
      <div className="project-index">
        {filtered.map((p) => (
          <Link href={`/work/${p.slug}`} className="index-project" key={p.slug}>
            <div>
              <span className="eyebrow">{p.discipline}</span>
              <h2>{p.name}</h2>
              <p>{p.summary}</p>
              <div className="technology-list">
                {p.technologies.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <span className="index-status">
              {p.status}
              <span>↗</span>
            </span>
          </Link>
        ))}
      </div>
      <section className="index-supporting">
        <p className="eyebrow">FURTHER EXPLORATIONS</p>
        <h2>From the workbench.</h2>
        {supporting.map((p) => (
          <details
            key={p.name}
            id={p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          >
            <summary>
              <span>{p.name}</span>
              <span>{p.area}</span>
              <span className="detail-plus">+</span>
            </summary>
            <div>
              <p>{p.text}</p>
              <p className="evidence-status">{p.status}</p>
              <p className="muted">{p.scope}</p>
            </div>
          </details>
        ))}
      </section>
    </>
  );
}
