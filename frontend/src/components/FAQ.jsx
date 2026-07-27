import React, { useState } from "react";
import "./FAQ.css";

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
    <section className="faq">

      <div className="container">

        <span className="section-tag">
          Help Center
        </span>

        <h2 className="section-title">
          Frequently Asked Questions
        </h2>

        <p className="section-subtitle">
          Everything you need to know before booking your next luxury getaway.
        </p>

        <div className="faq-container">

          {faqData.map((item, index) => (

            <div
              className={`faq-item ${
                activeIndex === index ? "active" : ""
              }`}
              key={index}
            >

              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >

                <h3>{item.question}</h3>

                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>

              </div>

              {activeIndex === index && (

                <div className="faq-answer">

                  <p>{item.answer}</p>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default FAQ;