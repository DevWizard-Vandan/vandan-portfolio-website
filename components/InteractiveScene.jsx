"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (progress, start, end) => clamp((progress - start) / (end - start));
const bell = (progress, start, end) => {
  const t = range(progress, start, end);
  return Math.sin(t * Math.PI);
};

function useReducedStage() {
  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    const update = () => {
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setFallback(mobile || reduced);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return fallback;
}

function useTransparentMaterial(color, options = {}) {
  return useMemo(
    () => {
      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0,
        metalness: options.metalness ?? 0.35,
        roughness: options.roughness ?? 0.28,
        emissive: options.emissive ?? color,
        emissiveIntensity: options.emissiveIntensity ?? 0.08,
        wireframe: options.wireframe ?? false
      });

      material.userData.baseOpacity = options.opacity ?? 1;
      return material;
    },
    [color, options.emissive, options.emissiveIntensity, options.metalness, options.opacity, options.roughness, options.wireframe]
  );
}

function setGroupOpacity(group, opacity) {
  if (!group) return;
  group.traverse((child) => {
    if (!child.material) return;
    const baseOpacity = child.material.userData.baseOpacity ?? 1;
    child.material.opacity = baseOpacity * opacity;
    child.material.transparent = true;
    child.material.depthWrite = baseOpacity * opacity > 0.92;
  });
}

