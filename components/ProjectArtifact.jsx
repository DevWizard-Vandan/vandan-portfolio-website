"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function useArtifactFallback() {
  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    const update = () => {
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setFallback(mobile || reduced);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return fallback;
}

function Rig({ children }) {
  const group = useRef();

  useFrame(({ pointer }) => {
    if (!group.current) return;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.18, 0.05);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.24, 0.05);
  });

  return <group ref={group}>{children}</group>;
}

function TitanArtifact() {
  const group = useRef();
  const bars = useMemo(() => Array.from({ length: 30 }, (_, index) => index), []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((bar, index) => {
      if (!bar.geometry?.type?.includes("Box")) return;
      const pressure = Math.abs(Math.sin(state.clock.elapsedTime * 2.8 + index * 0.52));
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, 0.32 + pressure * 1.35, 0.08);
      bar.position.y = -0.66 + bar.scale.y * 0.28;
    });
  });

  return (
    <Rig>
      <group ref={group} position={[0, -0.15, 0]}>
        {bars.map((bar) => {
          const side = bar < 15 ? -1 : 1;
          const slot = bar < 15 ? bar : bar - 15;
          return (
            <mesh key={bar} position={[side * (0.2 + slot * 0.13), -0.38, side * 0.2]}>
              <boxGeometry args={[0.08, 0.58, 0.26]} />
              <meshStandardMaterial
                color={side < 0 ? "#22c55e" : "#f97316"}
                emissive={side < 0 ? "#166534" : "#9a3412"}
                emissiveIntensity={0.26}
                roughness={0.34}
              />
            </mesh>
          );
        })}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 0]}>
        <planeGeometry args={[4.8, 2.3, 14, 8]} />
        <meshStandardMaterial color="#334155" wireframe transparent opacity={0.24} />
      </mesh>
    </Rig>
  );
}

function Edge({ from, to }) {
  const geometry = useMemo(() => {
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]);
    return lineGeometry;
  }, [from, to]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.56} />
    </line>
  );
}

function VajraArtifact() {
  const group = useRef();
  const nodes = useMemo(
    () => [
      [-1.5, -0.28, 0.3],
      [-0.82, 0.72, -0.4],
      [-0.35, -0.86, 0.64],
      [0.16, 0.08, 0],
      [0.88, 0.65, -0.46],
      [1.35, -0.46, 0.32],
      [1.6, 0.34, -0.18],
      [-0.02, 1.15, 0.32]
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
      [7, 4]
    ],
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.22;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
  });

  return (
    <Rig>
      <group ref={group}>
        {edges.map(([from, to]) => (
          <Edge key={`${from}-${to}`} from={nodes[from]} to={nodes[to]} />
        ))}
        {nodes.map((position, index) => (
          <mesh key={position.join(":")} position={position}>
            <sphereGeometry args={[index === 3 ? 0.16 : 0.09, 24, 24]} />
            <meshStandardMaterial
              color={index === 3 ? "#f8fafc" : "#dff7ff"}
              emissive={index === 3 ? "#f97316" : "#38bdf8"}
              emissiveIntensity={index === 3 ? 0.4 : 0.18}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </Rig>
  );
}

function CompressionArtifact() {
  const outer = useRef();
  const inner = useRef();

  useFrame((state) => {
    const shrink = (Math.sin(state.clock.elapsedTime * 1.4) + 1) / 2;
    outer.current.rotation.x += 0.008;
    outer.current.rotation.y += 0.011;
    inner.current.rotation.x -= 0.01;
    inner.current.rotation.y += 0.012;
    inner.current.scale.setScalar(THREE.MathUtils.lerp(1.02, 0.66, shrink));
  });

  return (
    <Rig>
      <mesh ref={outer}>
        <boxGeometry args={[2.25, 2.25, 2.25, 5, 5, 5]} />
        <meshStandardMaterial color="#94a3b8" wireframe transparent opacity={0.42} />
      </mesh>
      <mesh ref={inner}>
        <boxGeometry args={[1.28, 1.28, 1.28, 4, 4, 4]} />
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.28} roughness={0.28} />
      </mesh>
    </Rig>
  );
}

function SkillsArtifact() {
  const group = useRef();
  const particles = useMemo(() => Array.from({ length: 48 }, (_, index) => index), []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.28;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
  });

  return (
    <Rig>
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[0.24, 28, 28]} />
          <meshStandardMaterial color="#f8fafc" emissive="#38bdf8" emissiveIntensity={0.28} />
        </mesh>
        {particles.map((particle) => {
          const angle = particle * 0.7;
          const radius = 1.02 + (particle % 6) * 0.13;
          const y = Math.sin(particle * 1.55) * 0.78;
          return (
            <mesh
              key={particle}
              position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
            >
              <sphereGeometry args={[0.035 + (particle % 4) * 0.009, 14, 14]} />
              <meshStandardMaterial color={particle % 2 ? "#38bdf8" : "#f97316"} emissive={particle % 2 ? "#0ea5e9" : "#9a3412"} emissiveIntensity={0.2} />
            </mesh>
          );
        })}
      </group>
    </Rig>
  );
}

const scenes = {
  titan: TitanArtifact,
  vajra: VajraArtifact,
  compression: CompressionArtifact,
  skills: SkillsArtifact
};

export default function ProjectArtifact({ variant }) {
  const fallback = useArtifactFallback();
  const Scene = scenes[variant] || TitanArtifact;

  if (fallback) {
    return <div className={`artifact-fallback artifact-fallback-${variant}`} />;
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.62} />
      <directionalLight position={[3, 4, 4]} intensity={1.25} />
      <pointLight position={[-2.4, 1.2, 2.8]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[2.2, -1.4, 2.8]} intensity={0.95} color="#f97316" />
      <Scene />
    </Canvas>
  );
}
