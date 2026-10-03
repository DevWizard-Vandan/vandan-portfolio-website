"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import { profile } from "@/lib/projects";

const MotionContext = createContext({ reduced: true });
export const useMotionPreference = () => useContext(MotionContext);

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(true);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("lab-motion");
    } catch {
      /* Storage is optional. */
    }
    setReduced(saved ? saved === "reduced" : query.matches);
    const change = () => {
      try {
        if (!localStorage.getItem("lab-motion")) setReduced(query.matches);
      } catch {
        setReduced(query.matches);
      }
    };
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);
  function toggleMotion() {
    const next = !reduced;
    setReduced(next);
    try {
      localStorage.setItem("lab-motion", next ? "reduced" : "full");
    } catch {
      /* Keep the current session preference. */
    }
  }
  return (
    <MotionContext.Provider value={{ reduced }}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Vandan Sharma — home">
          <span className="brand-monogram">
            VS<span>↗</span>
          </span>
          <span className="brand-caption">
            VANDAN SHARMA<span>SYSTEMS & APPLIED AI</span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className={menu ? "main-nav is-open" : "main-nav"}
        >
          <Link href="/work" onClick={() => setMenu(false)}>
            Selected work
          </Link>
          <Link href="/research" onClick={() => setMenu(false)}>
            Research
            <span className="nav-dot" />
          </Link>
          <Link href="/about" onClick={() => setMenu(false)}>
            About
          </Link>
          <a href={`mailto:${profile.email}`} onClick={() => setMenu(false)}>
            Contact ↗
          </a>
        </nav>
        <div className="header-controls">
          <button
            className="motion-button"
            onClick={toggleMotion}
            aria-pressed={reduced}
            aria-label={`Reduced motion ${reduced ? "on" : "off"}. Toggle motion preference.`}
          >
            <span className="motion-icon">◒</span>
            <span>Motion: {reduced ? "reduced" : "full"}</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label="Toggle navigation"
          >
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <Link href="/" className="footer-name">
          Vandan Sharma<span>Building systems. Asking better questions.</span>
        </Link>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href="/Vandan-Sharma-Resume.pdf">Résumé ↗</a>
          <a href="#main">Back to top ↑</a>
        </div>
        <span className="footer-note">
          © {new Date().getFullYear()} · Designed as an experiment in clarity.
        </span>
      </footer>
    </MotionContext.Provider>
  );
}
