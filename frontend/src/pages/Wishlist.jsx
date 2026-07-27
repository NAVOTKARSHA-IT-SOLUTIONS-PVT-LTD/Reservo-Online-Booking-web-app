import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Calendar, MapPin } from "lucide-react";
import "./Wishlist.css";
import rivoSearching from "../assets/images/rivo_searching.png";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("reservo-wishlist");
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const removeWish = (id, name) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("reservo-wishlist", JSON.stringify(updated));
    showGlobalToast(`Removed ${name} from Wishlist`);
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

  const bookStay = (name) => {
    const modal = document.getElementById("booking-modal");
    const closeBtn = document.getElementById("close-modal-btn");
    if (!modal) return;

    modal.querySelector(".modal-title").textContent = "Reserving Saved Suite";
    modal.querySelector(".modal-desc").innerHTML = `Booking request for <strong>${name}</strong> is processing...`;
    
    const loaderImg = modal.querySelector(".ai-loader img");
    if (loaderImg) {
      loaderImg.src = "/src/assets/images/rivo_confirmed.png";
    }

    modal.querySelector(".ai-loader").style.display = "flex";
    if (closeBtn) closeBtn.style.display = "none";
    modal.style.display = "flex";

    setTimeout(() => {
      modal.querySelector(".modal-title").textContent = "Booking Room Secured!";
      modal.querySelector(".modal-desc").innerHTML = `Your saved suite at <strong>${name}</strong> is booked successfully. Confirmation keys have been delivered.`;
      modal.querySelector(".ai-loader").style.display = "none";
      if (closeBtn) closeBtn.style.display = "inline-flex";
      showGlobalToast(`Successfully booked ${name}!`);
    }, 2500);
  };

  return (
    <div className="wishlist-page fade-up">
      <div className="container wishlist-container">
        <header className="wishlist-header">
          <h1>Saved Stays & Wishlist</h1>
          <p>Your curated selections of verified luxury retreats around the world.</p>
        </header>

        {wishlist.length > 0 ? (
          <div className="wishlist-grid">
            {wishlist.map(resort => (
              <div key={resort.id} className="wish-card">
                <div className="wish-img-box">
                  <img src={resort.image} alt={resort.name} />
                  <button 
                    className="wish-delete-btn"
                    onClick={() => removeWish(resort.id, resort.name)}
                    aria-label="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="wish-body">
                  <span className="wish-loc"><MapPin size={12} /> {resort.location}</span>
                  <h3>{resort.name}</h3>

                  <div className="wish-footer">
                    <div className="wish-price">
                      <strong>${resort.price}</strong>
                      <span>/ night</span>
                    </div>

                    <button 
                      className="wish-book-btn"
                      onClick={() => bookStay(resort.name)}
                    >
                      Book Now <Calendar size={13} style={{ marginLeft: 6 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="wishlist-empty-state">
            <div className="wishlist-empty-illustration-wrapper">
              <img 
                src={rivoSearching} 
                alt="Rivo searching empty wishlist" 
                className="wishlist-empty-mascot-img"
              />
              <div className="wishlist-empty-badge">?</div>
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>Rivo couldn't find any saved resorts here. Explore our verified listings and click the heart icon to save them!</p>
            <Link to="/resorts" className="explore-resorts-action-btn">
              Explore Luxury Resorts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
