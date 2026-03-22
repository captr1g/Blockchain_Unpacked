import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Center, Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ─── PREMIUM MATERIALS ────────────────────────────────────────────────

const EmissiveMaterial = ({ color = '#38bdf8', intensity = 2 }) => (
  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
);

const PulseMaterial = ({ color = '#38bdf8', baseIntensity = 1.5, pulseSpeed = 2 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.emissiveIntensity = baseIntensity + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.8;
    }
  });
  return (
    <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={baseIntensity} toneMapped={false} />
  );
};

// Holographic panel material — solid dark face + colored emissive tint
const HoloPanelMaterial = ({ color = '#38bdf8', opacity = 0.25 }) => (
  <meshStandardMaterial
    color="#151722"
    emissive={color}
    emissiveIntensity={0.3}
    transparent
    opacity={opacity}
    side={THREE.DoubleSide}
    depthWrite={false}
  />
);

// ─── REUSABLE ORBITAL RING ──────────────────────────────────────────

const OrbitalRing = ({ radius, tubeRadius = 0.02, color, rotationAxis = [0, 0, 0], speed = 0.3 }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = rotationAxis[0] + t * speed;
    ref.current.rotation.y = rotationAxis[1] + t * speed * 0.7;
    ref.current.rotation.z = rotationAxis[2];
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tubeRadius, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} />
    </mesh>
  );
};

// ─── FLOATING PARTICLES ─────────────────────────────────────────────

const FloatingParticles = ({ count = 80, spread = 6, color = '#38bdf8', size = 1.5 }) => (
  <Sparkles count={count} scale={spread} size={size} speed={0.2} opacity={0.5} color={color} />
);

// ─── CONNECTING BEAM (reusable line between two 3D points) ──────────

const ConnectingBeam = ({ from, to, color, opacity = 0.2 }) => {
  const ref = useRef();
  const midpoint = useMemo(() => [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ], [from, to]);
  const length = useMemo(() => {
    const dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }, [from, to]);

  useFrame(() => {
    if (ref.current) {
      ref.current.lookAt(new THREE.Vector3(...to));
      ref.current.rotateX(Math.PI / 2);
    }
  });

  return (
    <mesh ref={ref} position={midpoint}>
      <cylinderGeometry args={[0.012, 0.012, length, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

// ─── Helix Backbone Tube — smooth curve along a helix path ───────────
const HelixTube = ({ radius, height, turns, tubeRadius = 0.025, color, phaseOffset = 0 }) => {
  const tubeRef = useRef();
  const geometry = useMemo(() => {
    const points = [];
    const segments = 200;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2 * turns;
      const y = -height / 2 + (i / segments) * height;
      points.push(new THREE.Vector3(
        Math.cos(t + phaseOffset) * radius,
        y,
        Math.sin(t + phaseOffset) * radius
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 120, tubeRadius, 8, false);
  }, [radius, height, turns, tubeRadius, phaseOffset]);

  return (
    <mesh ref={tubeRef} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
};

// ─── Static Rung (properly oriented cylinder between two points) ─────
const HelixRung = ({ from, to, color, opacity = 0.2, thickness = 0.018 }) => {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    dir.normalize();
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return { position: [mid.x, mid.y, mid.z], quaternion: quat, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[thickness, thickness, length, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

// ─── SCENE 1: HOME — Blockchain DNA Helix ────────────────────────────
export const HomeScene = () => {
  const groupRef = useRef();
  const helixRef = useRef();
  const coreRef = useRef();
  const dataStreamRef = useRef();

  const HELIX_SEGMENTS = 32;
  const HELIX_RADIUS = 1.4;
  const HELIX_HEIGHT = 5.5;
  const HELIX_TURNS = 1.5;

  // Generate helix block positions & tangent rotations (two strands)
  const { strandA, strandB, rungs } = useMemo(() => {
    const a = [], b = [], r = [];
    for (let i = 0; i < HELIX_SEGMENTS; i++) {
      const frac = i / HELIX_SEGMENTS;
      const angle = frac * Math.PI * 2 * HELIX_TURNS;
      const y = -HELIX_HEIGHT / 2 + frac * HELIX_HEIGHT;

      // Tangent direction for orienting blocks along the curve
      const tangentAngle = angle + 0.01;
      const tangentY = y + (HELIX_HEIGHT / HELIX_SEGMENTS) * 0.01;
      const tanAx = Math.cos(tangentAngle) * HELIX_RADIUS - Math.cos(angle) * HELIX_RADIUS;
      const tanAz = Math.sin(tangentAngle) * HELIX_RADIUS - Math.sin(angle) * HELIX_RADIUS;
      const rotY = Math.atan2(tanAx, tanAz);

      a.push({
        pos: [Math.cos(angle) * HELIX_RADIUS, y, Math.sin(angle) * HELIX_RADIUS],
        rotY
      });
      b.push({
        pos: [Math.cos(angle + Math.PI) * HELIX_RADIUS, y, Math.sin(angle + Math.PI) * HELIX_RADIUS],
        rotY: rotY + Math.PI
      });
      if (i % 4 === 0) r.push(i);
    }
    return { strandA: a, strandB: b, rungs: r };
  }, []);

  // Data stream particles flowing along helix
  const streamPositions = useMemo(() => {
    const positions = [];
    const count = 100;
    for (let i = 0; i < count; i++) {
      positions.push(0, 0, 0);
    }
    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.05;
    helixRef.current.rotation.y = t * 0.06;
    coreRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08);

    // Animate data stream particles spiraling along the helix path
    if (dataStreamRef.current) {
      const pos = dataStreamRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const phase = ((t * 0.4 + i * 0.012) % 1);
        const angle = phase * Math.PI * 2 * HELIX_TURNS;
        const y = -HELIX_HEIGHT / 2 + phase * HELIX_HEIGHT;
        const r = HELIX_RADIUS * 0.4;
        pos.array[ix] = Math.cos(angle) * r;
        pos.array[ix + 1] = y;
        pos.array[ix + 2] = Math.sin(angle) * r;
      }
      pos.needsUpdate = true;
    }
  });


  return (
    <group ref={groupRef}>
      <group ref={helixRef}>
        {/* ── Smooth Backbone Tubes (the continuous helix curves) ── */}
        <HelixTube radius={HELIX_RADIUS} height={HELIX_HEIGHT} turns={HELIX_TURNS} tubeRadius={0.03} color="#38bdf8" phaseOffset={0} />
        <HelixTube radius={HELIX_RADIUS} height={HELIX_HEIGHT} turns={HELIX_TURNS} tubeRadius={0.03} color="#f59e0b" phaseOffset={Math.PI} />

        {/* ── Emissive wire backbone overlay for glow ── */}
        <HelixTube radius={HELIX_RADIUS} height={HELIX_HEIGHT} turns={HELIX_TURNS} tubeRadius={0.015} color="#38bdf8" phaseOffset={0} />
        <HelixTube radius={HELIX_RADIUS} height={HELIX_HEIGHT} turns={HELIX_TURNS} tubeRadius={0.015} color="#f59e0b" phaseOffset={Math.PI} />

        {/* ── Strand A — SKY blocks (chain data) ── */}
        {strandA.map((item, i) => (
          <group key={`a-${i}`} position={item.pos} rotation={[0, item.rotY, 0]}>
            <mesh>
              <boxGeometry args={[0.3, 0.2, 0.2]} />
              <meshStandardMaterial
                color="#0f1a2e"
                emissive="#38bdf8"
                emissiveIntensity={0.5 + (i % 4) * 0.15}
                metalness={0.5}
                roughness={0.2}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.32, 0.22, 0.22]} />
              <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.2} />
            </mesh>
          </group>
        ))}

        {/* ── Strand B — AMBER blocks (transaction data) ── */}
        {strandB.map((item, i) => (
          <group key={`b-${i}`} position={item.pos} rotation={[0, item.rotY, 0]}>
            <mesh>
              <boxGeometry args={[0.3, 0.2, 0.2]} />
              <meshStandardMaterial
                color="#1a1810"
                emissive="#f59e0b"
                emissiveIntensity={0.5 + (i % 4) * 0.15}
                metalness={0.5}
                roughness={0.2}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.32, 0.22, 0.22]} />
              <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.2} />
            </mesh>
          </group>
        ))}

      </group>

      {/* ── Central Core — genesis pulse ── */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <PulseMaterial color="#fb7185" baseIntensity={2.5} pulseSpeed={1.2} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.52, 2]} />
        <meshBasicMaterial color="#fb7185" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.04} />
      </mesh>

      {/* ── Spiraling data stream particles ── */}
      <points ref={dataStreamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[streamPositions.slice(), 3]}
            count={streamPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#4ade80" sizeAttenuation transparent opacity={0.9} />
      </points>

      <FloatingParticles count={100} spread={6} color="#38bdf8" size={1.5} />
      <FloatingParticles count={50} spread={5} color="#f59e0b" size={1} />
      <FloatingParticles count={30} spread={4} color="#4ade80" size={0.7} />
    </group>
  );
};

