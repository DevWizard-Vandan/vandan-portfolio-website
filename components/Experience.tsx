"use client";
import { useEffect, useRef, useState } from "react";
import Laboratory from "./Laboratory";
import { type SceneId } from "./lab-state";
import { useMotionPreference } from "./SiteShell";
import {
  chapterIds,
  chapterTitles,
  journeyAt,
  type JourneySnapshot,
} from "./journey";

const chapters = chapterIds;
export default function Experience({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<SceneId>("specimen");
  const [visible, setVisible] = useState(true);
  const [desktop, setDesktop] = useState(false);
  const { reduced } = useMotionPreference();
  const progress = useRef(0.5);
  const journey = useRef<JourneySnapshot>(journeyAt(0, 0));
  const experience = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 901px)");
    const resize = () => setDesktop(query.matches);
    resize();
    query.addEventListener("change", resize);
    return () => query.removeEventListener("change", resize);
  }, []);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const line = window.innerHeight * 0.16;
      let next = chapters[0];
      for (const id of chapters) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) next = id;
      }
      for (const id of chapters)
        document
          .getElementById(id)
          ?.setAttribute("data-current", String(id === next));
      const rect = document.getElementById(next)?.getBoundingClientRect();
      progress.current = rect
        ? Math.max(0, Math.min(1, (line - rect.top) / rect.height))
        : 0.5;
      journey.current = journeyAt(chapters.indexOf(next), progress.current);
      window.dispatchEvent(new Event("portfolio:journey"));
      experience.current?.style.setProperty(
        "--focus",
        String(reduced || !desktop ? 0 : journey.current.focus),
      );
      experience.current?.style.setProperty(
        "--travel",
        String(reduced ? 0 : journey.current.travel),
      );
      experience.current?.setAttribute(
        "data-passage",
        journey.current.travel > 0.15
          ? "transit"
          : journey.current.focus > 0.5
            ? "inspect"
            : "arrive",
      );
      experience.current?.setAttribute(
        "data-copy-hidden",
        String(!reduced && desktop && journey.current.focus > 0.92),
      );
      if (meter.current)
        meter.current.style.setProperty(
          "--journey",
          String((chapters.indexOf(next) + progress.current) / chapters.length),
        );
      setActive(next);
      setVisible(
        (document.getElementById("more-work")?.getBoundingClientRect().top ??
          Infinity) >
          window.innerHeight * 0.25,
      );
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [desktop, reduced]);
  return (
    <div
      className="experience"
      ref={experience}
      data-chapter={active}
      data-copy={chapters.indexOf(active) % 2 ? "right" : "left"}
    >
      <div
        className={`journey-meter ${visible ? "" : "stage-hidden"}`}
        ref={meter}
        aria-hidden="true"
      >
        <i />
      </div>
      <aside
        className={`world-stage ${visible ? "" : "stage-hidden"}`}
        aria-label="Interactive project laboratory"
        inert={!visible}
      >
        {desktop && (
          <Laboratory
            id={active}
            progress={progress}
            journey={journey}
            paused={!visible}
          />
        )}
      </aside>
      <nav
        className={`chapter-rail ${visible ? "" : "stage-hidden"}`}
        aria-label="Portfolio chapters"
        inert={!visible}
      >
        {chapters.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`${String(i).padStart(2, "0")} ${id === "specimen" ? "Introduction" : id}`}
            aria-current={active === id ? "location" : undefined}
          >
            <span>{String(i).padStart(2, "0")}</span>
            <i />
          </a>
        ))}
      </nav>
      <div
        className={`journey-caption ${visible ? "" : "stage-hidden"}`}
        aria-hidden="true"
      >
        <span className="journey-title">
          {String(chapters.indexOf(active)).padStart(2, "0")} /{" "}
          {chapterTitles[chapters.indexOf(active)]}
        </span>
        <span className="journey-next">
          APPROACHING /{" "}
          {chapterTitles[Math.min(5, chapters.indexOf(active) + 1)]}
        </span>
        <span className="journey-prompt">
          <i>↓</i> SCROLL TO MOVE THROUGH THE LAB
        </span>
      </div>
      {children}
    </div>
  );
}
