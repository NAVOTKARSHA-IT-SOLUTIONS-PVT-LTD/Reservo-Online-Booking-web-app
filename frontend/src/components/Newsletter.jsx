import React from "react";

function Newsletter() {
  return (
    <section className="py-20 bg-bg-white transition-colors duration-300">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        <div className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-[28px] py-17.5 px-15 md:py-12.5 md:px-7.5 text-center text-white shadow-[0_25px_60px_rgba(0,0,0,0.15)] relative overflow-hidden border border-border-color">
          
          {/* Decorative Background Circles */}
          <div className="absolute w-[260px] h-[260px] bg-white/3 rounded-full -top-[120px] -right-[80px] pointer-events-none"></div>
          <div className="absolute w-[180px] h-[180px] bg-gold/8 rounded-full -bottom-[70px] -left-[60px] pointer-events-none"></div>

          <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">
            Stay Connected
          </span>

          <h2 className="text-[28px] md:text-3.5xl xl:text-4xl font-bold my-3.75 text-white">
            Unlock Exclusive Luxury Travel Deals
          </h2>

          <p className="max-w-[650px] mx-auto mb-8.5 text-base md:text-[14.5px] leading-relaxed text-white/75">
            Join thousands of travelers and receive exclusive resort offers,
            early access to seasonal discounts, travel inspiration, and premium
            vacation ideas directly in your inbox.
          </p>

          <form className="max-w-[650px] mx-auto flex flex-col md:flex-row gap-3 md:gap-3.75 bg-transparent md:bg-bg-white p-0 md:p-2 rounded-none md:rounded-full shadow-none md:shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 border border-border-color md:border-none outline-none px-5 py-3.5 rounded-full text-[15px] bg-bg-white md:bg-transparent text-text-dark placeholder-text-gray shadow-custom md:shadow-none"
            />
            <button 
              type="submit"
              className="w-full md:w-auto bg-gold text-white px-8.5 py-3.5 border-none rounded-full text-sm font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(197,160,89,0.3)] hover:bg-gold-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(197,160,89,0.4)] shrink-0"
            >
              Subscribe
            </button>
          </form>

          <div className="flex justify-center gap-6 mt-8.5 text-sm text-white/70 flex-wrap">
            <span>✓ Exclusive Discounts</span>
            <span>✓ No Spam</span>
            <span>✓ Weekly Travel Tips</span>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Newsletter;