// ─── SCENE 2: CONSENSUS — Validator Ring Protocol ────────────────────
export const ConsensusScene = () => {
  const groupRef = useRef();
  const blockRef = useRef();
  const nodesRef = useRef([]);
  const ringPulseRef = useRef();

  const NODE_COUNT = 8;
  const RING_RADIUS = 2.4;
  const colors = ['#38bdf8', '#4ade80', '#f59e0b', '#fb7185', '#38bdf8', '#4ade80', '#f59e0b', '#a78bfa'];

  // Validator node positions — clean horizontal ring
  const nodePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      positions.push([
        Math.cos(angle) * RING_RADIUS,
        0,
        Math.sin(angle) * RING_RADIUS
      ]);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Entire scene rotates very slowly for viewing angle
    groupRef.current.rotation.y = t * 0.05;

    // Block rotates and gently floats
    blockRef.current.rotation.y = t * 0.12;
    blockRef.current.position.y = Math.sin(t * 0.6) * 0.15;

    // Validators pulse in a sequential wave (consensus propagation)
    nodesRef.current.forEach((node, i) => {
      if (node) {
        const wave = Math.sin(t * 2 - i * 0.8);
        const scale = 1 + Math.max(0, wave) * 0.3;
        node.scale.setScalar(scale);
      }
    });

    // Consensus confirmation ring expands and fades cyclically
    if (ringPulseRef.current) {
      const cycle = (t * 0.4) % 1;
      const r = 0.5 + cycle * 2.5;
      ringPulseRef.current.scale.setScalar(r);
      ringPulseRef.current.material.opacity = 0.15 * (1 - cycle);
    }
  });

  return (
    <group ref={groupRef} scale={1.3}>
      {/* ── Central Proof Block (the block being validated) ── */}
      <Float floatIntensity={0.3} speed={1}>
        <group ref={blockRef}>
          {/* Block body — solid amber crystal */}
          <mesh>
            <boxGeometry args={[1.0, 1.0, 1.0]} />
            <meshStandardMaterial
              color="#1a1510"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              metalness={0.5}
              roughness={0.15}
            />
          </mesh>
          {/* Block wireframe */}
          <mesh>
            <boxGeometry args={[1.02, 1.02, 1.02]} />
            <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.5} />
          </mesh>
          {/* Block inner core */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <PulseMaterial color="#f59e0b" baseIntensity={3} pulseSpeed={1.2} />
          </mesh>
        </group>
      </Float>

      {/* ── Expanding Consensus Pulse Ring ── */}
      <mesh ref={ringPulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.04, 8, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.15} />
      </mesh>

      {/* ── Validator Ring (flat ring connecting all nodes) ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, 0.015, 8, 64]} />
        <EmissiveMaterial color="#38bdf8" intensity={1} />
      </mesh>

      {/* ── Validator Nodes ── */}
      {nodePositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Validator body */}
          <mesh ref={el => nodesRef.current[i] = el}>
            <octahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial
              color="#101520"
              emissive={colors[i]}
              emissiveIntensity={1}
              metalness={0.4}
              roughness={0.2}
            />
          </mesh>
          {/* Validator wireframe edge */}
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <meshBasicMaterial color={colors[i]} wireframe transparent opacity={0.3} />
          </mesh>
          {/* Glow halo */}
          <mesh>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshBasicMaterial color={colors[i]} transparent opacity={0.04} />
          </mesh>
          {/* Beam to center block */}
          <HelixRung from={pos} to={[0, 0, 0]} color={colors[i]} opacity={0.12} thickness={0.012} />
        </group>
      ))}


      <FloatingParticles count={60} spread={6} color="#f59e0b" size={1} />
      <FloatingParticles count={40} spread={5} color="#38bdf8" size={0.7} />
    </group>
  );
};

