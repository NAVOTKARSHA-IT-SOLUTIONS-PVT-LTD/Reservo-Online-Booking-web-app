import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Globe, 
  ChevronDown, Gift, ShieldCheck, Star, HeadphonesIcon, 
  Sparkles 
} from "lucide-react";
import rivoMascot from "../assets/images/rivo_mascot.jpg";
import logoImage from "../assets/images/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [language, setLanguage] = useState("English");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastMsg("Signed in successfully! Redirecting...");
    setTimeout(() => {
      setToastMsg("");
      navigate("/dashboard"); // Route to dashboard
    }, 2000);
  };

  return (
    <div className="h-screen w-screen bg-bg-light flex items-center justify-center font-sans overflow-hidden transition-colors duration-300 p-0 lg:p-6 select-none">
      
      {/* Toast message overlay */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[9999] bg-[#121e1b] text-white border border-[#334155] py-4 px-6 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-5 duration-300">
          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Main Split Container */}
      <div className="w-full h-full lg:h-[90vh] lg:max-h-[800px] max-w-[1200px] bg-bg-white border border-border-color lg:rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: HERO PANEL */}
        <div className="relative w-full lg:w-[45%] h-[280px] lg:h-full bg-slate-900 text-white p-6 lg:p-10 flex flex-col justify-between shrink-0 overflow-hidden">
          {/* Background Image overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80" 
              alt="Luxury Pool Beachfront Resort" 
              className="w-full h-full object-cover filter brightness-[0.8]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/75 z-10" />
          </div>

          {/* Logo & Tagline */}
          <div className="relative z-20 flex items-center gap-2.5">
            <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain" />
            <div>
              <h2 className="text-lg font-bold tracking-[0.5px] font-serif leading-none">Reservo</h2>
              <span className="text-[7px] text-white/60 tracking-[2px] font-bold uppercase mt-1 block">Connect • Book • Relax • Revisit</span>
            </div>
          </div>

          {/* Hero text descriptor */}
          <div className="relative z-20 space-y-3 max-w-[380px] hidden lg:block">
            <h1 className="text-3xl lg:text-4.5xl font-serif font-bold leading-[1.1] tracking-tight">Your Journey Begins Here</h1>
            <div className="w-12 h-0.5 bg-gold" />
            <p className="text-[12px] text-white/80 leading-relaxed font-semibold">
              Sign in to unlock amazing stays, personalized trip planning with RIVO AI, exclusive rewards and more.
            </p>
          </div>

          {/* Rivo overlay card & Trust points */}
          <div className="relative z-20 space-y-5 hidden lg:block">
            {/* Rivo Overlay */}
            <div className="bg-[#0e1624]/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <img src={rivoMascot} alt="Rivo mascot" className="w-11 h-11 rounded-full object-cover border-2 border-gold shadow-md shrink-0 animate-pulse" />
              <div>
                <h4 className="text-[12px] font-bold text-white">Hi, I'm RIVO 👋</h4>
                <p className="text-[9.5px] text-[#94A3B8] leading-normal mt-0.5">Your AI Travel Buddy. I'll help you plan the perfect trip just for you!</p>
              </div>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-2 text-center border-t border-white/10 pt-4 text-[9px] text-white/80 font-medium">
              <div className="space-y-1">
                <ShieldCheck className="w-3.5 h-3.5 mx-auto text-gold" />
                <strong className="block text-white">Secure & Safe</strong>
                <span className="text-white/50 block text-[7.5px] leading-tight">Data protected by top security</span>
              </div>
              <div className="space-y-1 border-x border-white/10">
                <HeadphonesIcon className="w-3.5 h-3.5 mx-auto text-gold" />
                <strong className="block text-white">24/7 Support</strong>
                <span className="text-white/50 block text-[7.5px] leading-tight">We are here for you anytime</span>
              </div>
              <div className="space-y-1">
                <Star className="w-3.5 h-3.5 mx-auto text-gold fill-current" />
                <strong className="block text-white">Best Price</strong>
                <span className="text-white/50 block text-[7.5px] leading-tight">Get the best deals or match</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INPUT FORM */}
        <div className="w-full lg:flex-1 h-0 lg:h-full flex-grow bg-bg-white p-6 lg:p-10 flex flex-col justify-between items-center relative overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {/* Top Actions: Language Selector */}
          <div className="self-end relative shrink-0">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border-color rounded-full bg-bg-white text-text-dark text-[10px] font-bold cursor-pointer hover:border-primary transition"
            >
              <Globe className="w-3 h-3 text-text-gray" />
              <span>{language}</span>
              <ChevronDown className="w-2.5 h-2.5 text-text-gray" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-9 bg-bg-white border border-border-color rounded-xl shadow-lg p-1 w-26 z-50 text-[10px] font-semibold text-text-dark animate-fade-in">
                {["English", "Hindi", "Spanish"].map(lang => (
                  <button 
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-bg-light bg-transparent border-none cursor-pointer text-text-dark"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form wrapper */}
          <div className="max-w-[360px] w-full my-auto py-4 space-y-5">
            <div className="space-y-0.5">
              <h1 className="text-2xl lg:text-3xl font-serif font-extrabold text-text-dark">Welcome Back</h1>
              <p className="text-[11.5px] text-text-gray font-semibold">Sign in to continue your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1 flex flex-col">
                <label className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-bg-light border border-border-color text-text-dark rounded-xl text-[11.5px] font-semibold outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-bg-light border border-border-color text-text-dark rounded-xl text-[11.5px] font-semibold outline-none focus:border-primary transition"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button 
                  type="button"
                  onClick={() => setToastMsg("Password reset request sent to your inbox.")}
                  className="text-[10px] font-bold text-primary hover:underline bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Action */}
              <button 
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow cursor-pointer border-none flex items-center justify-center gap-1.5"
              >
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="relative flex py-1.5 items-center">
              <div className="flex-grow border-t border-border-color"></div>
              <span className="flex-shrink mx-3 text-[9px] text-text-gray font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-border-color"></div>
            </div>

            {/* Social Connects */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { provider: "Google", logo: "https://www.svgrepo.com/show/475656/google-color.svg" },
                { provider: "Apple", logo: "https://www.svgrepo.com/show/511330/apple-black.svg" },
                { provider: "Facebook", logo: "https://www.svgrepo.com/show/475647/facebook-color.svg" }
              ].map(social => (
                <button 
                  key={social.provider}
                  type="button"
                  onClick={() => setToastMsg(`Sign in with ${social.provider} coming soon!`)}
                  className="w-full py-2 bg-bg-white border border-border-color hover:bg-bg-light text-text-dark rounded-xl text-[10.5px] font-extrabold flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <img src={social.logo} alt={social.provider} className="w-3.5 h-3.5 object-contain" />
                  <span>Continue with {social.provider}</span>
                </button>
              ))}
            </div>

            {/* Bottom link toggle */}
            <div className="text-center text-[11px] font-semibold text-text-gray">
              <span>Don't have an account?</span>{" "}
              <button 
                type="button"
                onClick={() => navigate("/register")}
                className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign Up
              </button>
            </div>

            {/* Premium promo box */}
            <div 
              onClick={() => navigate("/register")}
              className="bg-primary/5 hover:bg-primary/10 border border-primary/10 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition shrink-0"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8.5 h-8.5 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Gift className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-text-dark">New here?</h4>
                  <p className="text-[9.5px] text-text-gray font-semibold mt-0.5">Sign up and get exciting offers on first booking!</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
            </div>

          </div>

          {/* Bottom Copyright info */}
          <div className="text-[9px] text-text-gray font-bold shrink-0 mt-4">
            © 2026 Reservo. All rights reserved.
          </div>

        </div>

      </div>   
    </div>
  );
}
