import Navbar from "@/components/Navbar";
import DashboardContent from "@/components/DashboardContent";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Camera, LayoutDashboard, Settings, User, BarChart2, History, ChevronDown, FileText, Shirt, Calendar, Tag, Upload, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClothingDesigner from "@/components/ClothingDesigner";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'upload' | 'designer' | 'history' | 'analytics' | 'settings' | 'profile'>('upload');

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated and not a demo, redirect to login
      navigate("/login");
    }
    
    // Add animation loading trigger
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const sidebarItems = [
    {
      id: "upload",
      label: "Upload Clothing",
      icon: <Upload className="h-5 w-5" />,
      description: "Analyze your clothing items",
      disabled: false
    },
    {
      id: "designer",
      label: "Clothing Designer",
      icon: <Shirt className="h-5 w-5" />,
      description: "Design and customize clothing",
      disabled: false
    },
    {
      id: "history",
      label: "Analysis History",
      icon: <History className="h-5 w-5" />,
      description: "View past analyses",
      disabled: false
    },
    {
      id: "analytics",
      label: "Style Analytics",
      icon: <BarChart2 className="h-5 w-5" />,
      description: "Your style insights",
      disabled: false
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Account preferences",
      disabled: false
    },
    {
      id: "profile",
      label: "Your Profile",
      icon: <User className="h-5 w-5" />,
      description: "View your profile",
      disabled: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-grow flex">
        {/* Sidebar */}
        <div className={`w-full md:w-64 lg:w-72 bg-white border-r border-gray-200 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3 mb-3">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h2 className="font-bold text-xl">Dashboard</h2>
            </div>
            <p className="text-sm text-gray-500">Fashion analysis tools</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => !item.disabled ? setActiveSection(item.id as any) : null}
                  disabled={item.disabled}
                  className={cn(
                    "w-full flex items-center text-left space-x-3 px-3 py-3 rounded-lg transition-all",
                    (item.id === activeSection) 
                      ? "bg-primary text-white shadow-md" 
                      : !item.disabled
                        ? "text-gray-700 hover:bg-gray-100" 
                        : "text-gray-400 cursor-not-allowed",
                    !item.disabled && "cursor-pointer"
                  )}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </nav>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 py-6 px-4 md:px-8 overflow-auto">
          <div className={`max-w-5xl mx-auto`}>
            <div className={`text-center mb-8 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-fashion-blush">
                Fashion Dashboard
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {activeSection === "upload" && "Upload your clothing for personalized style recommendations and fashion analysis"}
                {activeSection === "designer" && "Design custom clothing with our interactive 3D designer - add logos, text, and patterns"}
                {activeSection === "history" && "Browse your previous style analyses and recommendations"}
                {activeSection === "analytics" && "View insights and trends in your personal style over time"}
                {activeSection === "settings" && "Customize your account settings and preferences"}
                {activeSection === "profile" && "Manage your profile information and style preferences"}
              </p>
            </div>
            
            {/* Upload Your Clothing Section */}
            {activeSection === "upload" && (
              <div 
                className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <div className="flex items-center mb-6">
                  <Camera className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold">Upload Your Clothing</h2>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl mb-8">
                  <p className="text-gray-600 mb-4">
                    Upload images of your clothing to get professional style analysis and personalized recommendations.
                    Our AI will identify your style and provide fashion insights.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                   
                    <span className="px-3 py-1 bg-gray-200 rounded-full">Style Detection</span>
                    <span className="px-3 py-1 bg-gray-200 rounded-full">Personalized Recommendations</span>
                  </div>
                </div>
                <div 
                  className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <DashboardContent onStyleDetected={(style) => {
                    // Handle style detection (redirect to results perhaps)
                    console.log("Detected style:", style);
                    // Navigate to history after successful analysis
                    setActiveSection("history");
                  }} />
                </div>
              </div>
            )}
            
            {/* Designer Section */}
            {activeSection === "designer" && (
              <div 
                className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <div className="flex items-center mb-6">
                  <Shirt className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold">Clothing Designer</h2>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl mb-8">
                  <p className="text-gray-600 mb-4">
                    Design and customize your clothes with our interactive 3D tool. Add logos, text, and patterns to create unique styles.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 bg-gray-200 rounded-full">3D Visualization</span>
                    <span className="px-3 py-1 bg-gray-200 rounded-full">Custom Design</span>
                    <span className="px-3 py-1 bg-gray-200 rounded-full">Logo Placement</span>
                  </div>
                </div>
                
                <ClothingDesigner />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="font-medium mb-3">Popular Designs</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="aspect-square rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        >
                          <img 
                            src={`https://source.unsplash.com/random/200x200?tshirt,design&${i}`} 
                            alt={`Design ${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="font-medium mb-3">My Recent Designs</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[4, 5, 6].map((i) => (
                        <div 
                          key={i}
                          className="aspect-square rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        >
                          <img 
                            src={`https://source.unsplash.com/random/200x200?fashion,design&${i}`} 
                            alt={`Design ${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* History Section */}
            {activeSection === "history" && (
              <div 
                className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <div className="flex items-center mb-6">
                  <History className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold">Analysis History</h2>
                </div>
                
                <div className="mb-6">
                  <Input placeholder="Search analyses..." className="max-w-md" />
                </div>
                
                <div className="space-y-4">
                  {/* Recent Analysis Item */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          <img 
                            src={`https://source.unsplash.com/random/100x100?clothing&${i}`} 
                            alt="Clothing item" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Analysis #{i}</h3>
                            <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full">{["Casual", "Formal", "Sporty"][i-1]} Style</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Analyzed on {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/results')}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Load More
                  </Button>
                </div>
              </div>
            )}
            
            {/* Analytics Section */}
            {activeSection === "analytics" && (
              <div 
                className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <div className="flex items-center mb-6">
                  <BarChart2 className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold">Style Analytics</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-sm text-gray-500 mb-1">Most Detected Style</h3>
                    <div className="flex items-center">
                      <Shirt className="h-5 w-5 text-primary mr-2" />
                      <span className="text-xl font-bold">Casual</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Based on 12 analyses</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-sm text-gray-500 mb-1">Total Analyses</h3>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-primary mr-2" />
                      <span className="text-xl font-bold">7</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-sm text-gray-500 mb-1">Top Color</h3>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-500 mr-2" />
                      <span className="text-xl font-bold">Blue</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">In 5 garments</p>
                  </div>
                </div>
                
                <h3 className="font-medium text-lg mb-4">Style Distribution</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Casual</span>
                        <span className="text-sm text-gray-500">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Formal</span>
                        <span className="text-sm text-gray-500">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Sporty</span>
                        <span className="text-sm text-gray-500">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button>
                    Generate Full Report
                  </Button>
                </div>
              </div>
            )}
            
            {/* Settings Section */}
            {activeSection === "settings" && (
              <div 
                className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <div className="flex items-center mb-6">
                  <Settings className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold">Settings</h2>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                            <p className="text-sm text-gray-500">Receive email updates about your analyses</p>
                          </div>
                          <Switch id="email-notifications" defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                            <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                          </div>
                          <Switch id="dark-mode" />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="data-sharing" className="font-medium">Data Sharing</Label>
                            <p className="text-sm text-gray-500">Allow anonymous data collection to improve our services</p>
                          </div>
                          <Switch id="data-sharing" defaultChecked />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="public-profile" className="font-medium">Public Profile</Label>
                            <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                          </div>
                          <Switch id="public-profile" />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="save-history" className="font-medium">Save Analysis History</Label>
                            <p className="text-sm text-gray-500">Store your past analyses for future reference</p>
                          </div>
                          <Switch id="save-history" defaultChecked />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div 
                className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold">Your Profile</h2>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="w-full md:w-1/3">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-medium">Jane Doe</h3>
                      <p className="text-sm text-gray-500 mb-4">jane.doe@example.com</p>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" defaultValue="Jane Doe" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="jane.doe@example.com" className="mt-1" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        id="bio" 
                        className="w-full min-h-[100px] p-2 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        defaultValue="Fashion enthusiast with a passion for sustainable clothing and unique styles."
                      />
                    </div>
                    
                    <div>
                      <Label>Style Preferences</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge className="cursor-pointer bg-primary">Casual</Badge>
                        <Badge className="cursor-pointer" variant="outline">Formal</Badge>
                        <Badge className="cursor-pointer" variant="outline">Sporty</Badge>
                        <Badge className="cursor-pointer" variant="outline">Elegant</Badge>
                        <Badge className="cursor-pointer bg-primary">Vintage</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Profile</Button>
                </div>
              </div>
            )}
            
            <div className={`text-center mt-8 mb-12 transition-all duration-700 ease-out delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="inline-flex items-center bg-primary/10 px-4 py-2 rounded-full">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">
                  {activeSection === "upload" && "Upload your clothing items to receive personalized fashion recommendations!"}
                  {activeSection === "designer" && "Create custom clothing designs with logos, text, and patterns using our 3D tool!"}
                  {activeSection === "history" && "View your past analyses to track your style evolution."}
                  {activeSection === "analytics" && "Gain insights into your personal style preferences and trends."}
                  {activeSection === "settings" && "Customize your account settings to personalize your experience."}
                  {activeSection === "profile" && "Keep your profile up to date with your latest style preferences."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full border-t py-6 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025 Fashion Recommendation System. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
