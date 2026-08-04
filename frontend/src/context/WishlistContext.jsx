import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("reservo-wishlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("reservo-wishlist", JSON.stringify(wishlist));
    // Dispatch standard storage event so other components sync
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("wishlist-updated"));
  }, [wishlist]);

  const toggleWishlist = (resort) => {
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
