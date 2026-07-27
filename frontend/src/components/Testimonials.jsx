import React from "react";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai, India",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    review: "Reservo made our honeymoon unforgettable. The booking process was seamless, and the resort was even more beautiful than the pictures."
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Ahmedabad, India",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    review: "The luxury stay, exceptional hospitality, and smooth booking experience exceeded all our expectations. Highly recommended!"
  },
  {
    id: 3,
    name: "Aman Verma",
    location: "Delhi, India",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    review: "One of the finest resort booking platforms. Premium resorts, transparent pricing, and outstanding customer support."
  }
];

function Testimonials() {
  return (
    <section className="py-20 bg-bg-white transition-colors duration-300" id="testimonials">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">Guest Reviews</span>
        <h2 className="text-[28px] sm:text-[32px] md:text-[38px] xl:text-[46px] font-bold text-center text-primary mb-4.5">What Our Guests Say</h2>
        <p className="max-w-[720px] mx-auto mb-15 text-center text-text-gray text-base md:text-lg leading-relaxed">
          Thousands of travelers trust Reservo for unforgettable luxury vacations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.25 mt-12.5">
          {TESTIMONIALS.map((item) => (
            <div className="bg-bg-white rounded-2xl p-8.75 md:p-6.25 border border-border-color relative flex flex-col shadow-custom transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group" key={item.id}>
              <div className="text-gold mb-5 flex items-center">
                <Quote size={32} fill="rgba(194, 168, 120, 0.1)" color="rgba(194, 168, 120, 0.2)" />
              </div>

              <p className="text-base leading-relaxed text-text-gray mb-6.25 flex-1">{item.review}</p>

              <div className="flex items-center gap-3.75 border-t border-border-color pt-5 mt-auto">
                <img src={item.image} alt={item.name} className="w-12.5 h-12.5 rounded-full object-cover border-2 border-border-color transition-all duration-300 group-hover:border-gold group-hover:scale-105" />
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-text-dark m-0 mb-0.5">{item.name}</h3>
                  <span className="text-xs text-text-gray">{item.location}</span>
                </div>
                <div className="flex gap-0.75 ml-auto self-center">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#C2A878" color="#C2A878" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;