// ─── SCENE 3: TOKENS — Token Mint Reactor ────────────────────────────
export const TokensScene = () => {
  const outerRef = useRef();
  const reactorRef = useRef();
  const erc20Ref = useRef();
  const erc721Ref = useRef();
  const erc1155Ref = useRef();
  const ringPulseRef = useRef();
  const mintStreamRef = useRef();

  // Mint stream particles — orbiting the reactor
  const mintPositions = useMemo(() => {
    const positions = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      positions.push(Math.cos(t) * 2.5, Math.sin(t * 3) * 0.3, Math.sin(t) * 2.5);
    }
    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    outerRef.current.rotation.y = t * 0.04;

    // Reactor core pulses
    const rPulse = 1 + Math.sin(t * 2) * 0.06;
    reactorRef.current.scale.setScalar(rPulse);
    reactorRef.current.rotation.y = t * 0.15;
    reactorRef.current.rotation.x = t * 0.08;

    // ERC-20: orbits steadily on lane 1 (bottom ring)
    const a20 = t * 0.4;
    erc20Ref.current.position.set(Math.cos(a20) * 2.6, -1.2, Math.sin(a20) * 2.6);
    erc20Ref.current.rotation.y = t * 0.5;

    // ERC-721: orbits on lane 2 (mid ring, opposite direction)
    const a721 = -t * 0.3 + Math.PI * 0.66;
    erc721Ref.current.position.set(Math.cos(a721) * 2.8, 0, Math.sin(a721) * 2.8);
    erc721Ref.current.rotation.y = t * 0.2;
    erc721Ref.current.rotation.x = Math.sin(t * 0.5) * 0.3;

    // ERC-1155: orbits on lane 3 (top ring)
    const a1155 = t * 0.35 + Math.PI * 1.33;
    erc1155Ref.current.position.set(Math.cos(a1155) * 2.4, 1.2, Math.sin(a1155) * 2.4);
    erc1155Ref.current.rotation.y = t * 0.25;
    erc1155Ref.current.rotation.z = Math.sin(t * 0.6) * 0.2;

    // Expanding mint pulse
    if (ringPulseRef.current) {
      const cycle = (t * 0.5) % 1;
      ringPulseRef.current.scale.setScalar(0.5 + cycle * 1.5);
      ringPulseRef.current.material.opacity = 0.12 * (1 - cycle);
    }

    // Mint stream particles spiral
    if (mintStreamRef.current) {
      const pos = mintStreamRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const phase = ((t * 0.5 + i * 0.07) % (Math.PI * 2));
        const r = 2.5 + Math.sin(phase * 2) * 0.3;
        pos.array[ix] = Math.cos(phase) * r;
        pos.array[ix + 1] = Math.sin(phase * 3) * 0.6;
        pos.array[ix + 2] = Math.sin(phase) * r;
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group scale={1.1} ref={outerRef}>
      {/* ── Central Reactor Core ── */}
      <group ref={reactorRef}>
        <mesh>
          <icosahedronGeometry args={[0.8, 2]} />
          <meshStandardMaterial
            color="#12101a"
            emissive="#38bdf8"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.82, 2]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.3} />
        </mesh>
        {/* Inner core fire */}
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <PulseMaterial color="#f59e0b" baseIntensity={3} pulseSpeed={1.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.05} />
        </mesh>
      </group>

      {/* ── Expanding Mint Pulse Ring ── */}
      <mesh ref={ringPulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.04, 8, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
      </mesh>

      {/* ── Three Orbital Lane Rings ── */}
      {/* Lane 1 — bottom (ERC-20) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <torusGeometry args={[2.6, 0.012, 8, 64]} />
        <EmissiveMaterial color="#f59e0b" intensity={1.2} />
      </mesh>
      {/* Lane 2 — mid (ERC-721) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.012, 8, 64]} />
        <EmissiveMaterial color="#fb7185" intensity={1.2} />
      </mesh>
      {/* Lane 3 — top (ERC-1155) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}>
        <torusGeometry args={[2.4, 0.012, 8, 64]} />
        <EmissiveMaterial color="#4ade80" intensity={1.2} />
      </mesh>

      {/* ── ERC-20: Coin Stack (orbiting) ── */}
      <group ref={erc20Ref}>
        {[0, 0.15, 0.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 6]} />
            <meshStandardMaterial
              color="#1a1810"
              emissive="#f59e0b"
              emissiveIntensity={0.8 + i * 0.3}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.15, 0]}>
          <torusGeometry args={[0.52, 0.025, 16, 6]} />
          <EmissiveMaterial color="#f59e0b" intensity={2.5} />
        </mesh>
      </group>

      {/* ── ERC-721: Crystal Gem (orbiting) ── */}
      <group ref={erc721Ref}>
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#1a1028"
            emissive="#fb7185"
            emissiveIntensity={0.7}
            metalness={0.5}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.72, 0]} />
          <meshBasicMaterial color="#fb7185" wireframe transparent opacity={0.45} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <PulseMaterial color="#fb7185" baseIntensity={3} pulseSpeed={1.5} />
        </mesh>
        {/* Crown spike */}
        <mesh position={[0, 0.85, 0]}>
          <coneGeometry args={[0.08, 0.25, 4]} />
          <EmissiveMaterial color="#fb7185" intensity={2} />
        </mesh>
      </group>

      {/* ── ERC-1155: Hybrid Dodecahedron (orbiting) ── */}
      <group ref={erc1155Ref}>
        <mesh>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#0f1a20"
            emissive="#4ade80"
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.15}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh>
          <dodecahedronGeometry args={[0.62, 0]} />
          <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.35} />
        </mesh>
        {/* Dual-core showing hybrid nature */}
        <mesh position={[-0.12, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <EmissiveMaterial color="#f59e0b" intensity={2.5} />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <EmissiveMaterial color="#fb7185" intensity={2.5} />
        </mesh>
      </group>

      {/* ── Reactor vertical energy axis ── */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 3.5, 8, 1, true]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Mint Stream Particles ── */}
      <points ref={mintStreamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[mintPositions.slice(), 3]}
            count={mintPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#f59e0b" sizeAttenuation transparent opacity={0.8} />
      </points>

      <FloatingParticles count={60} spread={6} color="#f59e0b" size={1.2} />
      <FloatingParticles count={40} spread={5} color="#fb7185" size={0.8} />
      <FloatingParticles count={30} spread={4} color="#4ade80" size={0.6} />
    </group>
  );
};

