import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds, PerspectiveCamera } from '@react-three/drei';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shirt } from 'lucide-react';

interface ClothingDesignerProps {
  onSaveDesign?: (designData: any) => void;
}

// Scene component to handle the 3D rendering
function ClothingScene({ 
  selectedItem, 
  selectedColor, 
  logoUrl, 
  designText, 
  textColor 
}: { 
  selectedItem: string; 
  selectedColor: string; 
  logoUrl: string; 
  designText: string; 
  textColor: string;
}) {
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(document.createElement('canvas'));
  const groupRef = useRef<THREE.Group>(null);
  
  // Convert hex color to THREE.Color
  const threeColor = useMemo(() => new THREE.Color(selectedColor), [selectedColor]);
  
  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 2048; // Higher resolution for better detail
      canvasRef.current.height = 2048;
      updateCanvasTexture();
    }
  }, []);
  
  // Update when props change
  useEffect(() => {
    updateCanvasTexture();
  }, [selectedItem, selectedColor, logoUrl, designText, textColor]);
  
  // Create or update canvas texture
  const updateCanvasTexture = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Fill with base color
    ctx.fillStyle = selectedColor;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Add subtle fabric texture pattern based on clothing type
    ctx.globalAlpha = 0.1;
    
    if (selectedItem === 'tshirt') {
      // T-shirt fabric texture (fine cotton-like pattern)
      ctx.fillStyle = selectedColor === '#ffffff' ? '#eeeeee' : '#ffffff';
      
      const gridSize = 12;
      for (let x = 0; x < canvasRef.current.width; x += gridSize) {
        for (let y = 0; y < canvasRef.current.height; y += gridSize) {
          if ((x + y) % (gridSize * 2) === 0) {
            ctx.fillRect(x, y, gridSize, gridSize);
          }
        }
      }
    } else if (selectedItem === 'hoodie') {
      // Hoodie fabric texture (coarser pattern)
      ctx.fillStyle = selectedColor === '#ffffff' ? '#eeeeee' : '#ffffff';
      
      const gridSize = 24;
      for (let x = 0; x < canvasRef.current.width; x += gridSize) {
        for (let y = 0; y < canvasRef.current.height; y += gridSize) {
          if ((x + y) % (gridSize * 2) === 0) {
            ctx.fillRect(x, y, gridSize, gridSize/1.5);
          }
        }
      }
      
      // Add subtle fabric lines for hoodie
      ctx.strokeStyle = selectedColor === '#ffffff' ? '#f5f5f5' : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      
      for (let y = 0; y < canvasRef.current.height; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasRef.current.width, y);
        ctx.stroke();
      }
    } else if (selectedItem === 'pants') {
      // Pants fabric texture (denim-like pattern)
      ctx.fillStyle = selectedColor === '#ffffff' ? '#eeeeee' : '#ffffff';
      
      // Diagonal lines for denim effect
      ctx.strokeStyle = selectedColor === '#ffffff' ? '#f0f0f0' : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 2;
      
      const lineSpacing = 36;
      // Diagonal lines in one direction
      for (let i = -canvasRef.current.width; i < canvasRef.current.width * 2; i += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvasRef.current.width, canvasRef.current.height);
        ctx.stroke();
      }
      
      // Diagonal lines in opposite direction (lighter)
      ctx.globalAlpha = 0.05;
      for (let i = -canvasRef.current.width; i < canvasRef.current.width * 2; i += lineSpacing * 2) {
        ctx.beginPath();
        ctx.moveTo(i, canvasRef.current.height);
        ctx.lineTo(i + canvasRef.current.width, 0);
        ctx.stroke();
      }
    }
    
    ctx.globalAlpha = 1.0;
    
    // Add text if provided
    if (designText) {
      // Add shadow for text
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Choose font size based on text length
      const fontSize = Math.min(
        canvasRef.current.width * 0.08,
        canvasRef.current.width * 0.8 / (designText.length * 0.5)
      );
      
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Position text based on clothing type
      let textY = canvasRef.current.height * 0.35;
      if (selectedItem === 'pants') {
        textY = canvasRef.current.height * 0.2;
      } else if (selectedItem === 'hoodie') {
        textY = canvasRef.current.height * 0.4;
      }
      
      ctx.fillText(
        designText, 
        canvasRef.current.width / 2, 
        textY, 
        canvasRef.current.width * 0.8
      );
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    
    // Add logo if URL is provided
    if (logoUrl) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        if (!ctx || !canvasRef.current) return;
        
        // Draw logo in center with appropriate size
        const logoSize = canvasRef.current.width * 0.25;
        
        // Position logo based on clothing type and if there's text
        let logoY = (canvasRef.current.height - logoSize) / 2;
        if (designText) {
          if (selectedItem === 'pants') {
            logoY = canvasRef.current.height * 0.5;
          } else {
            logoY = canvasRef.current.height * 0.6;
          }
        }
        
        // Add subtle shadow behind logo
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        
        ctx.drawImage(
          img, 
          (canvasRef.current.width - logoSize) / 2, 
          logoY, 
          logoSize, 
          logoSize
        );
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Update texture
        if (textureRef.current) {
          textureRef.current.needsUpdate = true;
        }
      };
      img.onerror = () => {
        console.error('Error loading logo image');
      };
      img.src = logoUrl;
    }
    
    // Create or update the texture
    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvasRef.current);
      textureRef.current.wrapS = THREE.RepeatWrapping;
      textureRef.current.wrapT = THREE.RepeatWrapping;
      textureRef.current.repeat.set(1, 1);
      textureRef.current.anisotropy = 16; // Sharper texture
    } else {
      textureRef.current.needsUpdate = true;
    }
  };
  
  // Animate gentle rotation/floating
  useFrame((state) => {
    if (groupRef.current) {
      // Natural breathing/swaying motion
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1 + Math.PI;
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.05;
      
      // Subtle scaling to simulate breathing
      const breathScale = 1 + Math.sin(time * 0.8) * 0.01;
      groupRef.current.scale.setX(breathScale);
      groupRef.current.scale.setZ(breathScale);
    }
  });

  // Custom material with texture and environment mapping
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: textureRef.current || null,
      color: threeColor,
      roughness: selectedItem === 'pants' ? 0.7 : 0.5,
      metalness: selectedItem === 'pants' ? 0.1 : 0.05,
      envMapIntensity: 0.8,
      side: THREE.DoubleSide, // Render both sides of faces
    });
    
    return mat;
  }, [textureRef.current, threeColor, selectedItem]);

  // Render appropriate clothing model based on selection
  return (
    <Bounds fit clip observe margin={1.4}>
      {/* Camera setup */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={40} near={0.1} far={100} />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />
      <directionalLight position={[0, -5, -5]} intensity={0.2} />
      
      {/* Environment for reflections */}
      <hemisphereLight args={['#ffeeff', '#80a0c0', 0.5]} />
      
      {/* Floor shadow receiver */}
      <mesh 
        position={[0, -2.5, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      
      {/* Clothing models - make sure this is visible */}
      <group ref={groupRef} position={[0, 0, 0]} scale={1.2}>
        {selectedItem === 'tshirt' && (
          <TShirtModel material={material} />
        )}
        {selectedItem === 'hoodie' && (
          <HoodieModel material={material} />
        )}
        {selectedItem === 'pants' && (
          <PantsModel material={material} />
        )}
      </group>
      
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minDistance={2}
        maxDistance={10}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </Bounds>
  );
}

// T-Shirt Model
function TShirtModel({ material }: { material: THREE.Material }) {
  // Create wrinkle effect for the t-shirt
  const wrinkleEffect = useMemo(() => {
    const modifyGeometry = (geometry: THREE.BufferGeometry) => {
      const positionAttribute = geometry.getAttribute('position');
      const vertex = new THREE.Vector3();
      const vertexCount = positionAttribute.count;
      
      // Apply subtle wrinkles to create cloth-like appearance
      for (let i = 0; i < vertexCount; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        
        // Add slight displacement based on position
        const noiseScale = 0.05;
        const noise = Math.sin(vertex.x * 10) * Math.sin(vertex.y * 8) * noiseScale;
        
        // Apply more wrinkles to sleeves and bottom
        if (vertex.y < -0.7 || (Math.abs(vertex.x) > 0.7 && vertex.y > 0)) {
          vertex.z += noise * 2;
        } else {
          vertex.z += noise;
        }
        
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      geometry.computeVertexNormals();
      return geometry;
    };
    
    return modifyGeometry;
  }, []);

  return (
    <group position={[0, 0, 0]} scale={1.5} rotation={[0, Math.PI, 0]}>
      {/* Main torso */}
      <mesh material={material} castShadow receiveShadow>
        <cylinderGeometry args={[1, 0.9, 2, 32, 16, true]} />
      </mesh>
      
      {/* Left sleeve */}
      <group position={[-1, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh material={material} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.7, 16, 8, true]} />
        </mesh>
        
        {/* Sleeve cap */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.3, 16]} />
        </mesh>
        
        {/* Sleeve opening */}
        <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.25, 16]} />
        </mesh>
      </group>
      
      {/* Right sleeve */}
      <group position={[1, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <mesh material={material} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.7, 16, 8, true]} />
        </mesh>
        
        {/* Sleeve cap */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.3, 16]} />
        </mesh>
        
        {/* Sleeve opening */}
        <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.25, 16]} />
        </mesh>
      </group>
      
      {/* Neckline */}
      <group position={[0, 0.97, 0]}>
        {/* Front collar */}
        <mesh position={[0, 0, 0.2]} material={material}>
          <torusGeometry args={[0.35, 0.1, 16, 32, Math.PI]} />
        </mesh>
        
        {/* Back collar */}
        <mesh position={[0, 0, -0.2]} rotation={[0, Math.PI, 0]} material={material}>
          <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
        </mesh>
        
        {/* Collar opening */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0.25, 0.4, 32]} />
        </mesh>
      </group>
      
      {/* Bottom hem with slight gather */}
      <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.9, 0.1, 16, 32]} />
      </mesh>
      
      {/* Bottom opening */}
      <mesh position={[0, -1.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <ringGeometry args={[0, 0.9, 32]} />
      </mesh>
    </group>
  );
}

