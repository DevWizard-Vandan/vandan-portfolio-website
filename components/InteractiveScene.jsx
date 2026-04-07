"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function useMobileFallback() {
  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    const update = () => {
      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setFallback(isMobile || reduced);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return fallback;
}

function Rig({ children }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const x = (state.pointer.y || 0) * 0.18;
    const y = (state.pointer.x || 0) * 0.25;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, x, 0.04);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, y, 0.04);
  });

  return <group ref={group}>{children}</group>;
}

function HeroObject() {
  const mesh = useRef();
  const ring = useRef();

  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.22;
    mesh.current.rotation.y += delta * 0.34;
    ring.current.rotation.z -= delta * 0.18;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.08;
  });

  return (
    <Rig>
      <mesh ref={mesh} castShadow receiveShadow>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.56} roughness={0.22} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[1.78, 0.018, 16, 120]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0369a1" emissiveIntensity={0.22} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2.2, 0]}>
        <torusGeometry args={[2.05, 0.012, 16, 120]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.28} />
      </mesh>
    </Rig>
  );
}

function TitanBars() {
  const group = useRef();
  const bars = useMemo(() => Array.from({ length: 26 }, (_, i) => i), []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += 0.003;
    group.current.children.forEach((bar, index) => {
      const wave = Math.sin(state.clock.elapsedTime * 2.4 + index * 0.7);
      const height = 0.35 + Math.abs(wave) * (index % 2 === 0 ? 1.4 : 1.0);
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, height, 0.08);
      bar.position.y = (bar.scale.y - 1) * 0.22;
    });
  });

  return (
    <Rig>
      <group ref={group} position={[-1.7, -0.6, 0]}>
        {bars.map((bar) => {
          const side = bar < 13 ? -1 : 1;
          const offset = bar < 13 ? bar : bar - 13;
          return (
            <mesh key={bar} position={[side * (0.25 + offset * 0.18), 0, side * 0.2]}>
              <boxGeometry args={[0.11, 0.55, 0.28]} />
              <meshStandardMaterial
                color={side < 0 ? "#0ea5e9" : "#22c55e"}
                emissive={side < 0 ? "#075985" : "#166534"}
                emissiveIntensity={0.18}
                roughness={0.38}
              />
            </mesh>
          );
        })}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
        <planeGeometry args={[5.1, 2.4, 12, 12]} />
        <meshStandardMaterial color="#e2e8f0" wireframe transparent opacity={0.22} />
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
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.38} />
    </line>
  );
}

function VajraGraph() {
  const group = useRef();
  const nodes = useMemo(
    () => [
      [-1.6, -0.4, 0.2],
      [-0.9, 0.9, -0.3],
      [-0.2, -0.8, 0.7],
      [0.55, 0.55, -0.6],
      [1.25, -0.25, 0.25],
      [0.2, 1.35, 0.35],
      [1.7, 0.82, -0.2]
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
      [1, 5]
    ],
    []
  );

  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.18;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <Rig>
      <group ref={group}>
        {edges.map(([a, b]) => (
          <Edge key={`${a}-${b}`} from={nodes[a]} to={nodes[b]} />
        ))}
        {nodes.map((position, index) => (
          <mesh key={position.join(",")} position={position}>
            <sphereGeometry args={[index === 3 ? 0.16 : 0.11, 24, 24]} />
            <meshStandardMaterial
              color={index === 3 ? "#0f172a" : "#f8fafc"}
              emissive={index === 3 ? "#0ea5e9" : "#38bdf8"}
              emissiveIntensity={index === 3 ? 0.34 : 0.14}
              roughness={0.28}
            />
          </mesh>
        ))}
      </group>
    </Rig>
  );
}

function CompressionCube() {
  const outer = useRef();
  const inner = useRef();

  useFrame((state) => {
    const pulse = (Math.sin(state.clock.elapsedTime * 1.6) + 1) / 2;
    outer.current.rotation.x += 0.006;
    outer.current.rotation.y += 0.009;
    inner.current.rotation.x -= 0.008;
    inner.current.rotation.y += 0.007;
    inner.current.scale.setScalar(0.68 + pulse * 0.18);
  });

  return (
    <Rig>
      <mesh ref={outer}>
        <boxGeometry args={[2.1, 2.1, 2.1, 4, 4, 4]} />
        <meshStandardMaterial color="#94a3b8" wireframe transparent opacity={0.42} />
      </mesh>
      <mesh ref={inner}>
        <boxGeometry args={[1.25, 1.25, 1.25, 3, 3, 3]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#075985"
          emissiveIntensity={0.18}
          metalness={0.18}
          roughness={0.34}
        />
      </mesh>
    </Rig>
  );
}

function SkillsCluster() {
  const group = useRef();
  const particles = useMemo(() => Array.from({ length: 36 }, (_, index) => index), []);

  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.28;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
  });

  return (
    <Rig>
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color="#0f172a" emissive="#0369a1" emissiveIntensity={0.26} />
        </mesh>
        {particles.map((particle) => {
          const angle = particle * 0.68;
          const radius = 1.15 + (particle % 5) * 0.14;
          const y = Math.sin(particle * 1.7) * 0.82;
          return (
            <mesh
              key={particle}
              position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
            >
              <sphereGeometry args={[0.045 + (particle % 3) * 0.012, 16, 16]} />
              <meshStandardMaterial color={particle % 2 ? "#38bdf8" : "#e2e8f0"} />
            </mesh>
          );
        })}
      </group>
    </Rig>
  );
}

const sceneMap = {
  hero: HeroObject,
  titan: TitanBars,
  vajra: VajraGraph,
  compression: CompressionCube,
  skills: SkillsCluster
};

export default function InteractiveScene({ variant = "hero" }) {
  const fallback = useMobileFallback();
  const Scene = sceneMap[variant] || HeroObject;

  if (fallback) {
    return <div className={`scene-fallback fallback-${variant}`} />;
  }

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, variant === "hero" ? 5.2 : 4.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 4, 5]} intensity={1.55} castShadow />
      <pointLight position={[-3, -2, 3]} intensity={0.95} color="#38bdf8" />
      <Scene />
    </Canvas>
  );
}
