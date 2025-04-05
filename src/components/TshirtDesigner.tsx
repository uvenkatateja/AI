import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import gsap from 'gsap';

// Realistic T-shirt model component
function TShirtModel({ color, logoUrl, logoPosition, size }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  
  // Convert hex color to THREE.Color
  const threeColor = useMemo(() => new THREE.Color(color), [color]);
  
  // Create procedural textures instead of loading external ones
  const textureMaps = useMemo(() => {
    // Create normal map programmatically
    const normalMap = new THREE.DataTexture(
      createNoiseTexture(128, 128, 0.5),
      128, 128,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.needsUpdate = true;
    
    // Create roughness map programmatically
    const roughnessMap = new THREE.DataTexture(
      createNoiseTexture(128, 128, 0.7),
      128, 128,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.needsUpdate = true;
    
    return { normalMap, roughnessMap };
  }, []);
  
  // Function to create procedural noise texture
  function createNoiseTexture(width, height, intensity) {
    const size = width * height * 4; // RGBA
    const data = new Float32Array(size);
    
    for (let i = 0; i < size; i += 4) {
      const noise = Math.random() * intensity;
      // Set RGB channels to the same value for grayscale
      data[i] = 0.5 + noise * 0.5; // R
      data[i + 1] = 0.5 + noise * 0.5; // G
      data[i + 2] = 1.0; // B - blue channel for normal maps
      data[i + 3] = 1.0; // A
    }
    
    return data;
  }
  
  // Create texture for the logo
  const [logoTexture, setLogoTexture] = useState(null);
  const [logoError, setLogoError] = useState(false);
  
  // Create mannequin head material
  const headMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f5f5f5',
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
  }, []);
  
  useEffect(() => {
    if (logoUrl) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = "Anonymous";
      
      // Reset error state when trying to load a new texture
      setLogoError(false);
      
      textureLoader.load(
        logoUrl, 
        (texture) => {
          texture.anisotropy = 16; // Sharper texture
          setLogoTexture(texture);
        },
        undefined, // onProgress callback is not needed
        (error) => {
          console.error('Error loading logo texture:', error);
          setLogoError(true);
        }
      );
    } else {
      setLogoTexture(null);
    }
  }, [logoUrl]);

  // Initialize GSAP animations
  useEffect(() => {
    if (groupRef.current) {
      // Initial animation - t-shirt appears with a slight bounce
      gsap.fromTo(
        groupRef.current.position,
        { y: -1, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: "elastic.out(1, 0.5)",
          delay: 0.2 
        }
      );
      
      // Continuous floating animation
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2 + Math.PI,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
      
      // Subtle breathing effect
      const breathingTl = gsap.timeline({ repeat: -1, yoyo: true });
      breathingTl.to(groupRef.current.scale, {
        x: modelScale * 1.03,
        y: modelScale * 1.03, 
        z: modelScale * 1.03,
        duration: 2,
        ease: "sine.inOut"
      });
    }
  }, []);

  // Calculate logo position
  const logoPosition3D = useMemo(() => {
    let posX = 0;
    if (logoPosition === 'L') posX = -0.28;
    if (logoPosition === 'R') posX = 0.28;
    return [posX, 0.2, 0.37] as const;
  }, [logoPosition]);
  
  // Scale based on size
  const modelScale = useMemo(() => {
    if (size === 'S') return 0.9;
    if (size === 'L') return 1.1;
    return 1.0; // Medium is default
  }, [size]);
  
  // Create custom material with fabric-like properties
  const material = useMemo(() => {
    const fabricMaterial = new THREE.MeshStandardMaterial({
      color: threeColor,
      roughness: 0.7,
      metalness: 0.05,
      side: THREE.DoubleSide,
      normalMap: textureMaps.normalMap,
      roughnessMap: textureMaps.roughnessMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      envMapIntensity: 0.5,
    });
    
    // Add slight color variation for a more handmade look
    const originalColor = new THREE.Color(threeColor);
    const slightlyDarker = new THREE.Color().copy(originalColor).multiplyScalar(0.95);
    
    // Custom shader to add color variation and fabric appearance
    fabricMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.colorVariation = { value: slightlyDarker };
      shader.uniforms.time = { value: 0 };
      
      // Add to vertex shader to create subtle surface variation
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float time;
        varying vec2 vUv;
        varying vec3 vOrigPosition;
        
        // Noise function for natural variation
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        `
      );
      
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vUv = uv;
        vOrigPosition = position;
        
        // Add very subtle displacement based on position
        float noiseVal = noise(position.xy * 10.0) * 0.005;
        transformed += normal * noiseVal;
        `
      );
      
      // Add to fragment shader for color variation
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform vec3 colorVariation;
        varying vec2 vUv;
        varying vec3 vOrigPosition;
        `
      );
      
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        
        // Add subtle fabric texture/pattern
        float grain = noise(vUv * 500.0) * 0.08;
        float thread = max(
          sin(vUv.x * 200.0 + vUv.y * 100.0) * 0.03,
          sin(vUv.y * 200.0 + vUv.x * 100.0) * 0.03
        );
        
        // Mix with slightly darker color for variation
        float colorMix = noise(vUv * 2.0) * 0.15;
        diffuseColor.rgb = mix(diffuseColor.rgb, colorVariation, colorMix);
        
        // Add fabric grain and thread lines
        diffuseColor.rgb += vec3(grain + thread);
        `
      );
      
      // Update time for animation
      fabricMaterial.userData.shader = shader;
    };
    
    return fabricMaterial;
  }, [threeColor, textureMaps]);
  
  // Update shader time for animations
  useFrame((state) => {
    if (material.userData && material.userData.shader) {
      material.userData.shader.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={groupRef} scale={[modelScale, modelScale, modelScale]} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      {/* Mannequin Head */}
      <group position={[0, 1.35, 0]}>
        {/* Head */}
        <mesh material={headMaterial} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, -0.3, 0]} material={headMaterial} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.4, 32]} />
        </mesh>
        
        {/* Ears - simple ear representations */}
        <mesh position={[-0.38, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={headMaterial} castShadow>
          <capsuleGeometry args={[0.05, 0.12, 8, 8]} />
        </mesh>
        
        <mesh position={[0.38, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={headMaterial} castShadow>
          <capsuleGeometry args={[0.05, 0.12, 8, 8]} />
        </mesh>
        
        {/* Simple Facial Features */}
        {/* Subtle nose suggestion */}
        <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 3, 0, 0]} material={headMaterial} castShadow>
          <coneGeometry args={[0.05, 0.1, 16]} />
        </mesh>
      </group>
      
      {/* Main torso */}
      <mesh ref={meshRef} material={material} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.8, 1.8, 64, 32, true]} />
      </mesh>
      
      {/* Left sleeve */}
      <group position={[-0.9, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh material={material} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.55, 32, 16, true]} />
        </mesh>
        
        {/* Sleeve cap */}
        <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.25, 32]} />
        </mesh>
        
        {/* Sleeve opening */}
        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.2, 32]} />
        </mesh>
      </group>
      
      {/* Right sleeve */}
      <group position={[0.9, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <mesh material={material} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.55, 32, 16, true]} />
        </mesh>
        
        {/* Sleeve cap */}
        <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.25, 32]} />
        </mesh>
        
        {/* Sleeve opening */}
        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0, 0.2, 32]} />
        </mesh>
      </group>
      
      {/* Neckline */}
      <group position={[0, 0.85, 0]}>
        {/* Front collar */}
        <mesh position={[0, 0, 0.2]} material={material}>
          <torusGeometry args={[0.25, 0.08, 32, 32, Math.PI * 1.2]} />
        </mesh>
        
        {/* Back collar */}
        <mesh position={[0, 0, -0.2]} rotation={[0, Math.PI, 0]} material={material}>
          <torusGeometry args={[0.2, 0.07, 32, 32, Math.PI]} />
        </mesh>
        
        {/* Collar opening */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <ringGeometry args={[0.15, 0.3, 32]} />
        </mesh>
      </group>
      
      {/* Bottom hem with slight gather */}
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.8, 0.08, 32, 32]} />
      </mesh>
      
      {/* Bottom opening */}
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <ringGeometry args={[0, 0.8, 32]} />
      </mesh>
      
      {/* Enhanced wrinkles for realism - more organic shapes */}
      <group>
        {/* Main body wrinkles */}
        <mesh position={[0, -0.3, 0.8]} rotation={[Math.PI / 2 - 0.2, 0, 0]} material={material}>
          <torusGeometry args={[0.5, 0.02, 16, 32, Math.PI * 0.7]} />
        </mesh>
        
        <mesh position={[0.2, 0.2, 0.8]} rotation={[Math.PI / 2 - 0.1, 0, -0.3]} material={material}>
          <torusGeometry args={[0.3, 0.015, 16, 32, Math.PI * 0.5]} />
        </mesh>
        
        {/* Additional natural folds */}
        <mesh position={[-0.3, -0.1, 0.8]} rotation={[Math.PI / 2 - 0.15, 0.2, 0.1]} material={material}>
          <torusGeometry args={[0.35, 0.012, 16, 32, Math.PI * 0.4]} />
        </mesh>
        
        <mesh position={[0, -0.6, 0.8]} rotation={[Math.PI / 2 - 0.1, 0, 0]} material={material}>
          <torusGeometry args={[0.6, 0.018, 16, 32, Math.PI * 0.6]} />
        </mesh>
        
        {/* Sleeve wrinkles - more detailed */}
        <mesh position={[-0.7, 0.1, 0.2]} rotation={[0.3, -0.4, Math.PI / 2 - 0.3]} material={material}>
          <torusGeometry args={[0.15, 0.01, 16, 32, Math.PI * 0.7]} />
        </mesh>
        
        <mesh position={[-0.75, 0, 0.15]} rotation={[0.2, -0.3, Math.PI / 2 - 0.4]} material={material}>
          <torusGeometry args={[0.12, 0.008, 16, 32, Math.PI * 0.5]} />
        </mesh>
        
        <mesh position={[0.7, 0.1, 0.2]} rotation={[0.3, 0.4, -Math.PI / 2 + 0.3]} material={material}>
          <torusGeometry args={[0.15, 0.01, 16, 32, Math.PI * 0.7]} />
        </mesh>
        
        <mesh position={[0.75, 0, 0.15]} rotation={[0.2, 0.3, -Math.PI / 2 + 0.4]} material={material}>
          <torusGeometry args={[0.12, 0.008, 16, 32, Math.PI * 0.5]} />
        </mesh>
      </group>
      
      {/* Stitching details for handmade look */}
      <group>
        {/* Neckline stitching */}
        <mesh position={[0, 0.87, 0.25]} rotation={[Math.PI / 2 - 0.2, 0, 0]} material={material}>
          <torusGeometry args={[0.28, 0.005, 16, 32, Math.PI * 1.2]} />
        </mesh>
        
        {/* Sleeve hems stitching */}
        <mesh position={[-0.9, -0.06, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <ringGeometry args={[0.21, 0.215, 32]} />
          <meshStandardMaterial color={threeColor} metalness={0.1} roughness={0.8} />
        </mesh>
        
        <mesh position={[0.9, -0.06, 0]} rotation={[0, 0, Math.PI / 6]}>
          <ringGeometry args={[0.21, 0.215, 32]} />
          <meshStandardMaterial color={threeColor} metalness={0.1} roughness={0.8} />
        </mesh>
        
        {/* Bottom hem stitching */}
        <mesh position={[0, -0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.81, 0.82, 32]} />
          <meshStandardMaterial color={threeColor} metalness={0.1} roughness={0.8} />
        </mesh>
      </group>
      
      {/* Logo with realistic application effect */}
      {logoTexture && (
        <>
          {/* Slightly raised base for the print */}
          <mesh position={[logoPosition3D[0], logoPosition3D[1], logoPosition3D[2] - 0.01]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.37, 0.37]} />
            <meshStandardMaterial 
              color={new THREE.Color().copy(threeColor).multiplyScalar(0.9)}
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
          
          {/* Actual logo */}
          <mesh position={[logoPosition3D[0], logoPosition3D[1], logoPosition3D[2]]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.35, 0.35]} />
            <meshStandardMaterial 
              map={logoTexture} 
              transparent={true} 
              alphaTest={0.1}
              side={THREE.DoubleSide}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// Scene component with enhanced lighting for photorealistic rendering
function Scene({ children }) {
  const { scene } = useThree();
  
  // Set up environment
  useEffect(() => {
    scene.background = new THREE.Color('#000000');
    
    // Add subtle fog for depth
    scene.fog = new THREE.FogExp2('#000000', 0.05);
    
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  return (
    <>
      {/* Enhanced lighting setup for photorealistic rendering */}
      <ambientLight intensity={0.2} />
      
      {/* Key light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        shadow-bias={-0.0001}
        color="#ffffff"
      />
      
      {/* Fill light */}
      <directionalLight 
        position={[-5, 3, -2]} 
        intensity={0.7} 
        color="#b0c4de" 
      />
      
      {/* Rim light for edge definition */}
      <spotLight 
        position={[0, 8, -10]} 
        intensity={0.6} 
        angle={0.5} 
        penumbra={0.8}
        color="#e0e0ff"
      />
      
      {/* Ground fill light */}
      <pointLight position={[0, -3, 2]} intensity={0.2} color="#404040" />
      
      {/* Environment light for better reflections */}
      <hemisphereLight args={['#ffeeff', '#080820', 0.3]} />
      
      {/* Camera setup */}
      <PerspectiveCamera makeDefault position={[0, 0, 3.5]} fov={40} near={0.1} far={100} />
      
      {/* Floor shadow receiver */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1.8, 0]} 
        receiveShadow
      >
        <planeGeometry args={[15, 15]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      
      {children}
      
      {/* Enhanced camera controls */}
      <OrbitControls 
        enablePan={false}
        minDistance={2.5}
        maxDistance={5}
        minPolarAngle={Math.PI/3}
        maxPolarAngle={Math.PI*2/3}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.7}
      />
    </>
  );
}

// Main component
export default function TshirtDesigner() {
  const [tshirtColor, setTshirtColor] = useState('#2196f3'); // Default blue color
  const [logoUrl, setLogoUrl] = useState('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png');
  const [logoPosition, setLogoPosition] = useState('L'); // L, M, R
  const [size, setSize] = useState('M'); // S, M, L
  
  // Handle color change with GSAP animation
  const handleColorChange = (newColor) => {
    // Animate the canvas background during color transition
    gsap.to(".bg-black", {
      backgroundColor: "rgba(0,0,0,0.8)",
      duration: 0.3,
      yoyo: true,
      repeat: 1
    });
    
    setTshirtColor(newColor);
  };
  
  // Color options with more handmade/artisanal colors
  const colorOptions = [
    { name: 'Blue', value: '#2196f3' },
    { name: 'Navy', value: '#0d47a1' },
    { name: 'Cream', value: '#fffdd0' },
    { name: 'Brick', value: '#c62828' },
    { name: 'Olive', value: '#556b2f' },
    { name: 'Charcoal', value: '#36454f' },
  ];

  return (
    <div className="relative h-full w-full bg-black text-white">
      <div className="absolute top-0 left-0 right-0 p-4 text-center z-10">
        <h1 className="text-2xl font-bold">
          Design your <span className="text-blue-500">Handcrafted T-shirt</span>
        </h1>
      </div>

      {/* Left sidebar - Colors and design options */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-70 rounded-full p-4 flex flex-col items-center gap-4 z-10">
        {/* Color picker */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-blue-500 text-xs font-bold">FABRIC</span>
          {colorOptions.map((color) => (
            <button 
              key={color.value}
              className={`w-8 h-8 rounded-full border-2 ${tshirtColor === color.value ? 'border-white' : 'border-transparent'}`}
              style={{ 
                backgroundColor: color.value,
                boxShadow: tshirtColor === color.value ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
              }}
              onClick={() => handleColorChange(color.value)}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
      </div>

      {/* 3D Model Canvas */}
      <div className="w-full h-full">
        <Canvas shadows dpr={[1, 2]} className="bg-black">
          <Suspense fallback={null}>
            <Scene>
              <TShirtModel 
                color={tshirtColor} 
                logoUrl={logoUrl}
                logoPosition={logoPosition}
                size={size}
              />
            </Scene>
          </Suspense>
        </Canvas>
      </div>

      {/* Right sidebar - Logo position and size */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-70 rounded-full p-4 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-2">
          <p className="text-blue-500 text-xs font-bold">LOGO</p>
          <p className="text-blue-500 text-xs font-semibold">POS</p>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${logoPosition === 'L' ? 'bg-blue-500' : 'bg-gray-800'}`}
            onClick={() => setLogoPosition('L')}
          >
            L
          </button>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${logoPosition === 'M' ? 'bg-blue-500' : 'bg-gray-800'}`}
            onClick={() => setLogoPosition('M')}
          >
            M
          </button>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${logoPosition === 'R' ? 'bg-blue-500' : 'bg-gray-800'}`}
            onClick={() => setLogoPosition('R')}
          >
            R
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-blue-500 text-xs font-bold">SIZE</p>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${size === 'S' ? 'bg-blue-500' : 'bg-gray-800'}`}
            onClick={() => setSize('S')}
          >
            S
          </button>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${size === 'M' ? 'bg-blue-500' : 'bg-gray-800'}`}
            onClick={() => setSize('M')}
          >
            M
          </button>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${size === 'L' ? 'bg-blue-500' : 'bg-gray-800'}`}
            onClick={() => setSize('L')}
          >
            L
          </button>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-70 rounded-full p-2 flex items-center gap-4 z-10">
        <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">👕</span>
        </button>
        <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">👚</span>
        </button>
        <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">💾</span>
        </button>
      </div>
      
      {/* Help text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs z-10">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
} 