// Hoodie Model
function HoodieModel({ material }: { material: THREE.Material }) {
  // Create fabric texture effect
  const fabricEffect = useMemo(() => {
    const modifyGeometry = (geometry: THREE.BufferGeometry) => {
      const positionAttribute = geometry.getAttribute('position');
      const vertex = new THREE.Vector3();
      const vertexCount = positionAttribute.count;
      
      // Apply subtle fabric texture
      for (let i = 0; i < vertexCount; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        
        // Add slight displacement for fabric effect
        const noiseScale = 0.03;
        const noise = 
          Math.sin(vertex.x * 15) * Math.sin(vertex.y * 10) * noiseScale + 
          Math.sin(vertex.z * 8) * Math.cos(vertex.y * 12) * noiseScale;
        
        // Apply noise based on position
        if (Math.abs(vertex.x) > 0.8 || Math.abs(vertex.y) > 0.8) {
          vertex.z += noise * 2; // More texture at edges
        } else {
          vertex.z += noise;
        }
        
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      geometry.computeVertexNormals();
      return geometry;
    };
    
    return modifyGeometry;
  }, []);

  return (
    <group position={[0, 0, 0]} scale={1.5} rotation={[0, Math.PI, 0]}>
      {/* Main body - thicker and looser than t-shirt */}
      <mesh material={material} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1, 2, 32, 16, true]} />
      </mesh>
      
      {/* Left sleeve - thicker and longer */}
      <group position={[-1.1, 0.1, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <mesh material={material} castShadow>
          <cylinderGeometry args={[0.4, 0.35, 0.9, 16, 8, true]} />
        </mesh>
        
        {/* Cuff */}
        <mesh position={[0, -0.45, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.1, 16, 1]} />
        </mesh>
        
        {/* Sleeve openings */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.35, 16]} />
        </mesh>
      </group>
      
      {/* Right sleeve */}
      <group position={[1.1, 0.1, 0]} rotation={[0, 0, Math.PI / 5]}>
        <mesh material={material} castShadow>
          <cylinderGeometry args={[0.4, 0.35, 0.9, 16, 8, true]} />
        </mesh>
        
        {/* Cuff */}
        <mesh position={[0, -0.45, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.1, 16, 1]} />
        </mesh>
        
        {/* Sleeve openings */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.35, 16]} />
        </mesh>
      </group>
      
      {/* Hood */}
      <group position={[0, 1.05, -0.3]}>
        {/* Hood base */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 6, 0, 0]} material={material} castShadow>
          <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        
        {/* Hood opening */}
        <mesh position={[0, 0.1, 0.3]} rotation={[Math.PI / 2 - Math.PI / 6, 0, 0]} material={material}>
          <ringGeometry args={[0.4, 0.7, 32, 8, 0, Math.PI * 1.3]} />
        </mesh>
        
        {/* Hood strings */}
        <group position={[0, 0, 0.4]} rotation={[Math.PI / 2 - Math.PI / 6, 0, 0]}>
          <mesh position={[-0.25, -0.2, 0]} rotation={[0, 0, Math.PI / 12]} material={material}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          </mesh>
          <mesh position={[0.25, -0.2, 0]} rotation={[0, 0, -Math.PI / 12]} material={material}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          </mesh>
        </group>
      </group>
      
      {/* Front pocket */}
      <mesh position={[0, -0.2, 1.05]} rotation={[Math.PI / 2, 0, 0]} material={material} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
      </mesh>
      
      {/* Bottom hem with ribbing */}
      <mesh position={[0, -1, 0]} material={material} castShadow>
        <cylinderGeometry args={[1, 1, 0.15, 32, 1]} />
      </mesh>
      
      {/* Bottom opening */}
      <mesh position={[0, -1.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <ringGeometry args={[0, 1, 32]} />
      </mesh>
    </group>
  );
}

