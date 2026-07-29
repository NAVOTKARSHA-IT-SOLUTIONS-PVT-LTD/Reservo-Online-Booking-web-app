import React from "react";
import { Sparkles, ShieldCheck, CreditCard, HeadphonesIcon, Users, Globe, Award, Shield, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    id: "01",
    icon: <Sparkles size={28} />,
    title: "AI Personal Recommendations",
    description: "Our intelligent algorithm maps your mood, calendar, and past stay histories to deliver tailored recommendations with unparalleled precision.",
  },
  {
    id: "02",
    icon: <ShieldCheck size={28} />,
    title: "100% Hand-Verified Stays",
    description: "Every resort, private villa, and boutique hotel goes through a thorough 150+ point safety, luxury, and amenity auditing process before listing.",
  },
  {
    id: "03",
    icon: <CreditCard size={28} />,
    title: "Instant Secure Payments",
    description: "Sleek checkout powered by Stripe, accepting global premium credit cards, digital wallets, and flexible installment schedules.",
  },
  {
    id: "04",
    icon: <HeadphonesIcon size={28} />,
    title: "24/7 Concierge Support",
    description: "Our dedicated digital and human concierge support teams are available around the clock to handle bookings, dining reservations, or any changes.",
  }
];

const STATS = [
  {
    icon: <Users size={20} />,
    value: "10,000+",
    label: "Happy Travelers",
    subLabel: "Trusted by our global community",
  },
  {
    icon: <Globe size={20} />,
    value: "1,200+",
    label: "Luxury Properties",
    subLabel: "Curated for the perfect stay",
  },
  {
    icon: <Award size={20} />,
    value: "4.9/5",
    label: "Average Rating",
    subLabel: "From 12K+ verified reviews",
  },
  {
    icon: <Shield size={20} />,
    value: "100%",
    label: "Secure & Safe",
    subLabel: "Your safety is our priority",
  }
];

function WhyChooseUs() {
  return (
    <section className="py-16 bg-bg-light transition-colors duration-300" id="why">
      <div className="w-full max-w-[1280px] mx-auto px-5 flex flex-col items-center">
        
        {/* Top Badge */}
        <div className="flex items-center justify-center gap-2 bg-bg-light text-primary px-4 py-1.5 rounded-full mb-6 border border-border-color transition-colors duration-300">
          <ShieldCheck size={14} />
          <span className="text-[11px] font-bold uppercase tracking-[1px]">WHY CHOOSE RESERVO</span>
        </div>

        {/* Header */}
        <h2 className="text-[36px] sm:text-[42px] md:text-[50px] font-extrabold text-text-dark leading-[1.1] text-center mb-4 font-serif transition-colors duration-300">
          The Next Era of <span className="text-primary">Luxury Stays</span>
        </h2>
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-500"></div>
          <div className="w-2 h-2 rotate-45 bg-yellow-500"></div>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-500"></div>
        </div>

        <p className="text-text-gray text-[15px] sm:text-[16px] leading-relaxed mb-10 max-w-[560px] text-center transition-colors duration-300">
          Reservo pairs cutting-edge technology with elite hospitality standards to redefine your holiday experience.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-custom border border-border-color transition-all duration-300 hover:-translate-y-2">
              <div className="w-full flex justify-start mb-2">
                <span className="text-primary bg-bg-light font-bold text-xs px-2.5 py-1 rounded-full border border-border-color transition-colors duration-300">{feature.id}</span>
              </div>
              <div className="w-[72px] h-[72px] rounded-full bg-bg-light flex items-center justify-center text-primary mb-6 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-[19px] font-bold text-text-dark mb-4 leading-snug transition-colors duration-300">{feature.title}</h3>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-200 to-blue-500 rounded-full mb-5"></div>
              <p className="text-text-gray text-[14px] leading-relaxed mb-8 flex-1 transition-colors duration-300">{feature.description}</p>
              
              <button className="flex items-center gap-2 text-primary font-semibold text-[14px] hover:text-primary-dark transition-colors mt-auto group border-none bg-transparent cursor-pointer">
                Learn more <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Stats Bar */}
        <div className="w-full bg-bg-white rounded-3xl p-8 shadow-custom border border-border-color flex flex-wrap justify-between items-center gap-8 transition-colors duration-300">
          {STATS.map((stat, index) => (
            <div key={index} className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-[0_5px_15px_rgba(13,71,161,0.3)] transition-colors duration-300">
                  {stat.icon}
                </div>
                <div>
                  <h4 className="text-[22px] font-extrabold text-text-dark leading-none mb-1 transition-colors duration-300">{stat.value}</h4>
                  <p className="text-[13px] font-medium text-text-gray m-0 transition-colors duration-300">{stat.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-1">
                <span className="text-yellow-500 text-[12px]">★</span>
                <span className="text-[12px] font-medium text-text-gray/80 transition-colors duration-300">{stat.subLabel}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;