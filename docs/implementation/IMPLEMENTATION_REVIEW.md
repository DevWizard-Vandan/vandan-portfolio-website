# Portfolio rebuild — implementation review

Completed 3 October 2026, following the 2 October discovery audit. Local production preview: http://localhost:3000.

## Second visual iteration

The refinement follows the request for a more ambitious experience. All six procedural specimens were rebuilt around a tangible laboratory vocabulary: machined assemblies, glass, contact arrays, chips, optical rings, and signal conduits. The hero now occupies substantially more of the desktop stage; its controls use a compact two-column dock. Selected-component labels, a continuous scroll meter, pale mint typography, and restrained chapter entrances connect the visual system.

INDRA has six glass peer enclosures with visible compute cores and signed-operation stacks. Disconnecting splits the groups and removes their bridge. Whisper-Net uses five acoustic modules with different waveform representations and a highlighted message path. LITHOS is a cutaway metal channel with smooth incident, distorted, and partially compensated traces. Kāryaphala presents sealed evidence nodes, a disputed branch, and an abstention state. DCPA/PRAXIS uses raised representation trays whose patterns change with the selected experiment.

Camera framing is tailored to the model, with bounded scroll travel and subtle pointer parallax. Dragging rotates the assembly while reusing its geometry. Only the current chapter and its neighbors are mounted in the shared world. A reflection environment is generated locally once per canvas; no external HDR image is downloaded. Object clicks select actual geometry; background clicks do not advance selection, and dragging does not change the selected component.

## Delivered experience

### Third iteration: scroll through the laboratory

The previous side-stage presentation did not communicate enough depth. The desktop canvas now fills the viewport. Six rooms sit 18 world units apart, with specimens alternating left and right. Native scrolling moves the camera from an arrival frame into a closer inspection passage, then forward through the room to the next specimen. The camera and target positions meet continuously at chapter boundaries, and reverse scrolling retraces the path.

Project copy stays readable during arrival, clears the inspection passage, and returns before departure. Keyboard focus restores the relevant copy. Controls remain in a fixed dock opposite the text. Platforms and portals are navigation targets; model components retain actual raycast selection and drag rotation. The scroll meter and destination caption provide orientation without scroll interception.

The section controller explicitly requests a render after updating the journey reference, preventing a single scroll event from leaving the camera at its previous position. Camera damping uses elapsed time with a 120 ms cap so devices below 25 fps do not suffer the earlier exaggerated settling delay. At rest, rendering stops. Mobile uses local experiment panels with bounded scroll orbit and dolly; reduced motion removes these movements while retaining direct navigation and interactive controls.

The homepage includes an inspectable four-layer specimen and five project experiments. Every 3D presentation supports object selection and horizontal drag rotation, with equivalent keyboard and touch controls.

- **INDRA:** inspect six peers, partition the network, and reconnect. Operation/provenance explanations stay explicit about the mock settlement scope.
- **Whisper-Net:** follow a sample message through plaintext, encryption, framing/FEC, modulation, and the receiver. The accepted paper, complete coauthor credit, and verified status timeline are available.
- **LITHOS:** vary an illustrative distorted channel and inspect incident, medium, and recovered traces. Simulation and WAV loopback are distinguished from physical transmission.
- **Kāryaphala:** inspect the evidence graph, add a contradiction, or demonstrate causal abstention.
- **DCPA → PRAXIS:** compare curated DCPA, official-task DCPA, and internal PRAXIS microworld settings without conflating their benchmarks.

Nine content routes provide the homepage, work index, five case studies, research, and about/contact. Supporting projects have useful technical descriptions and individual evidence scope. Metadata, a social preview, favicon, sitemap, 404 page, public manuscript, architecture diagram, and technical brief are included.

## Performance and resilience

The final stack is Next.js 16.3.8, React, TypeScript, Three.js/Fiber, local Geist fonts, and plain CSS. Native scroll and one camera controller replace the originally proposed GSAP/Lenis layer; the spatial journey does not require an additional animation library.

