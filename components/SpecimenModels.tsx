"use client";

import { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { type LabState } from "./lab-state";

type V3 = [number, number, number];
type Props = { state: LabState; select: (index: number) => void };
const CYAN = "#86e0e2",
  AMBER = "#efb66e",
  METAL = "#35454c";
const pick =
  (index: number, select: Props["select"]) =>
  (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta > 5) return;
    select(index);
  };

function Solid({
  size,
  position = [0, 0, 0],
  color = METAL,
  glass = false,
}: {
  size: V3;
  position?: V3;
  color?: string;
  glass?: boolean;
}) {
  const geometry = useMemo(
    () => new RoundedBoxGeometry(...size, 3, Math.min(0.065, size[1] / 3)),
    [size[0], size[1], size[2]],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh position={position} geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        metalness={glass ? 0.05 : 0.82}
        roughness={glass ? 0.13 : 0.3}
        clearcoat={1}
        clearcoatRoughness={0.18}
        transparent={glass}
        opacity={glass ? 0.16 : 1}
        depthWrite={!glass}
      />
    </mesh>
  );
}

function Trace({
  points,
  color = CYAN,
  opacity = 1,
}: {
  points: V3[];
  color?: string;
  opacity?: number;
}) {
  const line = useMemo(
    () =>
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(
          points.map((p) => new THREE.Vector3(...p)),
        ),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
      ),
    [points, color, opacity],
  );
  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    },
    [line],
  );
  return <primitive object={line} />;
}

function Conduit({
  points,
  color = CYAN,
  radius = 0.012,
}: {
  points: V3[];
  color?: string;
  radius?: number;
}) {
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        Math.min(360, Math.max(48, points.length * 3)),
        radius,
        5,
        false,
      ),
    [points, radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.65}
        metalness={0.4}
        roughness={0.25}
      />
    </mesh>
  );
}

function Contacts({
  points,
  color = AMBER,
  radius = 0.026,
}: {
  points: V3[];
  color?: string;
  radius?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    points.forEach((p, i) => {
      matrix.makeTranslation(...p);
      ref.current?.setMatrixAt(i, matrix);
    });
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      ref.current.computeBoundingSphere();
    }
  }, [points]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[radius, 8, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.45}
        metalness={0.5}
        roughness={0.28}
      />
    </instancedMesh>
  );
}

