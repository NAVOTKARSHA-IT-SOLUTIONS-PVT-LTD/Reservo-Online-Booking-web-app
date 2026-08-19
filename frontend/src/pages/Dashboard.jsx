import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutGrid, Calendar, Wallet, Award, ArrowRight, 
  MapPin, Sparkles, QrCode, ClipboardList, Clock 
} from "lucide-react";
import { authService } from "../services/auth.service";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-bg-light pt-28 pb-20 px-6 font-sans transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in">
        
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-color pb-6">
          <div>
            <h1 className="text-3xl font-serif font-extrabold text-text-dark">Welcome back, {user?.name || "User"} 👋</h1>
            <p className="text-sm text-text-gray mt-1">Manage your luxury stays, rewards points, and active travel passes here.</p>
          </div>
          <button 
            onClick={() => navigate("/ai-planner")}
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow hover:bg-primary-dark border-none cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Plan New Trip
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-bg-white border border-border-color rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[130px]">
            <div className="flex justify-between items-center text-text-gray">
              <span className="text-[10px] font-bold uppercase tracking-wider">Next Stay</span>
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-1 my-1 h-7">
              <h3 className="text-base font-bold text-text-dark truncate">Goa Coastline</h3>
            </div>
            <p className="text-[11px] text-text-gray font-semibold">Starts in 10 Days</p>
          </div>

          <div className="bg-bg-white border border-border-color rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[130px]">
            <div className="flex justify-between items-center text-text-gray">
              <span className="text-[10px] font-bold uppercase tracking-wider">Member Tier</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1 my-1 h-7">
              <h3 className="text-base font-bold text-text-dark">Elite Diamond</h3>
            </div>
            <p className="text-[11px] text-text-gray font-semibold">Diamond Member Status</p>
          </div>

          <div className="bg-bg-white border border-border-color rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[130px]">
            <div className="flex justify-between items-center text-text-gray">
              <span className="text-[10px] font-bold uppercase tracking-wider">Reward Points</span>
              <Wallet className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1 my-1 h-7">
              <h3 className="text-base font-bold text-text-dark">24,500 pts</h3>
            </div>
            <p className="text-[11px] text-text-gray font-semibold">₹2,450 Value Equivalents</p>
          </div>

          <div className="bg-bg-white border border-border-color rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[130px]">
            <div className="flex justify-between items-center text-text-gray">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Bookings</span>
              <ClipboardList className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-1 my-1 h-7">
              <h3 className="text-base font-bold text-text-dark">3 Completed</h3>
            </div>
            <p className="text-[11px] text-text-gray font-semibold">Across 2 Destinations</p>
          </div>
        </div>

        {/* Inner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Pass (Left) */}
          <div className="lg:col-span-8 bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-serif font-extrabold text-text-dark border-b border-border-color pb-3">Active Vacation Pass</h2>
            
            <div className="bg-bg-light border border-border-color rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-white p-4 rounded-xl border border-border-color shadow-sm shrink-0">
                <QrCode className="w-32 h-32 text-slate-800" />
              </div>
              <div className="flex-1 space-y-4 text-[12px] font-semibold text-text-dark">
                <div>
                  <span className="bg-rose-500/10 text-rose-500 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Active Stay</span>
                  <h3 className="text-base font-bold text-text-dark mt-1 font-serif">Goa Heritage Villa</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-text-gray block text-[10px]">Check-in</span>
                    <span>12 Sep 2026, 12:00 PM</span>
                  </div>
                  <div>
                    <span className="text-text-gray block text-[10px]">Guests</span>
                    <span>4 Adults • Suite Room</span>
                  </div>
                  <div>
                    <span className="text-text-gray block text-[10px]">Transit Route</span>
                    <span>Flight Transit Confirmed</span>
                  </div>
                  <div>
                    <span className="text-text-gray block text-[10px]">Location</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> Goa, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Rivo Assistance (Right) */}
          <div className="lg:col-span-4 bg-[#1E293B] text-white rounded-3xl p-6 shadow-md relative overflow-hidden space-y-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/30 to-transparent rounded-full filter blur-xl" />
            
            <div>
              <span className="bg-gold text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">AI Concierge</span>
              <h3 className="text-lg font-serif font-bold mt-2.5">Need help on your trip?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Rivo is configured to manage check-ins, request fresh towels, and book transport transfers directly inside the companion chat popup.</p>
            </div>

            <button 
              onClick={() => navigate("/ai-planner")}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl shadow cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              Consult Rivo AI <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Reward History */}
        <div className="bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-extrabold text-text-dark border-b border-border-color pb-3">Points Activity</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] font-semibold text-text-dark border-collapse">
              <thead>
                <tr className="border-b border-border-color text-text-gray text-[10px] uppercase">
                  <th className="py-2.5">Activity Detail</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th className="text-right">Points Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                <tr>
                  <td className="py-3 flex items-center gap-2">🌴 Stay booking: Azure Bay Resort Bali</td>
                  <td className="text-text-gray font-mono">TXN-489270</td>
                  <td className="text-text-gray">22 Jul 2026</td>
                  <td className="text-emerald-500 text-right font-bold">+12,000 pts</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2">🛫 Cab Transit Allocation Partner Reward</td>
                  <td className="text-text-gray font-mono">TXN-487612</td>
                  <td className="text-text-gray">19 Jul 2026</td>
                  <td className="text-emerald-500 text-right font-bold">+2,500 pts</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2">🛍️ Luxury Spa redemption at Bali</td>
                  <td className="text-text-gray font-mono">TXN-472091</td>
                  <td className="text-text-gray">10 Jan 2026</td>
                  <td className="text-rose-500 text-right font-bold">-5,000 pts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