All content routes are prerendered. The production HTML references approximately **186 KiB of initial JavaScript after gzip**, with approximately **222 KiB of WebGL code in a separate lazy bundle**. These are local build-payload measurements, not field-performance scores. Exact measurements and methodology are in `build-payload.json`.

The renderer runs on demand, caps pixel ratio at 1.5, and uses procedural geometry without external model downloads, shadows, or a postprocessing chain. Mobile keeps the experiment's layout and state while releasing an offscreen canvas. Reduced motion removes camera travel and settling; save-data starts in 2D. Context loss preserves the HTML experiment and SVG diagram, and offers an explicit retry. Static case-study reading and research downloads work without JavaScript.

## Validation

The final production build, TypeScript check, formatting check, and dependency audit passed. The dependency audit reported zero vulnerabilities at completion.

**16 browser tests passed** on the third iteration in the local Microsoft Edge test environment (2.1 minutes), covering:

1. All content routes, evidence downloads, metadata files, and unknown-project 404s.
2. Useful case-study content and paper links without JavaScript.
3. Actual 3D object picking, drag rotation, keyboard slider adjustment, and a state-preserving 2D/3D round trip.
4. INDRA partition/reconnection and state across desktop chapters.
5. All remaining project experiments and research presets.
6. WebGL context loss, the retained interactive fallback, and retry.
7. Project filtering and supporting-project disclosures.
8. Reduced-motion preference and persistence through reload.
9. Mobile navigation, retained experiment state, stable scene height, and bounded canvas count.
10. Horizontal-overflow checks at 320, 390, 768, 1024, and 1280 px across the principal layouts.
11. Touch-device peer inspection and native slider adjustment, including a 44 px slider target.
12. Automated WCAG-tagged accessibility checks across all nine routes at 390 px.
13. The same checks at 1280 px.
14. Full-motion camera transitions and all five project experiments at a compact 1024 × 768 desktop viewport, including visible controls, changed rendered output, canvas height, and absence of browser exceptions.
15. Camera and look-target continuity at all five chapter boundaries, including the expanded hero specimen.
16. Native wheel scrolling at 1280 × 800: camera approach and lateral travel, full-viewport canvas, text clearing during inspection, forward travel into INDRA, a usable partition control, reverse travel, return to the arrival position, and rendering stopping at rest. This test records the walkthrough video.

The automated scans found no violations in their checked rules. They complement the manual desktop/mobile visual review; they are not an accessibility certification or a claim about every browser/device combination.

## Evidence and publication state

Whisper-Net is correctly shown as **accepted at WiCOMM 2026, an IEEE conference, Paper 161**. The acceptance notification, IEEE electronic agreement, and presentation-registration confirmation were reviewed. Presentation and IEEE Xplore publication are separate milestones. Private correspondence is not copied into the site.

Unauthenticated GitHub API checks returned 404 for the configured INDRA and Whisper-Net repository remotes. Those public project links were omitted. The public GitHub profile and local PDF/SVG evidence remain available. No public source URLs were invented for local projects.

The existing résumé download was preserved. Project results are identified by evidence type and historical scope. The portfolio remains a local, reviewable production build; it has not been published to a hosting provider.

## Review assets

The third iteration is recorded in `desktop-arrival-v3.jpg`, `desktop-inspection-v3.jpg`, and `desktop-indra-v3.jpg`, showing arrival, close inspection, and the next room. `scroll-journey-v3.webm` records native scrolling, camera approach, forward travel, an INDRA interaction, and reverse travel in the software-rendered browser test environment. `mobile-hero-v3.jpg` and `mobile-experiment-v3.jpg` record the phone-size review; its temporary viewport override was reset afterwards. Earlier screenshots, the original audit, content strategy, storyboard, and generated concept remain available for comparison.
