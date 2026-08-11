import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Sparkles, QrCode, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../services/booking.service';
import { useToast } from '../context/ToastContext';
import StripeCardInput from './StripeCardInput';
import rivoConfirmed from '../assets/images/rivo_confirmed.png';

export default function BookingModal({ resort, room, isDarkMode, onClose, onAskRivo }) {
  const toast = useToast();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [addonButler, setAddonButler] = useState(true);
  const [addonDinner, setAddonDinner] = useState(false);
  const [addonHelicopter, setAddonHelicopter] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Currency Converter states
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const handleStorage = () => {
      const cur = localStorage.getItem("reservo-currency") || "en_inr";
      if (cur === "en_usd") {
        setCurrencySymbol("$");
        setExchangeRate(0.012);
      } else if (cur === "es_eur") {
        setCurrencySymbol("€");
        setExchangeRate(0.011);
      } else {
        setCurrencySymbol("₹");
        setExchangeRate(1);
      }
    };
    handleStorage();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const basePrice = room ? room.price : resort.price;
  const nights = 3;
  const butlerFee = addonButler ? 1500 : 0;
  const dinnerFee = addonDinner ? 3500 : 0;
  const helicopterFee = addonHelicopter ? 8000 : 0;
  const subtotal = (basePrice * nights) + butlerFee + dinnerFee + helicopterFee;
  const taxes = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + taxes;

  const [bookingCode] = useState(() => `RES-${Math.floor(100000 + Math.random() * 900000)}`);
  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const bookingDetails = {
        id: bookingCode,
        resortId: resort.id,
        roomId: room ? room.id : (resort.roomTypes && resort.roomTypes[0] ? resort.roomTypes[0].id : null),
        resortName: resort.name,
        location: resort.location,
        resortImage: resort.heroImage || resort.image,
        checkin: "2026-09-12",
        checkout: "2026-09-15",
        guests: 2,
        roomTitle: room ? room.title : (resort.roomTypes && resort.roomTypes[0] ? resort.roomTypes[0].title : "Luxury Suite"),
        total: grandTotal,
        amount: `${currencySymbol}${(Math.round(grandTotal * exchangeRate)).toLocaleString()}`,
        code: bookingCode
      };

      await bookingService.createBooking(bookingDetails);
      setIsConfirmed(true);
      toast(`Suite checkout for ${resort.name} confirmed!`, "success");
    } catch (e) {
      console.error("Failed to save booking:", e);
      toast("Failed to confirm checkout. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={`rounded-3xl max-w-xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDarkMode ? 'bg-[#1E293B] border-[#334155] text-[#F8FAFC]' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
        }`}
      >
        {/* Header */}
        <div className="bg-[#2563EB] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showPayment && !isConfirmed && (
              <button 
                onClick={() => setShowPayment(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white border-none bg-transparent cursor-pointer mr-1"
                aria-label="Back to details"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">
                {showPayment ? "SECURE CHECKOUT VIA STRIPE" : "RESERVO INSTANT RESERVATION"}
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{resort.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer border-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isConfirmed ? (
            <div className="flex flex-col items-center text-center space-y-4 py-2 animate-fade-in">
              <div className="relative w-28 h-28 mx-auto">
                <img 
                  src={rivoConfirmed} 
                  alt="Booking Confirmed" 
                  className="w-full h-full object-cover rounded-full border-2 border-[#22C55E] shadow-lg animate-bounce"
                />
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center border-2 border-white shadow-md">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-100 text-[#22C55E] rounded-full text-[10px] font-bold uppercase tracking-wider">
                  BOOKING VERIFIED & CONFIRMED
                </span>
                <h3 className="text-2xl font-bold mt-2">Reservation Secured!</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Rivo has secured your booking. Digital pass sent to email!
                </p>
              </div>

              <div className="bg-[#0B1120] text-white rounded-2xl p-5 text-left border border-[#2563EB] w-full space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[10px] text-[#60A5FA] font-bold uppercase">BOOKING ID</div>
                    <div className="text-sm font-mono font-bold">{bookingCode}</div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-[#0B1120]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-400 text-[10px] uppercase block">GUEST</span><span className="font-bold">Valued RESERVO Guest</span></div>
                  <div><span className="text-slate-400 text-[10px] uppercase block">DATES</span><span className="font-bold">Sep 12 - Sep 15, 2026</span></div>
                </div>
              </div>
            </div>
          ) : showPayment ? (
            /* Stripe Interactive Payment Form integration */
            <div className="animate-fade-in">
              <StripeCardInput 
                grandTotal={grandTotal * exchangeRate} 
                currencySymbol={currencySymbol} 
                onPaymentSuccess={handleConfirm} 
              />
            </div>
          ) : (
            /* Stay and Addons Selection Details */
            <>
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? 'bg-[#111827] border-[#334155]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}>
                <div>
                  <div className="text-xs text-[#2563EB] font-bold uppercase">Selected Suite</div>
                  <div className="text-base font-bold mt-0.5">{room ? room.title : resort.roomTypes[0].title}</div>
                  <div className={`text-xs flex items-center gap-2 mt-1 ${isDarkMode ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                    <span>📅 Sep 12 - Sep 15 (3 Nights)</span>
                    <span>•</span>
                    <span>👥 2 Guests</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-stone-400">Nightly Rate</div>
                  <div className="text-lg font-bold text-[#2563EB]">
                    {currencySymbol}{(Math.round(basePrice * exchangeRate)).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Tailored Luxury Add-ons</div>
                
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  addonButler
                    ? 'bg-[#DBEAFE] border-[#2563EB] text-[#2563EB]'
                    : isDarkMode ? 'bg-[#111827] border-[#334155]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={addonButler} onChange={(e) => setAddonButler(e.target.checked)} className="accent-[#2563EB]" />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1">24/7 Dedicated Rivo AI Butler <Sparkles className="w-3 h-3 text-[#2563EB]" /></div>
                      <div className="text-[11px] opacity-75">Live priority room service & packing assistance.</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold">+{currencySymbol}{(Math.round(1500 * exchangeRate)).toLocaleString()}</span>
                </label>

                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  addonDinner
                    ? 'bg-[#DBEAFE] border-[#2563EB] text-[#2563EB]'
                    : isDarkMode ? 'bg-[#111827] border-[#334155]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={addonDinner} onChange={(e) => setAddonDinner(e.target.checked)} className="accent-[#2563EB]" />
                    <div>
                      <div className="text-xs font-bold">Candlelit Beachside Seafood Dinner</div>
                      <div className="text-[11px] opacity-75">5-course private chef menu.</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold">+{currencySymbol}{(Math.round(3500 * exchangeRate)).toLocaleString()}</span>
                </label>

                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  addonHelicopter
                    ? 'bg-[#DBEAFE] border-[#2563EB] text-[#2563EB]'
                    : isDarkMode ? 'bg-[#111827] border-[#334155]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={addonHelicopter} onChange={(e) => setAddonHelicopter(e.target.checked)} className="accent-[#2563EB]" />
                    <div>
                      <div className="text-xs font-bold">Helicopter Airport Transfer</div>
                      <div className="text-[11px] opacity-75">Direct aerial transfer to resort helipad.</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold">+{currencySymbol}{(Math.round(8000 * exchangeRate)).toLocaleString()}</span>
                </label>
              </div>

              <div className="border-t border-stone-200 dark:border-stone-700 pt-4 space-y-2 text-xs">
                <div className="flex justify-between"><span>Room Charge (3 nights)</span><span className="font-bold">{currencySymbol}{(Math.round(basePrice * nights * exchangeRate)).toLocaleString()}</span></div>
                {addonButler && <div className="flex justify-between"><span>Rivo AI Butler</span><span>{currencySymbol}{(Math.round(1500 * exchangeRate)).toLocaleString()}</span></div>}
                {addonDinner && <div className="flex justify-between"><span>Beachfront Dinner</span><span>{currencySymbol}{(Math.round(3500 * exchangeRate)).toLocaleString()}</span></div>}
                {addonHelicopter && <div className="flex justify-between"><span>Helicopter Shuttle</span><span>{currencySymbol}{(Math.round(8000 * exchangeRate)).toLocaleString()}</span></div>}
                <div className="flex justify-between"><span>Resort Taxes (12%)</span><span>{currencySymbol}{(Math.round(taxes * exchangeRate)).toLocaleString()}</span></div>
                <div className="border-t pt-2 flex justify-between text-base font-bold text-[#2563EB]">
                  <span>Total Amount</span>
                  <span>{currencySymbol}{(Math.round(grandTotal * exchangeRate)).toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!showPayment && !isConfirmed && (
          <div className={`p-6 border-t ${isDarkMode ? 'bg-[#111827] border-[#334155]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg border-none transition cursor-pointer"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {isConfirmed && (
          <div className={`p-6 border-t ${isDarkMode ? 'bg-[#111827] border-[#334155]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <button
              onClick={() => {
                onClose();
                if (onAskRivo) onAskRivo();
              }}
              className="w-full sm:flex-grow py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer transition"
            >
              <Sparkles className="w-4 h-4" /> Open Rivo for Check-in
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl border-none cursor-pointer transition"
            >
              Close Pass
            </button>
          </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
