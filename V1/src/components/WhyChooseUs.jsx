import React from "react";
import { Sparkles, ShieldCheck, CreditCard, HelpCircle } from "lucide-react";
import "./WhyChooseUs.css";

const FEATURES = [
  {
    id: 1,
    icon: <Sparkles size={32} />,
    title: "AI Personal Recommendations",
    description: "Our intelligent algorithm maps your mood, calendar, and past stay histories to deliver tailored recommendations with unparalleled precision."
  },
  {
    id: 2,
    icon: <ShieldCheck size={32} />,
    title: "100% Hand-Verified Stays",
    description: "Every resort, private villa, and boutique hotel goes through a thorough 150-point safety, luxury, and amenity auditing process before listing."
  },
  {
    id: 3,
    icon: <CreditCard size={32} />,
    title: "Instant Secure Payments",
    description: "Sleek checkout integration powered by Stripe, accepting global premium credit cards, digital wallets, and flexible installment schedules."
  },
  {
    id: 4,
    icon: <HelpCircle size={32} />,
    title: "24/7 Concierge Support",
    description: "Our dedicated digital and human concierge support teams are available around the clock to handle bookings, dining reservations, or changes."
  }
];

function WhyChooseUs() {
  return (
    <section className="why" id="why">
      <div className="container">
        <span className="section-tag">Value Proposition</span>
        <h2 className="section-title">The Next Era of Luxury Stays</h2>
        <p className="section-subtitle">
          Reservo pairs cutting-edge machine learning with elite hospitality standards to redefine your holiday experience.
        </p>

        <div className="why-grid">
          {FEATURES.map((feature) => (
            <div className="why-card" key={feature.id}>
              <div className="why-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;