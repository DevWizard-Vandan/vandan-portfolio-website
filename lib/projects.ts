export type Project = {
  slug: string;
  name: string;
  discipline: string;
  headline: string;
  summary: string;
  status: string;
  technologies: string[];
  question: string;
  approach: string;
  architecture: string[];
  evidence: string;
  boundary: string;
  takeaway: string;
  links: { label: string; href: string }[];
};

export const profile = {
  name: "Vandan Sharma",
  email: "vandan.sharma06@gmail.com",
  github: "https://github.com/DevWizard-Vandan",
  linkedin: "https://www.linkedin.com/in/vandan-sharma-682536330/",
};

export const projects: Project[] = [
  {
    slug: "indra",
    name: "INDRA",
    discipline: "Distributed systems",
    headline: "Connection is optional.\nConsistency isn’t.",
    summary:
      "A local-first replication system built to preserve signed operations through disconnection—and reconcile them when the network returns.",
    status: "Implemented prototype",
    technologies: ["Rust", "CRDTs", "Merkle trees", "Ed25519"],
    question:
      "What happens to a system when connectivity stops being an assumption?",
    approach:
      "INDRA separates local durability from network availability. Operations are signed, persisted, and associated with causal state. Peers compare Merkle structures to discover differences instead of exchanging the entire history.",
    architecture: [
      "Signed operations · Ed25519 + BLAKE3",
      "Local durability · SQLite WAL",
      "Causal state · clocks + CRDTs",
      "Reconciliation · radix-16 Merkle structure",
      "Transport · opportunistic peer exchange",
    ],
    evidence:
      "The repository contains eight Rust crates, replication and transport implementations, a reproducible demo, an architecture document, and an explicit limitations report. The evidence manifest records historical tests; this portfolio does not reinterpret them as production deployment results.",
    boundary:
      "The merchant settlement demonstration uses a mock institutional switch. Offline recording does not imply offline financial finality. Local socket, web, and Bluetooth experiments have distinct scopes; no live banking deployment is claimed.",
    takeaway:
      "A useful distributed system explains not only how data converges, but which guarantees survive a partition.",
    links: [
      {
        label: "Technical brief · PDF",
        href: "/evidence/indra-technical-brief.pdf",
      },
      { label: "Architecture · SVG", href: "/evidence/indra-architecture.svg" },
    ],
  },
  {
    slug: "whisper-net",
    name: "Whisper-Net",
    discipline: "Communications research",
    headline: "A message.\nHidden in sound.",
    summary:
      "A near-ultrasonic acoustic communication system combining layered encryption, adaptive modulation, error correction, and psychoacoustic masking.",
    status: "Accepted · WiCOMM 2026",
    technologies: ["Python", "DSP", "OFDM / FSK", "Reed–Solomon"],
    question:
      "Can ordinary speakers and microphones form a software-defined acoustic link?",
    approach:
      "Follow a message from plaintext into encryption, packet framing and forward error correction, then through modulation and acoustic masking. At the receiver, synchronization and decoding reverse the transformation. The interaction here illustrates that pipeline without requesting microphone access or playing sound.",
    architecture: [
      "Message · layered encryption",
      "Packet · framing + forward error correction",
      "Waveform · adaptive modulation",
      "Acoustic channel · psychoacoustic masking",
      "Receiver · synchronization + decoding",
    ],
    evidence:
      "The research paper was accepted at WiCOMM 2026, an IEEE conference, as Paper 161. The acceptance notification, IEEE electronic copyright agreement, and presentation registration were checked during the October 2026 audit. The source materials also include protocol code, interface materials, a generated signal spectrogram, and a demonstration recording.",
    boundary:
      "Acceptance is distinct from presentation and IEEE Xplore publication. Those later milestones are not claimed here. Some benchmark plots are generated from analytical models, and performance figures vary between drafts; they are not presented as independently reproduced hardware measurements.",
    takeaway:
      "Research becomes more legible when the signal path, measurement method, and publication status are all visible.",
    links: [
      {
        label: "Read accepted manuscript · PDF",
        href: "/evidence/whisper-net-paper.pdf",
      },
    ],
  },
  {
    slug: "lithos",
    name: "LITHOS",
    discipline: "Adaptive signal processing",
    headline: "Learn the channel.\nRecover the signal.",
    summary:
      "An adaptive physical-medium modem exploring channel sounding, synchronization, equalization, and reliable decoding under distortion.",
    status: "Simulation + WAV loopback",
    technologies: ["Python", "BPSK", "MMSE / DFE", "Viterbi"],
    question:
      "How do you communicate through a medium whose response you do not yet know?",
    approach:
      "LITHOS treats calibration as part of communication. A sounding signal estimates the channel; synchronization compensates for offset; equalization mitigates distortion; interleaving and decoding recover the packet. The lab control below changes an illustrative channel, not a measured physical medium.",
    architecture: [
      "Sounding · estimate the impulse response",
      "Synchronization · timing + carrier offset",
      "Equalization · LS / LMMSE + MMSE DFE",
      "Recovery · interleaving + Viterbi decoding",
      "Validation · persisted WAV + packet CRC",
    ],
    evidence:
      "The inspected source contains implemented signal-processing stages, simulated channel experiments, acoustic sounding tools, and persisted WAV artifacts. The latest progress record describes a simulated steel-channel loopback with a valid packet CRC.",
    boundary:
      "The available result is simulation and WAV loopback. Hardware preparation is documented, but successful physical transmission through steel has not been established by the reviewed material. The interactive model is qualitative and does not predict throughput or bit error rate.",
    takeaway:
      "The channel is something to identify and adapt to, not an inconvenient detail to hide.",
    links: [],
  },
  {
    slug: "karyaphala",
    name: "Kāryaphala",
    discipline: "Evidence + causal systems",
    headline: "Trace the consequence.\nQuestion the evidence.",
    summary:
      "A signed evidence pipeline with causal analysis, dispute handling, and an explicit ability to abstain when the evidence is insufficient.",
    status: "Synthetic reference workflow",
    technologies: ["Rust", "Python", "Evidence DAGs", "Causal inference"],
    question:
      "How can a system preserve provenance without confusing integrity with truth?",
    approach:
      "Kāryaphala collects events into a durable, signed evidence structure and connects actions, obligations, and outcomes. A separate causal engine evaluates evidence and can abstain when confounding, clock skew, or insufficient controls undermine a conclusion.",
    architecture: [
      "Collection · write-ahead log",
      "Provenance · Merkle commitments + Ed25519",
      "Relationships · evidence DAG",
      "Analysis · difference-in-differences + synthetic control",
      "Resolution · disputes, abstention, and dossiers",
    ],
    evidence:
      "The inspected implementation includes signing and evidence collection, a causal engine with explicit abstention rules, and a synthetic reference workflow. The reviewed rule set uses a p-value threshold of 0.009, at least 30 controls, and a 500 ms clock-skew bound; these are implementation choices, not universal statistical guarantees.",
    boundary:
      "The workflow uses synthetic data. The trusted execution environment is modelled rather than a demonstrated production enclave. A valid signature establishes provenance and integrity; it does not establish causality, legal admissibility, or correctness of the original observation.",
    takeaway:
      "Sometimes the most trustworthy answer a system can return is: there is not enough evidence.",
    links: [],
  },
  {
    slug: "dcpa-praxis",
    name: "DCPA → PRAXIS",
    discipline: "Program synthesis research",
    headline: "When search fails,\nchange the representation.",
    summary:
      "A research progression from proof-directed program search to representation learning in bounded, interactive microworlds.",
    status: "Research prototypes",
    technologies: [
      "Rust",
      "Program synthesis",
      "Grammar learning",
      "Microworlds",
    ],
    question: "Is faster search enough if the right abstraction is missing?",
    approach:
      "DCPA investigates adaptive synthesis and pruning. Its results exposed a gap between curated examples and official tasks. PRAXIS explores the next question: can interaction help form reusable representations before a system searches for a solution?",
    architecture: [
      "DCPA · candidate grammars + proof-directed pruning",
      "Evaluation · curated and official tasks kept separate",
      "Research pivot · identify representation bottlenecks",
      "PRAXIS · bounded interaction + abstraction formation",
      "Holdout · controlled internal microworld episodes",
    ],
    evidence:
      "Historical DCPA artifacts report 20 of 20 curated tasks solved, but 0 of 30 official tasks in the inspected battery. PRAXIS internal holdout records show 3/60 for baseline A, 40/60 for C, and 59/60 for D; oracle B scored 60/60. These are separate experiments with different task settings.",
    boundary:
      "The PRAXIS scorecard concerns internal microworld episodes, not the official ARC benchmark or general intelligence. Historical records have not been rerun for this portfolio. Mock and live experiments remain distinct.",
    takeaway:
      "A failed benchmark can be a useful result when it changes the next experiment.",
    links: [],
  },
];

