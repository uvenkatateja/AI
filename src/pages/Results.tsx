import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import VirtualModel from "@/components/VirtualModel";
import { Palette, ChevronRight, ChevronRightIcon, ShoppingBagIcon, CalendarIcon, Shirt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface StyleResult {
  style: string;
  color: string;
  confidence: number;
  recommendations: Recommendation[];
  occasions: string[];
  matchingItems: string[];
}

interface Recommendation {
  type: string;
  name: string;
  style: string;
  description: string;
}

const Results = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [styleResults, setStyleResults] = useState<StyleResult | null>(null);
  const [colorName, setColorName] = useState<string | null>(null);
  const [detectedColor, setDetectedColor] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Get data from localStorage (in a real app, this would come from the API)
    const image = localStorage.getItem("uploadedImage");
    const resultsData = localStorage.getItem("styleResults");
    const color = localStorage.getItem("colorName");
    const detectedColorHex = localStorage.getItem("detectedColor");
    
    if (!image || !resultsData) {
      navigate("/dashboard");
      return;
    }
    
    setUploadedImage(image);
    setStyleResults(JSON.parse(resultsData));
    setColorName(color);
    setDetectedColor(detectedColorHex);
  }, [isAuthenticated, navigate]);

  if (!styleResults || !uploadedImage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-lg">Loading results...</p>
          </div>
        </main>
      </div>
    );
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const getComplementaryColors = (hex: string): string[] => {
    if (!hex) return ['#f0f0f0', '#e0e0e0', '#d0d0d0'];
    
    // Remove # if present
    const color = hex.startsWith('#') ? hex.slice(1) : hex;
    
    // Convert to RGB
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    
    // Generate complementary color (opposite on color wheel)
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    
    // Generate analogous colors (adjacent on color wheel)
    const hsl = rgbToHsl(r, g, b);
    const hue = hsl[0];
    
    const hue1 = (hue + 30) % 360;
    const hue2 = (hue + 60) % 360;
    
    const rgb1 = hslToRgb(hue1, hsl[1], hsl[2]);
    const rgb2 = hslToRgb(hue2, hsl[1], hsl[2]);
    
    const color1 = `#${rgb1[0].toString(16).padStart(2, '0')}${rgb1[1].toString(16).padStart(2, '0')}${rgb1[2].toString(16).padStart(2, '0')}`;
    const color2 = `#${rgb2[0].toString(16).padStart(2, '0')}${rgb2[1].toString(16).padStart(2, '0')}${rgb2[2].toString(16).padStart(2, '0')}`;
    const compColor = `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
    
    return [color1, color2, compColor];
  };
  
  // RGB to HSL conversion
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h *= 60;
    }
    
    return [h, s, l];
  };
  
  // HSL to RGB conversion
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, (h / 360) + 1/3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, (h / 360) - 1/3);
    }
    
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  };

  const getIconForRecommendation = (type: string) => {
    switch (type.toLowerCase()) {
      case 'top':
        return <Shirt className="h-5 w-5" />;
      case 'bottom':
        return <ShoppingBagIcon className="h-5 w-5" />;
      case 'accessory':
        return <span className="text-xl">👑</span>;
      default:
        return <ShoppingBagIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-3xl font-bold mb-2">Your Fashion Analysis</h1>
          <p className="text-muted-foreground mb-8">
            Based on your image, we've analyzed your style and prepared personalized recommendations
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
            <div className="col-span-1 lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your Fashion Item</CardTitle>
                  <CardDescription>
                    Uploaded image for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-md overflow-hidden border border-gray-200">
                    <img
                      src={uploadedImage}
                      alt="Uploaded outfit"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Color Analysis</CardTitle>
                  <CardDescription>
                    We detected the following color palette
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full border border-gray-200"
                        style={{ backgroundColor: detectedColor || '#ccc' }}
                      />
                      <div>
                        <h4 className="font-medium">Primary Color</h4>
                        <p className="text-sm text-gray-600">{colorName || 'Neutral'}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div>
                      <h4 className="font-medium mb-2">Complementary Colors</h4>
                      <div className="flex space-x-2">
                        {getComplementaryColors(detectedColor || '').map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={`Complementary color ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        These colors pair well with your primary color
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 lg:col-span-3">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Style Profile</CardTitle>
                      <CardDescription>
                        Your detected fashion style
                      </CardDescription>
                    </div>
                    <Badge className="px-3 py-1">
                      {Math.round(styleResults.confidence * 100)}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 bg-gray-50 rounded-lg mb-4">
                    <h2 className="text-2xl font-bold mb-2 text-primary">
                      {capitalize(styleResults.style)} Style
                    </h2>
                    <p className="text-gray-600">
                      {styleResults.style === 'casual' && "Relaxed, comfortable clothing suitable for everyday wear"}
                      {styleResults.style === 'formal' && "Elegant, sophisticated attire for professional or special occasions"}
                      {styleResults.style === 'sporty' && "Athletic-inspired clothing that combines function and fashion"}
                      {styleResults.style === 'elegant' && "Sophisticated and refined style for upscale occasions"}
                      {styleResults.style === 'streetwear' && "Urban fashion with bold contemporary edge"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-medium">Perfect For</h3>
                      </div>
                      <ul className="space-y-1">
                        {styleResults.occasions.map((occasion, idx) => (
                          <li key={idx} className="text-sm flex items-center">
                            <ChevronRightIcon className="h-4 w-4 text-muted-foreground mr-1" />
                            {occasion}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <ShoppingBagIcon className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-medium">Pair With</h3>
                      </div>
                      <ul className="space-y-1">
                        {styleResults.matchingItems.map((item, idx) => (
                          <li key={idx} className="text-sm flex items-center">
                            <ChevronRightIcon className="h-4 w-4 text-muted-foreground mr-1" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fashion Recommendations</CardTitle>
                  <CardDescription>
                    Based on your style and color, here are some personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {styleResults.recommendations.map((rec, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            {getIconForRecommendation(rec.type)}
                          </div>
                          <h3 className="font-medium">{rec.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {rec.description}
                        </p>
                        <Badge variant="outline" className="bg-primary/5">
                          {capitalize(rec.type)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t bg-gray-50">
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => navigate("/dashboard")}
                  >
                    Try Another Fashion Item
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Outfit Combination Ideas</CardTitle>
                <CardDescription>
                  Outfit concepts based on your style and color
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {colorName} {styleResults.style} Outfit {index + 1}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {index === 0 ? "Casual day out" : 
                           index === 1 ? "Weekend brunch" : "Evening social"}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fashion Tips</CardTitle>
                <CardDescription>
                  How to enhance your {styleResults.style} look
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Highlight Your Color Palette</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {colorName} pairs well with {getComplementaryColors(detectedColor || '')[0]} and {getComplementaryColors(detectedColor || '')[1]} for a balanced look.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Accessorize Thoughtfully</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Choose {styleResults.style === "formal" ? "minimal" : 
                              styleResults.style === "elegant" ? "statement" : 
                              styleResults.style === "casual" ? "relaxed" : "bold"} accessories that enhance without overwhelming.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Consider the Occasion</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Adapt your {styleResults.style} style to fit different settings with subtle adjustments in formality.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button onClick={() => navigate('/dashboard')}>
              Analyze Another Item
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