function Reactor({ progress }) {
  const group = useRef();
  const cradle = useRef();
  const core = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: "#dff7ff",
      transparent: true,
      opacity: 0,
      metalness: 0,
      roughness: 0.08,
      transmission: 0.72,
      thickness: 0.9,
      ior: 1.35,
      emissive: "#38bdf8",
      emissiveIntensity: 0.18
    });
    material.userData.baseOpacity = 0.32;
    return material;
  }, []);
  const innerGlow = useTransparentMaterial("#f8fafc", {
    emissive: "#f97316",
    emissiveIntensity: 0.8,
    opacity: 0.76,
    roughness: 0.18
  });
  const filament = useTransparentMaterial("#38bdf8", {
    emissive: "#38bdf8",
    emissiveIntensity: 0.7,
    opacity: 0.62,
    metalness: 0.15,
    roughness: 0.18
  });
  const amber = useTransparentMaterial("#f97316", {
    emissive: "#f97316",
    emissiveIntensity: 0.5,
    opacity: 0.48,
    roughness: 0.2
  });
  const ghost = useTransparentMaterial("#e2e8f0", {
    emissive: "#38bdf8",
    emissiveIntensity: 0.12,
    opacity: 0.16,
    wireframe: true,
    roughness: 0.5
  });
  const particles = useMemo(() => Array.from({ length: 22 }, (_, index) => index), []);

  useFrame((state, delta) => {
    const p = progress.get();
    const pointer = state.pointer;
    const opacity = 1 - range(p, 0.08, 0.17);
    setGroupOpacity(group.current, opacity);
    if (!group.current || !cradle.current) return;
    const baseX = THREE.MathUtils.lerp(1.5, 1.12, range(p, 0.02, 0.14));
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, baseX + pointer.x * 0.18, 0.06);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, pointer.y * 0.16, 0.06);
    group.current.position.z = THREE.MathUtils.lerp(0, -2.2, range(p, 0.09, 0.18));
    group.current.scale.setScalar(THREE.MathUtils.lerp(0.92, 0.62, range(p, 0.1, 0.18)));
    cradle.current.rotation.x += delta * 0.1 + pointer.y * 0.003;
    cradle.current.rotation.y += delta * 0.22 + pointer.x * 0.004;
    cradle.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.38) * 0.12 + pointer.x * 0.18;
  });

  return (
    <group ref={group} position={[0.6, 0, 0]}>
      <group ref={cradle}>
        <mesh material={core}>
          <sphereGeometry args={[0.72, 48, 48]} />
        </mesh>
        <mesh material={ghost}>
          <icosahedronGeometry args={[1.26, 2]} />
        </mesh>
        <mesh material={innerGlow}>
          <sphereGeometry args={[0.1, 24, 24]} />
        </mesh>
        {[0, 1, 2, 3].map((index) => (
          <mesh
            key={index}
            material={index % 2 === 0 ? filament : amber}
            rotation={[Math.PI / 2.4 + index * 0.48, index * 0.72, index * 0.33]}
          >
            <torusGeometry args={[1.32 + index * 0.17, 0.006, 10, 220]} />
          </mesh>
        ))}
        {particles.map((particle) => {
          const angle = particle * 0.83;
          const radius = 1.08 + (particle % 5) * 0.13;
          return (
            <mesh
              key={particle}
              material={particle % 3 === 0 ? amber : filament}
              position={[
                Math.cos(angle) * radius,
                Math.sin(particle * 1.41) * 0.84,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.018 + (particle % 4) * 0.006, 12, 12]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function TitanOrderBook({ progress }) {
  const group = useRef();
  const bids = useTransparentMaterial("#22c55e", { emissive: "#166534", emissiveIntensity: 0.24 });
  const asks = useTransparentMaterial("#f97316", { emissive: "#9a3412", emissiveIntensity: 0.24 });
  const grid = useTransparentMaterial("#334155", { wireframe: true, roughness: 0.8, emissiveIntensity: 0 });
  const bars = useMemo(() => Array.from({ length: 34 }, (_, i) => i), []);

  useFrame((state) => {
    const p = progress.get();
    const pointer = state.pointer;
    const opacity = bell(p, 0.27, 0.46);
    setGroupOpacity(group.current, opacity);
    if (!group.current) return;
    const baseX = THREE.MathUtils.lerp(-3.7, -2.2, range(p, 0.28, 0.43));
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, baseX + pointer.x * 0.16, 0.06);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -0.08 + pointer.y * 0.08, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.04 + pointer.y * 0.08, 0.05);
    group.current.rotation.y = 0.18 + Math.sin(state.clock.elapsedTime * 0.45) * 0.08 + pointer.x * 0.1;
    group.current.children.forEach((child, index) => {
      if (child.type !== "Mesh" || !child.geometry?.type?.includes("Box")) return;
      const wave = Math.sin(state.clock.elapsedTime * 3.1 + index * 0.48);
      const height = 0.35 + Math.abs(wave) * (index % 3 === 0 ? 1.6 : 1.05);
      child.scale.y = THREE.MathUtils.lerp(child.scale.y, height, 0.08);
      child.position.y = -0.72 + child.scale.y * 0.32;
    });
  });

  return (
    <group ref={group} position={[3.2, 0, 0]}>
      {bars.map((bar) => {
        const side = bar < 17 ? -1 : 1;
        const slot = bar < 17 ? bar : bar - 17;
        return (
          <mesh
            key={bar}
            material={side < 0 ? bids : asks}
            position={[side * (0.18 + slot * 0.14), -0.35, side * 0.22]}
          >
            <boxGeometry args={[0.075, 0.58, 0.3]} />
          </mesh>
        );
      })}
      <mesh material={grid} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <planeGeometry args={[5.1, 2.4, 16, 8]} />
      </mesh>
    </group>
  );
}

function GraphEdge({ from, to, material }) {
  const geometry = useMemo(() => {
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]);
    return lineGeometry;
  }, [from, to]);

  return (
    <line geometry={geometry}>
      <primitive object={material} attach="material" />
    </line>
  );
}

function VajraField({ progress }) {
  const group = useRef();
  const node = useTransparentMaterial("#e0f2fe", { emissive: "#38bdf8", emissiveIntensity: 0.25 });
  const hub = useTransparentMaterial("#f8fafc", { emissive: "#0ea5e9", emissiveIntensity: 0.5 });
  const edge = useMemo(
    () => {
      const material = new THREE.LineBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0 });
      material.userData.baseOpacity = 0.54;
      return material;
    },
    []
  );
  const nodes = useMemo(
    () => [
      [-1.8, -0.25, 0.4],
      [-1.05, 1.0, -0.6],
      [-0.42, -0.98, 0.9],
      [0.1, 0.25, 0],
      [0.82, 0.92, -0.72],
      [1.4, -0.6, 0.45],
      [1.82, 0.42, -0.18],
      [-0.2, 1.58, 0.5],
      [0.6, -1.45, -0.48]
    ],
    []
  );
  const edges = useMemo(
    () => [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 6],
      [1, 7],
      [2, 8],
      [7, 4],
      [8, 5]
    ],
    []
  );

  useFrame((state) => {
    const p = progress.get();
    const pointer = state.pointer;
    const opacity = bell(p, 0.43, 0.62);
    setGroupOpacity(group.current, opacity);
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.2 + range(p, 0.43, 0.62) * 0.65 + pointer.x * 0.18;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.42) * 0.12 + pointer.y * 0.16;
    const baseX = THREE.MathUtils.lerp(3.0, 1.7, range(p, 0.44, 0.58));
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, baseX + pointer.x * 0.12, 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, pointer.y * 0.1, 0.05);
  });

  return (
    <group ref={group} position={[3.0, 0, 0]}>
      {edges.map(([from, to]) => (
        <GraphEdge key={`${from}-${to}`} from={nodes[from]} to={nodes[to]} material={edge} />
      ))}
      {nodes.map((position, index) => (
        <mesh key={position.join(":")} position={position} material={index === 3 ? hub : node}>
          <sphereGeometry args={[index === 3 ? 0.17 : 0.105, 24, 24]} />
        </mesh>
      ))}
    </group>
  );
}

