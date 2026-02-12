import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Torus, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

// Individual floating geometric shape
function FloatingShape({ position, geometry, color, speed }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle rotation
    meshRef.current.rotation.x += 0.001 * speed;
    meshRef.current.rotation.y += 0.002 * speed;
    
    // Floating motion
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.4}
        metalness={0.8}
      />
    </mesh>
  );
}

// Main constellation scene
export default function GeometricConstellation() {
  const groupRef = useRef<THREE.Group>(null);

  // Mouse parallax effect
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const { mouse } = state;
    groupRef.current.rotation.x = mouse.y * 0.05;
    groupRef.current.rotation.y = mouse.x * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Ambient and point lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#60A5FA" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />

      {/* Geometric shapes constellation */}
      <FloatingShape
        position={[-2, 1, 0]}
        geometry={<Sphere args={[0.5, 32, 32]} />}
        color="#60A5FA"
        speed={0.5}
      />
      
      <FloatingShape
        position={[2, -0.5, -1]}
        geometry={<Octahedron args={[0.6]} />}
        color="#34D399"
        speed={0.7}
      />
      
      <FloatingShape
        position={[0, 0.5, 1]}
        geometry={<Torus args={[0.4, 0.15, 16, 32]} />}
        color="#8B5CF6"
        speed={0.6}
      />
      
      <FloatingShape
        position={[-1.5, -1, 2]}
        geometry={<Octahedron args={[0.4]} />}
        color="#60A5FA"
        speed={0.8}
      />
      
      <FloatingShape
        position={[1.5, 1.5, -2]}
        geometry={<Sphere args={[0.3, 32, 32]} />}
        color="#34D399"
        speed={0.4}
      />
    </group>
  );
}
