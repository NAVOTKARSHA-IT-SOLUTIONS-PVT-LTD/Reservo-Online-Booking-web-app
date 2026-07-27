import React, { useState, useRef } from "react";
import { Heart, Star, MapPin, ChevronLeft, ChevronRight, Waves, Mountain, Trees, Home, Tent, Sparkles, Palmtree, Compass, PawPrint, HeartHandshake } from "lucide-react";

// Import local images from Aditya's assets
import goaImg from "../assets/images/goa.jpg";
import manaliImg from "../assets/images/manali.jpg";
import keralaImg from "../assets/images/kerala.jpg";
import coorgImg from "../assets/images/coorg.jpg";
import andamanImg from "../assets/images/andaman.jpg";
import udaipurImg from "../assets/images/udaipur.jpg";
import rivoSearching from "../assets/images/rivo_searching.png";

const CATEGORIES = [
  { id: "beach", label: "Beach Resorts", icon: <Waves size={16} /> },
  { id: "mountain", label: "Mountain Retreats", icon: <Mountain size={16} /> },
  { id: "forest", label: "Forest Chalets", icon: <Trees size={16} /> },
  { id: "villas", label: "Luxury Villas", icon: <Home size={16} /> },
  { id: "cabins", label: "Rustic Cabins", icon: <Tent size={16} /> },
  { id: "glamping", label: "Glamping Stays", icon: <Sparkles size={16} /> },
  { id: "island", label: "Private Islands", icon: <Palmtree size={16} /> },
  { id: "camping", label: "Eco Camping", icon: <Compass size={16} /> },
  { id: "pet", label: "Pet Friendly", icon: <PawPrint size={16} /> },
  { id: "family", label: "Family Stays", icon: <HeartHandshake size={16} /> }
];

const DESTINATIONS = [
  {
    id: 1,
    name: "Goa Coastline",
    location: "West Coast, India",
    rating: 4.9,
    price: 8000,
    image: goaImg,
    category: "beach"
  },
  {
    id: 2,
    name: "Manali Peaks",
    location: "Himachal Pradesh, India",
    rating: 4.8,
    price: 6500,
    image: manaliImg,
    category: "mountain"
  },
  {
    id: 3,
    name: "Kerala Backwaters",
    location: "South Coast, India",
    rating: 4.9,
    price: 9000,
    image: keralaImg,
    category: "beach"
  },
  {
    id: 4,
    name: "Coorg Coffee Estate",
    location: "Karnataka Hills, India",
    rating: 4.7,
    price: 7500,
    image: coorgImg,
    category: "forest"
  },
  {
    id: 5,
    name: "Andaman Shore",
    location: "Bay of Bengal, India",
    rating: 4.9,
    price: 12000,
    image: andamanImg,
    category: "island"
  },
  {
    id: 6,
    name: "Udaipur Lake Palace",
    location: "Rajasthan, India",
    rating: 4.8,
    price: 11000,
    image: udaipurImg,
    category: "villas"
  },
];