// ─── SCENE 4: DEFI — Liquidity Flow Network ─────────────────────────
export const DeFiScene = () => {
  const outerRef = useRef();
  const poolARef = useRef();
  const poolBRef = useRef();
  const flowRef = useRef();
  const curveRef = useRef();

  // Generate flowing particles along a path between pools
  const flowPositions = useMemo(() => {
    const positions = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      positions.push(
        Math.cos(t) * 1.8,
        Math.sin(t * 2) * 0.4,
        Math.sin(t) * 1.8
      );
    }
    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    outerRef.current.rotation.y = t * 0.03;

    // Pools gently breathe
    const pulseA = 1 + Math.sin(t * 0.8) * 0.04;
    const pulseB = 1 + Math.sin(t * 0.8 + Math.PI) * 0.04;
    poolARef.current.scale.setScalar(pulseA);
    poolBRef.current.scale.setScalar(pulseB);

    // Flow particles animate along path
    if (flowRef.current) {
      const pos = flowRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const phase = ((t * 0.4 + i * 0.05) % (Math.PI * 2));
        pos.array[ix] = Math.cos(phase) * 1.8;
        pos.array[ix + 1] = Math.sin(phase * 2) * 0.4;
        pos.array[ix + 2] = Math.sin(phase) * 1.8;
      }
      pos.needsUpdate = true;
    }

    // Bonding curve rotates slowly
    curveRef.current.rotation.y = t * 0.05;
    curveRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
  });

  return (
    <group scale={1.15} ref={outerRef}>
      {/* ── Pool A (Token A — left) ── */}
      <group ref={poolARef} position={[-1.8, 0, 0]}>
        {/* Toroidal pool chamber */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.35, 20, 48]} />
          <meshStandardMaterial
            color="#0f1a2e"
            emissive="#4ade80"
            emissiveIntensity={0.4}
            metalness={0.3}
            roughness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Pool wireframe edge */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.02, 0.36, 20, 48]} />
          <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.2} />
        </mesh>
        {/* Pool core light */}
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <PulseMaterial color="#4ade80" baseIntensity={2} pulseSpeed={1.2} />
        </mesh>
        {/* Pool label dot */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <EmissiveMaterial color="#4ade80" intensity={3} />
        </mesh>
      </group>

      {/* ── Pool B (Token B — right) ── */}
      <group ref={poolBRef} position={[1.8, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.35, 20, 48]} />
          <meshStandardMaterial
            color="#0f1520"
            emissive="#38bdf8"
            emissiveIntensity={0.4}
            metalness={0.3}
            roughness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.02, 0.36, 20, 48]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <PulseMaterial color="#38bdf8" baseIntensity={2} pulseSpeed={1.2} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <EmissiveMaterial color="#38bdf8" intensity={3} />
        </mesh>
      </group>

      {/* ── Flowing Swap Particles (between pools) ── */}
      <points ref={flowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[flowPositions.slice(), 3]}
            count={flowPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#f59e0b" sizeAttenuation transparent opacity={0.9} />
      </points>

      {/* ── Central Bonding Curve Surface (x*y=k) ── */}
      <group ref={curveRef} position={[0, -0.2, 0]}>
        {/* Hyperbolic mesh representing the AMM curve */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.015, 8, 64]} />
          <EmissiveMaterial color="#f59e0b" intensity={2} />
        </mesh>
        {/* Second curve ring at angle */}
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[1.6, 0.012, 8, 64]} />
          <EmissiveMaterial color="#f59e0b" intensity={1.5} />
        </mesh>
        {/* Central k-constant indicator */}
        <mesh>
          <icosahedronGeometry args={[0.2, 1]} />
          <EmissiveMaterial color="#f59e0b" intensity={3} />
        </mesh>
      </group>

      <FloatingParticles count={60} spread={5} color="#f59e0b" size={1.5} />
      <FloatingParticles count={40} spread={4} color="#4ade80" size={0.8} />
      <FloatingParticles count={30} spread={3} color="#38bdf8" size={0.6} />
    </group>
  );
};