function Ring({
  radius,
  position = [0, 0, 0],
  color = CYAN,
  rotation = [Math.PI / 2, 0, 0],
  tube = 0.013,
}: {
  radius: number;
  position?: V3;
  color?: string;
  rotation?: V3;
  tube?: number;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={[radius, tube, 6, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.55}
        metalness={0.55}
        roughness={0.25}
      />
    </mesh>
  );
}

function Chip({
  position = [0, 0, 0],
  color = CYAN,
  size = 0.6,
}: {
  position?: V3;
  color?: string;
  size?: number;
}) {
  const pins = useMemo(
    () =>
      [-1, 1].flatMap((sign) =>
        Array.from({ length: 9 }, (_, i): V3 => [
          sign * size * 0.54,
          0.04,
          ((i - 4) * size) / 10,
        ]),
      ),
    [size],
  );
  return (
    <group position={position}>
      <Solid size={[size, 0.12, size]} color="#151e25" />
      <Solid
        size={[size * 0.58, 0.014, size * 0.58]}
        position={[0, 0.069, 0]}
        color="#6d7c80"
      />
      <Ring
        radius={size * 0.19}
        position={[0, 0.083, 0]}
        color={color}
        tube={0.009}
      />
      <Contacts points={pins} radius={0.019} color={AMBER} />
    </group>
  );
}

function Board({
  size = [4.3, 0.14, 2.6],
  selected,
  glass = false,
}: {
  size?: V3;
  selected: boolean;
  glass?: boolean;
}) {
  const [w, h, d] = size;
  const perimeter: V3[] = [
    [-w / 2 + 0.07, h / 2 + 0.005, -d / 2 + 0.07],
    [w / 2 - 0.07, h / 2 + 0.005, -d / 2 + 0.07],
    [w / 2 - 0.07, h / 2 + 0.005, d / 2 - 0.07],
    [-w / 2 + 0.07, h / 2 + 0.005, d / 2 - 0.07],
    [-w / 2 + 0.07, h / 2 + 0.005, -d / 2 + 0.07],
  ];
  return (
    <group>
      <Solid
        size={size}
        color={glass ? "#a7d6df" : selected ? "#293c43" : "#141f28"}
        glass={glass}
      />
      <Trace
        points={perimeter}
        color={selected ? AMBER : "#91a4ab"}
        opacity={glass ? 0.7 : 0.4}
      />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <group
            key={`${x}-${z}`}
            position={[x * (w / 2 - 0.19), h / 2 + 0.015, z * (d / 2 - 0.19)]}
          >
            <mesh>
              <cylinderGeometry args={[0.055, 0.055, 0.026, 12]} />
              <meshStandardMaterial
                color="#a4afb2"
                metalness={1}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.018, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.012, 6]} />
              <meshStandardMaterial color="#071018" />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

export function Specimen({ state, select }: Props) {
  const spread = 0.32 + state.value * 0.009;
  const circuits = useMemo(
    () =>
      Array.from({ length: 9 }, (_, row): V3[] => {
        const z = (row - 4) * 0.21;
        return [
          [-1.94, 0.09, z],
          [-1.05, 0.09, z],
          [-0.75, 0.09, z * 0.65],
          [0.75, 0.09, z * 0.65],
          [1.12, 0.09, z],
          [1.94, 0.09, z],
        ];
      }),
    [],
  );
  const waves = useMemo(
    () =>
      Array.from({ length: 18 }, (_, k) =>
        Array.from({ length: 90 }, (_, i): V3 => {
          const x = -1.86 + (i * 3.72) / 89;
          return [
            x,
            0.17 + Math.sin(x * 3.8 + k * 0.17) * 0.15,
            (k - 8.5) * 0.105,
          ];
        }),
      ),
    [],
  );
  const dots = useMemo(
    () =>
      Array.from({ length: 176 }, (_, i): V3 => [
        ((i % 16) - 7.5) * 0.19,
        0.096,
        (Math.floor(i / 16) - 5) * 0.19,
      ]),
    [],
  );
  return (
    <group rotation={[0, 0, -0.09]}>
      {[0, 1, 2, 3].map((layer) => (
        <group
          key={layer}
          position={[
            0,
            (layer - 1.5) * spread + (state.selected === layer ? 0.07 : 0),
            0,
          ]}
          onClick={pick(layer, select)}
        >
          <Board
            size={[4.3, layer === 0 ? 0.25 : 0.09, 2.6]}
            selected={state.selected === layer}
            glass={layer === 1 || layer === 2}
          />
          {layer === 1 ? (
            waves.map((points, i) => (
              <Trace
                key={i}
                points={points}
                color={state.selected === layer ? AMBER : CYAN}
                opacity={0.3 + (i % 3) * 0.18}
              />
            ))
          ) : (
            <>
              {circuits.map((points, i) => (
                <Trace
                  key={i}
                  points={points}
                  color={state.selected === layer ? AMBER : "#678b93"}
                  opacity={0.55}
                />
              ))}
              <Contacts
                points={dots}
                color={layer === 2 ? CYAN : "#8c9e9e"}
                radius={0.013}
              />
              <Chip
                position={[0, layer === 0 ? 0.21 : 0.16, 0]}
                size={layer === 3 ? 1 : 0.7}
                color={state.selected === layer ? AMBER : CYAN}
              />
              {[-1, 1].map((x) => (
                <Chip
                  key={x}
                  position={[x * 1.4, 0.15, -0.57]}
                  size={0.38}
                  color={CYAN}
                />
              ))}
            </>
          )}
          {[-1, 1].map((x) => (
            <mesh key={x} position={[x * 1.78, 0, 1.305]}>
              <boxGeometry args={[0.24, 0.024, 0.016]} />
              <meshBasicMaterial
                color={state.selected === layer ? AMBER : CYAN}
              />
            </mesh>
          ))}
        </group>
      ))}
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z, j) => (
          <group
            key={`${x}-${z}`}
            onClick={pick(j + (x === 1 ? 2 : 0), select)}
            position={[x * 1.95, 0, z * 1.11]}
          >
            <mesh>
              <cylinderGeometry args={[0.017, 0.017, spread * 3 + 0.35, 8]} />
              <meshStandardMaterial
                color="#bfa477"
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>
            {[-1.5, 1.5].map((y) => (
              <mesh key={y} position={[0, y * spread, 0]}>
                <cylinderGeometry args={[0.065, 0.065, 0.08, 12]} />
                <meshStandardMaterial
                  color={AMBER}
                  metalness={0.85}
                  roughness={0.25}
                />
              </mesh>
            ))}
          </group>
        )),
      )}
    </group>
  );
}

