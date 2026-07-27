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
    <section className="py-20 bg-bg-light transition-colors duration-300">

      <div className="w-[90%] max-w-[1300px] mx-auto">

        <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">
          Help Center
        </span>

        <h2 className="text-[28px] sm:text-[32px] md:text-[38px] xl:text-[46px] font-bold text-center text-primary mb-4.5">
          Frequently Asked Questions
        </h2>

        <p className="max-w-[720px] mx-auto mb-15 text-center text-text-gray text-base md:text-lg leading-relaxed">
          Everything you need to know before booking your next luxury getaway.
        </p>

        <div className="max-w-[800px] mx-auto mt-12.5">

          {faqData.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                className={`bg-bg-white border border-border-color rounded-2xl mb-4.5 overflow-hidden shadow-custom transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)] ${
                  isActive ? "border-l-4 border-l-gold" : ""
                }`}
                key={index}
              >

                <div
                  className="flex justify-between items-center px-7.5 py-5.5 md:px-5 md:py-4.5 cursor-pointer transition-colors duration-300 hover:bg-bg-light"
                  onClick={() => toggleFAQ(index)}
                >

                  <h3 className="text-xl font-bold text-text-dark m-0 md:text-[17px]">{item.question}</h3>

                  <span className={`w-9 h-9 rounded-full flex justify-center items-center text-xl font-bold transition-all duration-300 ease-out ${
                    isActive 
                      ? "bg-gold text-white rotate-180" 
                      : "bg-primary text-bg-white"
                  }`}>
                    {isActive ? "−" : "+"}
                  </span>

                </div>

                {isActive && (
                  <div className="px-7.5 pb-5.5 md:px-5 md:pb-4.5 bg-bg-white">
                    <p className="text-text-gray text-[14.5px] leading-relaxed m-0">{item.answer}</p>
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