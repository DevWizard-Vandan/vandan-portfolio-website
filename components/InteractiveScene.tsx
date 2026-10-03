"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  Specimen,
  Network,
  Acoustic,
  Channel,
  Evidence,
  Synthesis,
} from "./SpecimenModels";
import { initialLabState, type LabState, type SceneId } from "./lab-state";
import ChapterArchitecture from "./ChapterArchitecture";
import { cameraPose, specimenPosition, type JourneySnapshot } from "./journey";

const CYAN = "#86e0e2",
  AMBER = "#efb66e";
type Select = (index: number) => void;
const models = {
  specimen: memo(Specimen),
  indra: memo(Network),
  "whisper-net": memo(Acoustic),
  lithos: memo(Channel),
  karyaphala: memo(Evidence),
  "dcpa-praxis": memo(Synthesis),
};
const sceneIds = Object.keys(models) as SceneId[];
const initialStates = Object.fromEntries(
  sceneIds.map((scene) => [scene, initialLabState(scene)]),
) as Record<SceneId, LabState>;
const framing: Record<SceneId, number> = {
  specimen: 7.3,
  indra: 8,
  "whisper-net": 8,
  lithos: 8.2,
  karyaphala: 8,
  "dcpa-praxis": 7.6,
};

// A locally generated studio reflection map: no HDR download or idle rendering.
function Studio() {
  const { gl, scene, invalidate } = useThree();
  useLayoutEffect(() => {
    const studio = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const target = generator.fromScene(studio, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.55;
    studio.dispose();
    generator.dispose();
    invalidate();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}
function ContextMonitor({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useLayoutEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}
function World({
  id,
  state,
  reduced,
  paused,
  progress,
  journey,
  select,
  onReady,
  aim,
}: {
  id: SceneId;
  state: LabState;
  reduced: boolean;
  paused: boolean;
  progress?: React.RefObject<number>;
  journey?: React.RefObject<JourneySnapshot>;
  select: Select;
  onReady: () => void;
  aim: React.RefObject<[number, number]>;
}) {
  const root = useRef<THREE.Group>(null);
  const prepared = useRef(false);
  const lookAt = useRef(new THREE.Vector3());
  const targetCamera = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const { invalidate, gl } = useThree();
  // Rotation changes the assembly transform, never its individual geometries.
  const modelState = useMemo(
    () => ({
      selected: state.selected,
      value: state.value,
      mode: state.mode,
      angle: 0,
    }),
    [state.selected, state.value, state.mode],
  );
  const navigation = useMemo(
    () =>
      Object.fromEntries(
        sceneIds.map((scene) => [
          scene,
          (_index: number): void => {
            document
              .getElementById(scene)
              ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
          },
        ]),
      ) as Record<SceneId, Select>,
    [reduced],
  );
  useEffect(() => {
    invalidate();
  }, [id, state, reduced, invalidate]);
  useEffect(() => {
    if (paused) return;
    const refresh = () => invalidate();
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("portfolio:journey", refresh);
    return () => {
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("portfolio:journey", refresh);
    };
  }, [invalidate, paused]);
  useEffect(() => {
    if (paused || reduced) return;
    const refresh = () => invalidate();
    const element = gl.domElement.parentElement;
    element?.addEventListener("pointermove", refresh);
    element?.addEventListener("pointerleave", refresh);
    return () => {
      element?.removeEventListener("pointermove", refresh);
      element?.removeEventListener("pointerleave", refresh);
    };
  }, [gl, invalidate, paused, reduced]);
  useFrame((frame, delta) => {
    if (!root.current) return;
    // Preserve time-based camera response when a device renders below 25 fps.
    delta = Math.min(delta, 0.12);
    const index = journey ? sceneIds.indexOf(id) : 0;
    const inlinePhase = progress?.current ?? 0.5;
    const inlineOrbit = progress && !reduced ? inlinePhase - 0.5 : 0;
    const pose = journey
      ? cameraPose(
          journey.current,
          reduced,
          id === "specimen" ? state.value : 65,
        )
      : {
          camera: [
            inlineOrbit * 0.3,
            1.8 + inlineOrbit * 0.65,
            framing[id] -
              Math.abs(inlineOrbit) * 0.55 +
              (id === "specimen" ? Math.max(0, state.value - 65) * 0.025 : 0),
          ] as [number, number, number],
          target: [0, 0, 0] as [number, number, number],
          pitch: 0.18 + inlineOrbit * 0.2,
          yaw: -0.34 + inlineOrbit * 0.75,
        };
    targetCamera.current.set(...pose.camera);
    targetLook.current.set(...pose.target);
    if (!reduced) {
      targetCamera.current.x += aim.current[0] * 0.16;
      targetCamera.current.y += aim.current[1] * 0.1;
    }
    let unsettled =
      frame.camera.position.distanceTo(targetCamera.current) > 0.002 ||
      lookAt.current.distanceTo(targetLook.current) > 0.002;
    const snap = reduced || !prepared.current;
    if (snap) {
      frame.camera.position.copy(targetCamera.current);
      lookAt.current.copy(targetLook.current);
    } else {
      for (const axis of ["x", "y", "z"] as const) {
        frame.camera.position[axis] = THREE.MathUtils.damp(
          frame.camera.position[axis],
          targetCamera.current[axis],
          7,
          delta,
        );
        lookAt.current[axis] = THREE.MathUtils.damp(
          lookAt.current[axis],
          targetLook.current[axis],
          7,
          delta,
        );
      }
    }
    frame.camera.lookAt(lookAt.current);
    root.current.children.forEach((child) => {
      const active = child.userData.index === index;
      const yaw = active ? state.angle + pose.yaw : -0.32;
      const pitch = active ? pose.pitch : 0.14;
      unsettled ||=
        Math.abs(child.rotation.y - yaw) > 0.002 ||
        Math.abs(child.rotation.x - pitch) > 0.002;
      if (snap) child.rotation.set(pitch, yaw, 0);
      else {
        child.rotation.x = THREE.MathUtils.damp(
          child.rotation.x,
          pitch,
          8,
          delta,
        );
        child.rotation.y = THREE.MathUtils.damp(
          child.rotation.y,
          yaw,
          8,
          delta,
        );
      }
    });
    // The attributes describe the actual rendered camera, not the scroll target.
    gl.domElement.dataset.cameraZ = frame.camera.position.z.toFixed(3);
    gl.domElement.dataset.cameraX = frame.camera.position.x.toFixed(3);
    gl.domElement.dataset.renderPhase =
      unsettled && !snap ? "settling" : "idle";
    gl.domElement.dataset.renderFrame = String(gl.info.render.frame);
    if (unsettled && !reduced && !paused) invalidate();
    if (!prepared.current) {
      prepared.current = true;
      onReady();
    }
  });
  const ids: SceneId[] = journey
    ? [
        "specimen",
        "indra",
        "whisper-net",
        "lithos",
        "karyaphala",
        "dcpa-praxis",
      ]
    : [id];
  const activeIndex = journey ? ids.indexOf(id) : 0;
  const [activeX, , activeZ] = journey
    ? specimenPosition(activeIndex)
    : [0, 0, 0];
  return (
    <>
      <Studio />
      {journey && <fogExp2 attach="fog" args={["#080d12", 0.018]} />}
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#bce0e7", "#0f1720", 0.8]} />
      <directionalLight position={[3, 5, 4]} intensity={3.4} color="#e8f1ee" />
      <pointLight
        position={[activeX - 4, 1, activeZ + 3]}
        intensity={24}
        color={CYAN}
      />
      <pointLight
        position={[activeX + 3, -2, activeZ - 1]}
        intensity={16}
        color={AMBER}
      />
      <group ref={root}>
        {ids.map((scene, i) => {
          if (Math.abs(i - activeIndex) > 1) return null;
          const Model = models[scene];
          return (
            <group
              key={scene}
              position={journey ? specimenPosition(i) : [0, 0, 0]}
              userData={{ index: i }}
            >
              <Model
                state={scene === id ? modelState : initialStates[scene]}
                select={scene === id ? select : navigation[scene]}
              />
            </group>
          );
        })}
      </group>
      {journey &&
        ids.map(
          (scene, i) =>
            Math.abs(i - activeIndex) <= 1 && (
              <ChapterArchitecture
                key={scene}
                index={i}
                navigate={(target) => navigation[sceneIds[target]](0)}
              />
            ),
        )}
    </>
  );
}
export default function InteractiveScene({
  id,
  state,
  reduced,
  paused,
  progress,
  journey,
  select,
  rotate,
  onFailure,
}: {
  id: SceneId;
  state: LabState;
  reduced: boolean;
  paused: boolean;
  progress?: React.RefObject<number>;
  journey?: React.RefObject<JourneySnapshot>;
  select: Select;
  rotate: (angle: number) => void;
  onFailure: () => void;
}) {
  const drag = useRef<{ x: number; angle: number; moved: boolean } | null>(
    null,
  );
  const [hidden, setHidden] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const aim = useRef<[number, number]>([0, 0]);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  return (
    <div
      className="canvas-interaction"
      data-ready={initialized}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        drag.current = { x: e.clientX, angle: state.angle, moved: false };
      }}
      onPointerMove={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        aim.current = [
          ((e.clientX - bounds.left) / bounds.width) * 2 - 1,
          1 - ((e.clientY - bounds.top) / bounds.height) * 2,
        ];
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        if (Math.abs(dx) > 5) drag.current.moved = true;
        if (drag.current.moved) rotate(drag.current.angle + dx * 0.006);
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
        aim.current = [0, 0];
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 1.8, 7.3], fov: 34, near: 0.1, far: 70 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        onCreated={({ raycaster, camera }) => {
          raycaster.params.Line.threshold = 0.13;
          const ids: SceneId[] = [
            "specimen",
            "indra",
            "whisper-net",
            "lithos",
            "karyaphala",
            "dcpa-praxis",
          ];
          const pose = journey
            ? cameraPose(journey.current, reduced, state.value)
            : {
                camera: [0, 1.8, framing[id]] as [number, number, number],
                target: [0, 0, 0] as [number, number, number],
              };
          camera.position.set(pose.camera[0], pose.camera[1], pose.camera[2]);
          camera.lookAt(pose.target[0], pose.target[1], pose.target[2]);
          camera.updateMatrixWorld(true);
        }}
      >
        <ContextMonitor onFailure={onFailure} />
        <World
          id={id}
          state={state}
          reduced={reduced}
          paused={paused || hidden}
          progress={progress}
          journey={journey}
          select={select}
          onReady={() => setInitialized(true)}
          aim={aim}
        />
      </Canvas>
    </div>
  );
}