export function Network({ state, select }: Props) {
  const gap = state.mode ? 0.46 : 0;
  const nodes: V3[] = [
    [-1.75 - gap, 0.62, 0.5],
    [-1.25 - gap, -0.8, 0.4],
    [-0.65 - gap, 0.15, -1.05],
    [0.65 + gap, 0.75, -0.4],
    [1.8 + gap, -0.5, 0.8],
    [1.55 + gap, -0.7, -1.05],
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 0],
    [3, 4],
    [4, 5],
    [5, 3],
    [2, 3],
    [1, 4],
  ];
  return (
    <group>
      {edges.map(
        ([a, b], i) =>
          (!state.mode || i < 6) && (
            <group key={i} onClick={pick(a, select)}>
              <Conduit
                points={[
                  nodes[a],
                  [
                    (nodes[a][0] + nodes[b][0]) / 2,
                    (nodes[a][1] + nodes[b][1]) / 2 + 0.18,
                    (nodes[a][2] + nodes[b][2]) / 2 + 0.25,
                  ],
                  nodes[b],
                ]}
                color={
                  state.selected === a || state.selected === b ? AMBER : CYAN
                }
                radius={0.014}
              />
            </group>
          ),
      )}
      {nodes.map((point, i) => (
        <group key={i} position={point} onClick={pick(i, select)}>
          <group rotation={[0.18, i * 0.23, 0.04]}>
            <Solid
              size={[0.72, 0.7, 0.72]}
              color={state.selected === i ? "#59696c" : "#253740"}
              glass
            />
            <Chip
              position={[0, -0.12, 0]}
              size={0.5}
              color={state.selected === i ? AMBER : CYAN}
            />
            <group position={[0, -0.28, 0]}>
              <Board
                size={[0.75, 0.085, 0.75]}
                selected={state.selected === i}
              />
            </group>
            <group position={[0, 0.36, 0]}>
              <Board
                size={[0.75, 0.06, 0.75]}
                selected={state.selected === i}
                glass
              />
            </group>
            {[-1, 1].flatMap((x) =>
              [-1, 1].map((z) => (
                <mesh key={`${x}-${z}`} position={[x * 0.31, 0.04, z * 0.31]}>
                  <cylinderGeometry args={[0.017, 0.017, 0.62, 6]} />
                  <meshStandardMaterial
                    color="#b6ac91"
                    metalness={0.9}
                    roughness={0.25}
                  />
                </mesh>
              )),
            )}
            {[0, 1, 2].map((j) => (
              <mesh key={j} position={[-0.19 + j * 0.19, -0.05, 0.38]}>
                <boxGeometry args={[0.09, 0.017, 0.012]} />
                <meshBasicMaterial color={state.mode ? AMBER : CYAN} />
              </mesh>
            ))}
          </group>
          {state.selected === i && (
            <Ring radius={0.63} position={[0, -0.28, 0]} color={AMBER} />
          )}
          {[0, 1, 2].map((j) => (
            <group key={j} position={[0, -0.5 - j * 0.11, 0]}>
              <Solid
                size={[0.46, 0.022, 0.32]}
                color={state.mode ? "#a78a61" : "#526b74"}
              />
            </group>
          ))}
        </group>
      ))}
      {state.mode && (
        <group onClick={pick(2, select)}>
          <Trace
            points={[
              [-0.22, -1.4, 0],
              [0.22, -1, 0],
            ]}
            color={AMBER}
          />
          <Trace
            points={[
              [0.22, -1.4, 0],
              [-0.22, -1, 0],
            ]}
            color={AMBER}
          />
        </group>
      )}
    </group>
  );
}

