import React, { useState } from "react";
import { User, Mail, Phone, Globe, Shield, CreditCard, LogOut, CheckCircle2 } from "lucide-react";
import "./Profile.css";

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
    <div className="profile-page fade-up">
      <div className="container profile-container">
        {/* Left column info */}
        <aside className="profile-sidebar-card">
          <div className="profile-avatar-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=150&q=80" 
              alt={profile.name} 
              className="profile-avatar-img"
            />
            <span className="profile-tier-badge">{profile.tier}</span>
          </div>

          <div className="profile-meta-info">
            <h2>{profile.name}</h2>
            <p>{profile.joined}</p>
          </div>

          <div className="profile-points-card">
            <span className="points-title">Loyalty Points Available</span>
            <h3>{profile.points}</h3>
          </div>

          <nav className="profile-aside-nav">
            <a href="#details" className="active"><User size={16} /> Personal Info</a>
            <a href="#history"><CreditCard size={16} /> Booking History</a>
            <a href="#security"><Shield size={16} /> Security</a>
            <button 
              className="logout-action-btn"
              onClick={() => showGlobalToast("Account signed out.")}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Right column details */}
        <main className="profile-main-details">
          {/* Section 1 details */}
          <div id="details" className="profile-section-card">
            <h3>Personal Information</h3>
            <p className="section-desc">Manage your basic accounts details and communication settings.</p>

            <form onSubmit={saveSettings} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><User size={12} /> Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label><Mail size={12} /> Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label><Phone size={12} /> Mobile Number</label>
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label><Globe size={12} /> Language / Currency</label>
                  <select defaultValue="en_usd">
                    <option value="en_usd">English (USD)</option>
                    <option value="en_inr">English (INR)</option>
                    <option value="es_eur">Español (EUR)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="save-profile-btn">
                Save Changes
              </button>
            </form>
          </div>

          {/* Section 2 details */}
          <div id="history" className="profile-section-card">
            <h3>Active & Past Reservations</h3>
            <p className="section-desc">Real-time status updates of your digital keys and suite check-ins.</p>

            <div className="booking-history-stack">
              {bookingHistory.map(bk => (
                <div key={bk.id} className="history-item-row">
                  <div className="history-main-info">
                    <h4>{bk.property}</h4>
                    <span>{bk.dates}</span>
                  </div>
                  <div className="history-price-status">
                    <strong>{bk.amount}</strong>
                    <span className={`status-pill ${bk.status.toLowerCase()}`}>
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
