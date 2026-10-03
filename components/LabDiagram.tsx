import { useId } from "react";
import { sceneLabels, type LabState, type SceneId } from "./lab-state";

export default function LabDiagram({
  id,
  state,
  select,
}: {
  id: SceneId;
  state: LabState;
  select: (i: number) => void;
}) {
  const labels = sceneLabels[id];
  const key = useId().replace(/:/g, "");
  const positions =
    id === "indra"
      ? [
          [110, 120],
          [210, 80],
          [180, 250],
          [420, 110],
          [500, 220],
          [370, 270],
        ]
      : id === "karyaphala"
        ? [
            [100, 180],
            [230, 100],
            [230, 260],
            [380, 180],
            [510, 180],
          ]
        : labels.map((_, i) => [95 + (i * 410) / (labels.length - 1), 180]);
  return (
    <svg
      className="lab-diagram"
      viewBox="0 0 600 360"
      aria-label={`${id} interactive diagram`}
    >
      <defs>
        <pattern
          id={`grid-${key}`}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path d="M30 0H0V30" fill="none" stroke="#25313a" strokeWidth=".5" />
        </pattern>
        <linearGradient id={`fill-${key}`}>
          <stop stopColor="#1e343e" />
          <stop offset="1" stopColor="#101820" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill={`url(#grid-${key})`} opacity=".4" />
      {positions.slice(1).map(([x, y], i) => (
        <path
          key={i}
          d={`M${positions[i][0]},${positions[i][1]} L${x},${y}`}
          stroke={
            id === "indra" && state.mode && i === 2 ? "#e9af5c" : "#6acddd"
          }
          strokeWidth="1"
          strokeDasharray={
            id === "indra" && state.mode && i === 2 ? "5 8" : "0"
          }
          opacity=".6"
        />
      ))}
      {id === "lithos" &&
        [90, 270].map((y, k) => (
          <path
            key={y}
            d={Array.from(
              { length: 120 },
              (_, i) =>
                `${i === 0 ? "M" : "L"}${60 + i * 4},${(y + Math.sin(i * 0.32) * (k ? 12 + state.value * 0.16 : 20) + Math.sin(i * 1.4) * state.value * (k ? 0.08 : 0.32)).toFixed(3)}`,
            ).join(" ")}
            fill="none"
            stroke={k ? "#e9af5c" : "#6acddd"}
          />
        ))}
      {positions.map(([x, y], i) => (
        <g
          key={i}
          transform={
            id === "specimen"
              ? `translate(0,${((i - 1.5) * state.value * 0.65).toFixed(2)})`
              : undefined
          }
          onClick={() => select(i)}
          className="diagram-node"
          style={{ cursor: "pointer" }}
        >
          <circle
            cx={x}
            cy={y}
            r={state.selected === i ? 28 : 22}
            fill={`url(#fill-${key})`}
            stroke={state.selected === i ? "#e9af5c" : "#6acddd"}
          />
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill="#e6ece8"
            fontSize="12"
            fontFamily="monospace"
          >
            {String(i + 1).padStart(2, "0")}
          </text>
          <text
            x={x}
            y={y + 51}
            textAnchor="middle"
            fill="#a7b6bc"
            fontSize="11"
          >
            {labels[i]}
          </text>
        </g>
      ))}
      {id === "karyaphala" && state.mode > 0 && (
        <text x="300" y="327" textAnchor="middle" fill="#e9af5c" fontSize="12">
          {state.mode === 1 ? "DISPUTED BRANCH" : "CAUSAL ANALYSIS: ABSTAIN"}
        </text>
      )}
      {id === "dcpa-praxis" && (
        <text x="300" y="300" textAnchor="middle" fill="#e9af5c" fontSize="12">
          {
            [
              "CURATED · 20/20",
              "OFFICIAL TASKS · 0/30",
              "INTERNAL MICROWORLDS · 59/60",
            ][state.mode]
          }
        </text>
      )}
    </svg>
  );
}
