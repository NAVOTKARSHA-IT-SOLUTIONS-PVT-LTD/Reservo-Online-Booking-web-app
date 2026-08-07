import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Heart, Star, ChevronLeft, ChevronRight, Waves, Mountain, TreePine, Home, Tent, Palmtree, ArrowRight, ShieldCheck, HeadphonesIcon } from "lucide-react";

const goaImage = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=70&fm=webp";
const keralaImage = "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=70&fm=webp";
const coorgImage = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=70&fm=webp";
const manaliImage = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=70&fm=webp";
const jaipurImage = "https://images.unsplash.com/photo-1477587458883-47135fbdb5ee?auto=format&fit=crop&w=800&q=70&fm=webp";
const udaipurImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=70&fm=webp";
const shimlaImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=70&fm=webp";
const andamanImage = "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=70&fm=webp";

const CATEGORIES = [
  { id: "beach", label: "Beach Resorts", icon: <Waves size={16} /> },
  { id: "mountain", label: "Mountain Retreats", icon: <Mountain size={16} /> },
  { id: "forest", label: "Forest Chalets", icon: <TreePine size={16} /> },
  { id: "villas", label: "Luxury Villas", icon: <Home size={16} /> },
  { id: "cabins", label: "Rustic Cabins", icon: <Home size={16} /> },
  { id: "glamping", label: "Glamping Stays", icon: <Tent size={16} /> },
  { id: "islands", label: "Private Islands", icon: <Palmtree size={16} /> },
];

const DESTINATIONS = [
  {
    id: 1,
    name: "Goa Coastline",
    location: "West Coast, India",
    price: 8000,
    rating: 4.9,
    reviews: "Exceptional",
    image: goaImage,
    category: "beach"
  },
  {
    id: 2,
    name: "Kerala Backwaters",
    location: "South Coast, India",
    price: 9000,
    rating: 4.9,
    reviews: "Exceptional",
    image: keralaImage,
    category: "beach"
  },
  {
    id: 11,
    name: "Andaman Beach Cove",
    location: "Andaman Islands, India",
    price: 13500,
    rating: 4.9,
    reviews: "Exceptional",
    image: andamanImage,
    category: "beach"
  },
  {
    id: 3,
    name: "Solang Valley Manali",
    location: "Himachal Pradesh, India",
    price: 6500,
    rating: 4.8,
    reviews: "Excellent",
    image: manaliImage,
    category: "mountain"
  },
  {
    id: 4,
    name: "Coorg Hill Station",
    location: "Karnataka, India",
    price: 7200,
    rating: 4.7,
    reviews: "Excellent",
    image: coorgImage,
    category: "mountain"
  },
  {
    id: 12,
    name: "Shimla Alpine Resort",
    location: "Himachal Pradesh, India",
    price: 8200,
    rating: 4.8,
    reviews: "Exceptional",
    image: shimlaImage,
    category: "mountain"
  },
  {
    id: 5,
    name: "Coorg Forest Chalet",
    location: "Karnataka, India",
    price: 8500,
    rating: 4.8,
    reviews: "Exceptional",
    image: coorgImage,
    category: "forest"
  },
  {
    id: 6,
    name: "Udaipur Lake Palace",
    location: "Rajasthan, India",
    price: 15000,
    rating: 4.9,
    reviews: "Exceptional",
    image: udaipurImage,
    category: "villas"
  },
  {
    id: 7,
    name: "Jaipur Haveli",
    location: "Rajasthan, India",
    price: 12000,
    rating: 4.8,
    reviews: "Excellent",
    image: jaipurImage,
    category: "villas"
  },
  {
    id: 13,
    name: "Goa Heritage Villa",
    location: "Goa, India",
    price: 11000,
    rating: 4.7,
    reviews: "Excellent",
    image: goaImage,
    category: "villas"
  },
  {
    id: 8,
    name: "Shimla Log Cabin",
    location: "Himachal Pradesh, India",
    price: 5800,
    rating: 4.6,
    reviews: "Good",
    image: shimlaImage,
    category: "cabins"
  },
  {
    id: 9,
    name: "Manali Glamping Tents",
    location: "Himachal Pradesh, India",
    price: 7500,
    rating: 4.9,
    reviews: "Exceptional",
    image: manaliImage,
    category: "glamping"
  },
  {
    id: 10,
    name: "Andaman Private Shore",
    location: "Andaman Islands, India",
    price: 18000,
    rating: 5.0,
    reviews: "Exceptional",
    image: andamanImage,
    category: "islands"
  }
];

import { useTranslation } from "../hooks/useTranslation";

