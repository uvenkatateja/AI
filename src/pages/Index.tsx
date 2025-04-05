import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FashionCarousel from "@/components/FashionCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import VirtualModel from "@/components/VirtualModel";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Camera, Shirt, PanelsTopLeft, Tag, Database, Code, Brain, Sparkles } from "lucide-react";
import styles from "@/styles/index.module.css";

const Index = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Fashion color palette
  const colors = {
    neutrals: {
      white: "#FFFFFF",
      cream: "#F8F5F2",
      lightGray: "#EAEAEA",
      mediumGray: "#D1D1D1",
      darkGray: "#5A5A5A"
    },
    accents: {
      blush: "#E8C4C4",       // soft pink
      sage: "#B4C9B4",        // muted green
      terracotta: "#CB8E79",  // earthy orange
      dustyBlue: "#8BA9C6",   // muted blue
      mauve: "#B98EA7"        // soft purple
    }
  };

  // Typography settings
  const typography = {
    fontFamily: "'Inter', 'Open Sans', sans-serif",
    heading: {
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    body: {
      fontWeight: 500,
      lineHeight: 1.6
    }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 font-['Inter']">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center">
        <motion.section 
          className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-20 md:py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="order-2 md:order-1"
              variants={fadeInUp}
            >
              <motion.div 
                className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-[#5A5A5A] text-white mb-6 hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span className={styles['scale-text']}>AI-Powered Fashion Analysis</span>
                </span>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
                variants={fadeInUp}
                style={{ letterSpacing: "-0.02em" }}
              >
                <span className={styles['text-glow']}>Smart Fashion{" "}</span>
               
                <span className="text-pink-500">Recommendations</span>

              </motion.h1>

              <motion.p className={`text-lg md:text-xl text-black font-bold mb-8 max-w-md leading-relaxed ${styles['hover-text']}`}>
                Experience our advanced system that analyzes your style through image recognition and provides personalized fashion recommendations.
              </motion.p>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
                variants={staggerChildren}
              >
                <motion.div 
                  className={`group ${styles['feature-card']}`}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E8C4C4]/10 to-[#B4C9B4]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Camera className="h-8 w-8 text-[#B98EA7] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-black">Real-time Analysis</h3>
                    <p className="text-sm text-black font-bold mt-2">Instant style detection</p>
                  </div>
                </motion.div>

                <motion.div 
                  className={`group ${styles['feature-card']}`}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E8C4C4]/10 to-[#B4C9B4]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Code className="h-8 w-8 text-[#8BA9C6] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-black">Tech-Powered</h3>
                    <p className="text-sm text-black font-bold mt-2">Advanced recognition technology</p>
                  </div>
                </motion.div>

                <motion.div 
                  className={`group ${styles['feature-card']}`}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E8C4C4]/10 to-[#B4C9B4]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Database className="h-8 w-8 text-[#CB8E79] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-black">Rich Dataset</h3>
                    <p className="text-sm text-black font-bold mt-2">Comprehensive Collection</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-[#E8C4C4]/20 to-[#8BA9C6]/20 rounded-xl blur-2xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-[#F8F5F2] p-6 rounded-xl">
                    <VirtualModel 
                      outfit="elegant" 
                      initialSize={1.4}
                      humanLike={true}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
        
        <div className="w-full py-16 bg-transparent"></div>
        
        <motion.section 
          className="w-full bg-gradient-to-r from-[#F8F5F2] to-white py-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.h2 
              className={`text-4xl md:text-5xl font-bold mb-12 text-center text-black`} 
              style={{ letterSpacing: "-0.02em" }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-pink-500">Technology Stack</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white backdrop-blur-sm p-8 rounded-2xl overflow-hidden relative group cursor-pointer border border-[#EAEAEA] hover:border-[#B98EA7]/30"
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15 
                }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#B98EA7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="bg-gradient-to-br from-[#B98EA7] to-[#B98EA7]/80 text-white w-20 h-20 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 z-10 relative overflow-hidden shadow-lg"
                  whileHover={{ rotate: 10 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                    animate={{ 
                      x: ["0%", "100%", "0%"],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Code className="h-10 w-10 relative z-10" />
                </motion.div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-black group-hover:text-[#B98EA7] transition-colors duration-300 relative`}>
                  <span className="relative inline-block">
                    Frontend
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-0 h-1 bg-[#B98EA7] group-hover:w-full transition-all duration-300"
                    />
                  </span>
                </h3>
                <p className={`text-lg text-black/80 font-medium ${styles['scale-text']} group-hover:text-black transition-colors duration-300 mb-4`}>
                  Built with React.js and Three.js for interactive 3D visualization and real-time style analysis.
                </p>
                
                {/* Hidden details that appear on hover */}
                <motion.div 
                  className="overflow-hidden max-h-0 group-hover:max-h-56 transition-all duration-500 mt-0 group-hover:mt-4 opacity-0 group-hover:opacity-100"
                >
                  <ul className="text-base text-black/70 space-y-3 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#B98EA7]"></span>
                      <span>Modern React with Hooks</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#B98EA7]"></span>
                      <span>Real-time 3D rendering</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#B98EA7]"></span>
                      <span>Framer Motion animations</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>

              <motion.div 
                className="bg-white backdrop-blur-sm p-8 rounded-2xl overflow-hidden relative group cursor-pointer border border-[#EAEAEA] hover:border-[#B4C9B4]/30"
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15 
                }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#B4C9B4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="bg-gradient-to-br from-[#B4C9B4] to-[#B4C9B4]/80 text-white w-20 h-20 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 z-10 relative overflow-hidden shadow-lg"
                  whileHover={{ rotate: 10 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                    animate={{ 
                      x: ["0%", "100%", "0%"],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Database className="h-10 w-10 relative z-10" />
                </motion.div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-black group-hover:text-[#B4C9B4] transition-colors duration-300 relative`}>
                  <span className="relative inline-block">
                    Backend
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-0 h-1 bg-[#B4C9B4] group-hover:w-full transition-all duration-300"
                    />
                  </span>
                </h3>
                <p className={`text-lg text-black/80 font-medium ${styles['scale-text']} group-hover:text-black transition-colors duration-300 mb-4`}>
                  Powered by Flask (Python) with advanced ML models for image classification and style detection.
                </p>
                
                {/* Hidden details that appear on hover */}
                <motion.div 
                  className="overflow-hidden max-h-0 group-hover:max-h-56 transition-all duration-500 mt-0 group-hover:mt-4 opacity-0 group-hover:opacity-100"
                >
                  <ul className="text-base text-black/70 space-y-3 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#B4C9B4]"></span>
                      <span>REST API architecture</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#B4C9B4]"></span>
                      <span>Scalable cloud deployment</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#B4C9B4]"></span>
                      <span>Real-time data processing</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>

              <motion.div 
                className="bg-white backdrop-blur-sm p-8 rounded-2xl overflow-hidden relative group cursor-pointer border border-[#EAEAEA] hover:border-[#CB8E79]/30"
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15 
                }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#CB8E79]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="bg-gradient-to-br from-[#CB8E79] to-[#CB8E79]/80 text-white w-20 h-20 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 z-10 relative overflow-hidden shadow-lg"
                  whileHover={{ rotate: 10 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                    animate={{ 
                      x: ["0%", "100%", "0%"],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Brain className="h-10 w-10 relative z-10" />
                </motion.div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-black group-hover:text-[#CB8E79] transition-colors duration-300 relative`}>
                  <span className="relative inline-block">
                    ML Components
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-0 h-1 bg-[#CB8E79] group-hover:w-full transition-all duration-300"
                    />
                  </span>
                </h3>
                <p className={`text-lg text-black/80 font-medium ${styles['scale-text']} group-hover:text-black transition-colors duration-300 mb-4`}>
                  CNN-based image classification and NLP for comprehensive style analysis.
                </p>
                
                {/* Hidden details that appear on hover */}
                <motion.div 
                  className="overflow-hidden max-h-0 group-hover:max-h-56 transition-all duration-500 mt-0 group-hover:mt-4 opacity-0 group-hover:opacity-100"
                >
                  <ul className="text-base text-black/70 space-y-3 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#CB8E79]"></span>
                      <span>TensorFlow & PyTorch</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#CB8E79]"></span>
                      <span>Custom trained CNN models</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#CB8E79]"></span>
                      <span>Computer vision techniques</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
        
        <div className="w-full py-16 bg-transparent"></div>
        
        <motion.section 
          className="w-full py-20 px-4 bg-[#F8F5F2] overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-8" 
                style={{ letterSpacing: "-0.02em" }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Fashion <span className="bg-gradient-to-r from-[#B98EA7] to-[#8BA9C6] bg-clip-text text-transparent">Features</span>
              </motion.h2>
              <p className="text-xl md:text-2xl text-[#5A5A5A] max-w-3xl mx-auto leading-relaxed font-medium">
                Our AI-powered system offers a comprehensive set of features to enhance your fashion experience.
              </p>
            </motion.div>
            
            {/* Carousel Container */}
            <div className="relative px-4 py-6 overflow-hidden">
              {/* Auto-scrolling Carousel Track */}
              <motion.div 
                className="flex space-x-8 pb-10 pl-4"
                initial={{ opacity: 0 }}
                animate={{ 
                  x: [0, -1920], 
                  opacity: 1,
                  transition: {
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 20,
                      ease: "linear"
                    },
                    opacity: { duration: 0.8 }
                  }
                }}
                style={{ pointerEvents: "none" }} // Disables all pointer interactions
              >
                {/* Feature Card 1 */}
                <motion.div
                  className={`bg-white p-8 ${styles['feature-box']} rounded-2xl shadow-lg flex-shrink-0 w-full md:w-80 lg:w-96`}
                >
                  <div className="mb-6">
                    <div className={`bg-[#B98EA7]/10 rounded-full w-20 h-20 flex items-center justify-center mb-6 ${styles['feature-icon']}`}>
                      <Brain className="h-10 w-10 text-[#B98EA7]" />
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles['feature-title']}`}>Smart Analysis</h3>
                    <p className="text-lg text-black/80 leading-relaxed font-medium">
                      Advanced algorithms analyze your clothing items to identify your unique fashion preferences.
                    </p>
                  </div>
                </motion.div>
                
                {/* Feature Card 2 */}
                <motion.div
                  className={`bg-white p-8 ${styles['feature-box']} rounded-2xl shadow-lg flex-shrink-0 w-full md:w-80 lg:w-96`}
                >
                  <div className="mb-6">
                    <div className={`bg-[#B4C9B4]/10 rounded-full w-20 h-20 flex items-center justify-center mb-6 ${styles['feature-icon']}`}>
                      <Shirt className="h-10 w-10 text-[#B4C9B4]" />
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles['feature-title']}`}>Custom Recommendations</h3>
                    <p className="text-lg text-black/80 leading-relaxed font-medium">
                      Get personalized suggestions that complement your existing wardrobe and enhance your style.
                    </p>
                  </div>
                </motion.div>
                
                {/* Feature Card 3 */}
                <motion.div
                  className={`bg-white p-8 ${styles['feature-box']} rounded-2xl shadow-lg flex-shrink-0 w-full md:w-80 lg:w-96`}
                >
                  <div className="mb-6">
                    <div className={`bg-[#CB8E79]/10 rounded-full w-20 h-20 flex items-center justify-center mb-6 ${styles['feature-icon']}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#CB8E79]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles['feature-title']}`}>Secure Processing</h3>
                    <p className="text-lg text-black/80 leading-relaxed font-medium">
                      Your data and images are processed securely with strong privacy protections.
                    </p>
                  </div>
                </motion.div>
                
                {/* Feature Card 4 */}
                <motion.div
                  className={`bg-white p-8 ${styles['feature-box']} rounded-2xl shadow-lg flex-shrink-0 w-full md:w-80 lg:w-96`}
                >
                  <div className="mb-6">
                    <div className={`bg-[#8BA9C6]/10 rounded-full w-20 h-20 flex items-center justify-center mb-6 ${styles['feature-icon']}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#8BA9C6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles['feature-title']}`}>Quick Results</h3>
                    <p className="text-lg text-black/80 leading-relaxed font-medium">
                      Receive fashion analysis and recommendations instantly after uploading your images.
                    </p>
                  </div>
                </motion.div>

                {/* Duplicated Cards for Continuous Loop Effect */}
                <motion.div
                  className={`bg-white p-8 ${styles['feature-box']} rounded-2xl shadow-lg flex-shrink-0 w-full md:w-80 lg:w-96`}
                >
                  <div className="mb-6">
                    <div className={`bg-[#B98EA7]/10 rounded-full w-20 h-20 flex items-center justify-center mb-6 ${styles['feature-icon']}`}>
                      <Brain className="h-10 w-10 text-[#B98EA7]" />
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles['feature-title']}`}>Smart Analysis</h3>
                    <p className="text-lg text-black/80 leading-relaxed font-medium">
                      Advanced algorithms analyze your clothing items to identify your unique fashion preferences.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  className={`bg-white p-8 ${styles['feature-box']} rounded-2xl shadow-lg flex-shrink-0 w-full md:w-80 lg:w-96`}
                >
                  <div className="mb-6">
                    <div className={`bg-[#B4C9B4]/10 rounded-full w-20 h-20 flex items-center justify-center mb-6 ${styles['feature-icon']}`}>
                      <Shirt className="h-10 w-10 text-[#B4C9B4]" />
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles['feature-title']}`}>Custom Recommendations</h3>
                    <p className="text-lg text-black/80 leading-relaxed font-medium">
                      Get personalized suggestions that complement your existing wardrobe and enhance your style.
                    </p>
                  </div>
                </motion.div>

                {/* More duplicated cards for a smoother loop */}
                <motion.div
                  className={`bg-white p-8 ${styles['feature-box']} rounded-2xl shadow-lg flex-shrink-0 w-full md:w-80 lg:w-96`}
                >
                  <div className="mb-6">
                    <div className={`bg-[#CB8E79]/10 rounded-full w-20 h-20 flex items-center justify-center mb-6 ${styles['feature-icon']}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#CB8E79]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles['feature-title']}`}>Secure Processing</h3>
                    <p className="text-lg text-black/80 leading-relaxed font-medium">
                      Your data and images are processed securely with strong privacy protections.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  className={`bg-white p-8 ${styles['feature-box']} rounded-2xl shadow-lg flex-shrink-0 w-full md:w-80 lg:w-96`}
                >
                  <div className="mb-6">
                    <div className={`bg-[#8BA9C6]/10 rounded-full w-20 h-20 flex items-center justify-center mb-6 ${styles['feature-icon']}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#8BA9C6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles['feature-title']}`}>Quick Results</h3>
                    <p className="text-lg text-black/80 leading-relaxed font-medium">
                      Receive fashion analysis and recommendations instantly after uploading your images.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Carousel Indicators */}
              <div className="flex justify-center mt-8 space-x-3">
                <div className="w-12 h-1 rounded-full bg-[#B98EA7] opacity-100"></div>
                <div className="w-3 h-1 rounded-full bg-[#B98EA7] opacity-50"></div>
                <div className="w-3 h-1 rounded-full bg-[#B98EA7] opacity-50"></div>
                <div className="w-3 h-1 rounded-full bg-[#B98EA7] opacity-50"></div>
              </div>

              {/* Auto-scroll indication */}
              <div className="text-center mt-6 text-[#5A5A5A] font-medium text-sm">
                <p>Features automatically scroll for easy viewing</p>
              </div>
            </div>
          </div>
        </motion.section>
        
        <div className="w-full py-16 bg-transparent"></div>
        
        <motion.section 
          className="w-full py-16 px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center ${styles['text-glow']}`} 
              style={{ letterSpacing: "-0.02em" }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Comprehensive Fashion Analysis System
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-[#F8F5F2] p-6 rounded-lg">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">Style Detection System</h3>
                  <p className="text-base md:text-lg text-[#5A5A5A] leading-relaxed font-medium">
                    Real-time clothing analysis with color detection and style classification.
                  </p>
                </div>
                <div className="bg-[#F8F5F2] p-6 rounded-lg">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">Image Analysis Pipeline</h3>
                  <p className="text-base md:text-lg text-[#5A5A5A] leading-relaxed font-medium">
                    Advanced preprocessing and feature extraction for accurate style prediction.
                  </p>
                </div>
                <div className="bg-[#F8F5F2] p-6 rounded-lg">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">Rich Dataset Integration</h3>
                  <p className="text-base md:text-lg text-[#5A5A5A] leading-relaxed font-medium">
                    Comprehensive fashion dataset with high-resolution images and detailed attributes.
                  </p>
                </div>
              </div>
              
              <div className="order-first md:order-none bg-[#F8F5F2] p-6 rounded-xl">
                <div className="h-[450px]">
                  <VirtualModel 
                    outfit="casual" 
                    initialSize={1.4}
                    humanLike={true}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#F8F5F2] p-6 rounded-lg">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">3D Visualization</h3>
                  <p className="text-base md:text-lg text-[#5A5A5A] leading-relaxed font-medium">
                    Interactive Three.js rendering with realistic fabric simulation.
                  </p>
                </div>
                <div className="bg-[#F8F5F2] p-6 rounded-lg">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">Smart Recommendations</h3>
                  <p className="text-base md:text-lg text-[#5A5A5A] leading-relaxed font-medium">
                    AI-powered suggestions for complementary items and occasions.
                  </p>
                </div>
                <div className="bg-[#F8F5F2] p-6 rounded-lg">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">Future Ready</h3>
                  <p className="text-base md:text-lg text-[#5A5A5A] leading-relaxed font-medium">
                    Prepared for AR integration and virtual try-on capabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
        
        <div className="w-full py-16 bg-transparent"></div>
        
        <motion.section 
          className="w-full bg-gradient-to-r from-[#B98EA7] to-[#8BA9C6] py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${styles['text-glow']}`} style={{ letterSpacing: "-0.02em" }}>
              Experience Advanced Fashion Analysis
            </h2>
            <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed font-bold ${styles['hover-text']}`}>
              Join us in revolutionizing the fashion industry with cutting-edge technology and personalized style recommendations.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 text-lg font-semibold"
            >
              Start Your Style Journey
            </Button>
          </div>
        </motion.section>
      </main>
      
      <footer className="w-full border-t py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[#5A5A5A] font-medium">
            © 2025 AI Fashion Analysis System. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className={`text-sm text-[#5A5A5A] font-medium ${styles['hover-text']}`}>Privacy</a>
            <a href="#" className={`text-sm text-[#5A5A5A] font-medium ${styles['hover-text']}`}>Terms</a>
            <a href="#" className={`text-sm text-[#5A5A5A] font-medium ${styles['hover-text']}`}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
