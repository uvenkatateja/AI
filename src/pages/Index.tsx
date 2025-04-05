import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FashionCarousel from "@/components/FashionCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import VirtualModel from "@/components/VirtualModel";
import { ArrowRight, Upload, Camera, Shirt, PanelsTopLeft, Tag } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center">
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 animate-fade-in">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Smart Fashion <span className="gradient-text">Recommendations</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Upload your clothing images and our system will analyze your style, recommend matching pieces, and suggest perfect occasions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto group"
                >
                  Try It Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shirt className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">Style Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">Accessory Matches</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <PanelsTopLeft className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">Occasion Suggestions</span>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 animate-fade-in">
              <div className="rounded-xl overflow-hidden shadow-xl card-glow">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="h-[500px]">
                    <VirtualModel 
                      outfit="elegant" 
                      initialSize={1.4}
                      humanLike={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full bg-fashion-charcoal text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="bg-fashion-blush text-white w-10 h-10 flex items-center justify-center rounded-full mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Clothing</h3>
                <p className="text-gray-300">
                  Take a photo of your clothing item or upload an existing image to our platform.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="bg-fashion-blush text-white w-10 h-10 flex items-center justify-center rounded-full mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Identify Style</h3>
                <p className="text-gray-300">
                  Our system analyzes your image to determine style category, color palette, and key characteristics.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="bg-fashion-blush text-white w-10 h-10 flex items-center justify-center rounded-full mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
                <p className="text-gray-300">
                  Receive personalized suggestions for matching pieces, accessories, and occasions to wear your outfit.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <FeaturesSection />
        
        <section className="w-full py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-12 text-center">
              Advanced Fashion Recognition Technology
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Multiple Style Categories</h3>
                  <p className="text-sm text-gray-600">
                    Our system identifies casual, formal, sporty, elegant, and streetwear styles from your photos.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Color Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Get color palette suggestions that complement your clothing items perfectly.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Complete Outfit Creation</h3>
                  <p className="text-sm text-gray-600">
                    Turn a single item into a complete outfit with coordinated pieces and accessories.
                  </p>
                </div>
              </div>
              
              <div className="order-first md:order-none bg-gray-50 p-6 rounded-xl">
                <div className="h-[450px]">
                  <VirtualModel 
                    outfit="casual" 
                    initialSize={1.4}
                    humanLike={true}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Occasion Recommendations</h3>
                  <p className="text-sm text-gray-600">
                    Discover the perfect settings and events where your outfits will shine.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Accessory Matching</h3>
                  <p className="text-sm text-gray-600">
                    Find the ideal accessories to complement and enhance your clothing styles.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Style Visualization</h3>
                  <p className="text-sm text-gray-600">
                    See your recommended styles demonstrated with interactive 3D models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full bg-gradient-to-r from-fashion-blush to-fashion-sage py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Discover Your Perfect Style
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of fashion enthusiasts who have enhanced their wardrobe with our Fashion Recommendation System.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-white text-fashion-blush hover:bg-white/90"
            >
              Start Your Style Journey
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025 Fashion Recommendation System. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