function PopularDestinations({ wishlist = [], toggleWishlist, currencySymbol = "₹", exchangeRate = 1 }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState("beach");

  const filteredDestinations = DESTINATIONS.filter(
    (dest) => dest.category === activeCat
  );

  return (
    <section className="py-12 bg-bg-light transition-colors duration-300" id="explore">
      <div className="w-full max-w-[1280px] mx-auto px-5">
        
        {/* Categories Tab Bar */}
        <div className="flex overflow-x-auto hide-scrollbar gap-6 mb-5 bg-bg-white rounded-2xl px-5 py-3 shadow-[0_5px_15px_rgba(0,0,0,0.02)] border border-border-color transition-colors duration-300">
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex flex-col items-center gap-1.5 min-w-max pb-1 relative transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-text-gray hover:text-primary"
                } bg-transparent border-none cursor-pointer focus:outline-none`}
              >
                <span>{cat.icon}</span>
                <span className="text-[12px] font-bold">{cat.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Section Header Area */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-5">
          
          {/* Left Title Area */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-primary">POPULAR DESTINATIONS</span>
              <div className="w-8 h-0.5 bg-primary"></div>
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-text-dark mb-1.5 font-serif transition-colors duration-300">
              {t("popular_destinations")}
            </h2>
            <p className="text-text-gray text-[13.5px] leading-relaxed max-w-[420px] transition-colors duration-300">
              {t("discover_stays")}
            </p>
          </div>

          {/* Right Trust Badges & Controls */}
          <div className="flex flex-col items-start lg:items-end gap-3.5 w-full lg:w-auto">
            <div className="flex flex-wrap gap-3 bg-bg-white rounded-[20px] p-2 shadow-[0_5px_15px_rgba(0,0,0,0.02)] border border-border-color transition-colors duration-300 w-full lg:w-auto">
              
              <div className="flex items-center gap-2 px-2 py-1 border-r border-border-color flex-1 lg:flex-initial">
                <div className="w-8 h-8 rounded-full bg-bg-light flex items-center justify-center text-primary transition-colors duration-300">
                  <ShieldCheck size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-text-dark transition-colors duration-300">Verified Stays</span>
                  <span className="text-[10px] text-text-gray transition-colors duration-300">Quality checked</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 py-1 border-r border-border-color flex-1 lg:flex-initial">
                <div className="w-8 h-8 rounded-full bg-bg-light flex items-center justify-center text-primary transition-colors duration-300">
                  <Star size={16} className="fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-text-dark transition-colors duration-300">Best Price</span>
                  <span className="text-[10px] text-text-gray transition-colors duration-300">Value guaranteed</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 py-1 flex-1 lg:flex-initial">
                <div className="w-8 h-8 rounded-full bg-bg-light flex items-center justify-center text-primary transition-colors duration-300">
                  <HeadphonesIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-text-dark transition-colors duration-300">24/7 Support</span>
                  <span className="text-[10px] text-text-gray transition-colors duration-300">Here anytime</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-3">
              <button className="flex items-center gap-1.5 text-primary font-bold text-[13px] hover:text-primary-dark bg-transparent border-none cursor-pointer transition-colors px-2">
                View All Stays <ArrowRight size={14} />
              </button>
              <div className="flex gap-1.5">
                <button className="w-8.5 h-8.5 rounded-full bg-bg-white border border-border-color flex items-center justify-center text-text-gray hover:text-primary hover:border-primary transition-all cursor-pointer">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8.5 h-8.5 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-all cursor-pointer shadow-[0_5px_15px_rgba(47,128,237,0.2)]">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
          {filteredDestinations.map((dest) => {
            const isLiked = wishlist.includes(dest.id);
            return (
              <div 
                key={dest.id} 
                onClick={() => navigate(`/resort/${dest.id}`)}
                className="bg-bg-white rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-border-color transition-colors duration-300 group cursor-pointer max-w-[380px] w-full mx-auto"
              >
                
                {/* Image Area */}
                <div className="relative h-[210px] overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* Top Left Rating Badge */}
                  <div className="absolute top-4 left-4 bg-primary/95 backdrop-blur-sm text-white p-1.5 rounded-lg shadow-md border border-white/10 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-0.5 text-[12px] font-bold text-yellow-400">
                      <Star size={10} className="fill-current" /> {dest.rating}
                    </div>
                  </div>

                  {/* Top Right Heart */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(dest.id);
                    }}
                    className="absolute top-4 right-4 w-8.5 h-8.5 rounded-full bg-bg-white text-text-gray flex items-center justify-center shadow-md hover:text-red-500 transition-all border-none cursor-pointer focus:outline-none"
                  >
                    <Heart 
                      size={16} 
                      className={`transition-colors duration-300 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-text-gray"
                      }`} 
                    />
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-4.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[16px] font-extrabold text-text-dark mb-1 font-serif transition-colors duration-300">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-text-gray font-medium text-[12.5px] transition-colors duration-300">
                        <MapPin size={14} /> {dest.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-text-gray/80 text-[11px] font-medium block">{t("from")}</span>
                      <div className="text-[16px] font-extrabold text-text-dark transition-colors duration-300">
                        {currencySymbol}{(Math.round(dest.price * exchangeRate)).toLocaleString()}<span className="text-[12px] text-text-gray font-medium"> / {t("per_night")}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default PopularDestinations;