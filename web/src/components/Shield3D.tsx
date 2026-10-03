import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Shield3DProps {
  verdict: 'safe' | 'suspicious' | 'scam' | 'idle';
}

export default function Shield3D({ verdict }: Shield3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  let color = '#3b82f6'; // idle
  let speed = 1;
  let distort = 0.2;
  
  if (verdict === 'safe') {
    color = '#10b981';
    speed = 1.5;
    distort = 0.1;
  } else if (verdict === 'suspicious') {
    color = '#f59e0b';
    speed = 3;
    distort = 0.4;
  } else if (verdict === 'scam') {
    color = '#ef4444';
    speed = 5;
    distort = 0.8;
  }

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed * 0.2;
      meshRef.current.rotation.y += delta * speed * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        {verdict === 'idle' || verdict === 'safe' ? (
          <icosahedronGeometry args={[1, 1]} />
        ) : (
          <icosahedronGeometry args={[1, 0]} />
        )}
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.5}
          roughness={0.2}
          distort={distort}
          speed={speed}
          wireframe={verdict === 'scam'}
        />
      </mesh>
    </Float>
  );
}