export const supporting = [
  {
    name: "TRIYANTRA",
    area: "Native inference",
    text: "Ternary-weight bitplanes and lookup-table kernels across CPU architectures.",
    status: "Software implementation",
    scope:
      "Native software kernels; performance depends on the CPU architecture and benchmark configuration.",
  },
  {
    name: "Advaita",
    area: "Hardware-aware AI",
    text: "Analog inference feasibility explored with hardware-aware simulation.",
    status: "Simulation",
    scope:
      "AIHWKit-based feasibility research, with simulated hardware behavior rather than fabricated silicon.",
  },
  {
    name: "MAHAKAL",
    area: "Efficient computation",
    text: "Quantized computation with software measurements and RTL exploration.",
    status: "Software + RTL research",
    scope:
      "Software measurements and RTL exploration are distinct from measured silicon energy results.",
  },
  {
    name: "Titan + Vajra",
    area: "Systems infrastructure",
    text: "A Rust matching engine and an archived replicated vector database.",
    status: "Implemented prototypes",
    scope:
      "Evidence comes from software implementations and synthetic workloads.",
  },
  {
    name: "MATRA",
    area: "Mobile perception",
    text: "Android RAW-sensor presentation attack detection and native inference.",
    status: "Research prototype",
    scope:
      "Evaluation is limited to the available RGB and RAW data; broader deployment remains an open validation step.",
  },
  {
    name: "Siren-Zip",
    area: "Neural compression",
    text: "Audio compression experiments with explicit reconstruction-quality checks.",
    status: "Experimental",
    scope:
      "Compression targets remain experimental; reconstruction quality and size reductions are evaluated separately.",
  },
];

export const coauthors = [
  "Om Tundurwar",
  "Aksh Upase",
  "Vandan Sharma",
  "Shashwat Upadhyay",
  "Prathamesh Upase",
  "Kanchan Wankhade",
];
export const paperTitle =
  "WhisperNet: A Covert Near-Ultrasonic Software-Defined Acoustic Communication System with Layered Encryption, Adaptive Modulation, and Psychoacoustic Masking";
