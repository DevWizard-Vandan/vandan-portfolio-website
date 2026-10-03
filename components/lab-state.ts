export type SceneId =
  | "specimen"
  | "indra"
  | "whisper-net"
  | "lithos"
  | "karyaphala"
  | "dcpa-praxis";
export type LabState = {
  selected: number;
  value: number;
  mode: number;
  angle: number;
};
export const sceneNames: Record<SceneId, string> = {
  specimen: "System specimen",
  indra: "Partition laboratory",
  "whisper-net": "Acoustic pipeline",
  lithos: "Channel laboratory",
  karyaphala: "Evidence laboratory",
  "dcpa-praxis": "Representation laboratory",
};
export const sceneLabels: Record<SceneId, string[]> = {
  specimen: ["Persistence", "Signals", "Evidence", "Representations"],
  indra: ["Peer A", "Peer B", "Peer C", "Peer D", "Peer E", "Peer F"],
  "whisper-net": [
    "Plaintext",
    "Encryption",
    "Framing + FEC",
    "Modulation",
    "Receiver",
  ],
  lithos: ["Incident signal", "Unknown medium", "Recovered signal"],
  karyaphala: [
    "Obligation",
    "Action",
    "Observation",
    "Outcome",
    "Causal analysis",
  ],
  "dcpa-praxis": ["Observation", "Candidate program", "Abstraction"],
};
export function initialLabState(id: SceneId): LabState {
  return {
    selected: 0,
    value: id === "specimen" ? 65 : id === "lithos" ? 35 : 0,
    mode: 0,
    angle: 0,
  };
}
export function labStatus(id: SceneId, state: LabState): string {
  const selected = sceneLabels[id][state.selected] || sceneLabels[id][0];
  if (id === "specimen")
    return `${selected} layer selected. Separation: ${state.value}%. Rotate or select another layer to inspect the system.`;
  if (id === "indra")
    return state.mode
      ? `${selected} retains a signed local operation. The bridge is disconnected; cross-partition updates are queued.`
      : `${selected} is connected. Merkle reconciliation discovers differences and exchanges missing signed operations.`;
  if (id === "whisper-net")
    return [
      "Sample message: HELLO. This is the input before any transformation.",
      "Encrypted payload: ciphertext replaces the readable message. This illustration does not perform cryptography.",
      "Framing and forward error correction structure the packet for recovery.",
      "The encoded packet becomes an acoustic waveform. Sound is not required for this illustration.",
      "The receiver synchronizes, demodulates, and decodes the message.",
    ][state.selected];
  if (id === "lithos")
    return `${selected} selected. Illustrative distortion: ${state.value}%. ${state.value > 75 ? "High distortion leaves residual error; recovery is not guaranteed." : "The equalized trace illustrates partial compensation for a changing channel."}`;
  if (id === "karyaphala")
    return state.mode === 1
      ? "Conflicting observation added. The evidence branch is disputed; a signature does not settle which observation is true."
      : state.mode === 2
        ? "Insufficient controls. The causal engine abstains rather than asserting an unsupported relationship."
        : `${selected} selected. Signed provenance preserves the record; causal confidence requires separate analysis.`;
  return [
    "DCPA curated battery: 20/20 solved. Historical artifacts; curated task setting.",
    "DCPA official-task battery: 0/30 solved. Pruning did not close the representation gap.",
    "PRAXIS internal microworld holdout: D 59/60, C 40/60, baseline A 3/60, oracle B 60/60. Different setting; not an ARC result.",
  ][state.mode];
}
