import React from "react";
import { Quote, Star, ChevronLeft, ChevronRight, Users, Globe, Award, Shield } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai, India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    review: "Reservo made our honeymoon unforgettable. The booking process was seamless, and the resort was even more beautiful than the pictures."
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Ahmedabad, India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    review: "The luxury stay, exceptional hospitality, and smooth booking experience exceeded all our expectations. Highly recommended!"
  },
  {
    id: 3,
    name: "Aman Verma",
    location: "Delhi, India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    review: "One of the finest resort booking platforms. Premium resorts, transparent pricing, and outstanding customer support."
  }
];

function Testimonials() {
  return (
    <section className="py-16 bg-bg-light relative overflow-hidden transition-colors duration-300" id="testimonials">
      {/* Decorative Dots */}
      <div className="absolute top-12 left-12 w-24 h-24 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:12px_12px] opacity-60"></div>
      <div className="absolute bottom-32 right-12 w-24 h-24 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:12px_12px] opacity-60"></div>
      
      {/* Decorative Palm Silhouette */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none bg-[url('https://cdn-icons-png.flaticon.com/512/3663/3663189.png')] bg-no-repeat bg-right-top bg-contain"></div>

      <div className="w-full max-w-[1280px] mx-auto px-5 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-500"></div>
          <span className="text-[11px] font-bold uppercase tracking-[2px] text-yellow-600">GUEST REVIEWS</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-500"></div>
        </div>

        <h2 className="text-[36px] sm:text-[42px] md:text-[50px] font-extrabold text-text-dark leading-[1.1] text-center mb-4 font-serif transition-colors duration-300">
          What Our <span className="text-primary">Guests</span> Say
        </h2>
        
        <p className="text-text-gray text-[15px] sm:text-[16px] leading-relaxed mb-16 max-w-[560px] text-center transition-colors duration-300">
          Thousands of travelers trust <span className="text-primary font-semibold">Reservo</span> for unforgettable luxury vacations.
        </p>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full">
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className="bg-bg-white rounded-[32px] p-8 shadow-custom border border-border-color flex flex-col transition-colors duration-300">
              
              <div className="flex justify-between items-start mb-6">
                <Quote size={40} className="text-primary fill-current" />
                <div className="flex items-center gap-1.5 bg-bg-light text-primary px-3 py-1.5 rounded-full border border-border-color transition-colors duration-300">
                  <Star size={14} className="fill-current" />
                  <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-text-gray mb-8 flex-1 transition-colors duration-300">
                {item.review}
              </p>
              
              <div className="w-full h-px bg-border-color mb-6 transition-colors duration-300"></div>
 
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3.5">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-[15px] font-extrabold text-text-dark mb-0.5 flex items-center gap-1.5 transition-colors duration-300">
                      {item.name} 
                      <span className="bg-primary text-white rounded-full p-0.5"><Shield size={10} className="fill-current" /></span>
                    </h4>
                    <span className="text-[12px] text-text-gray font-medium transition-colors duration-300">{item.location}</span>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-4 bg-bg-white px-5 py-2.5 rounded-full shadow-sm border border-border-color transition-colors duration-300">
          <button className="text-primary hover:text-primary-dark transition-colors border-none bg-transparent cursor-pointer"><ChevronLeft size={20} /></button>
          <div className="flex items-center gap-2">
            <span className="w-6 h-2 rounded-full bg-primary transition-colors"></span>
            <span className="w-2 h-2 rounded-full bg-border-color transition-colors"></span>
            <span className="w-2 h-2 rounded-full bg-border-color transition-colors"></span>
          </div>
          <button className="text-primary hover:text-primary-dark transition-colors border-none bg-transparent cursor-pointer"><ChevronRight size={20} /></button>
        </div>

      </div>
    </section>
  );
}

export default Testimonials;