function CompressionCore({ progress }) {
  const group = useRef();
  const outer = useRef();
  const inner = useRef();
  const shell = useTransparentMaterial("#94a3b8", { wireframe: true, roughness: 0.82 });
  const core = useTransparentMaterial("#f97316", { emissive: "#ea580c", emissiveIntensity: 0.28 });

  useFrame((state) => {
    const p = progress.get();
    const pointer = state.pointer;
    const opacity = bell(p, 0.6, 0.8);
    setGroupOpacity(group.current, opacity);
    if (!group.current) return;
    const phaseX = THREE.MathUtils.lerp(-3.0, -1.75, range(p, 0.62, 0.78));
    const baseY = THREE.MathUtils.lerp(-1.15, -0.08, range(p, 0.6, 0.72));
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, phaseX + pointer.x * 0.12, 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + pointer.y * 0.1, 0.05);
    outer.current.rotation.x += 0.008 + pointer.y * 0.002;
    outer.current.rotation.y += 0.011 + pointer.x * 0.002;
    inner.current.rotation.x -= 0.01 + pointer.y * 0.003;
    inner.current.rotation.y += 0.009 + pointer.x * 0.003;
    inner.current.scale.setScalar(THREE.MathUtils.lerp(1.05, 0.68, range(p, 0.48, 0.64)));
    inner.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.05;
  });

  return (
    <group ref={group} position={[-3.0, -1.1, 0]}>
      <mesh ref={outer} material={shell}>
        <boxGeometry args={[2.4, 2.4, 2.4, 5, 5, 5]} />
      </mesh>
      <mesh ref={inner} material={core}>
        <boxGeometry args={[1.25, 1.25, 1.25, 4, 4, 4]} />
      </mesh>
    </group>
  );
}

function SkillConstellation({ progress }) {
  const group = useRef();
  const particle = useTransparentMaterial("#e2e8f0", { emissive: "#38bdf8", emissiveIntensity: 0.14 });
  const anchor = useTransparentMaterial("#0f172a", { emissive: "#0ea5e9", emissiveIntensity: 0.42 });
  const points = useMemo(() => Array.from({ length: 58 }, (_, index) => index), []);

  useFrame((state) => {
    const p = progress.get();
    const pointer = state.pointer;
    const opacity = range(p, 0.78, 0.98);
    setGroupOpacity(group.current, opacity);
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.24 + pointer.x * 0.2;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.14, 0.04);
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.24) * 0.08 + pointer.x * 0.08;
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, pointer.y * 0.1, 0.04);
    const baseX = THREE.MathUtils.lerp(2.45, -1.8, range(p, 0.8, 0.98));
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, baseX + pointer.x * 0.1, 0.04);
    group.current.scale.setScalar(THREE.MathUtils.lerp(0.76, 1.04, range(p, 0.8, 0.98)));
  });

  return (
    <group ref={group}>
      <mesh material={anchor}>
        <sphereGeometry args={[0.22, 28, 28]} />
      </mesh>
      {points.map((point) => {
        const angle = point * 0.74;
        const radius = 1.15 + (point % 7) * 0.12;
        const y = Math.sin(point * 1.37) * 0.94;
        return (
          <mesh
            key={point}
            material={particle}
            position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.036 + (point % 4) * 0.009, 14, 14]} />
          </mesh>
        );
      })}
    </group>
  );
}

function SceneCamera({ progress }) {
  useFrame(({ camera, pointer }) => {
    const p = progress.get();
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.36, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.15 + pointer.y * 0.22, 0.035);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, THREE.MathUtils.lerp(5.8, 4.25, p), 0.045);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function PointerLight() {
  const light = useRef();

  useFrame(({ pointer }) => {
    if (!light.current) return;
    light.current.position.x = THREE.MathUtils.lerp(light.current.position.x, pointer.x * 3.6, 0.08);
    light.current.position.y = THREE.MathUtils.lerp(light.current.position.y, pointer.y * 2.1, 0.08);
    light.current.position.z = THREE.MathUtils.lerp(light.current.position.z, 2.8, 0.08);
  });

  return <pointLight ref={light} position={[0, 0, 2.8]} intensity={0.85} color="#e0f2fe" />;
}

function CinematicScene({ progress }) {
  return (
    <>
      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 4.8, 10.5]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3.2, 4.8, 5.5]} intensity={1.25} />
      <pointLight position={[-3.8, -1.5, 3.2]} intensity={1.7} color="#f97316" />
      <pointLight position={[3.4, 2.2, 2.6]} intensity={1.5} color="#38bdf8" />
      <PointerLight />
      <SceneCamera progress={progress} />
      <Reactor progress={progress} />
      <TitanOrderBook progress={progress} />
      <VajraField progress={progress} />
      <CompressionCore progress={progress} />
      <SkillConstellation progress={progress} />
    </>
  );
}

export default function InteractiveScene() {
  const fallback = useReducedStage();
  const { scrollYProgress } = useScroll();

  if (fallback) {
    return (
      <div className="stage-fallback" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, 5.8], fov: 39 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <CinematicScene progress={scrollYProgress} />
    </Canvas>
  );
}