// ─── SCENE 5: DEPLOYMENT — Launchpad Upload ──────────────────────────
export const DeploymentScene = () => {
  const groupRef = useRef();
  const contractRef = useRef();
  const streamRef = useRef();
  const padRef = useRef();

  // Upload stream particles — vertical column
  const streamPositions = useMemo(() => {
    const positions = [];
    const count = 100;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 8;
      const r = 0.3 + (i / count) * 0.2;
      positions.push(
        Math.cos(angle) * r,
        -2.0 + (i / count) * 4.5,
        Math.sin(angle) * r
      );
    }
    return new Float32Array(positions);
  }, []);

  // Network nodes — well-spaced arc above the contract
  const nodePositions = [
    [-2.0, 2.5, 0],
    [-1.0, 3.0, -0.5],
    [0, 3.3, 0],
    [1.0, 3.0, 0.5],
    [2.0, 2.5, 0],
  ];
  const nodeColors = ['#38bdf8', '#4ade80', '#f59e0b', '#fb7185', '#a78bfa'];

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Gentle scene rotation
    groupRef.current.rotation.y = t * 0.04;

    // Contract hovers and rotates
    contractRef.current.rotation.y = t * 0.2;
    contractRef.current.position.y = 0.5 + Math.sin(t * 0.8) * 0.15;

    // Stream particles flow upward continuously
    if (streamRef.current) {
      const pos = streamRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const baseY = streamPositions[ix + 1];
        const speed = 0.5 + (i / pos.count) * 0.3;
        const yOffset = (t * speed + i * 0.05) % 4.5;
        const angle = (i / pos.count) * Math.PI * 8 + t * 0.5;
        const r = 0.2 + (yOffset / 4.5) * 0.15;
        pos.array[ix] = Math.cos(angle) * r;
        pos.array[ix + 1] = -2.0 + yOffset;
        pos.array[ix + 2] = Math.sin(angle) * r;
      }
      pos.needsUpdate = true;
    }

    // Launchpad pulse
    padRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
  });

  return (
    <group ref={groupRef} scale={1.2}>

      {/* ── Launchpad Base ── */}
      <group ref={padRef} position={[0, -2.2, 0]}>
        {/* Pad disc — flat horizontal platform */}
        <mesh>
          <cylinderGeometry args={[1.8, 2.0, 0.08, 32]} />
          <meshStandardMaterial
            color="#151722"
            emissive="#38bdf8"
            emissiveIntensity={0.2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Pad edge ring — horizontal */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.9, 0.025, 16, 48]} />
          <EmissiveMaterial color="#38bdf8" intensity={1.5} />
        </mesh>
        {/* Inner ring — horizontal */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <torusGeometry args={[0.8, 0.015, 16, 32]} />
          <EmissiveMaterial color="#f59e0b" intensity={1.2} />
        </mesh>
        {/* Pad glow */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── Upload Stream (spiraling particles) ── */}
      <points ref={streamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[streamPositions.slice(), 3]}
            count={streamPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#38bdf8" sizeAttenuation transparent opacity={0.8} />
      </points>

      {/* ── Central upload guide tube ── */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4.2, 8, 1, true]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Contract Artifact (floating above pad) ── */}
      <group ref={contractRef}>
        {/* Contract body */}
        <mesh>
          <boxGeometry args={[0.7, 0.9, 0.7]} />
          <meshStandardMaterial
            color="#151025"
            emissive="#4ade80"
            emissiveIntensity={0.7}
            metalness={0.5}
            roughness={0.15}
          />
        </mesh>
        {/* Contract wireframe */}
        <mesh>
          <boxGeometry args={[0.72, 0.92, 0.72]} />
          <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.4} />
        </mesh>
        {/* Inner compilation core */}
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <PulseMaterial color="#4ade80" baseIntensity={2.5} pulseSpeed={2} />
        </mesh>
      </group>

      {/* ── Network Nodes (arc above) ── */}
      {nodePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <Float floatIntensity={0.4} speed={1.5 + i * 0.2}>
            {/* Node body */}
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial
                color="#101520"
                emissive={nodeColors[i]}
                emissiveIntensity={1}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>
            {/* Node wireframe */}
            <mesh>
              <sphereGeometry args={[0.3, 10, 10]} />
              <meshBasicMaterial color={nodeColors[i]} wireframe transparent opacity={0.15} />
            </mesh>
            {/* Node glow halo */}
            <mesh>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshBasicMaterial color={nodeColors[i]} transparent opacity={0.04} />
            </mesh>
          </Float>
        </group>
      ))}

      <FloatingParticles count={50} spread={5} color="#38bdf8" size={1} />
      <FloatingParticles count={25} spread={4} color="#4ade80" size={0.7} />
    </group>
  );
};

