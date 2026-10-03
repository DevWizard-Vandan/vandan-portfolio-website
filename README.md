# Vandan Sharma — interactive systems portfolio

A complete portfolio rebuild based on an audit of the local Projects and ASEP collections. The homepage is a scroll-driven laboratory with six interactive 3D scenes, backed by five readable case studies, a project index, research status, and an about/contact page.

## Run locally

```powershell
npm ci
npm run dev
```

For the production version:

```powershell
npm run build
npm run start
```

Set `NEXT_PUBLIC_SITE_URL` before building for a different production domain. No API keys, external fonts, microphone access, or external services are required.

## Stack and architecture

- Next.js App Router, React, TypeScript, locally hosted Geist fonts.
- Three.js and React Three Fiber, loaded in a separate browser-only bundle.
- Native scrolling drives a full-screen journey through a shared 3D world. Six specimens alternate across rooms spaced along the depth axis. Each chapter has arrival, close inspection, and departure phases; scrolling backwards retraces the path. The implementation uses no additional animation/scroll library.
- Demand rendering: frames run for interaction and camera settling, then stop at rest. Pixel ratio is capped at 1.5; geometry is procedural, with no model downloads, real-time shadows, or postprocessing chain.
- Machined/glass specimens, instanced contacts, smooth signal conduits, and a locally generated studio reflection map form the visual vocabulary. Rotation reuses geometry; the shared scene mounts only the current chapter and its neighbors. Interactive room portals provide spatial navigation. Project text alternates sides and clears the close inspection passage; keyboard focus restores readable text. Desktop controls remain available in a fixed dock.
- On mobile, scenes mount near the visible chapter and release their canvas when they leave it. Reduced motion removes camera travel and animated settling. Save-data starts in 2D. Every model has equivalent HTML controls and an interactive SVG fallback.
- Static HTML for every page, explicit evidence scope, complete research coauthor credit, and no private acceptance correspondence in public assets.

## Edit content

`lib/projects.ts` contains project copy, status, technologies, limitations, profile details, and evidence links. `components/lab-state.ts` contains the accessible interaction explanations. Public research and architecture artifacts live in `public/evidence`.

`components/SpecimenModels.tsx` contains the six procedural models. `components/journey.ts` defines the continuous camera path; `ChapterArchitecture.tsx` supplies clickable room platforms and portals. `InteractiveScene.tsx` manages framing, lighting, scroll travel, pointer parallax, and rotation. Keep every visible model part selectable through its parent group and preserve the equivalent HTML controls when changing geometry.

Whisper-Net is presented as **accepted at WiCOMM 2026, an IEEE conference, Paper 161**. The reviewed materials establish acceptance, the IEEE agreement, and presentation registration; presentation and IEEE Xplore publication remain separate milestones. Revisit the status before updating those claims.

INDRA and Whisper-Net repository remotes were checked with the unauthenticated GitHub API on 2 October 2026 and returned 404. Public project repository links are omitted; the public profile and local manuscript/architecture evidence remain available. Other private/local prototypes do not receive invented repository URLs.

## Validation

```powershell
npm run typecheck
npm run format:check
npm run test:e2e
```

Build before the browser tests. The test configuration uses locally installed Microsoft Edge by default; set `PLAYWRIGHT_CHANNEL` to another installed Playwright channel if needed. All 16 checks passed on the third iteration. Tests cover continuous chapter boundaries, native forward/reverse camera travel, text clearing during inspection, rendering stopping at rest, all routes and evidence files, JavaScript-disabled reading, object picking and drag, keyboard controls, all project experiments, retained state through 2D/3D switches, WebGL context loss, mobile navigation, filters, reduced-motion preference, responsive overflow, and automated accessibility scans at mobile and desktop sizes. The scroll test saves a local walkthrough video under `docs/implementation`.

Discovery sources, project selection, and the visual concept are in `docs/portfolio-discovery`. Implementation notes and measured build payloads are in `docs/implementation`. Screenshots are development evidence, not a claim of a deployed public site.
