
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Simple 3D clothing item component
function ClothingItem({ position, color, rotationSpeed, scale = 1 }: {
  position: [number, number, number],
  color: string,
  rotationSpeed: number,
  scale?: number
}) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <boxGeometry args={[1, 1.5, 0.2]} />
      <meshStandardMaterial color={color} />
      <Html position={[0, 0, 0.15]} center style={{ pointerEvents: 'none' }}>
        <div className="bg-white bg-opacity-70 p-1 rounded text-xs whitespace-nowrap">
          Fashion Item
        </div>
      </Html>
    </mesh>
  );
}

// Animated torus to represent accessories
function FashionAccessory({ position, color, pulse }: {
  position: [number, number, number],
  color: string,
  pulse: boolean
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    if (pulse) {
      const interval = setInterval(() => {
        setScale(prev => prev === 1 ? 1.1 : 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [pulse]);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusGeometry args={[0.7, 0.2, 16, 32]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

export default function FashionCarousel() {
  return (
    <div className="three-scene-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Clothing items in a circular formation */}
        <ClothingItem position={[2, 0, 0]} color="#DE5D83" rotationSpeed={0.01} />
        <ClothingItem position={[-2, 0, 0]} color="#9CAF88" rotationSpeed={0.015} />
        <ClothingItem position={[0, 2, 0]} color="#36454F" rotationSpeed={0.008} />
        <ClothingItem position={[0, -2, 0]} color="#E0C094" rotationSpeed={0.012} />
        
        {/* Fashion accessories */}
        <FashionAccessory position={[1.5, 1.5, 0]} color="#FFD700" pulse={true} />
        <FashionAccessory position={[-1.5, -1.5, 0]} color="#C0C0C0" pulse={false} />
        
        <Environment preset="city" />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