// ─── SCENE 6: SECURITY — Cyber Vault with Scanner ────────────────────
export const SecurityScene = () => {
  const vaultRef = useRef();
  const scannerRef = useRef();
  const scanPlaneRef = useRef();
  const sentinelsRef = useRef([]);
  const coreRef = useRef();

  const SENTINEL_COUNT = 4;
  const sentinelPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < SENTINEL_COUNT; i++) {
      const angle = (i / SENTINEL_COUNT) * Math.PI * 2;
      const r = 3.0;
      positions.push([Math.cos(angle) * r, 0, Math.sin(angle) * r]);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Vault slow dignified rotation
    vaultRef.current.rotation.y = t * 0.06;
    vaultRef.current.rotation.x = Math.sin(t * 0.15) * 0.03;

    // Core heartbeat
    const heartbeat = Math.pow(Math.sin(t * 2), 2) * 0.1;
    coreRef.current.scale.setScalar(1 + heartbeat);

    // Scanner helix rotation — continuous sweep
    scannerRef.current.rotation.y = t * 0.4;
    scannerRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;

    // Sentinel nodes pulse in sequence (monitoring)
    sentinelsRef.current.forEach((sentinel, i) => {
      if (sentinel) {
        const phase = t * 1.5 + i * (Math.PI / 2);
        sentinel.scale.setScalar(1 + Math.sin(phase) * 0.15);
      }
    });
  });

  return (
    <group>
      {/* ── Central Vault (Dodecahedron) ── */}
      <group ref={vaultRef}>
        {/* Vault body — dark metallic */}
        <mesh>
          <dodecahedronGeometry args={[1.6, 0]} />
          <meshStandardMaterial
            color="#12101a"
            emissive="#fb7185"
            emissiveIntensity={0.25}
            metalness={0.7}
            roughness={0.15}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Vault wireframe — structural integrity lines */}
        <mesh>
          <dodecahedronGeometry args={[1.62, 0]} />
          <meshBasicMaterial color="#fb7185" wireframe transparent opacity={0.35} />
        </mesh>
        {/* Secondary inner cage */}
        <mesh>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.12} />
        </mesh>

        {/* Vault core — the protected asset */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <PulseMaterial color="#f59e0b" baseIntensity={2.5} pulseSpeed={2} />
        </mesh>
        {/* Core ambient glow */}
        <mesh>
          <sphereGeometry args={[0.75, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.06} />
        </mesh>

      </group>

      {/* ── Scanner Helix (Rotating audit sweep) ── */}
      <group ref={scannerRef}>
        <mesh>
          <torusGeometry args={[2.2, 0.02, 8, 64]} />
          <EmissiveMaterial color="#38bdf8" intensity={2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.015, 8, 64]} />
          <EmissiveMaterial color="#38bdf8" intensity={1.5} />
        </mesh>
        {/* Scanner head — bright dot that orbits */}
        <mesh position={[2.2, 0, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <EmissiveMaterial color="#38bdf8" intensity={4} />
        </mesh>
      </group>

      {/* ── Sentinel Monitoring Nodes ── */}
      {sentinelPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh ref={el => sentinelsRef.current[i] = el}>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color="#0f1a15"
              emissive="#4ade80"
              emissiveIntensity={1.2}
              metalness={0.4}
              roughness={0.2}
            />
          </mesh>
          {/* Sentinel wireframe */}
          <mesh>
            <octahedronGeometry args={[0.27, 0]} />
            <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.3} />
          </mesh>
          {/* Sentinel glow */}
          <mesh>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial color="#4ade80" transparent opacity={0.04} />
          </mesh>
          {/* Beam from sentinel to vault */}
          <HelixRung from={pos} to={[0, 0, 0]} color="#4ade80" opacity={0.1} thickness={0.012} />
        </group>
      ))}

      {/* Outer defense perimeter ring */}
      <OrbitalRing radius={3.8} tubeRadius={0.006} color="#4ade80" rotationAxis={[0, Math.PI / 3, Math.PI / 8]} speed={0.06} />

      <FloatingParticles count={70} spread={6} color="#fb7185" size={1.2} />
      <FloatingParticles count={40} spread={5} color="#38bdf8" size={0.8} />
      <FloatingParticles count={25} spread={4} color="#4ade80" size={0.6} />
    </group>
  );
};

