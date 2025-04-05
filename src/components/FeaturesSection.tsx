import { Check, ShieldCheck, Clock, Sparkles } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-fashion-ivory">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Fashion <span className="text-pink-500">Features</span>
          </h2>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-fashion-blush/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-fashion-blush" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Smart Analysis</h3>
            <p className="text-gray-600">
              Advanced algorithms analyze your clothing items to identify your unique fashion preferences.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-fashion-sage/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Check className="w-6 h-6 text-fashion-sage" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Custom Recommendations</h3>
            <p className="text-gray-600">
              Get personalized suggestions that complement your existing wardrobe and enhance your style.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-fashion-blush/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <ShieldCheck className="w-6 h-6 text-fashion-blush" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Secure Processing</h3>
            <p className="text-gray-600">
              Your data and images are processed securely with strong privacy protections.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-fashion-sage/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Clock className="w-6 h-6 text-fashion-sage" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Quick Results</h3>
            <p className="text-gray-600">
              Receive fashion analysis and recommendations instantly after uploading your images.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