export function Acoustic({ state, select }: Props) {
  const locations: V3[] = [
    [-1.9, -0.45, 0.15],
    [-0.95, 0.4, -0.55],
    [0, 0.65, -0.4],
    [0.98, 0.2, 0.1],
    [1.98, -0.45, 0.45],
  ];
  return (
    <group>
      {locations.map((p, i) => (
        <group key={i} position={p} onClick={pick(i, select)}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.38, 0.38, 0.18, 32]} />
              <meshPhysicalMaterial
                color="#3c505a"
                metalness={0.9}
                roughness={0.23}
                clearcoat={1}
              />
            </mesh>
            <mesh position={[0, 0.105, 0]}>
              <cylinderGeometry args={[0.32, 0.32, 0.012, 32]} />
              <meshStandardMaterial
                color="#101d25"
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
            {[0.14, 0.23, 0.35].map((radius) => (
              <Ring
                key={radius}
                radius={radius}
                position={[0, 0.116, 0]}
                color={state.selected === i ? AMBER : "#698c95"}
                tube={0.008}
              />
            ))}
          </group>
          <group position={[0, 0, 0.13]}>
            {[0, 1, 2, 3].map((k) => (
              <Trace
                key={k}
                points={Array.from({ length: 64 }, (_, j): V3 => [
                  -0.28 + (j * 0.56) / 63,
                  Math.sin(
                    j * (i === 1 ? 1.2 : i === 3 ? 0.5 : 0.22) + k * 0.35,
                  ) * (state.selected === i ? 0.19 : 0.11),
                  0.03 + k * 0.032,
                ])}
                color={state.selected === i ? AMBER : CYAN}
                opacity={0.9 - k * 0.15}
              />
            ))}
          </group>
          {state.selected === i && (
            <Ring
              radius={0.5}
              rotation={[0, 0, 0]}
              position={[0, 0, 0.12]}
              color={AMBER}
            />
          )}
          <Solid size={[0.46, 0.04, 0.25]} position={[0, -0.58, 0]} />
        </group>
      ))}
      {locations.slice(0, -1).map((p, i) => (
        <group key={i} onClick={pick(i + 1, select)}>
          <Conduit
            points={[
              p,
              [
                (p[0] + locations[i + 1][0]) / 2,
                (p[1] + locations[i + 1][1]) / 2 + 0.38,
                0.4,
              ],
              locations[i + 1],
            ]}
            color={i < state.selected ? AMBER : CYAN}
          />
          <Contacts
            points={Array.from({ length: 7 }, (_, j): V3 => {
              const t = (j + 1) / 8;
              return [
                p[0] * (1 - t) + locations[i + 1][0] * t,
                p[1] * (1 - t) + locations[i + 1][1] * t - 0.35,
                p[2] * (1 - t) + locations[i + 1][2] * t,
              ];
            })}
            color={i < state.selected ? AMBER : CYAN}
            radius={0.018}
          />
        </group>
      ))}
    </group>
  );
}