// ─── SCENE 7: GLOSSARY — Knowledge Neural Network ───────────────────
export const GlossaryScene = () => {
  const groupRef = useRef();
  const nodesRef = useRef([]);
  const pulseTrailRef = useRef();

  const NODE_COUNT = 14;
  const colors = ['#38bdf8', '#f59e0b', '#fb7185', '#4ade80', '#a78bfa', '#38bdf8', '#f59e0b',
                  '#fb7185', '#4ade80', '#a78bfa', '#38bdf8', '#f59e0b', '#4ade80', '#fb7185'];

  // Organic 3D positions for neural nodes (spread in a brain-like cluster)
  const nodePositions = useMemo(() => {
    const positions = [];
    const golden = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT);
      const phi = Math.PI * 2 * i / golden;
      const r = 2.2 + Math.sin(i * 1.5) * 0.5;
      positions.push([
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta) * 0.7,
        r * Math.sin(theta) * Math.sin(phi)
      ]);
    }
    return positions;
  }, []);

  // Pre-compute connections between nearby nodes (synapses)
  const connections = useMemo(() => {
    const conns = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodePositions[i][0] - nodePositions[j][0];
        const dy = nodePositions[i][1] - nodePositions[j][1];
        const dz = nodePositions[i][2] - nodePositions[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3.0) {
          conns.push({ from: i, to: j, dist });
        }
      }
    }
    return conns;
  }, [nodePositions]);

  // Pulse trail particles moving along connections
  const pulsePositions = useMemo(() => {
    const positions = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      positions.push(0, 0, 0);
    }
    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.04;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.03;

    // Nodes pulse in waves (synaptic firing)
    nodesRef.current.forEach((node, i) => {
      if (node) {
        const wave = Math.sin(t * 1.2 + i * 0.7);
        const scale = 1 + Math.max(0, wave) * 0.35;
        node.scale.setScalar(scale);
      }
    });

    // Pulse particles travel along random connections
    if (pulseTrailRef.current) {
      const pos = pulseTrailRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const connIdx = i % connections.length;
        const conn = connections[connIdx];
        const fromPos = nodePositions[conn.from];
        const toPos = nodePositions[conn.to];
        const progress = ((t * 0.8 + i * 0.15) % 1);
        pos.array[ix] = fromPos[0] + (toPos[0] - fromPos[0]) * progress;
        pos.array[ix + 1] = fromPos[1] + (toPos[1] - fromPos[1]) * progress;
        pos.array[ix + 2] = fromPos[2] + (toPos[2] - fromPos[2]) * progress;
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} scale={1.15}>
      {/* ── Neural Nodes (knowledge terms) ── */}
      {nodePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <Float floatIntensity={0.6} speed={1 + (i % 3) * 0.5} rotationIntensity={0.1}>
            {/* Node body — glowing sphere */}
            <mesh ref={el => nodesRef.current[i] = el}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial
                color="#101520"
                emissive={colors[i]}
                emissiveIntensity={1.2}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>
            {/* Node outer halo ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.35, 0.015, 8, 24]} />
              <meshBasicMaterial color={colors[i]} transparent opacity={0.2} />
            </mesh>
            {/* Node ambient glow */}
            <mesh>
              <sphereGeometry args={[0.45, 8, 8]} />
              <meshBasicMaterial color={colors[i]} transparent opacity={0.04} />
            </mesh>
          </Float>
        </group>
      ))}

      {/* ── Synaptic Connections (beams between nodes) ── */}
      {connections.map((conn, i) => (
        <HelixRung
          key={i}
          from={nodePositions[conn.from]}
          to={nodePositions[conn.to]}
          color={colors[conn.from]}
          opacity={0.08 + (1 / conn.dist) * 0.05}
          thickness={0.012}
        />
      ))}

      {/* ── Traveling Pulse Particles (knowledge lookup animation) ── */}
      <points ref={pulseTrailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions.slice(), 3]}
            count={pulsePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.07} color="#f59e0b" sizeAttenuation transparent opacity={0.9} />
      </points>

      {/* ── Central hub node (the search/index core) ── */}
      <mesh>
        <icosahedronGeometry args={[0.4, 1]} />
        <PulseMaterial color="#38bdf8" baseIntensity={2} pulseSpeed={1} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.04} />
      </mesh>

      {/* ── Outer containment ── */}
      <OrbitalRing radius={3.2} tubeRadius={0.008} color="#a78bfa" rotationAxis={[Math.PI / 5, 0, 0]} speed={0.05} />
      <OrbitalRing radius={3.5} tubeRadius={0.006} color="#38bdf8" rotationAxis={[Math.PI / 3, Math.PI / 4, 0]} speed={0.04} />

      <FloatingParticles count={80} spread={6} color="#38bdf8" size={1} />
      <FloatingParticles count={30} spread={5} color="#f59e0b" size={0.7} />
      <FloatingParticles count={20} spread={4} color="#a78bfa" size={0.5} />
    </group>
  );
};

