import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Calendar, MapPin } from "lucide-react";
import rivoSearching from "../assets/images/rivo_searching.png";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();

  const removeWish = (id, name) => {
    toggleWishlist({ id });
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
    <div className="py-[120px] pb-[100px] bg-bg-light min-h-screen fade-in">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        <header className="text-center mb-[50px]">
          <h1 className="text-[32px] sm:text-[40px] font-bold text-text-dark mb-3">Saved Stays & Wishlist</h1>
          <p className="text-[15px] text-text-gray max-w-[600px] mx-auto">Your curated selections of verified luxury retreats around the world.</p>
        </header>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {wishlist.map(resort => (
              <div key={resort.id} className="bg-bg-white border border-border-color rounded-2xl overflow-hidden shadow-custom flex flex-col transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-[220px]">
                  <img src={resort.image} alt={resort.name} className="w-full h-full object-cover" />
                  <button 
                    className="absolute top-[15px] right-[15px] bg-white/90 text-red-500 border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-110"
                    onClick={() => removeWish(resort.id, resort.name)}
                    aria-label="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs text-text-gray flex items-center gap-1 mb-2 font-medium"><MapPin size={12} className="text-primary" /> {resort.location}</span>
                  <h3 className="text-xl font-bold text-text-dark mb-[18px]">{resort.name}</h3>

                  <div className="flex justify-between items-center border-t border-border-color pt-[15px] mt-auto">
                    <div className="flex items-center">
                      <strong className="text-xl font-bold text-text-dark">
                        {resort.price < 1000 ? '$' : '₹'}{resort.price}
                      </strong>
                      <span className="text-[11px] text-text-gray ml-0.5">/ night</span>
                    </div>

                    <button 
                      className="bg-primary text-bg-white border-none px-5 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer flex items-center transition-colors duration-300 hover:bg-primary-dark hover:text-white"
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
          <div className="text-center py-[60px] px-5 flex flex-col items-center text-text-gray">
            <div className="relative w-40 h-40 mb-[25px]">
              <img 
                src={rivoSearching} 
                alt="Rivo searching empty wishlist" 
                className="w-full h-full rounded-full border-[3px] border-border-color object-cover shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
              />
              <div className="absolute bottom-0 right-[5px] w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center text-[22px] font-extrabold border-[3px] border-bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">?</div>
            </div>
            <h2 className="text-[28px] text-text-dark mb-2.5 font-bold">Your Wishlist is Empty</h2>
            <p className="text-[14.5px] max-w-[450px] mb-[30px] leading-relaxed">Rivo couldn't find any saved resorts here. Explore our verified listings and click the heart icon to save them!</p>
            <Link to="/resorts" className="bg-primary text-bg-white no-underline px-[30px] py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-primary-dark hover:text-white hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(13,71,161,0.2)]">
              Explore Luxury Resorts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
