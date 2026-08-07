import React, { createContext, useContext, useState, useEffect } from "react";
import { secureStorage } from "../services/secureStorage";
import { authService } from "../services/auth.service";

const WishlistContext = createContext();
const WISHLIST_KEY = "reservo-wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const secured = secureStorage.getItem(WISHLIST_KEY);
      if (secured) return secured;
      // Fallback/migration from plain text local storage
      const plain = localStorage.getItem(WISHLIST_KEY);
      return plain ? JSON.parse(plain) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    secureStorage.setItem(WISHLIST_KEY, wishlist);
    // Legacy sync for components that check raw localstorage
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    
    // Dispatch standard storage event so other components sync
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("wishlist-updated"));
  }, [wishlist]);

  const toggleWishlist = (resort) => {
    if (!authService.isAuthenticated()) {
      alert("Please log in to save items to your wishlist.");
      window.location.href = "/login";
      return;
    }
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === resort.id);
      if (exists) {
        return prev.filter((item) => item.id !== resort.id);
      } else {
        return [...prev, {
          id: resort.id,
          name: resort.name,
          location: resort.location,
          price: resort.price,
          image: resort.heroImage || resort.image
        }];
      }
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
