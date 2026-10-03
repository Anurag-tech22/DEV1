import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// NORMAL, CLEAN 3D - SINGLE OBJECT, ZERO CLUTTER
// A sleek metallic cyber core rotating with studio rim lighting
// -------------------------------------------------------------
export default function CyberScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth, graceful normal 3D rotation
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.22;
    }

    // Natural tactile mouse parallax
    if (groupRef.current) {
      const targetY = state.pointer.x * 0.2;
      const targetX = -state.pointer.y * 0.12;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.04);
    }
  });

  return (
    <>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 8]} intensity={1.8} color="#38bdf8" />
      <directionalLight position={[-10, -10, -6]} intensity={1.2} color="#818cf8" />
      <pointLight position={[0, 0, 7]} intensity={1.5} color="#0284c7" />

      {/* Single Normal 3D Object */}
      <group ref={groupRef}>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
          <mesh ref={meshRef} position={[0, 0, 0]}>
            <torusKnotGeometry args={[2.6, 0.65, 128, 32]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#0369a1"
              emissiveIntensity={0.25}
              roughness={0.2}
              metalness={0.85}
              wireframe={false}
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}
