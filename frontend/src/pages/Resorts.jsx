import React, { useState } from "react";
import { Search, SlidersHorizontal, Star, Heart, MapPin } from "lucide-react";
import rivoSearching from "../assets/images/rivo_searching.png";

const ALL_RESORTS = [
  {
    id: 1,
    name: "Azure Bay Resort",
    location: "Bali, Indonesia",
    price: 245,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    amenities: ["Pool", "Spa", "Ocean View"],
    tag: "AI Choice",
  },
  {
    id: 2,
    name: "Himalaya Escape",
    location: "Manali, India",
    price: 189,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    amenities: ["Spa", "Fireplace", "Mountain View"],
    tag: "Cozy Retreat",
  },
  {
    id: 3,
    name: "Cove Santorini",
    location: "Santorini, Greece",
    price: 312,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    amenities: ["Pool", "Ocean View", "Private Chef"],
    tag: "Top Rated",
  },
  {
    id: 4,
    name: "Lagoon Paradise",
    location: "Maldives",
    price: 278,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80",
    amenities: ["Pool", "Ocean View", "Spa"],
    tag: "Trending",
  },
  {
    id: 5,
    name: "Rainforest Retreat",
    location: "Coorg, India",
    price: 195,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    amenities: ["Spa", "Forest View", "Guided Walks"],
    tag: "Nature Escape",
  },
  {
    id: 6,
    name: "Backwater Bliss",
    location: "Kerala, India",
    price: 210,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
    amenities: ["Spa", "Pool", "Canal View"],
    tag: "Serene Water",
  }
];

