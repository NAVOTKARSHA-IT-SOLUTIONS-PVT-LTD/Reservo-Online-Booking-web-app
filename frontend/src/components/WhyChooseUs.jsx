import React from "react";
import { Sparkles, ShieldCheck, CreditCard, HelpCircle } from "lucide-react";

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
    <section className="py-20 bg-bg-light transition-colors duration-300" id="why">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">Value Proposition</span>
        <h2 className="text-[28px] sm:text-[32px] md:text-[38px] xl:text-[46px] font-bold text-center text-primary mb-4.5">The Next Era of Luxury Stays</h2>
        <p className="max-w-[720px] mx-auto mb-15 text-center text-text-gray text-base md:text-lg leading-relaxed">
          Reservo pairs cutting-edge machine learning with elite hospitality standards to redefine your holiday experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12.5">
          {FEATURES.map((feature) => (
            <div className="bg-bg-white p-10 md:p-8 rounded-[20px] text-center border border-border-color shadow-custom transition-all duration-400 ease-out cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group" key={feature.id}>
              <div className="w-17.5 h-17.5 mx-auto mb-6 bg-primary text-gold rounded-full flex justify-center items-center transition-all duration-300 ease-out group-hover:bg-gold group-hover:text-white group-hover:rotate-10 group-hover:scale-105">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-3">{feature.title}</h3>
              <p className="text-text-gray leading-relaxed text-sm m-0">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;