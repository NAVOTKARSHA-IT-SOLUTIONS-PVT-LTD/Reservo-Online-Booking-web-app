import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, Home, Waves, Users, FileText, QrCode, 
  MapPin, CheckCircle, Clock, ChevronRight, XCircle 
} from "lucide-react";

export default function Bookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");

  const [bookings] = useState(() => {
    let localBookings = [];
    try {
      localBookings = JSON.parse(localStorage.getItem("reservo-bookings") || "[]");
    } catch(e) {}
    
    // Map local bookings to the UI format
    const formattedLocal = localBookings.map(b => ({
      id: b.id,
      resortName: b.resortName,
      dates: `${new Date(b.checkin).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(b.checkout).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      status: "Confirmed",
      amount: `₹${b.total.toLocaleString()}`,
      guests: `${b.guests || 2} Adults`,
      roomTitle: b.roomTitle || "Luxury Suite",
      location: b.location || "Goa, India",
      image: b.resortImage || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
      code: `RES-${b.id}`
    }));

    return [
      ...formattedLocal,
      {
        id: "mock-1",
        resortName: "Azure Bay Resort",
        dates: "Aug 12 - Aug 18, 2026",
        status: "Confirmed",
        amount: "₹1,24,700",
        guests: "2 Adults",
        roomTitle: "Infinity Ocean Suite",
        location: "Bali, Indonesia",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
        code: "RES-876120"
      },
      {
        id: "mock-2",
        resortName: "Himalaya Escape",
        dates: "Dec 22 - Dec 28, 2025",
        status: "Completed",
        amount: "₹72,400",
        guests: "4 Adults",
        roomTitle: "Alpine Valley Chalet",
        location: "Manali, India",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        code: "RES-429012"
      }
    ];
  });

  const upcomingBookings = bookings.filter(b => b.status === "Confirmed");
  const pastBookings = bookings.filter(b => b.status === "Completed");

  return (
    <div className="min-h-screen bg-bg-light pt-28 pb-20 px-6 font-sans transition-colors duration-300">
      <div className="max-w-[850px] mx-auto space-y-6 animate-fade-in">
        
        {/* Header Title */}
        <div className="border-b border-border-color pb-4">
          <h1 className="text-3xl font-serif font-extrabold text-text-dark">My Bookings</h1>
          <p className="text-sm text-text-gray mt-1">Manage and view voucher passes for your upcoming check-ins.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border-color gap-6">
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-sm font-bold bg-transparent border-none cursor-pointer relative transition-colors ${
              activeTab === "upcoming" ? "text-primary" : "text-text-gray hover:text-text-dark"
            }`}
          >
            Upcoming Trips ({upcomingBookings.length})
            {activeTab === "upcoming" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab("past")}
            className={`pb-3 text-sm font-bold bg-transparent border-none cursor-pointer relative transition-colors ${
              activeTab === "past" ? "text-primary" : "text-text-gray hover:text-text-dark"
            }`}
          >
            Past Vacations ({pastBookings.length})
            {activeTab === "past" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {(activeTab === "upcoming" ? upcomingBookings : pastBookings).map((b) => (
            <div 
              key={b.id} 
              className="bg-bg-white border border-border-color rounded-3xl p-5 shadow-sm flex flex-col md:flex-row gap-5 relative overflow-hidden"
            >
              {/* Card Image */}
              <div className="w-full md:w-[160px] h-[110px] rounded-2xl overflow-hidden shrink-0 bg-bg-light">
                <img src={b.image} alt={b.resortName} className="w-full h-full object-cover" />
              </div>

              {/* Card Body */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-text-gray tracking-wider block">RESERVATION CODE: {b.code}</span>
                      <h3 className="text-[17px] font-serif font-extrabold text-text-dark mt-0.5">{b.resortName}</h3>
                    </div>
                    {b.status === "Confirmed" ? (
                      <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Confirmed
                      </span>
                    ) : (
                      <span className="bg-slate-500/10 text-text-gray text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <XCircle className="w-2.5 h-2.5" /> Completed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-3 text-[11.5px] font-semibold text-text-dark">
                    <div>
                      <span className="text-[9px] text-text-gray block">Stay Dates</span>
                      <span>{b.dates}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-text-gray block">Suite Category</span>
                      <span className="truncate block max-w-[120px]">{b.roomTitle}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-text-gray block">Guests count</span>
                      <span>{b.guests}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-text-gray block">Total Paid</span>
                      <span className="text-primary font-bold">{b.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-color">
                  <span className="text-[10px] text-text-gray flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {b.location}
                  </span>
                  <div className="flex-1" />
                  <button 
                    onClick={() => navigate(`/resort/${b.id.toString().includes('mock') ? 'goa-coastline' : b.id}`)}
                    className="py-1.5 px-3 bg-bg-light border border-border-color text-text-dark text-[10px] font-bold rounded-lg hover:border-primary hover:text-primary transition-all cursor-pointer flex items-center gap-1"
                  >
                    View resort <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {(activeTab === "upcoming" ? upcomingBookings : pastBookings).length === 0 && (
            <div className="text-center py-16 border border-dashed border-border-color rounded-3xl bg-bg-white shadow-sm space-y-4">
              <QrCode className="w-12 h-12 text-text-gray mx-auto" />
              <div>
                <h3 className="text-base font-bold text-text-dark">No bookings found</h3>
                <p className="text-xs text-text-gray mt-1">You don't have any stays listed in this category.</p>
              </div>
              <button 
                onClick={() => navigate("/ai-planner")}
                className="py-2 px-4 bg-primary text-white text-xs font-bold rounded-lg border-none shadow hover:bg-primary-dark cursor-pointer"
              >
                Plan a Vacation
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
