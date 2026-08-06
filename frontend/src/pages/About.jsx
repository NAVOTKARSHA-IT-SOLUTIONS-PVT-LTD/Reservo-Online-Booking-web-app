import React from "react";
import aboutImage from "../assets/images/about.jpg";
import { useSEO } from "../hooks/useSEO";

function About() {
  useSEO({
    title: "About Us",
    description: "Discover Reservo's mission to curate premium vacation stays, luxury resorts, and high-end retreats with top-tier AI travel concierge support."
  });
  return (
    <>

      {/* Hero */}
      <section 
        className="py-[100px] md:py-[150px] px-5 text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(20,35,32,0.70), rgba(20,35,32,0.70)), url(${aboutImage})`
        }}
      >
        <div className="w-[90%] max-w-[1300px] mx-auto">
          <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">
            About Reservo
          </span>
          <h1 className="text-[42px] md:text-[64px] font-bold my-6 md:my-[25px] leading-tight text-white">
            Luxury Stays, <br /> Extraordinary Experiences
          </h1>
          <p className="max-w-[760px] mx-auto text-base md:text-xl leading-relaxed md:leading-[1.8] text-white/90">
            Reservo is your trusted luxury resort booking platform,
            helping travelers discover premium destinations across India
            with comfort, elegance, and unforgettable hospitality.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 md:py-[100px] bg-[#FCFAF7]">
        <div className="w-[90%] max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12.5 lg:gap-20 items-center">
          
          <div className="w-full">
            <img
              src={aboutImage}
              alt="Luxury Resort"
              className="w-full rounded-[22px] shadow-[0_25px_60px_rgba(0,0,0,0.15)]"
            />
          </div>

          <div className="text-center lg:text-left">
            <span className="inline-block text-gold font-semibold tracking-widest text-xs mb-3.75">
              WHO WE ARE
            </span>
            <h2 className="text-[36px] md:text-[48px] font-bold text-primary mb-6.25">
              Making Every Journey Truly Memorable
            </h2>
            <p className="text-text-gray leading-relaxed text-[17px] mb-5.5">
              Reservo connects travelers with India's finest luxury resorts,
              boutique stays, villas, and nature retreats. Our carefully
              selected properties ensure comfort, elegance, and exceptional
              experiences.
            </p>
            <p className="text-text-gray leading-relaxed text-[17px] mb-5.5">
              From secure online booking to verified guest reviews and
              dedicated customer support, we simplify every step of your
              vacation planning.
            </p>
            <button className="bg-primary text-white border-none px-[38px] py-4 rounded-full text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#162B27] hover:-translate-y-1">
              Explore Resorts
            </button>
          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-[100px] bg-[#F8F5F0]">
        <div className="w-[90%] max-w-[1300px] mx-auto">
          <span className="block text-center text-xs font-bold uppercase tracking-widest text-gold mb-3">
            Our Purpose
          </span>
          <h2 className="text-[28px] sm:text-[32px] md:text-[38px] xl:text-[46px] font-bold text-center text-primary mb-4.5">
            Built Around Trust & Luxury
          </h2>
          <p className="max-w-[720px] mx-auto mb-15 text-center text-text-gray text-base md:text-lg leading-relaxed">
            Everything we do is focused on creating unforgettable travel
            experiences for every guest.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8.75 mt-15">
            
            <div className="bg-bg-white border border-[#E7DFD4] rounded-2xl px-[30px] py-10 text-center shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-[350ms] ease-out hover:-translate-y-2.5 hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)]">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary text-white flex justify-center items-center text-[34px]">
                🎯
              </div>
              <h3 className="text-3xl font-bold text-primary mb-[18px]">Our Mission</h3>
              <p className="text-text-gray leading-relaxed">
                To simplify luxury resort booking through technology,
                transparency, and exceptional customer service.
              </p>
            </div>

            <div className="bg-bg-white border border-[#E7DFD4] rounded-2xl px-[30px] py-10 text-center shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-[350ms] ease-out hover:-translate-y-2.5 hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)]">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary text-white flex justify-center items-center text-[34px]">
                👁
              </div>
              <h3 className="text-3xl font-bold text-primary mb-[18px]">Our Vision</h3>
              <p className="text-text-gray leading-relaxed">
                To become India's most trusted premium travel platform
                for unforgettable luxury vacations.
              </p>
            </div>

            <div className="bg-bg-white border border-[#E7DFD4] rounded-2xl px-[30px] py-10 text-center shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-[350ms] ease-out hover:-translate-y-2.5 hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)]">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary text-white flex justify-center items-center text-[34px]">
                ❤️
              </div>
              <h3 className="text-3xl font-bold text-primary mb-[18px]">Our Values</h3>
              <p className="text-text-gray leading-relaxed">
                Trust, honesty, quality, customer satisfaction,
                innovation, and premium hospitality.
              </p>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}

export default About;