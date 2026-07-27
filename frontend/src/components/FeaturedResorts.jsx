import React, { useState } from "react";
import { Heart, Star, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

// Import local images from Aditya's assets
import manaliImg from "../assets/images/manali.jpg";
import goaImg from "../assets/images/goa.jpg";
import keralaImg from "../assets/images/kerala.jpg";
import udaipurImg from "../assets/images/udaipur.jpg";
import shimlaImg from "../assets/images/shimla.jpg";
import coorgImg from "../assets/images/coorg.jpg";
import andamanImg from "../assets/images/andaman.jpg";
import jaipurImg from "../assets/images/jaipur.jpg";

const RESORTS = [
  {
    id: 1,
    name: "Mountain Paradise Resort",
    location: "Manali, Himachal Pradesh",
    price: 6500,
    rating: "4.8 (89 reviews)",
    badge: "Best Seller",
    image: manaliImg,
    amenities: ["🔥 Fireplace", "🧖 Spa", "📶 WiFi"],
    isAIRecommended: false
  },
  {
    id: 2,
    name: "Ocean Breeze Resort",
    location: "Goa, India",
    price: 8200,
    rating: "4.9 (142 reviews)",
    badge: "Luxury",
    image: goaImg,
    amenities: ["🏖️ Beachfront", "🍽️ Restaurant", "🍸 Bar"],
    isAIRecommended: true
  },
  {
    id: 3,
    name: "Green Valley Resort",
    location: "Kerala, India",
    price: 5900,
    rating: "4.7 (76 reviews)",
    badge: "Top Rated",
    image: keralaImg,
    amenities: ["🧘 Spa", "🌲 Nature Trails", "🏊 Pool"],
    isAIRecommended: false
  },
  {
    id: 4,
    name: "Royal Lake Palace",
    location: "Udaipur, Rajasthan",
    price: 9500,
    rating: "4.9 (198 reviews)",
    badge: "Premium Heritage",
    image: udaipurImg,
    amenities: ["🌅 Lake View", "⚜️ Luxury Suites", "🏊 Pool"],
    isAIRecommended: true
  },
  {
    id: 5,
    name: "Himalayan Bliss Resort",
    location: "Shimla, India",
    price: 7300,
    rating: "4.8 (94 reviews)",
    badge: "Nature Retreat",
    image: shimlaImg,
    amenities: ["🏔️ Mountain View", "🔥 Fireplace", "💆 Spa"],
    isAIRecommended: false
  },
  {
    id: 6,
    name: "Coorg Nature Retreat",
    location: "Coorg, Karnataka",
    price: 6800,
    rating: "4.8 (65 reviews)",
    badge: "Editor's Pick",
    image: coorgImg,
    amenities: ["☕ Coffee Estate", "🏊 Pool", "🦜 Bird Watching"],
    isAIRecommended: false
  },
  {
    id: 7,
    name: "Sunrise Beach Resort",
    location: "Andaman Islands, India",
    price: 10200,
    rating: "4.9 (120 reviews)",
    badge: "Beachfront VIP",
    image: andamanImg,
    amenities: ["🏝️ Private Beach", "🤿 Scuba Diving", "💆 Spa"],
    isAIRecommended: true
  },
  {
    id: 8,
    name: "The Royal Heritage Resort",
    location: "Jaipur, Rajasthan",
    price: 8900,
    rating: "4.7 (104 reviews)",
    badge: "Heritage Palace",
    image: jaipurImg,
    amenities: ["🏰 Palace Tour", "🍽️ Fine Dining", "🏊 Pool"],
    isAIRecommended: false
  },
];

function FeaturedResorts() {
  const [wishlist, setWishlist] = useState({});
  const [sliderIndex, setSliderIndex] = useState(0);

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleQuickBook = (name) => {
    const modal = document.getElementById("booking-modal");
    if (modal) {
      modal.setAttribute("aria-hidden", "false");
      modal.style.display = "flex";
      
      const btn = document.getElementById("close-modal-btn");
      if (btn) btn.style.display = "none";
      
      const titleEl = modal.querySelector(".modal-title");
      const descEl = modal.querySelector(".modal-desc");
      if (titleEl) titleEl.innerText = "Checking Availability...";
      if (descEl) descEl.innerText = `Rivo is search-matching live luxury inventories for ${name}...`;

      setTimeout(() => {
        if (titleEl) titleEl.innerText = "Resort Available!";
        if (descEl) descEl.innerText = `Great choice! We have secured special rates for ${name}. Complete your check-out process.`;
        if (btn) btn.style.display = "block";
      }, 3000);
    }
  };

  const handleNext = () => {
    if (sliderIndex < RESORTS.length - 3) {
      setSliderIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (sliderIndex > 0) {
      setSliderIndex(prev => prev - 1);
    }
  };

  return (
    <section className="py-20 bg-bg-white transition-colors duration-300 overflow-hidden" id="resorts">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        
        {/* Title Header Row with Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12.5">
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-gold mb-3">Featured Stays</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4.5">Luxury Resorts Handpicked for You</h2>
            <p className="text-text-gray text-base md:text-lg leading-relaxed max-w-[720px]">
              Every location features premium amenities, breathtaking architecture, and stellar local service.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              className={`w-11 h-11 rounded-full border border-border-color bg-bg-white text-text-dark flex items-center justify-center transition-all duration-300 hover:border-gold hover:text-gold hover:scale-105 disabled:opacity-40 disabled:pointer-events-none`}
              onClick={handlePrev}
              disabled={sliderIndex === 0}
              aria-label="Previous stays"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className={`w-11 h-11 rounded-full border border-border-color bg-bg-white text-text-dark flex items-center justify-center transition-all duration-300 hover:border-gold hover:text-gold hover:scale-105 disabled:opacity-40 disabled:pointer-events-none`}
              onClick={handleNext}
              disabled={sliderIndex >= RESORTS.length - 3}
              aria-label="Next stays"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="w-full">
          <div 
            className="flex gap-[30px] transition-transform duration-500 ease-out w-full overflow-x-auto md:overflow-visible scrollbar-none [transform:none] md:[transform:var(--carousel-transform)]"
            style={{
              "--carousel-transform": `translateX(-${sliderIndex * (100 / 3)}%)`
            }}
          >
            {RESORTS.map((resort) => (
              <article className="flex-[0_0_85%] md:flex-[0_0_calc((100%-30px)/2)] lg:flex-[0_0_calc((100%-60px)/3)] bg-bg-white border border-border-color rounded-2xl overflow-hidden shadow-custom transition-all duration-400 ease-out flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group" key={resort.id}>
                <div className="relative h-60 overflow-hidden bg-border-color">
                  <img src={resort.image} alt={resort.name} className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-105" />
                  
                  {resort.isAIRecommended && (
                    <span className="absolute bottom-3.75 left-3.75 px-3 py-1.5 rounded-full text-xs font-bold z-10 shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center gap-1 bg-gradient-to-br from-[#121e1b] to-[#2f483c] text-white border border-white/10">
                      <Sparkles size={12} /> AI Recommended
                    </span>
                  )}
                  {!resort.isAIRecommended && resort.badge && (
                    <span className="absolute bottom-3.75 left-3.75 px-3 py-1.5 rounded-full text-xs font-bold z-10 shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center gap-1 bg-gold text-white">
                      {resort.badge}
                    </span>
                  )}

                  <button 
                    className={`absolute top-3.75 right-3.75 bg-white/85 backdrop-blur-[8px] border-none w-9 h-9 rounded-full flex items-center justify-center text-[#121e1b] cursor-pointer transition-all duration-300 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-110 ${
                      wishlist[resort.id] ? "text-red-500" : ""
                    }`}
                    aria-label="Add to Wishlist"
                    onClick={(e) => toggleWishlist(resort.id, e)}
                  >
                    <Heart size={16} fill={wishlist[resort.id] ? "#EF4444" : "none"} stroke={wishlist[resort.id] ? "#EF4444" : "currentColor"} />
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-3 text-[13px] text-text-gray">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin size={12} className="text-gold" /> {resort.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-text-dark">
                      <Star size={12} fill="#C2A878" color="#C2A878" /> {resort.rating}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-text-dark mb-3.75 leading-tight">{resort.name}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resort.amenities.map((item, index) => (
                      <span className="text-[12.5px] font-medium bg-bg-light text-text-gray px-3 py-1.5 rounded-full border border-border-color transition-colors duration-200 hover:bg-gold hover:text-white hover:border-gold" key={index}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-auto border-t border-border-color pt-4.5">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-text-dark leading-none">₹{resort.price}</span>
                      <span className="text-xs text-text-gray mt-1">per night</span>
                    </div>
                    <button 
                      className="bg-primary text-bg-white border-none px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(194,168,120,0.2)]" 
                      onClick={() => handleQuickBook(resort.name)}
                    >
                      Quick Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default FeaturedResorts;