// Pants Model
function PantsModel({ material }: { material: THREE.Material }) {
  // Create denim-like texture with wrinkles
  const denimEffect = useMemo(() => {
    const modifyGeometry = (geometry: THREE.BufferGeometry) => {
      const positionAttribute = geometry.getAttribute('position');
      const vertex = new THREE.Vector3();
      const vertexCount = positionAttribute.count;
      
      // Apply wrinkles and fabric texture
      for (let i = 0; i < vertexCount; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        
        // Different wrinkle patterns for different areas
        const kneesWrinkle = Math.sin(vertex.y * 6 + 3) * 0.03;
        const bottomWrinkle = Math.sin(vertex.y * 15) * Math.cos(vertex.x * 10) * 0.02;
        const waistWrinkle = Math.sin(vertex.x * 10) * 0.01;
        
        // Apply wrinkles based on position (knees, bottom, etc)
        if (vertex.y < -0.5 && vertex.y > -1.5) {
          // Knee area
          vertex.z += kneesWrinkle;
        } else if (vertex.y < -1.5) {
          // Bottom of pants
          vertex.z += bottomWrinkle;
        } else if (vertex.y > 0.8) {
          // Waistband
          vertex.z += waistWrinkle;
        } else {
          // Regular fabric texture
          vertex.z += Math.sin(vertex.x * 20) * Math.sin(vertex.y * 20) * 0.01;
        }
        
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      geometry.computeVertexNormals();
      return geometry;
    };
    
    return modifyGeometry;
  }, []);

  return (
    <group position={[0, -0.3, 0]} scale={1.5} rotation={[0, Math.PI, 0]}>
      {/* Waistband */}
      <mesh position={[0, 1.1, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.95, 0.9, 0.25, 32, 2]} />
      </mesh>
      
      {/* Belt loops */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.sin(i * Math.PI / 3) * 0.92,
            1.05,
            Math.cos(i * Math.PI / 3) * 0.92
          ]}
          rotation={[0, i * Math.PI / 3, 0]}
          material={material}
        >
          <boxGeometry args={[0.05, 0.15, 0.04]} />
        </mesh>
      ))}
      
      {/* Upper pants (hip to knee) */}
      <mesh position={[0, 0.5, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.9, 0.75, 1, 32, 8, true]} />
      </mesh>
      
      {/* Left pant leg */}
      <group position={[-0.4, -0.5, 0]}>
        <mesh material={material} castShadow>
          <cylinderGeometry args={[0.37, 0.32, 2, 16, 8, true]} />
        </mesh>
        
        {/* Bottom cuff */}
        <mesh position={[0, -1, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.1, 16, 1]} />
        </mesh>
        
        {/* Bottom opening */}
        <mesh position={[0, -1.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.32, 16]} />
        </mesh>
      </group>
      
      {/* Right pant leg */}
      <group position={[0.4, -0.5, 0]}>
        <mesh material={material} castShadow>
          <cylinderGeometry args={[0.37, 0.32, 2, 16, 8, true]} />
        </mesh>
        
        {/* Bottom cuff */}
        <mesh position={[0, -1, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.1, 16, 1]} />
        </mesh>
        
        {/* Bottom opening */}
        <mesh position={[0, -1.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.32, 16]} />
        </mesh>
      </group>
      
      {/* Front pockets outlines */}
      <group>
        {/* Left pocket */}
        <mesh position={[-0.5, 0.7, 0.85]} rotation={[Math.PI / 2 - Math.PI / 12, 0, Math.PI / 12]} material={material}>
          <planeGeometry args={[0.4, 0.3]} />
        </mesh>
        
        {/* Right pocket */}
        <mesh position={[0.5, 0.7, 0.85]} rotation={[Math.PI / 2 - Math.PI / 12, 0, -Math.PI / 12]} material={material}>
          <planeGeometry args={[0.4, 0.3]} />
        </mesh>
      </group>
      
      {/* Back pockets */}
      <group>
        {/* Left back pocket */}
        <mesh position={[-0.4, 0.6, -0.85]} rotation={[Math.PI / 2 + Math.PI / 12, 0, 0]} material={material}>
          <planeGeometry args={[0.3, 0.25]} />
        </mesh>
        
        {/* Right back pocket */}
        <mesh position={[0.4, 0.6, -0.85]} rotation={[Math.PI / 2 + Math.PI / 12, 0, 0]} material={material}>
          <planeGeometry args={[0.3, 0.25]} />
        </mesh>
      </group>
    </group>
  );
}

