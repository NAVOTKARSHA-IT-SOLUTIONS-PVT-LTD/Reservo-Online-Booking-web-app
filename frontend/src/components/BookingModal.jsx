import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, QrCode } from 'lucide-react';
import rivoConfirmed from '../assets/images/rivo_confirmed.png';

export default function BookingModal({ resort, room, isDarkMode, onClose, onAskRivo }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [addonButler, setAddonButler] = useState(true);
  const [addonDinner, setAddonDinner] = useState(false);
  const [addonHelicopter, setAddonHelicopter] = useState(false);

  const basePrice = room ? room.price : resort.price;
  const nights = 3;
  const butlerFee = addonButler ? 1500 : 0;
  const dinnerFee = addonDinner ? 3500 : 0;
  const helicopterFee = addonHelicopter ? 8000 : 0;
  const subtotal = (basePrice * nights) + butlerFee + dinnerFee + helicopterFee;
  const taxes = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + taxes;

  const [bookingCode] = useState(() => `RES-${Math.floor(100000 + Math.random() * 900000)}`);

  const handleConfirm = () => {
    setIsConfirmed(true);
    try {
      const existing = JSON.parse(localStorage.getItem("reservo-bookings") || "[]");
      const newBooking = {
        id: bookingCode,
        resortName: resort.name,
        checkin: "2026-09-12",
        checkout: "2026-09-15",
        status: "Confirmed",
        total: grandTotal
      };
      existing.unshift(newBooking);
      localStorage.setItem("reservo-bookings", JSON.stringify(existing));

      // Show success toast
      const toast = document.getElementById("toast");
      const toastMessage = document.getElementById("toast-message");
      if (toast && toastMessage) {
        toastMessage.textContent = `Suite checkout for ${resort.name} confirmed!`;
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3500);
      }
    } catch (e) {
      console.error("Failed to save booking:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className={`rounded-3xl max-w-xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        isDarkMode ? 'bg-[#1E293B] border-[#334155] text-[#F8FAFC]' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
      }`}>
        {/* Header */}
        <div className="bg-[#2563EB] text-white p-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">RESERVO INSTANT RESERVATION</div>
            <h3 className="text-lg font-bold text-white mt-0.5">{resort.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isConfirmed ? (
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
                  <div className="text-lg font-bold text-[#2563EB]">₹{basePrice.toLocaleString()}</div>
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
                  <span className="text-xs font-bold">+₹1,500</span>
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
                  <span className="text-xs font-bold">+₹3,500</span>
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
                  <span className="text-xs font-bold">+₹8,000</span>
                </label>
              </div>

              <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between"><span>Room Charge (3 nights)</span><span className="font-bold">₹{(basePrice * nights).toLocaleString()}</span></div>
                {addonButler && <div className="flex justify-between"><span>Rivo AI Butler</span><span>₹1,500</span></div>}
                {addonDinner && <div className="flex justify-between"><span>Beachfront Dinner</span><span>₹3,500</span></div>}
                {addonHelicopter && <div className="flex justify-between"><span>Helicopter Shuttle</span><span>₹8,000</span></div>}
                <div className="flex justify-between"><span>Resort Taxes (12%)</span><span>₹{taxes.toLocaleString()}</span></div>
                <div className="border-t pt-2 flex justify-between text-base font-bold text-[#2563EB]">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center space-y-4 py-2 animate-fade-in">
              <div className="relative w-28 h-28 mx-auto">
                <img 
                  src={rivoConfirmed} 
                  alt="Booking Confirmed" 
                  className="w-full h-full object-cover rounded-full border-2 border-[#22C55E] shadow-lg"
                  style={{ animation: "bounceRivo 2s infinite" }}
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

              <div className="bg-[#0B1120] text-white rounded-2xl p-5 text-left border border-[#2563EB] space-y-3">
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
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDarkMode ? 'bg-[#111827] border-[#334155]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
          {!isConfirmed ? (
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Confirm & Pay ₹{grandTotal.toLocaleString()}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (onAskRivo) onAskRivo();
                }}
                className="flex-1 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" /> Open Rivo for Check-in
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition"
              >
                Close Pass
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