export function Channel({ state, select }: Props) {
  const distortion = state.value / 100;
  const waves = useMemo(
    () =>
      [0, 1, 2].map((k) =>
        Array.from({ length: 120 }, (_, i): V3 => {
          const x = -2.15 + (i * 4.3) / 119;
          const noise =
            Math.sin(i * 0.87) *
            distortion *
            (k === 1 ? 0.43 : k === 2 ? 0.16 : 0);
          return [
            x,
            [1.0, 0, -1.0][k] + Math.sin(i * 0.27) * 0.23 + noise,
            k === 1 ? 0.68 : 0.2,
          ];
        }),
      ),
    [distortion],
  );
  return (
    <group rotation={[0, 0, -0.08]}>
      <group onClick={pick(1, select)} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry
            args={[0.53, 0.53, 3.75, 48, 1, true, 0, Math.PI * 1.45]}
          />
          <meshPhysicalMaterial
            color="#66757a"
            side={THREE.DoubleSide}
            metalness={0.94}
            roughness={0.27}
            clearcoat={0.7}
          />
        </mesh>
        {Array.from({ length: 13 }, (_, i) => (
          <mesh
            key={i}
            position={[0, -1.8 + i * 0.3, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.54, 0.016, 6, 48, Math.PI * 1.45]} />
            <meshStandardMaterial
              color={state.selected === 1 ? AMBER : "#85969a"}
              metalness={0.85}
              roughness={0.22}
            />
          </mesh>
        ))}
        {[-1, 1].map((sign) => (
          <mesh
            key={sign}
            position={[0, sign * 1.9, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.54, 0.065, 8, 48]} />
            <meshStandardMaterial
              color="#687980"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
      {waves.map((points, i) => (
        <group key={i} onClick={pick(i, select)}>
          <Conduit
            points={points}
            color={state.selected === i ? AMBER : CYAN}
            radius={i === 1 ? 0.014 : 0.018}
          />
          <Ring
            radius={0.14}
            position={points[0]}
            rotation={[0, Math.PI / 2, 0]}
            color={state.selected === i ? AMBER : CYAN}
          />
          <Ring
            radius={0.14}
            position={points[points.length - 1]}
            rotation={[0, Math.PI / 2, 0]}
            color={state.selected === i ? AMBER : CYAN}
          />
        </group>
      ))}
    </group>
  );
}

export function Evidence({ state, select }: Props) {
  const nodes: V3[] = [
    [-2, 0, 0],
    [-0.85, 0.85, -0.2],
    [-0.85, -0.85, 0.4],
    [0.6, 0, 0],
    [2, 0, 0.15],
  ];
  return (
    <group>
      {[
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        [3, 4],
      ].map(([a, b], i) => (
        <group key={i} onClick={pick(b, select)}>
          <Conduit
            points={[
              nodes[a],
              [
                (nodes[a][0] + nodes[b][0]) / 2,
                (nodes[a][1] + nodes[b][1]) / 2,
                0.25,
              ],
              nodes[b],
            ]}
            color={state.mode && (a === 2 || b === 4) ? AMBER : CYAN}
          />
        </group>
      ))}
      {nodes.map((p, i) => (
        <group key={i} position={p} onClick={pick(i, select)}>
          <Solid size={[0.63, 0.75, 0.35]} color="#a0c9cc" glass />
          <Solid
            size={[0.55, 0.055, 0.42]}
            position={[0, -0.39, 0]}
            color="#465b64"
          />
          <Solid
            size={[0.55, 0.055, 0.42]}
            position={[0, 0.39, 0]}
            color="#465b64"
          />
          <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 4]}>
            <octahedronGeometry args={[0.19, 0]} />
            <meshStandardMaterial
              color={state.mode && i === 4 ? AMBER : CYAN}
              emissive={state.mode && i === 4 ? AMBER : CYAN}
              emissiveIntensity={0.25}
              metalness={0.75}
              roughness={0.2}
              wireframe={state.mode === 2 && i === 4}
            />
          </mesh>
          <Ring
            radius={state.selected === i ? 0.42 : 0.26}
            position={[0, 0, 0.22]}
            rotation={[0, 0, 0]}
            color={
              state.selected === i || (state.mode && i === 4) ? AMBER : CYAN
            }
            tube={0.01}
          />
          <Contacts
            points={[
              [-0.18, -0.3, 0.19],
              [0, -0.3, 0.19],
              [0.18, -0.3, 0.19],
            ]}
            color={CYAN}
            radius={0.018}
          />
        </group>
      ))}
      {state.mode === 1 && (
        <group onClick={pick(2, select)}>
          <Conduit
            points={[nodes[2], [0, -1.5, 0.5], [0.45, -1.45, 0.5]]}
            color={AMBER}
          />
          <mesh position={[0.45, -1.45, 0.5]}>
            <octahedronGeometry args={[0.2]} />
            <meshStandardMaterial color={AMBER} wireframe />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function Synthesis({ state, select }: Props) {
  return (
    <group rotation={[0.05, 0, 0]}>
      {[0, 1, 2].map((board) => (
        <group
          key={board}
          position={[
            (board - 1) * 1.57,
            board === 1 ? 0.4 : -0.1,
            board === 1 ? -0.35 : 0,
          ]}
          onClick={pick(board, select)}
        >
          <Board
            size={[1.38, 0.15, 1.38]}
            selected={state.selected === board}
          />
          {Array.from({ length: 25 }, (_, i) => {
            const x = i % 5,
              y = Math.floor(i / 5);
            const active =
              state.mode === 0
                ? x === y || x + y === 4
                : state.mode === 1
                  ? (i * 7 + board) % 4 === 0
                  : x === 2 || y === 2 || (board === 2 && x === y);
            return (
              <group
                key={i}
                position={[
                  (x - 2) * 0.235,
                  0.115 + (active ? 0.09 : 0),
                  (y - 2) * 0.235,
                ]}
              >
                <Solid
                  size={[0.19, active ? 0.22 : 0.045, 0.19]}
                  color={
                    active
                      ? state.mode === 1
                        ? "#c88f50"
                        : "#74bac1"
                      : "#273641"
                  }
                />
              </group>
            );
          })}
          {state.selected === board && (
            <Ring radius={0.91} position={[0, -0.16, 0]} color={AMBER} />
          )}
          <Solid
            size={[1.22, 0.028, 1.22]}
            position={[0, -0.22, 0]}
            color="#687b81"
          />
        </group>
      ))}
      {[-1, 1].map((sign, i) => (
        <group key={sign} onClick={pick(i + 1, select)}>
          <Conduit
            points={[
              [sign * 0.85, -0.03, 0],
              [sign * 0.78, 0.12, 0],
              [sign * 0.67, 0.4, -0.35],
            ]}
            color={state.mode === 1 ? AMBER : CYAN}
          />
        </group>
      ))}
    </group>
  );
}
