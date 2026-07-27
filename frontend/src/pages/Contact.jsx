import React from "react";
import contactImage from "../assets/images/contact.jpg";

function Contact() {
  return (
    <>
      {/* Hero */}
      <section 
        className="py-[100px] md:py-[150px] px-5 text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(20,35,32,0.72), rgba(20,35,32,0.72)), url(${contactImage})`
        }}
      >
        <div className="w-[90%] max-w-[1300px] mx-auto">
          <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">
            Contact Reservo
          </span>
          <h1 className="text-[42px] md:text-[64px] font-bold my-6 md:my-[25px] leading-tight text-white">
            We'd Love <br /> To Hear From You
          </h1>
          <p className="max-w-[760px] mx-auto text-base md:text-xl leading-relaxed md:leading-[1.8] text-white/90">
            Whether you're planning your next luxury vacation or need booking
            assistance, our travel experts are always ready to help.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-[100px] bg-[#FCFAF7]">
        <div className="w-[90%] max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12.5 lg:gap-[70px] items-start">

          {/* Left */}
          <div className="text-center lg:text-left">
            <span className="inline-block text-gold font-semibold tracking-widest text-xs mb-3.75">
              GET IN TOUCH
            </span>
            <h2 className="text-[36px] md:text-[46px] font-bold text-primary mb-5">
              Let's Plan Your Next Luxury Escape
            </h2>
            <p className="text-text-gray leading-relaxed mb-7.5">
              Have questions about bookings, resorts, or special offers?
              Our friendly team is available 24/7 to assist you.
            </p>

            <div className="flex items-center gap-[18px] bg-bg-white border border-[#E7DFD4] rounded-2xl p-5.5 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-[350ms] ease-out hover:-translate-y-1.25 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] text-left">
              <div className="w-[60px] h-[60px] bg-primary text-white rounded-full flex justify-center items-center text-[26px] shrink-0">📍</div>
              <div>
                <h4 className="mb-1.5 text-primary text-xl font-bold">Office</h4>
                <p className="m-0 text-text-gray">Pune, Maharashtra, India</p>
              </div>
            </div>

            <div className="flex items-center gap-[18px] bg-bg-white border border-[#E7DFD4] rounded-2xl p-5.5 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-[350ms] ease-out hover:-translate-y-1.25 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] text-left">
              <div className="w-[60px] h-[60px] bg-primary text-white rounded-full flex justify-center items-center text-[26px] shrink-0">📞</div>
              <div>
                <h4 className="mb-1.5 text-primary text-xl font-bold">Phone</h4>
                <p className="m-0 text-text-gray">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-[18px] bg-bg-white border border-[#E7DFD4] rounded-2xl p-5.5 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-[350ms] ease-out hover:-translate-y-1.25 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] text-left">
              <div className="w-[60px] h-[60px] bg-primary text-white rounded-full flex justify-center items-center text-[26px] shrink-0">✉</div>
              <div>
                <h4 className="mb-1.5 text-primary text-xl font-bold">Email</h4>
                <p className="m-0 text-text-gray">support@reservo.com</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-bg-white border border-[#E7DFD4] rounded-[22px] p-6.25 md:p-10 shadow-[0_18px_40px_rgba(0,0,0,0.08)] text-left">
            <h2 className="text-[30px] md:text-[38px] font-bold text-primary mb-7.5">
              Send a Message
            </h2>
            <form className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-[18px] py-4 border border-[#D8D1C8] rounded-xl outline-none text-base bg-[#FAF8F5] transition-all duration-300 focus:border-gold focus:bg-bg-white"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-[18px] py-4 border border-[#D8D1C8] rounded-xl outline-none text-base bg-[#FAF8F5] transition-all duration-300 focus:border-gold focus:bg-bg-white"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-[18px] py-4 border border-[#D8D1C8] rounded-xl outline-none text-base bg-[#FAF8F5] transition-all duration-300 focus:border-gold focus:bg-bg-white"
              />
              <textarea
                rows="6"
                placeholder="Tell us how we can help..."
                className="w-full px-[18px] py-4 border border-[#D8D1C8] rounded-xl outline-none text-base bg-[#FAF8F5] transition-all duration-300 focus:border-gold focus:bg-bg-white resize-none"
              ></textarea>
              <button type="submit" className="bg-primary text-white border-none py-4 rounded-full text-[17px] font-semibold cursor-pointer transition-all duration-[350ms] hover:bg-[#162B27] hover:-translate-y-0.75">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Map */}
      <section className="py-20 md:py-[100px] bg-[#F8F5F0]">
        <div className="w-[90%] max-w-[1300px] mx-auto">
          <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">
            Visit Us
          </span>
          <h2 className="text-[28px] sm:text-[32px] md:text-[38px] xl:text-[46px] font-bold text-center text-primary mb-4.5">
            Our Office Location
          </h2>
          <p className="max-w-[720px] mx-auto mb-15 text-center text-text-gray text-base md:text-lg leading-relaxed">
            Feel free to visit or schedule a meeting with our travel consultants.
          </p>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Pune&output=embed"
            loading="lazy"
            className="w-full h-[350px] md:h-[500px] border-none rounded-[22px] mt-12.5 shadow-[0_20px_45px_rgba(0,0,0,0.12)]"
          ></iframe>
        </div>
      </section>
    </>
  );
}

export default Contact;