function Resorts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [maxPrice, setMaxPrice] = useState(350);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("reservo-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (resort) => {
    let updated;
    if (wishlist.some(item => item.id === resort.id)) {
      updated = wishlist.filter(item => item.id !== resort.id);
      showGlobalToast(`Removed ${resort.name} from Wishlist`);
    } else {
      updated = [...wishlist, resort];
      showGlobalToast(`Added ${resort.name} to Wishlist!`);
    }
    setWishlist(updated);
    localStorage.setItem("reservo-wishlist", JSON.stringify(updated));
  };

  const showGlobalToast = (msg) => {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    if (toast && toastMessage) {
      toastMessage.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3500);
    }
  };

  const triggerQuickBook = (name) => {
    const modal = document.getElementById("booking-modal");
    const closeBtn = document.getElementById("close-modal-btn");
    if (!modal) return;

    modal.querySelector(".modal-title").textContent = "Securing Luxury Suite";
    modal.querySelector(".modal-desc").innerHTML = `Initializing Stripe premium gateway checkout for <strong>${name}</strong>. Hold tight while we secure your rates...`;
    
    const loaderImg = modal.querySelector(".ai-loader img");
    if (loaderImg) {
      loaderImg.src = "/src/assets/images/rivo_confirmed.png";
    }

    modal.querySelector(".ai-loader").style.display = "flex";
    if (closeBtn) closeBtn.style.display = "none";
    modal.style.display = "flex";

    setTimeout(() => {
      modal.querySelector(".modal-title").textContent = "Suite Secured Successfully!";
      modal.querySelector(".modal-desc").innerHTML = `Your luxury suite at <strong>${name}</strong> is reserved successfully. Confirmation email and digital keys have been delivered.`;
      modal.querySelector(".ai-loader").style.display = "none";
      if (closeBtn) closeBtn.style.display = "inline-flex";
      showGlobalToast(`Successfully booked ${name}!`);
    }, 2500);
  };

  const filteredResorts = ALL_RESORTS.filter(resort => {
    const matchesSearch = resort.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resort.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoc = selectedLocation === "All" || resort.location.includes(selectedLocation);
    const matchesPrice = resort.price <= maxPrice;
    return matchesSearch && matchesLoc && matchesPrice;
  });

  return (
    <div className="pt-20 bg-bg-light min-h-screen fade-up">
      {/* Header Banner */}
      <section className="relative h-[380px] bg-[url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center flex items-center text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#121e1b]/40 to-[#121e1b]/80 z-10"></div>
        <div className="relative z-20 w-[90%] max-w-[1300px] mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gold mb-3 block">Curated Collections</span>
          <h1 className="text-[38px] md:text-5xl font-bold mb-3.75 text-white">Luxury Resorts & Boutique Hotels</h1>
          <p className="text-base max-w-[600px] mx-auto opacity-90 leading-relaxed">Handpicked five-star retreats with verified Rivo scores & certified credentials.</p>
        </div>
      </section>

      {/* Main Filter and Grid section */}
      <section className="py-12.5 pb-25">
        <div className="w-[90%] max-w-[1300px] mx-auto">
          <div className="bg-bg-white border border-border-color p-6 rounded-2xl shadow-custom mb-12.5 flex flex-col gap-5">
            {/* Search inputs */}
            <div className="flex items-center gap-3 bg-bg-light border border-border-color rounded-xl px-5 py-3">
              <Search size={18} className="text-text-gray" />
              <input 
                type="text" 
                placeholder="Search by resort name or country..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent w-full outline-none text-sm text-text-dark"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex justify-between items-center flex-wrap gap-5 flex-col sm:flex-row">
              <div className="flex gap-2.5 overflow-x-auto">
                {["All", "Bali", "Santorini", "Maldives", "India"].map((loc) => {
                  const isActive = selectedLocation === loc;
                  return (
                    <button 
                      key={loc}
                      className={`bg-bg-light border border-border-color text-text-gray px-4.5 py-2 rounded-full text-[13.5px] font-semibold cursor-pointer transition-all duration-300 hover:bg-text-dark hover:text-bg-white hover:border-text-dark ${
                        isActive ? "bg-text-dark! text-bg-white! border-text-dark!" : ""
                      }`}
                      onClick={() => setSelectedLocation(loc)}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>

              {/* Price slider controls */}
              <div className="flex items-center gap-3 text-text-dark text-sm font-medium w-full sm:w-auto justify-between sm:justify-start">
                <SlidersHorizontal size={16} />
                <span>Max Price: <strong>${maxPrice}</strong></span>
                <input 
                  type="range" 
                  min="150" 
                  max="350" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-gold cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Stays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5">
            {filteredResorts.length > 0 ? (
              filteredResorts.map((resort) => {
                const isLiked = wishlist.some(item => item.id === resort.id);
                return (
                  <div key={resort.id} className="bg-bg-white border border-border-color rounded-2xl overflow-hidden shadow-custom transition-all duration-400 ease-out flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
                    <div className="relative h-55 overflow-hidden">
                      <img src={resort.image} alt={resort.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" />
                      <span className="absolute bottom-3 left-3 bg-gold text-white px-2.5 py-1 rounded-xl text-[11px] font-bold">{resort.tag}</span>
                      <button 
                        className={`absolute top-3 right-3 w-8.5 h-8.5 rounded-full bg-white/85 backdrop-blur-[4px] border-none flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:scale-110 ${
                          isLiked ? "text-red-500" : "text-[#121e1b]"
                        }`}
                        onClick={() => toggleWishlist(resort)}
                      >
                        <Heart size={16} fill={isLiked ? "#EF4444" : "none"} stroke={isLiked ? "#EF4444" : "currentColor"} />
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between text-xs text-text-gray mb-2.5">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin size={12} className="text-gold" /> {resort.location}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-text-dark">
                          <Star size={12} fill="#C2A878" color="#C2A878" /> {resort.rating}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-text-dark mb-3">{resort.name}</h3>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {resort.amenities.map((am, i) => (
                          <span key={i} className="text-[11.5px] bg-bg-light text-text-gray px-2.5 py-1 rounded-xl border border-border-color">{am}</span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t border-border-color pt-3.75 mt-auto">
                        <div className="flex items-center">
                          <span className="text-xl font-bold text-text-dark">${resort.price}</span>
                          <span className="text-[11px] text-text-gray ml-0.5">/ night</span>
                        </div>
                        <button 
                          className="bg-primary text-bg-white border-none px-5 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-px"
                          onClick={() => triggerQuickBook(resort.name)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-15 px-5 flex flex-col items-center text-text-gray">
                <div className="relative w-140 h-140 mb-5 w-[140px] h-[140px]">
                  <img 
                    src={rivoSearching} 
                    alt="Rivo searching resorts" 
                    className="w-full h-full rounded-full border-3 border-border-color object-cover"
                  />
                  <div className="absolute bottom-0 right-1.25 w-9 h-9 bg-gold text-white rounded-full flex items-center justify-center text-lg font-extrabold border-3 border-bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">?</div>
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-2">No Luxury Resorts Found</h3>
                <p className="text-[14.5px] text-text-gray max-w-[400px] mx-auto text-center leading-relaxed">
                  Try clearing your search query or selecting a different location filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Resorts;
