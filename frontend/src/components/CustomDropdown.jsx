import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  icon: PrefixIcon = null,
  label = null,
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  align = "left", // 'left' | 'right'
  direction = "down", // 'down' | 'up'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to { value, label, icon, badge, description }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return { value: opt, label: String(opt) };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val) => {
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-gray mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer select-none outline-none ${
          isOpen
            ? "border-primary ring-2 ring-primary/20 bg-bg-white"
            : "border-border-color bg-bg-white hover:border-primary/50"
        } ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate text-text-dark">
          {PrefixIcon && <span className="text-primary shrink-0">{PrefixIcon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-gray-400 font-normal">{placeholder}</span>}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`text-text-gray transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === "up" ? 8 : -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === "up" ? 8 : -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-[100] min-w-[200px] w-full max-h-64 overflow-y-auto overscroll-contain bg-bg-white border border-border-color rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] p-1.5 focus:outline-none ${
              align === "right" ? "right-0" : "left-0"
            } ${
              direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
            } ${menuClassName}`}
          >
            <div className="flex flex-col gap-0.5">
              {normalizedOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer border-none font-semibold ${
                      isSelected
                        ? "bg-primary/10 text-primary font-bold"
                        : "bg-transparent text-text-dark hover:bg-bg-light"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {isSelected && (
                      <Check size={14} className="text-primary shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
