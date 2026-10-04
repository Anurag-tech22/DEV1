import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// -------------------------------------------------------------
// HOLOGRAPHIC CYBER DEFENSE CORE WITH GLOWING NODES & ORBITAL RING
// Single cohesive, high-tech 3D artifact with vibrant neon glow
// -------------------------------------------------------------
export default function CyberScene() {
  const groupRef = useRef<THREE.Group>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const orbitRingRef = useRef<THREE.Group>(null);
  const vertexPointsRef = useRef<THREE.Points>(null);

  // Generate geodesic sphere geometry and extract vertex positions for glowing nodes
  const { sphereGeo, vertexPositions } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(3.0, 2);
    const pos = geo.attributes.position.array as Float32Array;
    return { sphereGeo: geo, vertexPositions: pos };
  }, []);

  // Floating ambient cyber embers around the core
  const auraPositions = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3.6 + Math.abs(Math.sin(i * 12.34)) * 2.8;
      const theta = Math.abs(Math.cos(i * 45.67)) * Math.PI * 2;
      const phi = Math.acos(Math.sin(i * 78.91));
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotate outer geodesic wireframe & glowing nodes
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y = t * 0.12;
      outerMeshRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    }
    if (vertexPointsRef.current) {
      vertexPointsRef.current.rotation.y = t * 0.12;
      vertexPointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    }

    // Counter-rotate inner crystal core with subtle breathing pulse
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.22;
      innerCoreRef.current.rotation.z = t * 0.15;
      const pulse = 1 + Math.sin(t * 2.0) * 0.06;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Orbit ring rotation
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = t * 0.18;
      orbitRingRef.current.rotation.y = Math.sin(t * 0.15) * 0.25;
    }

    // Fluid mouse parallax
    if (groupRef.current) {
      const targetY = state.pointer.x * 0.25;
      const targetX = -state.pointer.y * 0.15;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    }
  });

  return (
    <>
      {/* High-Contrast Cyber Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 8]} intensity={2.0} color="#38bdf8" />
      <directionalLight position={[-10, -10, -6]} intensity={1.5} color="#818cf8" />
      <pointLight position={[0, 0, 6]} intensity={2.0} color="#06b6d4" distance={15} />

      {/* Main Holographic Artifact */}
      <group ref={groupRef} position={[0, 0, 0]}>
        <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.5}>
          
          {/* 1. Outer Geodesic Wireframe Sphere */}
          <mesh ref={outerMeshRef} geometry={sphereGeo}>
            <meshBasicMaterial 
              color="#38bdf8" 
              wireframe 
              transparent 
              opacity={0.45} 
            />
          </mesh>

          {/* 2. Sparkling Vertex Node Points at Grid Intersections */}
          <points ref={vertexPointsRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[vertexPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial 
              size={0.14} 
              color="#67e8f9" 
              transparent 
              opacity={0.9} 
              sizeAttenuation 
            />
          </points>

          {/* 3. Inner Crystalline Prismatic Core */}
          <group ref={innerCoreRef}>
            <mesh>
              <octahedronGeometry args={[1.8, 0]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.6}
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.35}
              />
            </mesh>
            <mesh>
              <octahedronGeometry args={[1.82, 0]} />
              <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.6} />
            </mesh>
            <pointLight color="#38bdf8" intensity={2.5} distance={6} />
          </group>

          {/* 4. Tilted Orbital Holographic Defense Ring */}
          <group ref={orbitRingRef} rotation={[Math.PI / 3.2, 0.2, 0]}>
            <mesh>
              <torusGeometry args={[4.4, 0.022, 16, 100]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
            </mesh>
            {/* Dashed outer accent ring */}
            <mesh>
              <torusGeometry args={[4.25, 0.015, 16, 80]} />
              <meshBasicMaterial color="#818cf8" transparent opacity={0.4} wireframe />
            </mesh>
          </group>

          {/* 5. Luminous Cyber Embers Aura */}
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[auraPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial 
              size={0.06} 
              color="#a5f3fc" 
              transparent 
              opacity={0.5} 
              sizeAttenuation 
            />
          </points>

        </Float>
      </group>

      {/* Vibrant Cyberpunk Neon Bloom */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.8} height={300} intensity={1.1} />
      </EffectComposer>
    </>
  );
}
