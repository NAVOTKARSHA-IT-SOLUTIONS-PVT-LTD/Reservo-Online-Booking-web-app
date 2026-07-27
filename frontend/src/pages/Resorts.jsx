import React, { useState } from "react";
import { Search, SlidersHorizontal, Star, Heart, MapPin } from "lucide-react";
import "./Resorts.css";
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
    
    // Set the book confirmed mascot image inside loader if exists
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

  // Filters logic
  const filteredResorts = ALL_RESORTS.filter(resort => {
    const matchesSearch = resort.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resort.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoc = selectedLocation === "All" || resort.location.includes(selectedLocation);
    const matchesPrice = resort.price <= maxPrice;
    return matchesSearch && matchesLoc && matchesPrice;
  });

  return (
    <div className="resorts-page fade-up">
      {/* Header Banner */}
      <section className="resorts-hero">
        <div className="resorts-hero-overlay"></div>
        <div className="container resorts-hero-content">
          <span className="resorts-tag">Curated Collections</span>
          <h1>Luxury Resorts & Boutique Hotels</h1>
          <p>Handpicked five-star retreats with verified Rivo scores & certified credentials.</p>
        </div>
      </section>

      {/* Main Filter and Grid section */}
      <section className="resorts-list-section">
        <div className="container">
          <div className="resorts-filter-wrapper">
            {/* Search inputs */}
            <div className="search-bar-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search by resort name or country..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="filter-controls-row">
              <div className="filter-pills-scroll">
                {["All", "Bali", "Santorini", "Maldives", "India"].map((loc) => (
                  <button 
                    key={loc}
                    className={`filter-pill-btn ${selectedLocation === loc ? "active" : ""}`}
                    onClick={() => setSelectedLocation(loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              {/* Price slider controls */}
              <div className="price-slider-box">
                <SlidersHorizontal size={16} />
                <span>Max Price: <strong>${maxPrice}</strong></span>
                <input 
                  type="range" 
                  min="150" 
                  max="350" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Stays Grid */}
          <div className="resorts-grid">
            {filteredResorts.length > 0 ? (
              filteredResorts.map((resort) => {
                const isLiked = wishlist.some(item => item.id === resort.id);
                return (
                  <div key={resort.id} className="resort-page-card">
                    <div className="resort-img-container">
                      <img src={resort.image} alt={resort.name} />
                      <span className="resort-tag-badge">{resort.tag}</span>
                      <button 
                        className={`resort-like-btn ${isLiked ? "active" : ""}`}
                        onClick={() => toggleWishlist(resort)}
                      >
                        <Heart size={16} fill={isLiked ? "#EF4444" : "none"} />
                      </button>
                    </div>

                    <div className="resort-body-details">
                      <div className="resort-header-details">
                        <span className="resort-loc-pin">
                          <MapPin size={12} /> {resort.location}
                        </span>
                        <span className="resort-rating-badge">
                          <Star size={12} fill="#C2A878" color="#C2A878" /> {resort.rating}
                        </span>
                      </div>

                      <h3>{resort.name}</h3>

                      <div className="resort-amenity-tags">
                        {resort.amenities.map((am, i) => (
                          <span key={i} className="amenity-tag">{am}</span>
                        ))}
                      </div>

                      <div className="resort-footer-row">
                        <div className="resort-price-tag">
                          <span className="price-value">${resort.price}</span>
                          <span className="price-lbl">/ night</span>
                        </div>
                        <button 
                          className="book-now-btn"
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
              <div className="no-resorts-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "60px 20px" }}>
                <div style={{ position: "relative", width: "140px", height: "140px", marginBottom: "20px" }}>
                  <img 
                    src={rivoSearching} 
                    alt="Rivo searching resorts" 
                    style={{ width: "100%", height: "100%", borderRadius: "50%", border: "3px solid var(--border-color)", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, right: "5px", width: "36px", height: "36px",
                    background: "var(--gold)", color: "white", borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800",
                    border: "3px solid var(--bg-white)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}>?</div>
                </div>
                <h3>No Luxury Resorts Found</h3>
                <p style={{ fontSize: "14.5px", color: "var(--text-gray)", maxWidth: "400px", margin: "8px auto 0 auto", textAlign: "center", lineHeight: "1.6" }}>
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