// Main component for the clothing designer
export default function ClothingDesigner() {
  const [selectedItem, setSelectedItem] = useState<string>('tshirt');
  const [selectedColor, setSelectedColor] = useState<string>('#ff0000'); // More visible red color
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [designText, setDesignText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  
  useEffect(() => {
    console.log("Selected item changed:", selectedItem);
  }, [selectedItem]);
  
  // Item options matching the UI in the screenshot
  const itemOptions = [
    { name: 'T-Shirt', value: 'tshirt' },
    { name: 'Hoodie', value: 'hoodie' },
    { name: 'Pants', value: 'pants' }
  ];
  
  // Color options matching the UI in the screenshot
  const colorOptions = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ff0000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Green', value: '#00ff00' },
    { name: 'Yellow', value: '#ffff00' },
  ];
  
  // Handle item selection
  const handleItemSelection = (item: string) => {
    console.log("Setting item to:", item);
    setSelectedItem(item);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controls - Left Panel */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-4">Choose Item</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {itemOptions.map((item) => (
              <button
                key={item.value}
                className={`flex items-center px-4 py-2 rounded-md ${
                  selectedItem === item.value 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
                onClick={() => handleItemSelection(item.value)}
              >
                <span className="mr-2">👕</span>
                {item.name}
              </button>
            ))}
          </div>
          
          <h3 className="font-medium mb-4">Item Color</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                  selectedColor === color.value ? 'border-pink-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setSelectedColor(color.value)}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
          
          <h3 className="font-medium mb-2">Add Logo</h3>
          <input 
            type="text" 
            value={logoUrl} 
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Logo URL"
            className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md"
          />
          <button
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md mb-6"
            onClick={() => {
              // This would typically open a file picker
              const url = prompt("Enter logo URL:");
              if (url) setLogoUrl(url);
            }}
          >
            Upload Logo
          </button>
          
          <h3 className="font-medium mb-2">Add Text</h3>
          <input 
            type="text" 
            value={designText}
            onChange={(e) => setDesignText(e.target.value)}
            placeholder="Enter text for design"
            className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md"
          />
          
          <div className="flex items-center gap-2 mb-6">
            <span className="whitespace-nowrap">Text Color:</span>
            <input 
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-8 cursor-pointer"
            />
          </div>
          
          <button
            className="w-full py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md"
            onClick={() => {
              alert('Design saved! In a real application, this would save your design or add it to cart.');
            }}
          >
            Save Design
          </button>
        </div>
        
        {/* 3D Preview - Right Panel */}
        <div className="lg:col-span-2 h-[500px] relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {/* Fallback content that will be replaced by Canvas when it loads */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-0">
            <h3 className="text-xl font-semibold mb-2">Three.js 3D Preview</h3>
            <p className="text-sm">Interactive 3D clothing model with customization</p>
          </div>
          
          <Canvas 
            shadows 
            dpr={[1, 2]} // Support high-DPI displays
            camera={{ position: [0, 0, 4], fov: 40 }}
            style={{ 
              background: 'linear-gradient(to bottom, #f0f4f8, #d1e0f0)',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10
            }}
          >
            <Suspense fallback={null}>
              <ClothingScene 
                selectedItem={selectedItem}
                selectedColor={selectedColor}
                logoUrl={logoUrl}
                designText={designText}
                textColor={textColor}
              />
            </Suspense>
          </Canvas>
          
          <div className="absolute bottom-3 left-0 right-0 text-center text-sm text-gray-700 z-20">
            Drag to rotate • Scroll to zoom • Press shift and drag to pan
          </div>
          
          {/* Debug indicators */}
          <div className="absolute top-3 right-3 text-xs text-gray-700 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full z-20">
            Current: {selectedItem}
          </div>
        </div>
      </div>
    </div>
  );
} 