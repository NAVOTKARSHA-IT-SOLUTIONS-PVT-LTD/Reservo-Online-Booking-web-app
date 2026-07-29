import React from "react";
import { Gift, Award, TrendingUp, CreditCard, Tag, Heart } from "lucide-react";

function RewardCard({ icon, title, description, badge }) {
  return (
    <div className="bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm hover:shadow-custom hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
          {icon}
        </div>
        {badge && (
          <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-text-dark mb-2">{title}</h3>
      <p className="text-sm text-text-gray leading-relaxed mb-4">{description}</p>
      <button className="text-gold font-bold text-sm bg-transparent border-none cursor-pointer hover:underline p-0 m-0">
        Learn More →
      </button>
    </div>
  );
}

export default function Rewards() {
  return (
    <div className="min-h-screen bg-bg-light pt-32 pb-20">
      <div className="max-w-[1200px] mx-auto w-[92%]">
        
        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-16 fade-up">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold font-bold text-sm px-4 py-1.5 rounded-full mb-4 border border-gold/20">
            <Award size={16} /> Reservo Elite
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-dark mb-4">
            Earn Rewards on Every Stay
          </h1>
          <p className="text-lg text-text-gray">
            Join our loyalty program to unlock exclusive discounts, room upgrades, and cashback offers.
          </p>
        </div>

        {/* User Status (Mock) */}
        <div className="bg-primary border border-border-color rounded-[32px] p-8 md:p-12 text-white mb-16 flex flex-col md:flex-row items-center justify-between shadow-[0_20px_50px_rgba(15,23,42,0.15)] relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="z-10 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Welcome back, Tausif!</h2>
            <p className="text-white/70 mb-4">You are currently a <strong className="text-gold">Gold Member</strong></p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[140px]">
                <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Total Points</div>
                <div className="text-3xl font-extrabold font-number text-gold">12,450</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[140px]">
                <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Available Coupons</div>
                <div className="text-3xl font-extrabold font-number">3</div>
              </div>
            </div>
          </div>
          <div className="z-10">
            <button className="bg-gold text-white font-bold py-3.5 px-8 rounded-xl border-none cursor-pointer hover:bg-gold-dark hover:scale-105 transition-all shadow-[0_10px_20px_rgba(212,166,79,0.3)]">
              Redeem Points
            </button>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-8">Ways to Earn & Save</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RewardCard 
              icon={<TrendingUp size={24} />} 
              title="Loyalty Points" 
              description="Earn 10 points for every $1 spent on bookings. Use points to get free nights and room upgrades." 
            />
            <RewardCard 
              icon={<Tag size={24} />} 
              title="Promo Codes" 
              description="Get access to member-only promo codes during seasonal sales and festive periods." 
              badge="New"
            />
            <RewardCard 
              icon={<Heart size={24} />} 
              title="Referral Rewards" 
              description="Invite a friend to Reservo and you both get a $50 coupon when they complete their first stay." 
            />
            <RewardCard 
              icon={<CreditCard size={24} />} 
              title="Cashback Offers" 
              description="Pay with our partner credit cards to instantly receive up to 5% cashback on luxury stays." 
            />
            <RewardCard 
              icon={<Award size={24} />} 
              title="Membership Levels" 
              description="Progress from Silver to Platinum to unlock early check-ins, late check-outs, and dedicated support." 
            />
            <RewardCard 
              icon={<Gift size={24} />} 
              title="Birthday Surprise" 
              description="Travel during your birthday month and receive a complimentary bottle of champagne and spa voucher." 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
