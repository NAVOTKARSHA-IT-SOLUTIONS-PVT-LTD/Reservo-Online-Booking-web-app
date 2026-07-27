import React, { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setIsVisible(true);
      const { clientX: x, clientY: y } = e;
      
      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top = `${y}px`;
      }
      
      if (ringRef.current) {
        // Use smooth animation or requestAnimationFrame
        ringRef.current.animate(
          {
            left: `${x}px`,
            top: `${y}px`
          },
          { duration: 250, fill: "forwards" }
        );
      }
    };

    const handleMouseOver = (e) => {
      // Check if hovering over clickable element
      const target = e.target;
      const isClickable = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.closest(".destination-card") ||
        target.closest(".resort-card") ||
        target.closest(".experience-card") ||
        target.classList.contains("clickable") ||
        target.style.cursor === "pointer";
      
      setIsHovered(isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className={`custom-cursor-dot ${isHovered ? "hover" : ""} ${isClicking ? "click" : ""}`}
      />
      <div 
        ref={ringRef} 
        className={`custom-cursor-ring ${isHovered ? "hover" : ""} ${isClicking ? "click" : ""}`}
      >
        <span>+</span>
      </div>
    </>
  );
}

export default CustomCursor;
