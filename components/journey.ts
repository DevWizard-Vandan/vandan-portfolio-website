import { type SceneId } from "./lab-state";

export type Vec3 = [number, number, number];
export const chapterIds: SceneId[] = [
  "specimen",
  "indra",
  "whisper-net",
  "lithos",
  "karyaphala",
  "dcpa-praxis",
];
export const chapterTitles = [
  "The invisible system",
  "INDRA",
  "Whisper-Net",
  "LITHOS",
  "Kāryaphala",
  "DCPA → PRAXIS",
];
export type JourneySnapshot = {
  index: number;
  phase: number;
  focus: number;
  travel: number;
};
export const specimenPosition = (index: number): Vec3 => [
  index % 2 ? -2.35 : 2.35,
  0,
  -index * 18,
];
const clamp = (x: number) => Math.max(0, Math.min(1, x));
export function smooth(a: number, b: number, x: number) {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
export function journeyAt(index: number, phase: number): JourneySnapshot {
  const p = clamp(phase);
  return {
    index,
    phase: p,
    focus: smooth(0.28, 0.48, p) * (1 - smooth(0.68, 0.84, p)),
    travel: index < 5 ? smooth(0.76, 1, p) : 0,
  };
}
// Scroll is the time axis. These positions form a continuous route between specimens.
export function cameraPose(
  journey: JourneySnapshot,
  reduced: boolean,
  separation = 65,
) {
  const { index, phase, focus, travel } = journey;
  const [x, , z] = specimenPosition(index);
  const [, , nextZ] = specimenPosition(Math.min(5, index + 1));
  if (reduced)
    return {
      camera: [0, 1.8, z + 10.2 + Math.max(0, separation - 65) * 0.025] as Vec3,
      target: [0, 0, z] as Vec3,
      pitch: 0.14,
      yaw: -0.32,
    };
  const orbit = Math.sin(phase * Math.PI * 2) * (1 - travel);
  const detail = focus * (1 - travel);
  const camera: Vec3 = [
    x * detail * 0.84 + orbit * 0.48,
    1.8 - detail * 0.9 + orbit * 0.22,
    z +
      (nextZ - z) * travel +
      10.2 -
      detail * 2.7 +
      Math.max(0, separation - 65) * 0.025 * (1 - travel),
  ];
  const target: Vec3 = [
    x * detail * 0.88,
    detail * 0.1,
    z + (nextZ - z) * travel,
  ];
  return {
    camera,
    target,
    pitch: 0.14 + detail * 0.08,
    yaw: -0.32 + orbit * 0.38 + detail * (index % 2 ? 0.3 : -0.3),
  };
}
