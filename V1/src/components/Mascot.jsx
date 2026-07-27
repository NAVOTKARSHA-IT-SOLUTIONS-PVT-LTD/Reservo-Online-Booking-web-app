import React from "react";
import rivoMascot from "../assets/images/rivo_mascot.jpg";
import "./Mascot.css";

const FEATURES = [
  {
    id: 1,
    icon: "👋",
    title: "1. WELCOME",
    description: "Rivo welcomes you to Reservo and makes you feel at home."
  },
  {
    id: 2,
    icon: "🔍",
    title: "2. SEARCH",
    description: "Rivo helps you search the best resorts and hotels anywhere."
  },
  {
    id: 3,
    icon: "⚖️",
    title: "3. COMPARE",
    description: "Rivo compares options so you can choose the perfect stay."
  },
  {
    id: 4,
    icon: "📅",
    title: "4. BOOK",
    description: "Rivo makes booking fast, easy and hassle-free."
  },
  {
    id: 5,
    icon: "🏷️",
    title: "5. BEST DEALS",
    description: "Rivo brings you exclusive offers and unbeatable prices."
  },
  {
    id: 6,
    icon: "✨",
    title: "6. AI RECOMMEND",
    description: "Rivo recommends personalized stays based on your preferences."
  },
  {
    id: 7,
    icon: "🗺️",
    title: "7. TRIP PLAN",
    description: "Rivo creates your complete trip plan including stays, activities and more."
  },
  {
    id: 8,
    icon: "🎧",
    title: "8. SUPPORT",
    description: "Rivo is here 24/7 to help you anytime, anywhere."
  },
  {
    id: 9,
    icon: "🔔",
    title: "9. REMINDERS",
    description: "Rivo reminds you about check-in, activities and special plans."
  },
  {
    id: 10,
    icon: "🕶️",
    title: "10. ENJOY",
    description: "Rivo wants you to relax, enjoy and create memories that last forever."
  },
  {
    id: 11,
    icon: "🔄",
    title: "11. REVISIT",
    description: "Rivo is excited to have you back for your next adventure."
  },
  {
    id: 12,
    icon: "🔗",
    title: "12. SHARE",
    description: "Rivo loves when you share your experience with your friends."
  }
];

function Mascot() {
  return (
    <section className="mascot" id="mascot">
      <div className="container">
        <div className="mascot-wrapper">
          
          {/* Left Column: Mascot Profile Card */}
          <div className="mascot-profile-card">
            <div className="mascot-img-container">
              <img src={rivoMascot} alt="Rivo Mascot" className="mascot-img" />
              <div className="mascot-badge">Rivo v1.0</div>
            </div>
            
            <h2 className="mascot-main-title">
              Meet <span>RIVO</span>
            </h2>
            <p className="mascot-tagline">Your Travel Buddy</p>
            
            <p className="mascot-intro">
              Rivo is here to make your travel planning easy, smart, and unforgettable. He is more than just a mascot — he is your interactive digital companion.
            </p>
            
            <div className="mascot-attributes">
              <span>🧠 Smart</span>
              <span>😊 Friendly</span>
              <span>👍 Helpful</span>
              <span>🛡️ Trustworthy</span>
            </div>
          </div>
          
          {/* Right Column: 12 Features Grid */}
          <div className="mascot-features-section">
            <div className="section-header-compact">
              <span className="section-tag">AI Digital Companion</span>
              <h3 className="mascot-sub-title">12 Ways Rivo Assists You</h3>
            </div>
            
            <div className="mascot-features-grid">
              {FEATURES.map((feature) => (
                <div className="feature-card" key={feature.id}>
                  <div className="feature-card-header">
                    <span className="feature-icon">{feature.icon}</span>
                    <h4>{feature.title}</h4>
                  </div>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default Mascot;
