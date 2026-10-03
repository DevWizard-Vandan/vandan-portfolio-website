"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import { useMotionPreference } from "./SiteShell";
import LabDiagram from "./LabDiagram";
import { type JourneySnapshot } from "./journey";
import {
  initialLabState,
  labStatus,
  sceneLabels,
  sceneNames,
  type LabState,
  type SceneId,
} from "./lab-state";

const Scene = dynamic(() => import("./InteractiveScene"), {
  ssr: false,
  loading: () => (
    <div className="scene-initializing">
      <span className="status-light" />
      OPENING THE LABORATORY
    </div>
  ),
});
class SceneBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function Laboratory({
  id,
  progress,
  journey,
  compact = false,
  paused = false,
}: {
  id: SceneId;
  progress?: React.RefObject<number>;
  journey?: React.RefObject<JourneySnapshot>;
  compact?: boolean;
  paused?: boolean;
}) {
  const { reduced } = useMotionPreference();
  const [records, setRecords] = useState<Partial<Record<SceneId, LabState>>>(
    {},
  );
  const state = records[id] || initialLabState(id);
  const [webgl, setWebgl] = useState(false);
  const [flat, setFlat] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  function checkWebGL() {
    try {
      const canvas = document.createElement("canvas"),
        gl = canvas.getContext("webgl2");
      if (gl) {
        setWebgl(true);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return;
      }
    } catch {
      /* Keep the interactive diagram available. */
    }
    setWebgl(false);
  }
  useEffect(() => {
    if (paused || ready) return;
    checkWebGL();
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) setFlat(true);
    setReady(true);
  }, [paused, ready]);
  const update = useCallback(
    (patch: Partial<LabState>) => {
      setRecords((current) => ({
        ...current,
        [id]: { ...(current[id] || initialLabState(id)), ...patch },
      }));
    },
    [id],
  );
  const select = useCallback(
    (selected: number) => update({ selected }),
    [update],
  );
  const rotate = useCallback((angle: number) => update({ angle }), [update]);
  const fail = useCallback(() => setWebgl(false), []);
  const fallback = <LabDiagram id={id} state={state} select={select} />;
  const is3d = ready && webgl && !flat && !paused;
  return (
    <div
      className={`laboratory ${compact ? "lab-compact" : ""}`}
      ref={ref}
      data-scene={id}
      data-renderer={is3d ? "3d" : "2d"}
    >
      <div className="lab-topline">
        <span>
          <i className="status-light" /> {sceneNames[id]}
        </span>
        <div className="lab-view-actions">
          <button
            className="text-button"
            onClick={() => update(initialLabState(id))}
          >
            Reset ↺
          </button>
          <button
            className="text-button"
            onClick={() => {
              if (!webgl) {
                checkWebGL();
                setFlat(false);
              } else setFlat(!flat);
            }}
            aria-pressed={flat}
          >
            {is3d ? "2D view" : webgl ? "3D view" : "Retry 3D"} ↗
          </button>
        </div>
      </div>
      <div className="lab-viewport" aria-hidden="true">
        <div className="specimen-hud">
          <span className="hud-index">
            {String(state.selected + 1).padStart(2, "0")}
          </span>
          <span>
            <small>SELECTED COMPONENT</small>
            {sceneLabels[id][state.selected]}
          </span>
          <i />
        </div>
        <span className="specimen-coordinate">
          {id === "specimen"
            ? "SYSTEM / EXPLODED VIEW"
            : "SYSTEM / INSPECTION VIEW"}
        </span>
        {is3d ? (
          <SceneBoundary fallback={fallback}>
            <Scene
              id={id}
              state={state}
              reduced={reduced}
              paused={paused}
              progress={progress}
              journey={journey}
              select={select}
              rotate={rotate}
              onFailure={fail}
            />
          </SceneBoundary>
        ) : (
          fallback
        )}
      </div>
      <div className="specimen-tag">
        <span>
          {id === "specimen"
            ? "FIG. 00 / SYSTEM SPECIMEN"
            : `FIG. 0${["indra", "whisper-net", "lithos", "karyaphala", "dcpa-praxis"].indexOf(id) + 1} / INTERACTIVE MODEL`}
        </span>
        <span>
          {is3d
            ? "DRAG TO ROTATE · SELECT TO INSPECT"
            : "SELECT A COMPONENT BELOW"}
        </span>
      </div>
      <div className="lab-controls">
        <div className="control-heading">
          <span>Explore the mechanism</span>
          <span className="control-marker">↘</span>
        </div>
        <div
          className="component-picker"
          role="group"
          aria-label={`Inspect ${sceneNames[id]} components`}
        >
          {sceneLabels[id].map((label, i) => (
            <button
              key={label}
              onClick={() => update({ selected: i })}
              aria-pressed={state.selected === i}
            >
              {id === "specimen" ? (
                label
              ) : (
                <>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </>
              )}
            </button>
          ))}
        </div>
        {(id === "specimen" || id === "lithos") && (
          <label className="range-control">
            <span>
              {id === "specimen" ? "Layer separation" : "Channel distortion"}
              <strong>{state.value}%</strong>
            </span>
            <input
              aria-label={
                id === "specimen" ? "Layer separation" : "Channel distortion"
              }
              type="range"
              min="0"
              max="100"
              step="5"
              value={state.value}
              onChange={(e) => update({ value: Number(e.target.value) })}
            />
          </label>
        )}
        {id === "indra" && (
          <button
            className="experiment-button"
            onClick={() => update({ mode: state.mode ? 0 : 1 })}
          >
            {state.mode ? "Reconnect peers ↔" : "Disconnect the bridge ⤯"}
          </button>
        )}
        {id === "whisper-net" && (
          <button
            className="experiment-button"
            onClick={() => update({ selected: (state.selected + 1) % 5 })}
          >
            Follow the message →
          </button>
        )}
        {id === "karyaphala" && (
          <div className="experiment-options">
            <button
              onClick={() => update({ mode: state.mode === 1 ? 0 : 1 })}
              aria-pressed={state.mode === 1}
            >
              Add contradiction
            </button>
            <button
              onClick={() => update({ mode: state.mode === 2 ? 0 : 2 })}
              aria-pressed={state.mode === 2}
            >
              Insufficient evidence
            </button>
          </div>
        )}
        {id === "dcpa-praxis" && (
          <div
            className="experiment-options"
            role="group"
            aria-label="Research experiment"
          >
            {["DCPA: curated", "DCPA: official", "PRAXIS: internal"].map(
              (label, mode) => (
                <button
                  key={label}
                  aria-pressed={state.mode === mode}
                  onClick={() => update({ mode })}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        )}
        <p className="lab-readout" aria-live="polite" aria-atomic="true">
          {labStatus(id, state)}
        </p>
        <div className="lab-bottomline">
          <span>ILLUSTRATIVE MODEL · NOT A LIVE BENCHMARK</span>
          {is3d && (
            <div>
              <button
                aria-label="Rotate model left"
                onClick={() => update({ angle: state.angle - 0.3 })}
              >
                ↶
              </button>
              <button
                aria-label="Rotate model right"
                onClick={() => update({ angle: state.angle + 0.3 })}
              >
                ↷
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
