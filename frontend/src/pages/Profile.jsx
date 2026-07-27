import React, { useState } from "react";
import { User, Mail, Phone, Globe, Shield, CreditCard, LogOut, CheckCircle2 } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Tausif Shaikh",
    email: "tausif.shaikh@example.com",
    phone: "+91 98765 43210",
    tier: "Elite Diamond Status",
    joined: "Member since July 2026",
    points: "24,500 pts"
  });

  const [bookingHistory] = useState([
    {
      id: 1,
      property: "Azure Bay Resort, Bali",
      dates: "Aug 12 - Aug 18, 2026",
      status: "Confirmed",
      amount: "$1,470"
    },
    {
      id: 2,
      property: "Himalaya Escape, Manali",
      dates: "Dec 22 - Dec 28, 2025",
      status: "Completed",
      amount: "$1,134"
    }
  ]);

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

  const saveSettings = (e) => {
    e.preventDefault();
    showGlobalToast("Profile configurations updated successfully!");
  };

  return (
    <div className="py-30 pb-25 bg-bg-light min-h-screen fade-up">
      <div className="w-[90%] max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 items-start">
        
        {/* Left column info */}
        <aside className="bg-bg-white border border-border-color rounded-3xl p-7.5 shadow-custom text-center">
          <div className="relative w-30 h-30 mx-auto mb-5">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=150&q=80" 
              alt={profile.name} 
              className="w-full h-full rounded-full object-cover border-3 border-gold"
            />
            <span className="absolute -bottom-1.25 left-1/2 -translate-x-1/2 bg-[#121e1b] text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.15)]">{profile.tier}</span>
          </div>

          <div className="profile-meta-info">
            <h2 className="text-2xl font-bold text-text-dark mb-1.25">{profile.name}</h2>
            <p className="text-xs text-text-gray mb-6.25">{profile.joined}</p>
          </div>

          <div className="bg-bg-light border border-border-color p-3.75 rounded-2xl mb-6.25">
            <span className="text-[11px] uppercase tracking-wider text-text-gray font-bold block mb-1.25">Loyalty Points Available</span>
            <h3 className="text-2xl font-extrabold text-text-dark">{profile.points}</h3>
          </div>

          <nav className="flex flex-col gap-2.5">
            <a href="#details" className="flex items-center gap-2.5 px-4.5 py-3 rounded-lg text-sm font-semibold text-text-dark no-underline bg-bg-light"><User size={16} /> Personal Info</a>
            <a href="#history" className="flex items-center gap-2.5 px-4.5 py-3 rounded-lg text-sm font-semibold text-text-gray no-underline transition-colors duration-300 bg-transparent border-none w-full text-left cursor-pointer hover:bg-bg-light hover:text-text-dark"><CreditCard size={16} /> Booking History</a>
            <a href="#security" className="flex items-center gap-2.5 px-4.5 py-3 rounded-lg text-sm font-semibold text-text-gray no-underline transition-colors duration-300 bg-transparent border-none w-full text-left cursor-pointer hover:bg-bg-light hover:text-text-dark"><Shield size={16} /> Security</a>
            <button 
              className="flex items-center gap-2.5 px-4.5 py-3 rounded-lg text-sm font-semibold text-red-500 no-underline transition-colors duration-300 bg-transparent border-none w-full text-left cursor-pointer hover:bg-red-500/5 mt-3.75"
              onClick={() => showGlobalToast("Account signed out.")}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Right column details */}
        <main className="flex flex-col gap-7.5">
          {/* Section 1 details */}
          <div id="details" className="bg-bg-white border border-border-color rounded-3xl p-10 shadow-custom">
            <h3 className="text-2xl font-extrabold text-text-dark mb-1.5">Personal Information</h3>
            <p className="text-[13.5px] text-text-gray mb-7.5">Manage your basic accounts details and communication settings.</p>

            <form onSubmit={saveSettings} className="flex flex-col gap-6.25">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-dark uppercase tracking-wider flex items-center gap-1"><User size={12} /> Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="p-3 px-4 rounded-lg border border-border-color bg-bg-light text-text-dark text-sm outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_2px_rgba(194,168,120,0.1)]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-dark uppercase tracking-wider flex items-center gap-1"><Mail size={12} /> Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="p-3 px-4 rounded-lg border border-border-color bg-bg-light text-text-dark text-sm outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_2px_rgba(194,168,120,0.1)]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-dark uppercase tracking-wider flex items-center gap-1"><Phone size={12} /> Mobile Number</label>
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="p-3 px-4 rounded-lg border border-border-color bg-bg-light text-text-dark text-sm outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_2px_rgba(194,168,120,0.1)]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-dark uppercase tracking-wider flex items-center gap-1"><Globe size={12} /> Language / Currency</label>
                  <select defaultValue="en_usd" className="p-3 px-4 rounded-lg border border-border-color bg-bg-light text-text-dark text-sm outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_2px_rgba(194,168,120,0.1)]">
                    <option value="en_usd">English (USD)</option>
                    <option value="en_inr">English (INR)</option>
                    <option value="es_eur">Español (EUR)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="self-start bg-primary text-bg-white border-none px-7.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-300 hover:bg-gold hover:text-white hover:-translate-y-px">
                Save Changes
              </button>
            </form>
          </div>

          {/* Section 2 details */}
          <div id="history" className="bg-bg-white border border-border-color rounded-3xl p-10 shadow-custom">
            <h3 className="text-2xl font-extrabold text-text-dark mb-1.5">Active & Past Reservations</h3>
            <p className="text-[13.5px] text-text-gray mb-7.5">Real-time status updates of your digital keys and suite check-ins.</p>

            <div className="flex flex-col gap-3.75">
              {bookingHistory.map(bk => (
                <div key={bk.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-bg-light border border-border-color rounded-2xl gap-3.75 sm:gap-0">
                  <div>
                    <h4 className="text-base text-text-dark font-bold mb-1">{bk.property}</h4>
                    <span className="text-xs text-text-gray">{bk.dates}</span>
                  </div>
                  <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-2">
                    <strong className="text-base text-text-dark">{bk.amount}</strong>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      bk.status === "Confirmed" 
                        ? "bg-[#121e1b]/10 text-[#121e1b]" 
                        : "bg-[#c5a059]/15 text-[#b58e45]"
                    }`}>
                      <CheckCircle2 size={12} /> {bk.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
