import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FashionCarousel from "@/components/FashionCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import VirtualModel from "@/components/VirtualModel";
import { ArrowRight, Upload, Camera, Shirt, PanelsTopLeft, Tag, Database, Code, Brain } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center">
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 animate-fade-in">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-fashion-charcoal text-white mb-6">
                <span className="flex items-center gap-1.5">
                  <Brain className="h-4 w-4" />
                  <span>AI-Powered Fashion Analysis</span>
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Smart Fashion <span className="gradient-text">Recommendations</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Experience our advanced AI system that analyzes your style through image recognition and provides personalized fashion recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto group"
                >
                  Try Style Analysis
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto"
                >
                  View Demo
                </Button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-fashion-charcoal/5 p-3 rounded-lg">
                  <div className="bg-fashion-blush p-2 rounded-full">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Real-time Analysis</span>
                </div>
                <div className="flex items-center gap-3 bg-fashion-charcoal/5 p-3 rounded-lg">
                  <div className="bg-fashion-sage p-2 rounded-full">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">ML-Powered</span>
                </div>
                <div className="flex items-center gap-3 bg-fashion-charcoal/5 p-3 rounded-lg">
                  <div className="bg-fashion-blush p-2 rounded-full">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">Rich Dataset</span>
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
              Advanced Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="bg-fashion-blush text-white w-10 h-10 flex items-center justify-center rounded-full mb-4">
                  <Code className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Frontend</h3>
                <p className="text-gray-300">
                  Built with React.js and Three.js for interactive 3D visualization and real-time style analysis.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="bg-fashion-sage text-white w-10 h-10 flex items-center justify-center rounded-full mb-4">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Backend</h3>
                <p className="text-gray-300">
                  Powered by Flask (Python) with advanced ML models for image classification and style detection.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="bg-fashion-blush text-white w-10 h-10 flex items-center justify-center rounded-full mb-4">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ML Components</h3>
                <p className="text-gray-300">
                  CNN-based image classification and NLP for comprehensive style analysis.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <FeaturesSection />
        
        <section className="w-full py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-12 text-center">
              Comprehensive Fashion Analysis System
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Style Detection System</h3>
                  <p className="text-sm text-gray-600">
                    Real-time clothing analysis with color detection and style classification.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Image Analysis Pipeline</h3>
                  <p className="text-sm text-gray-600">
                    Advanced preprocessing and feature extraction for accurate style prediction.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Rich Dataset Integration</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive fashion dataset with high-resolution images and detailed attributes.
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
                  <h3 className="font-medium mb-2">3D Visualization</h3>
                  <p className="text-sm text-gray-600">
                    Interactive Three.js rendering with realistic fabric simulation.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Smart Recommendations</h3>
                  <p className="text-sm text-gray-600">
                    AI-powered suggestions for complementary items and occasions.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Future Ready</h3>
                  <p className="text-sm text-gray-600">
                    Prepared for AR integration and virtual try-on capabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full bg-gradient-to-r from-fashion-blush to-fashion-sage py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Experience AI-Powered Fashion Analysis
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join us in revolutionizing the fashion industry with cutting-edge AI technology and personalized style recommendations.
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
            © 2025 AI Fashion Analysis System. All rights reserved.
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