function PopularDestinations() {
  const [activeCategory, setActiveCategory] = useState("beach");
  const [wishlist, setWishlist] = useState({});
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderRef = useRef(null);

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredDestinations = DESTINATIONS.filter(
    (dest) => dest.category === activeCategory || activeCategory === "all"
  );

  const handleNext = () => {
    if (sliderIndex < filteredDestinations.length - 3) {
      setSliderIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (sliderIndex > 0) {
      setSliderIndex(prev => prev - 1);
    }
  };

  return (
    <section className="py-15 bg-bg-light transition-colors duration-300 overflow-hidden" id="explore">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        
        {/* Categories Tab Bar */}
        <div className="mb-10 border-b border-border-color pb-1.25">
          <div className="flex gap-7.5 overflow-x-auto scrollbar-none pb-1.25">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`flex items-center gap-2 bg-transparent border-none py-3 px-1.5 text-sm font-semibold cursor-pointer whitespace-nowrap relative transition-colors duration-300 group ${
                    isActive 
                      ? "text-text-dark after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-0.5 after:bg-text-dark" 
                      : "text-text-gray hover:text-text-dark"
                  }`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSliderIndex(0);
                  }}
                >
                  <span className={`transition-colors duration-300 ${isActive ? "text-gold" : "text-text-gray group-hover:text-gold"}`}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-gold mb-3">Popular Destinations</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4.5">Trending Vacation Stays</h2>
            <p className="text-text-gray text-base md:text-lg leading-relaxed max-w-[580px]">
              Discover gorgeous corners around the world, verified for absolute comfort and luxury.
            </p>
          </div>
          
          {/* Navigation Slider Buttons */}
          {filteredDestinations.length > 3 && (
            <div className="flex gap-3">
              <button 
                className={`w-11 h-11 rounded-full border border-border-color bg-bg-white text-text-dark flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-text-dark hover:text-bg-white hover:border-text-dark hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed`}
                onClick={handlePrev}
                disabled={sliderIndex === 0}
                aria-label="Previous stays"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className={`w-11 h-11 rounded-full border border-border-color bg-bg-white text-text-dark flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-text-dark hover:text-bg-white hover:border-text-dark hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed`}
                onClick={handleNext}
                disabled={sliderIndex >= filteredDestinations.length - 3}
                aria-label="Next stays"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Card Carousel Slider */}
        <div className="w-full">
          <div 
            className="flex gap-[30px] transition-transform duration-500 ease-out w-full overflow-x-auto md:overflow-visible scrollbar-none [transform:none] md:[transform:var(--carousel-transform)]"
            ref={sliderRef}
            style={{
              "--carousel-transform": `translateX(-${sliderIndex * (100 / 3)}%)`
            }}
          >
            {filteredDestinations.map((dest) => (
              <div className="flex-[0_0_85%] md:flex-[0_0_calc((100%-30px)/2)] lg:flex-[0_0_calc((100%-60px)/3)] bg-bg-white border-radius-20 overflow-hidden shadow-custom transition-all duration-400 ease-out border border-border-color hover:-translate-y-1.25 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] group rounded-2xl" key={dest.id}>
                <div className="relative h-[250px] overflow-hidden bg-border-color">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-105" />
                  <button 
                    className={`absolute top-3.75 right-3.75 bg-white/85 backdrop-blur-[8px] border-none w-9 h-9 rounded-full flex items-center justify-center text-[#121e1b] cursor-pointer transition-all duration-300 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-110 ${
                      wishlist[dest.id] ? "text-red-500" : ""
                    }`}
                    aria-label="Bookmark destination"
                    onClick={(e) => toggleWishlist(dest.id, e)}
                  >
                    <Heart size={16} fill={wishlist[dest.id] ? "#EF4444" : "none"} stroke={wishlist[dest.id] ? "#EF4444" : "currentColor"} />
                  </button>
                </div>
                <div className="p-5 md:px-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-text-dark">{dest.name}</h3>
                    <span className="text-sm font-semibold text-text-dark flex items-center gap-1">
                      <Star size={14} fill="#C2A878" color="#C2A878" /> {dest.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[13.5px] text-text-gray">
                    <span className="flex items-center gap-1.25 font-medium">
                      <MapPin size={12} className="text-gold" /> {dest.location}
                    </span>
                    <span className="font-medium">
                      from <span className="text-base font-bold text-text-dark">₹{dest.price}</span>/night
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredDestinations.length === 0 && (
              <div className="no-destinations-fallback" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "40px 20px" }}>
                <div style={{ position: "relative", width: "140px", height: "140px", marginBottom: "20px" }}>
                  <img 
                    src={rivoSearching} 
                    alt="Rivo searching stays" 
                    style={{ width: "100%", height: "100%", borderRadius: "50%", border: "3px solid var(--border-color)", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, right: "5px", width: "36px", height: "36px",
                    background: "#C2A878", color: "white", borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800",
                    border: "3px solid var(--bg-white)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}>?</div>
                </div>
                <p style={{ fontSize: "15px", color: "var(--text-gray)", fontWeight: "500", maxWidth: "400px", margin: "0 auto", textAlign: "center", lineHeight: "1.6" }}>
                  No verified stays available for this category yet. Checking with Rivo...
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export default PopularDestinations;