// ─── SCENE 8: SOLIDITY — Smart Contract Compiler Cube ────────────────
export const SolidityScene = () => {
  const groupRef = useRef();
  const cubeRef = useRef();
  const layersRef = useRef([]);
  const bytecodeRef = useRef();
  const bracketLRef = useRef();
  const bracketRRef = useRef();

  // Bytecode particles flowing outward from cube
  const bytecodePositions = useMemo(() => {
    const positions = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.5 + (i / count) * 2;
      positions.push(Math.cos(angle) * r, (Math.random() - 0.5) * 3, Math.sin(angle) * r);
    }
    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.05;

    // Main cube rotates and morphs
    cubeRef.current.rotation.y = t * 0.12;
    cubeRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;

    // Circuit board layers expand/contract (compilation phases)
    layersRef.current.forEach((layer, i) => {
      if (layer) {
        const offset = Math.sin(t * 0.6 + i * 1.2) * 0.4;
        const baseY = (i - 1) * 0.8;
        layer.position.y = baseY + offset;
        layer.rotation.y = t * 0.08 * (i % 2 === 0 ? 1 : -1);
      }
    });

    // Brackets pulse open/close (syntax brackets { })
    const breathe = Math.sin(t * 0.8) * 0.3;
    bracketLRef.current.position.x = -2.0 - breathe;
    bracketRRef.current.position.x = 2.0 + breathe;

    // Bytecode particles radiate outward
    if (bytecodeRef.current) {
      const pos = bytecodeRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ix = i * 3;
        const phase = ((t * 0.3 + i * 0.08) % 1);
        const angle = (i / pos.count) * Math.PI * 2 + t * 0.15;
        const r = 1.2 + phase * 2.5;
        pos.array[ix] = Math.cos(angle) * r;
        pos.array[ix + 1] = Math.sin(t * 0.5 + i * 0.3) * (1.5 * phase);
        pos.array[ix + 2] = Math.sin(angle) * r;
      }
      pos.needsUpdate = true;
    }
  });

  const layerColors = ['#38bdf8', '#f59e0b', '#fb7185'];

  return (
    <group ref={groupRef} scale={1.15}>
      {/* ── Central Compilation Cube ── */}
      <group ref={cubeRef}>
        {/* Solid contract body */}
        <mesh>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshStandardMaterial
            color="#0f0a1a"
            emissive="#fb7185"
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Wireframe */}
        <mesh>
          <boxGeometry args={[1.32, 1.32, 1.32]} />
          <meshBasicMaterial color="#fb7185" wireframe transparent opacity={0.4} />
        </mesh>
        {/* Inner processing core */}
        <mesh>
          <octahedronGeometry args={[0.4, 0]} />
          <PulseMaterial color="#f59e0b" baseIntensity={2.5} pulseSpeed={2} />
        </mesh>
        {/* Core glow */}
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.05} />
        </mesh>
      </group>

      {/* ── Expanding Circuit Board Layers (compilation stages) ── */}
      {layerColors.map((color, i) => (
        <group key={i} ref={el => layersRef.current[i] = el} position={[0, (i - 1) * 0.8, 0]}>
          {/* Flat circuit layer */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0 + i * 0.3, 1.8 + i * 0.3, 6]} />
            <meshStandardMaterial
              color="#151722"
              emissive={color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Layer edge ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.8 + i * 0.3, 0.012, 8, 6]} />
            <EmissiveMaterial color={color} intensity={1.5} />
          </mesh>
          {/* Layer inner ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.0 + i * 0.3, 0.008, 8, 6]} />
            <EmissiveMaterial color={color} intensity={1} />
          </mesh>
        </group>
      ))}

      {/* ── Syntax Brackets { } (pulsing open/close) ── */}
      <group ref={bracketLRef} position={[-2.0, 0, 0]}>
        {/* Left bracket { — vertical bar + two prongs */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 2.0, 0.08]} />
          <EmissiveMaterial color="#38bdf8" intensity={2} />
        </mesh>
        <mesh position={[0.2, 0.9, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.08]} />
          <EmissiveMaterial color="#38bdf8" intensity={2} />
        </mesh>
        <mesh position={[0.2, -0.9, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.08]} />
          <EmissiveMaterial color="#38bdf8" intensity={2} />
        </mesh>
        {/* Center prong */}
        <mesh position={[-0.15, 0, 0]}>
          <boxGeometry args={[0.3, 0.08, 0.08]} />
          <EmissiveMaterial color="#38bdf8" intensity={2.5} />
        </mesh>
      </group>

      <group ref={bracketRRef} position={[2.0, 0, 0]}>
        {/* Right bracket } — mirror */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 2.0, 0.08]} />
          <EmissiveMaterial color="#38bdf8" intensity={2} />
        </mesh>
        <mesh position={[-0.2, 0.9, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.08]} />
          <EmissiveMaterial color="#38bdf8" intensity={2} />
        </mesh>
        <mesh position={[-0.2, -0.9, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.08]} />
          <EmissiveMaterial color="#38bdf8" intensity={2} />
        </mesh>
        <mesh position={[0.15, 0, 0]}>
          <boxGeometry args={[0.3, 0.08, 0.08]} />
          <EmissiveMaterial color="#38bdf8" intensity={2.5} />
        </mesh>
      </group>

      {/* ── Bytecode Output Particles ── */}
      <points ref={bytecodeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bytecodePositions.slice(), 3]}
            count={bytecodePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#4ade80" sizeAttenuation transparent opacity={0.7} />
      </points>

      <FloatingParticles count={60} spread={6} color="#fb7185" size={1} />
      <FloatingParticles count={40} spread={5} color="#38bdf8" size={0.7} />
      <FloatingParticles count={25} spread={4} color="#4ade80" size={0.5} />
    </group>
  );
};

// ─── POST-PROCESSING EFFECTS ─────────────────────────────────────────

const PostEffects = () => (
  <EffectComposer>
    <Bloom
      luminanceThreshold={0.2}
      luminanceSmoothing={0.9}
      intensity={1.0}
      mipmapBlur
    />
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={new THREE.Vector2(0.0004, 0.0004)}
    />
    <Vignette
      offset={0.3}
      darkness={0.55}
      blendFunction={BlendFunction.NORMAL}
    />
  </EffectComposer>
);

// ─── MAIN CANVAS COMPONENT ───────────────────────────────────────────

const SceneContent = ({ sceneId }) => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

    <OrbitControls
      enablePan={false}
      enableZoom={true}
      minDistance={3}
      maxDistance={20}
      enableRotate={true}
      autoRotate={true}
      autoRotateSpeed={0.2}
      enableDamping={true}
      dampingFactor={0.04}
    />

    {/* Lighting — balanced for dark scene with emissive materials */}
    <ambientLight intensity={0.4} color="#c8d4e8" />
    <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
    <pointLight position={[-10, -10, -10]} intensity={0.6} color="#fb7185" />
    <pointLight position={[10, -5, 5]} intensity={0.4} color="#38bdf8" />
    <pointLight position={[0, 10, -10]} intensity={0.3} color="#f59e0b" />

    <Center>
      {sceneId === 'home' && <HomeScene />}
      {sceneId === 'solidity' && <SolidityScene />}
      {sceneId === 'tokens' && <TokensScene />}
      {sceneId === 'defi' && <DeFiScene />}
      {sceneId === 'deployment' && <DeploymentScene />}
      {sceneId === 'consensus' && <ConsensusScene />}
      {sceneId === 'security' && <SecurityScene />}
      {sceneId === 'glossary' && <GlossaryScene />}
    </Center>

    <PostEffects />
  </>
);

export default function Scene3D({ sceneId }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', pointerEvents: 'auto', background: 'transparent' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      className="scene3d-blend"
    >
      <SceneContent sceneId={sceneId} />
    </Canvas>
  );
}
