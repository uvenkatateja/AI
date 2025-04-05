import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Camera, Upload, Aperture, X, Image as ImageIcon, RefreshCw, Palette, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ImageUploaderProps {
  onStyleDetected?: (style: string) => void;
}

interface FashionStyle {
  id: string;
  name: string;
  description: string;
  colorPalette: string[];
  occasions: string[];
  matchingItems: string[];
}

// Add new interface for RecommendationItem
interface RecommendationItem {
  type: string;
  name: string;
  style: string;
  description: string;
}

export default function ImageUploader({ onStyleDetected }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRealTimeDetection, setIsRealTimeDetection] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [boundingBox, setBoundingBox] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const [detectedColor, setDetectedColor] = useState<string | null>(null);
  const [colorName, setColorName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const detectionInterval = useRef<number | null>(null);

  // Color mapping for simple color names
  const colorMap: {[key: string]: string} = {
    '#FF0000': 'Red',
    '#00FF00': 'Green',
    '#0000FF': 'Blue',
    '#FFFF00': 'Yellow',
    '#FFA500': 'Orange',
    '#800080': 'Purple',
    '#FFC0CB': 'Pink',
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#808080': 'Gray',
    '#A52A2A': 'Brown'
  };

  // Add fashion styles database
  const fashionStyles: Record<string, FashionStyle> = {
    casual: {
      id: "casual",
      name: "Casual",
      description: "Relaxed, comfortable clothing suitable for everyday wear",
      colorPalette: ["#9CAF88", "#E0C094", "#B8A390", "#D6D1CD"],
      occasions: ["Weekend outings", "Coffee dates", "Shopping trips", "Casual gatherings"],
      matchingItems: ["Denim jacket", "Canvas sneakers", "Crossbody bag", "Simple accessories"]
    },
    formal: {
      id: "formal",
      name: "Formal",
      description: "Elegant, sophisticated attire for professional or special occasions",
      colorPalette: ["#36454F", "#000000", "#0F0F0F", "#1F1F1F"],
      occasions: ["Business meetings", "Formal dinners", "Job interviews", "Professional events"],
      matchingItems: ["Structured blazer", "Leather shoes", "Minimal jewelry", "Leather briefcase"]
    },
    sporty: {
      id: "sporty",
      name: "Sporty",
      description: "Athletic-inspired clothing that combines function and fashion",
      colorPalette: ["#DE5D83", "#FF4646", "#FF8C42", "#FFCE66"],
      occasions: ["Gym sessions", "Outdoor activities", "Casual sports events", "Active weekends"],
      matchingItems: ["Athletic shoes", "Performance socks", "Sports watch", "Gym bag"]
    },
    elegant: {
      id: "elegant",
      name: "Elegant",
      description: "Sophisticated and refined style for upscale occasions",
      colorPalette: ["#8B5CF6", "#7B61FF", "#6247AA", "#4B3C8F"],
      occasions: ["Evening galas", "Upscale restaurants", "Theater performances", "Special celebrations"],
      matchingItems: ["Statement earrings", "Clutch purse", "Heeled shoes", "Fine jewelry"]
    },
    streetwear: {
      id: "streetwear",
      name: "Streetwear",
      description: "Urban fashion with bold contemporary edge",
      colorPalette: ["#F97316", "#22D3EE", "#FB923C", "#F472B6"],
      occasions: ["Music festivals", "Urban exploration", "Art exhibitions", "Street culture events"],
      matchingItems: ["Statement sneakers", "Graphic tees", "Beanies/caps", "Crossbody bags"]
    }
  };

  // Clean up webcam stream on unmount
  useEffect(() => {
    return () => {
      closeWebcam();
    };
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target?.result as string);
          analyzeImageColor(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target?.result as string);
          analyzeImageColor(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive"
        });
      }
    }
  };

  const startWebcam = async (realTime = false) => {
    try {
      // First, close any existing stream
      closeWebcam();
      
      setIsCapturing(true);
      setIsCameraReady(false);
      
      // Show a toast to let the user know the camera is starting
      toast({
        title: "Starting camera",
        description: "Please allow camera access when prompted"
      });
      
      // Then start a new one
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setIsCameraReady(true);
              setIsRealTimeDetection(realTime);
              
              if (realTime) {
                // Start real-time detection after video has loaded
                setTimeout(() => startRealTimeDetection(), 500);
                
                toast({
                  title: "Real-time detection active",
                  description: "Move around to let us detect your clothing"
                });
              } else {
                toast({
                  title: "Camera ready",
                  description: "Press the Capture button when ready"
                });
              }
            }).catch(err => {
              console.error("Error playing video:", err);
              toast({
                title: "Camera Error",
                description: "There was a problem with your camera",
                variant: "destructive"
              });
            });
          }
        };
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setIsCapturing(false);
      toast({
        title: "Webcam Error",
        description: "Could not access your webcam. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const startRealTimeDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    
    if (!videoRef.current || !detectionCanvasRef.current) {
      return;
    }
    
    // Make sure the canvas is shown
    if (detectionCanvasRef.current) {
      detectionCanvasRef.current.style.display = 'block';
    }
    
    // Run detection every 200ms
    detectionInterval.current = window.setInterval(() => {
      if (videoRef.current && detectionCanvasRef.current) {
        const canvas = detectionCanvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');
        
        if (context && video.readyState >= 2) { // HAVE_CURRENT_DATA or better
          try {
            // Set canvas size to match video
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            
            // Draw video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Simulate person detection
            // In a real app, you'd use a ML model for this
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Size of person detection box (40% of width, 70% of height)
            const boxWidth = canvas.width * 0.4;
            const boxHeight = canvas.height * 0.7;
            const boxX = centerX - boxWidth/2;
            const boxY = centerY - boxHeight/2;
            
            // Draw person detection box
            context.strokeStyle = '#4ADE80'; // Green
            context.lineWidth = 4;
            context.strokeRect(boxX, boxY, boxWidth, boxHeight);
            
            // Label the box
            context.fillStyle = '#4ADE80';
            context.font = 'bold 16px sans-serif';
            context.fillText('Person Detected', boxX, boxY - 10);
            
            // Simulate clothing detection (chest area)
            const clothingBoxWidth = boxWidth * 0.8;
            const clothingBoxHeight = boxHeight * 0.3;
            const clothingBoxX = centerX - clothingBoxWidth/2;
            const clothingBoxY = centerY - clothingBoxHeight/2;
            
            // Draw clothing detection box
            context.strokeStyle = '#F472B6'; // Pink
            context.setLineDash([5, 3]);
            context.strokeRect(clothingBoxX, clothingBoxY, clothingBoxWidth, clothingBoxHeight);
            context.setLineDash([]);
            
            // Label the clothing box
            context.fillStyle = '#F472B6';
            context.font = 'bold 14px sans-serif';
            context.fillText('Clothing', clothingBoxX, clothingBoxY - 5);
            
            // Sample color from the center of the clothing area
            try {
              const imageData = context.getImageData(
                centerX, 
                centerY,
                1, 
                1
              );
              
              const r = imageData.data[0];
              const g = imageData.data[1];
              const b = imageData.data[2];
              
              const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              setDetectedColor(color);
              
              // Find nearest color in our map
              setColorName(findNearestColorName(r, g, b));
              
              // Draw a small color indicator
              context.fillStyle = color;
              context.beginPath();
              context.arc(clothingBoxX + clothingBoxWidth + 15, clothingBoxY + 10, 8, 0, Math.PI * 2);
              context.fill();
            } catch (error) {
              console.error("Error getting image data:", error);
            }

            // Add fashion style information based on detected color
            if (colorName) {
              const predictedStyle = determineStyleFromColor(colorName);
              const styleInfo = fashionStyles[predictedStyle];
              
              // Draw style information
              context.fillStyle = '#FFFFFF';
              context.fillRect(10, canvas.height - 100, 200, 90);
              
              context.fillStyle = '#000000';
              context.font = 'bold 14px sans-serif';
              context.fillText(`Detected Style: ${styleInfo.name}`, 15, canvas.height - 80);
              
              context.font = '12px sans-serif';
              context.fillText(`Color: ${colorName}`, 15, canvas.height - 60);
              context.fillText(`Occasion: ${styleInfo.occasions[0]}`, 15, canvas.height - 40);
              context.fillText(`Pair with: ${styleInfo.matchingItems[0]}`, 15, canvas.height - 20);
            }
          } catch (error) {
            console.error("Error drawing to canvas:", error);
          }
        }
      }
    }, 150); // Faster updates for more responsive feel
  };

  const findNearestColorName = (r: number, g: number, b: number): string => {
    let minDistance = Infinity;
    let closestColor = 'Unknown';
    
    Object.entries(colorMap).forEach(([hexColor, name]) => {
      // Convert hex to rgb
      const hex = hexColor.substring(1);
      const hr = parseInt(hex.substring(0, 2), 16);
      const hg = parseInt(hex.substring(2, 4), 16);
      const hb = parseInt(hex.substring(4, 6), 16);
      
      // Calculate Euclidean distance in RGB space
      const distance = Math.sqrt(
        Math.pow(r - hr, 2) + 
        Math.pow(g - hg, 2) + 
        Math.pow(b - hb, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = name;
      }
    });
    
    return closestColor;
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        try {
          // Draw the full video frame
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Get the image data
          const capturedImage = canvas.toDataURL('image/png');
          setImage(capturedImage);
          analyzeImageColor(capturedImage);
          
          // Success message
          toast({
            title: "Image captured!",
            description: "Analyzing your clothing style..."
          });
          
          // Stop webcam and real-time detection
          closeWebcam();
        } catch (error) {
          console.error("Error capturing image:", error);
          toast({
            title: "Capture Error",
            description: "There was a problem capturing the image",
            variant: "destructive"
          });
        }
      }
    }
  };

  const closeWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
    
    setIsCapturing(false);
    setIsRealTimeDetection(false);
    setIsCameraReady(false);
  };

  const resetImage = () => {
    setImage(null);
    setBoundingBox(null);
    setDetectedColor(null);
    setColorName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImageColor = (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        // Sample multiple points for better color detection
        const centerX = Math.floor(img.width / 2);
        const centerY = Math.floor(img.height / 2);
        
        // Sample a 5x5 grid around the center
        let r = 0, g = 0, b = 0;
        let sampleCount = 0;
        
        // Calculate average color from 5x5 grid
        for (let i = -2; i <= 2; i++) {
          for (let j = -2; j <= 2; j++) {
            try {
              const data = context.getImageData(centerX + i*10, centerY + j*10, 1, 1).data;
              r += data[0];
              g += data[1];
              b += data[2];
              sampleCount++;
            } catch (e) {
              console.error("Error sampling color", e);
            }
          }
        }
        
        // Calculate average
        r = Math.floor(r / sampleCount);
        g = Math.floor(g / sampleCount);
        b = Math.floor(b / sampleCount);
        
        const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        setDetectedColor(color);
        setColorName(findNearestColorName(r, g, b));
      }
    };
  };

  const analyzeImage = () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const imgElement = new Image();
      imgElement.src = image;
      
      imgElement.onload = () => {
        const width = imgElement.width * 0.6;
        const height = imgElement.height * 0.7;
        const x = (imgElement.width - width) / 2;
        const y = (imgElement.height - height) / 4;
        
        setBoundingBox({ x, y, width, height });
        
        // More sophisticated style detection based on color
        const detectedStyle = determineStyleFromColor(colorName);
        
        if (onStyleDetected) {
          onStyleDetected(detectedStyle);
        }
        
        // Generate occasion and accessory recommendations
        const recommendations = generateRecommendations(detectedStyle, colorName);
        
        // Store in localStorage for results page
        localStorage.setItem("uploadedImage", image);
        localStorage.setItem("detectedColor", detectedColor || '');
        localStorage.setItem("colorName", colorName || '');
        localStorage.setItem("styleResults", JSON.stringify({
          style: detectedStyle,
          color: colorName,
          confidence: 0.85 + Math.random() * 0.15, // Higher confidence range
          recommendations: recommendations,
          occasions: fashionStyles[detectedStyle]?.occasions || [],
          matchingItems: fashionStyles[detectedStyle]?.matchingItems || []
        }));
        
        setIsAnalyzing(false);
        
        toast({
          title: "Fashion Analysis Complete",
          description: `Identified ${colorName} ${fashionStyles[detectedStyle]?.name} style`,
        });
        
        // Navigate to results page after a delay
        setTimeout(() => {
          navigate("/results");
        }, 1000);
      };
    }, 1500);
  };

  // Add new function for determining style from color
  const determineStyleFromColor = (colorName: string | null): string => {
    if (!colorName) return "casual";
    
    // More sophisticated color-to-style mapping
    const colorStyleMap: Record<string, string[]> = {
      "Black": ["formal", "elegant", "streetwear"],
      "White": ["casual", "formal", "elegant"],
      "Gray": ["formal", "casual"],
      "Blue": ["casual", "elegant"],
      "Red": ["sporty", "elegant"],
      "Green": ["casual", "sporty"],
      "Yellow": ["sporty", "streetwear"],
      "Orange": ["sporty", "streetwear"],
      "Purple": ["elegant", "streetwear"],
      "Pink": ["casual", "elegant"],
      "Brown": ["casual", "formal"]
    };
    
    // Get possible styles for this color
    const possibleStyles = colorStyleMap[colorName] || ["casual"];
    
    // Return a style from the possible options
    return possibleStyles[Math.floor(Math.random() * possibleStyles.length)];
  };
  
  // Change return type from any[] to RecommendationItem[]
  const generateRecommendations = (style: string, colorName: string | null): RecommendationItem[] => {
    const styleData = fashionStyles[style] || fashionStyles.casual;
    
    // Generate top, bottom, and accessory recommendations
    return [
      { 
        type: "top", 
        name: `${colorName || ''} ${styleData.name} Top`, 
        style: style,
        description: `A ${colorName?.toLowerCase() || ''} top that perfectly matches ${styleData.name.toLowerCase()} style occasions`
      },
      { 
        type: "bottom", 
        name: `Complementary ${styleData.name} Bottom`, 
        style: style,
        description: `Pair with ${styleData.matchingItems[0].toLowerCase()} for a complete outfit`
      },
      { 
        type: "accessory", 
        name: styleData.matchingItems[Math.floor(Math.random() * styleData.matchingItems.length)], 
        style: style,
        description: `The perfect accessory for your ${styleData.name.toLowerCase()} look`
      }
    ];
  };

  return (
    <div className="space-y-4">
      {/* Hidden canvas for capturing webcam image */}
      <canvas ref={canvasRef} className="hidden" />
      
      {!image && !isCapturing && (
        <div 
          className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Upload a Fashion Image</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Drag and drop or click to upload an image of your clothing or outfit
            </p>
            <Input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleUpload}
            />
          </div>
        </div>
      )}
      
      {!image && !isCapturing && (
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <div className="w-full text-center bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <User className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold">Fashion Style Analyzer</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Use your webcam to detect clothing styles and get personalized recommendations
            </p>
            
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="flex flex-col items-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => startWebcam(false)}
                  className="flex items-center justify-center w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Fashion Photo
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Capture your outfit
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => startWebcam(true)}
                  className="flex items-center justify-center w-full bg-primary"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Style Scanner
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Live fashion analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isCapturing && (
        <div className="relative border rounded-lg overflow-hidden bg-black">
          {/* Actual video element - may be hidden in real-time mode */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={isRealTimeDetection ? "hidden" : "w-full h-80 object-cover"}
          />
          
          {/* Canvas for real-time detection visualization */}
          <canvas 
            ref={detectionCanvasRef} 
            className={isRealTimeDetection ? "w-full h-80 object-cover" : "hidden"}
          />
          
          {/* Loading indicator when camera is initializing */}
          {isCapturing && !isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                <p className="text-white font-medium">Starting camera...</p>
                <p className="text-gray-300 text-sm mt-2">Please allow camera access if prompted</p>
              </div>
            </div>
          )}
          
          {/* Close button */}
          <div className="absolute top-2 right-2">
            <Button 
              size="icon"
              variant="destructive"
              onClick={closeWebcam}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Actions bar at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3 flex justify-between items-center">
            {/* Left side - detected color if in real-time mode */}
            {isRealTimeDetection && detectedColor && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{backgroundColor: detectedColor}}
                />
                <span className="text-sm font-medium text-white">{colorName || 'Detecting...'}</span>
              </div>
            )}
            
            {/* If not in real-time mode, show empty div for spacing */}
            {!isRealTimeDetection && <div></div>}
            
            {/* Right side - action buttons */}
            <div className="flex gap-2">
              {!isRealTimeDetection && (
                <Button 
                  onClick={captureImage}
                  className="bg-white text-black hover:bg-white/90"
                  disabled={!isCameraReady}
                >
                  <Aperture className="mr-2 h-4 w-4" />
                  Capture
                </Button>
              )}
              
              {isRealTimeDetection && (
                <Button
                  onClick={captureImage}
                  className="bg-primary text-white hover:bg-primary/90"
                  disabled={!isCameraReady}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Use This Style
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Guidance text for webcam usage */}
      {isCapturing && isRealTimeDetection && isCameraReady && (
        <div className="text-center bg-primary/10 p-3 rounded-lg mt-2">
          <p className="text-sm font-medium">
            Move your clothing item into the detection box
          </p>
          <p className="text-xs text-gray-600 mt-1">
            We're detecting colors in real-time. Click "Use This Style" when ready.
          </p>
        </div>
      )}
      
      {image && (
        <div className="relative border rounded-lg overflow-hidden">
          <div className="relative">
            <img 
              src={image} 
              alt="Uploaded clothing" 
              className="w-full object-contain max-h-80"
            />
            {boundingBox && (
              <div 
                className="absolute border-2 border-primary animate-pulse pointer-events-none"
                style={{
                  left: `${(boundingBox.x / new Image().width) * 100}%`,
                  top: `${(boundingBox.y / new Image().height) * 100}%`,
                  width: `${(boundingBox.width / new Image().width) * 100}%`,
                  height: `${(boundingBox.height / new Image().height) * 100}%`
                }}
              />
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Button 
              size="icon"
              variant="destructive"
              onClick={resetImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {image && detectedColor && (
        <div className="border rounded-lg p-4 mt-4">
          <p className="text-sm font-medium mb-2">Detected Color:</p>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full" 
              style={{ backgroundColor: detectedColor }}
            />
            <div>
              <p className="font-medium">{colorName}</p>
              <p className="text-xs text-gray-500">{detectedColor}</p>
            </div>
          </div>
        </div>
      )}
      
      {image && (
        <div className="flex justify-center mt-6">
          <Button 
            className="w-full max-w-xs"
            onClick={analyzeImage}
            disabled={isAnalyzing}
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Fashion...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Get Fashion Recommendations
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
