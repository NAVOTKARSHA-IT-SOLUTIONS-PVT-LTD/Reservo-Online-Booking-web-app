import React, { useState } from "react";

const faqData = [
  {
    question: "How do I book a luxury resort?",
    answer:
      "Simply search for your preferred destination, select a resort, choose your check-in and check-out dates, and complete the secure payment process.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes. Booking modifications and cancellations are available according to the cancellation policy of your selected resort.",
  },
  {
    question: "Are my online payments secure?",
    answer:
      "Absolutely. Reservo uses industry-standard encrypted payment gateways to ensure every transaction is completely secure.",
  },
  {
    question: "When will I receive my booking confirmation?",
    answer:
      "Your booking confirmation is sent instantly via email immediately after successful payment.",
  },
  {
    question: "Is customer support available 24/7?",
    answer:
      "Yes. Our dedicated travel experts are available 24 hours a day to assist with bookings, cancellations, and travel queries.",
  },
  {
    question: "Do resorts include complimentary breakfast?",
    answer:
      "Many of our partner resorts offer complimentary breakfast. The inclusions are clearly listed on each resort page.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-bg-light transition-colors duration-300">

      <div className="w-[90%] max-w-[1300px] mx-auto">

        <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-2">
          Help Center
        </span>

        <h2 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-center text-primary mb-2.5">
          Frequently Asked Questions
        </h2>

        <p className="max-w-[720px] mx-auto mb-4 text-center text-text-gray text-[14px] leading-relaxed">
          Everything you need to know before booking your next luxury getaway.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3.5 max-w-[1000px] mx-auto mt-6">

          {faqData.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                className={`bg-bg-white border border-border-color rounded-xl overflow-hidden shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.02)] h-fit ${
                  isActive ? "border-l-4 border-l-gold shadow-md" : ""
                }`}
                key={index}
              >

                <div
                  className="flex justify-between items-center px-5 py-4 cursor-pointer transition-colors duration-300 hover:bg-bg-light gap-3"
                  onClick={() => toggleFAQ(index)}
                >

                  <h3 className="text-[14px] font-bold text-text-dark m-0 leading-snug">{item.question}</h3>

                  <span className={`shrink-0 w-7 h-7 rounded-full flex justify-center items-center text-md font-bold transition-all duration-300 ease-out ${
                    isActive 
                      ? "bg-gold text-white rotate-180" 
                      : "bg-bg-light border border-border-color text-text-gray"
                  }`}>
                    {isActive ? "−" : "+"}
                  </span>

                </div>

                {isActive && (
                  <div className="px-5 pb-4 bg-bg-white animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-text-gray text-[12.5px] leading-relaxed m-0">{item.answer}</p>
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default FAQ;