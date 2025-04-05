import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Html, useGLTF, PresentationControls, Float, useFBX } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Crown, Footprints } from "lucide-react";


function HumanModel({ outfit, isChanging, showAccessories, humanLike = true, initialSize = 1 }: { 
  outfit: string, 
  isChanging: boolean,
  showAccessories: {
    hat: boolean;
    shoes: boolean;
  },
  humanLike?: boolean,
  initialSize?: number
}) {
  const group = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(initialSize);
  const [walkCycle, setWalkCycle] = useState(0);
  
  
  useEffect(() => {
    if (isChanging) {
      setScale(scale * 0.95);
      const timeout = setTimeout(() => setScale(initialSize), 200);
      return () => clearTimeout(timeout);
    }
  }, [isChanging, initialSize, scale]);
  
  useFrame((state) => {
    if (group.current) {
      
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.03;
      
     
      setWalkCycle(state.clock.getElapsedTime());
      
      
      if (!state.pointer.x) {
        group.current.rotation.y += 0.001;
      }
    }
  });

  
  const getOutfitColor = () => {
    try {
      switch(outfit) {
        case 'casual': return '#9CAF88';
        case 'formal': return '#36454F';
        case 'sporty': return '#DE5D83';
        case 'elegant': return '#8B5CF6';
        case 'streetwear': return '#F97316';
        default: return '#E0C094';
      }
    } catch (error) {
      console.warn("Error getting outfit color:", error);
      return '#E0C094'; // Fallback color
    }
  };

  
  const leftLegAngle = Math.sin(walkCycle * 1.5) * 0.2;
  const rightLegAngle = Math.sin(walkCycle * 1.5 + Math.PI) * 0.2;
  const leftArmAngle = Math.sin(walkCycle * 1.5 + Math.PI) * 0.1;
  const rightArmAngle = Math.sin(walkCycle * 1.5) * 0.1;

  return (
    <group ref={group} scale={scale} position={[0, -1.5, 0]}>
      {/* Using more human-like model by default */}
      <>
        {/* Head with more natural shape and features */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#FFDBAC" />
          
          {/* Eyes with more detail */}
          <mesh position={[0.15, 0.1, 0.35]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#FFFFFF" />
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.03, 32, 32]} />
              <meshStandardMaterial color="#3E4347" />
              <mesh position={[0, 0, 0.015]}>
                <sphereGeometry args={[0.015, 32, 32]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
            </mesh>
          </mesh>
          <mesh position={[-0.15, 0.1, 0.35]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#FFFFFF" />
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.03, 32, 32]} />
              <meshStandardMaterial color="#3E4347" />
              <mesh position={[0, 0, 0.015]}>
                <sphereGeometry args={[0.015, 32, 32]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
            </mesh>
          </mesh>
          
          {/* Eyebrows */}
          <mesh position={[0.15, 0.18, 0.37]} rotation={[0, 0, 0.1]} scale={[0.12, 0.02, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#3A2A1D" />
          </mesh>
          <mesh position={[-0.15, 0.18, 0.37]} rotation={[0, 0, -0.1]} scale={[0.12, 0.02, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#3A2A1D" />
          </mesh>
          
          {/* Nose */}
          <mesh position={[0, 0, 0.4]} rotation={[0.3, 0, 0]}>
            <coneGeometry args={[0.06, 0.15, 32]} />
            <meshStandardMaterial color="#EECEB3" />
          </mesh>
          
          {/* Mouth more natural */}
          <mesh position={[0, -0.12, 0.37]} rotation={[0.1, 0, 0]} scale={[0.15, 0.03, 0.05]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#CE967B" />
          </mesh>
          
          {/* Hair with better style */}
          <group position={[0, 0.1, 0]}>
            {/* Top hair */}
            <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.43, 32, 32]} />
              <meshStandardMaterial color="#3A2A1D" />
            </mesh>
            
            {/* Side hair */}
            <mesh position={[0.35, -0.05, 0]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.15, 32, 16]} />
              <meshStandardMaterial color="#3A2A1D" />
            </mesh>
            <mesh position={[-0.35, -0.05, 0]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.15, 32, 16]} />
              <meshStandardMaterial color="#3A2A1D" />
            </mesh>
            
            {/* Back hair */}
            <mesh position={[0, 0, -0.15]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.41, 32, 32]} />
              <meshStandardMaterial color="#3A2A1D" />
            </mesh>
          </group>
          
          {/* Hat accessory */}
          {showAccessories.hat && (
            <group position={[0, 0.35, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.45, 0.48, 0.15, 32]} />
                <meshStandardMaterial color="#222" />
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
                <meshStandardMaterial color="#222" />
              </mesh>
            </group>
          )}
        </mesh>
        
        {/* Neck more realistic */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.3, 32]} />
          <meshStandardMaterial color="#FFDBAC" />
        </mesh>
        
        {/* Torso with natural proportions */}
        <group>
          {/* Upper body / chest */}
          <mesh position={[0, 0.8, 0]}>
            <capsuleGeometry args={[0.35, 0.6, 16, 32]} />
            <meshStandardMaterial color={getOutfitColor()} />
          </mesh>
          
          {/* Lower body / hip region */}
          <mesh position={[0, 0.3, 0]}>
            <capsuleGeometry args={[0.33, 0.4, 16, 32]} />
            <meshStandardMaterial color={getOutfitColor()} />
          </mesh>
          
          {/* Style label */}
          <Html position={[0, 0.8, 0.6]} center>
            <div className="bg-white/90 text-xs px-3 py-1.5 rounded-full font-medium shadow-md">
              {outfit.charAt(0).toUpperCase() + outfit.slice(1)} Style
            </div>
          </Html>
        </group>
        
        {/* Arms with elbow joint and animated movement */}
        <group position={[0.4, 1.0, 0]} rotation={[0, 0, leftArmAngle]}>
          {/* Upper arm */}
          <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.12, 0.5, 16, 32]} />
            <meshStandardMaterial color={getOutfitColor()} />
          </mesh>
          
          {/* Elbow joint */}
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color={getOutfitColor()} />
          </mesh>
          
          {/* Forearm */}
          <group position={[0, -0.5, 0]} rotation={[0, 0, 0.3]}>
            <mesh position={[0, -0.25, 0]}>
              <capsuleGeometry args={[0.1, 0.5, 16, 32]} />
              <meshStandardMaterial color={getOutfitColor()} />
            </mesh>
            
            {/* Hand */}
            <mesh position={[0, -0.55, 0]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.12, 32, 32]} />
              <meshStandardMaterial color="#FFDBAC" />
            </mesh>
          </group>
        </group>
        
        <group position={[-0.4, 1.0, 0]} rotation={[0, 0, rightArmAngle]}>
          {/* Upper arm */}
          <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.12, 0.5, 16, 32]} />
            <meshStandardMaterial color={getOutfitColor()} />
          </mesh>
          
          {/* Elbow joint */}
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color={getOutfitColor()} />
          </mesh>
          
          {/* Forearm */}
          <group position={[0, -0.5, 0]} rotation={[0, 0, -0.3]}>
            <mesh position={[0, -0.25, 0]}>
              <capsuleGeometry args={[0.1, 0.5, 16, 32]} />
              <meshStandardMaterial color={getOutfitColor()} />
            </mesh>
            
            {/* Hand */}
            <mesh position={[0, -0.55, 0]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.12, 32, 32]} />
              <meshStandardMaterial color="#FFDBAC" />
            </mesh>
          </group>
        </group>
        
        {/* Legs with knee joints and walking animation */}
        <group position={[0.18, 0, 0]} rotation={[leftLegAngle, 0, 0]}>
          {/* Hip joint */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshStandardMaterial color="#404040" />
          </mesh>
          
          {/* Thigh */}
          <mesh position={[0, -0.4, leftLegAngle > 0 ? 0.1 : -0.1]}>
            <capsuleGeometry args={[0.15, 0.8, 16, 32]} />
            <meshStandardMaterial color="#404040" />
          </mesh>
          
          {/* Knee joint */}
          <mesh position={[0, -0.85, leftLegAngle > 0 ? 0.2 : -0.2]}>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshStandardMaterial color="#404040" />
          </mesh>
          
          {/* Lower leg */}
          <group position={[0, -0.85, leftLegAngle > 0 ? 0.2 : -0.2]} rotation={[leftLegAngle > 0 ? -0.5 : 0.3, 0, 0]}>
            <mesh position={[0, -0.45, 0]}>
              <capsuleGeometry args={[0.13, 0.9, 16, 32]} />
              <meshStandardMaterial color="#404040" />
            </mesh>
            
            {/* Foot/Shoe */}
            {showAccessories.shoes ? (
              <mesh position={[0, -0.95, 0.1]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.2, 0.12, 0.4]} />
                <meshStandardMaterial color="#111" />
              </mesh>
            ) : (
              <mesh position={[0, -0.95, 0.05]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.2, 0.1, 0.35]} />
                <meshStandardMaterial color="#404040" />
              </mesh>
            )}
          </group>
        </group>
        
        <group position={[-0.18, 0, 0]} rotation={[rightLegAngle, 0, 0]}>
          {/* Hip joint */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshStandardMaterial color="#404040" />
          </mesh>
          
          {/* Thigh */}
          <mesh position={[0, -0.4, rightLegAngle > 0 ? 0.1 : -0.1]}>
            <capsuleGeometry args={[0.15, 0.8, 16, 32]} />
            <meshStandardMaterial color="#404040" />
          </mesh>
          
          {/* Knee joint */}
          <mesh position={[0, -0.85, rightLegAngle > 0 ? 0.2 : -0.2]}>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshStandardMaterial color="#404040" />
          </mesh>
          
          {/* Lower leg */}
          <group position={[0, -0.85, rightLegAngle > 0 ? 0.2 : -0.2]} rotation={[rightLegAngle > 0 ? -0.5 : 0.3, 0, 0]}>
            <mesh position={[0, -0.45, 0]}>
              <capsuleGeometry args={[0.13, 0.9, 16, 32]} />
              <meshStandardMaterial color="#404040" />
            </mesh>
            
            {/* Foot/Shoe */}
            {showAccessories.shoes ? (
              <mesh position={[0, -0.95, 0.1]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.2, 0.12, 0.4]} />
                <meshStandardMaterial color="#111" />
              </mesh>
            ) : (
              <mesh position={[0, -0.95, 0.05]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.2, 0.1, 0.35]} />
                <meshStandardMaterial color="#404040" />
              </mesh>
            )}
          </group>
        </group>
        
        {/* Add outfit-specific accessories */}
        {outfit === 'formal' && (
          <mesh position={[0, 1.5, 0.35]} rotation={[0, 0, 0.05]} scale={[0.4, 0.03, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        )}
        {outfit === 'sporty' && (
          <mesh position={[0, 1.7, 0.2]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
            <meshStandardMaterial color="#fff" />
            <mesh position={[0, 0.03, 0]} rotation={[0, 0, 0]} scale={[0.7, 0.7, 1]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
              <meshStandardMaterial color="#DE5D83" />
            </mesh>
          </mesh>
        )}
        {outfit === 'streetwear' && (
          <mesh position={[0, 1.7, 0.15]} rotation={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.36, 0.4, 0.12, 32]} />
            <meshStandardMaterial color="#222" />
            <mesh position={[0, 0.1, 0.05]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
              <meshStandardMaterial color="#F97316" />
            </mesh>
          </mesh>
        )}
      </>
    </group>
  );
}


export default function VirtualModel({ 
  outfit = "casual", 
  initialSize = 1,
  humanLike = true
}: { 
  outfit?: string,
  initialSize?: number,
  humanLike?: boolean
}) {
 
  const [currentOutfit, setCurrentOutfit] = useState(outfit);
  const [isChanging, setIsChanging] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(5.5);
  const [showAccessories, setShowAccessories] = useState({
    hat: false,
    shoes: true // Show shoes by default
  });
  

  useEffect(() => {
    if (outfit && outfit !== currentOutfit) {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentOutfit(outfit);
        setIsChanging(false);
      }, 300);
    }
  }, [outfit, currentOutfit]);

  
  const handleZoom = (delta: number) => {
    setCameraZoom(prev => {
      const newZoom = prev + delta;
      return Math.min(Math.max(newZoom, 4), 9); 
    });
  };

  
  const toggleAccessory = (accessory: 'hat' | 'shoes') => {
    if (isChanging) return; 
    
    setShowAccessories(prev => ({
      ...prev,
      [accessory]: !prev[accessory]
    }));
  };

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCameraZoom(6.5);
      } else if (window.innerWidth < 768) {
        setCameraZoom(5.8);
      } else {
        setCameraZoom(5.2);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 
  const canvasKey = `model-${humanLike ? 'human' : 'simple'}-${initialSize}`;

  return (
    <div className="relative">
      <div className="three-scene-container rounded-xl overflow-hidden border bg-gray-50">
        <Canvas 
          key={canvasKey}
          camera={{ position: [0, -0.5, cameraZoom], fov: 40 }} /* Adjusted camera position */
          style={{ minHeight: "400px" }} /* Increased height for better visibility */
        >
          <Suspense fallback={<Html center><div className="text-primary">Loading model...</div></Html>}>
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.7} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            
            <PresentationControls
              global
              zoom={0.8}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 2, Math.PI / 2]}
            >
              <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
                <HumanModel 
                  outfit={currentOutfit} 
                  isChanging={isChanging} 
                  showAccessories={showAccessories}
                  humanLike={humanLike}
                  initialSize={initialSize}
                />
              </Float>
            </PresentationControls>
            
            <Environment preset="sunset" />
            <OrbitControls 
              enableZoom={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
              minAzimuthAngle={-Math.PI / 2}
              maxAzimuthAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>
      
      
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex flex-row gap-2 sm:flex-col">
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => handleZoom(-0.8)}
          className="bg-white/90 shadow-md hover:bg-white"
          disabled={isChanging}
        >
          <ZoomIn className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Zoom In</span>
        </Button>
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => handleZoom(0.8)}
          className="bg-white/90 shadow-md hover:bg-white"
          disabled={isChanging}
        >
          <ZoomOut className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Zoom Out</span>
        </Button>
      </div>
      
     
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-row gap-2">
        <Button
          size="sm"
          variant={showAccessories.hat ? "default" : "secondary"}
          onClick={() => toggleAccessory('hat')}
          className={showAccessories.hat ? "bg-primary shadow-md" : "bg-white/90 shadow-md hover:bg-white"}
          title="Toggle Hat"
          disabled={isChanging}
        >
          <Crown className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Hat</span>
        </Button>
        <Button
          size="sm"
          variant={showAccessories.shoes ? "default" : "secondary"}
          onClick={() => toggleAccessory('shoes')}
          className={showAccessories.shoes ? "bg-primary shadow-md" : "bg-white/90 shadow-md hover:bg-white"}
          title="Toggle Shoes"
          disabled={isChanging}
        >
          <Footprints className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Shoes</span>
        </Button>
      </div>
    </div>
  );
}
