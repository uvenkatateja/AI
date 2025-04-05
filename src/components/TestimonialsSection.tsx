
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Emma Wilson",
      role: "Fashion Enthusiast",
      content: "StyleAI has completely transformed my wardrobe. The recommendations are spot-on and have helped me develop a more cohesive personal style.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Busy Professional",
      content: "As someone who doesn't have time to shop, StyleAI helps me make smarter clothing choices. I love how it suggests pieces that work with what I already own.",
      rating: 5,
    },
    {
      name: "Sophia Rodriguez",
      role: "Style Blogger",
      content: "The AI analysis is impressively accurate. It identified my style preferences better than I could articulate them myself. Highly recommend!",
      rating: 4,
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their style journey with StyleAI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-fashion-blush" />
                ))}
                {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
