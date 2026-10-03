"use client";

import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { type ThreeEvent } from "@react-three/fiber";
import { chapterIds, chapterTitles, specimenPosition } from "./journey";

// Each platform and portal is also a navigation target in the shared world.
export default function ChapterArchitecture({
  index,
  navigate,
}: {
  index: number;
  navigate: (index: number) => void;
}) {
  const [, , z] = specimenPosition(index);
  const grid = useMemo(() => {
    const points: number[] = [];
    for (let i = -7; i <= 7; i++) {
      points.push(i, -2.75, z + 7, i, -2.75, z - 9);
      points.push(-7, -2.75, z + i, 7, -2.75, z + i);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );
    return geometry;
  }, [z]);
  const label = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 128;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#75a0a8";
    context.font = "500 50px monospace";
    context.fillText(
      `${String(index).padStart(2, "0")}  /  ${chapterTitles[index].toUpperCase()}`,
      28,
      79,
    );
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [index]);
  useEffect(
    () => () => {
      grid.dispose();
      label.dispose();
    },
    [grid, label],
  );
  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta < 5) navigate(index);
  };
  return (
    <group onClick={select} name={`Portal ${chapterIds[index]}`}>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color="#355563" transparent opacity={0.22} />
      </lineSegments>
      <mesh position={[0, -2.78, z - 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 16]} />
        <meshStandardMaterial
          color="#040a0e"
          metalness={0.08}
          roughness={0.94}
        />
      </mesh>
      <mesh position={[0, -2.74, z + 4.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 0.875]} />
        <meshBasicMaterial map={label} transparent depthWrite={false} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 6, -0.4, z - 5]}>
            <boxGeometry args={[0.07, 5, 0.1]} />
            <meshStandardMaterial
              color="#36515c"
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>
          <mesh position={[side * 6, -2.7, z - 1]}>
            <boxGeometry args={[0.026, 0.026, 16]} />
            <meshStandardMaterial
              color="#68a8b6"
              emissive="#68a8b6"
              emissiveIntensity={0.65}
            />
          </mesh>
          <mesh position={[side * 6, 1.8, z - 4.94]}>
            <boxGeometry args={[0.021, 0.38, 0.012]} />
            <meshBasicMaterial color="#83dad9" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.1, z - 5]}>
        <boxGeometry args={[12, 0.06, 0.1]} />
        <meshStandardMaterial
          color="#36515c"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}
