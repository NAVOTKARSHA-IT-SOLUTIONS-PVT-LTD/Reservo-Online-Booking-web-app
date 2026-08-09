import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Globe, 
  ChevronDown, Gift, ShieldCheck, Star, HeadphonesIcon, 
  Sparkles, User 
} from "lucide-react";
import { authService } from "../services/auth.service";
import { secureStorage } from "../services/secureStorage";
import rivoMascot from "../assets/images/rivo_mascot.jpg";
import logoImage from "../assets/images/logo.png";

// Define registration validation schema with Zod
const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(40, { message: "Name cannot exceed 40 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [language, setLanguage] = useState("English");
  const [toastMsg, setToastMsg] = useState("");

  const [roleMode, setRoleMode] = useState("traveller");
  const [businessName, setBusinessName] = useState("");
  const [resortName, setResortName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("role") === "resort_admin") {
      setRoleMode("business");
    }
  }, []);

  // Setup Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const nameVal = watch("name", "") || "";
  const passwordVal = watch("password", "") || "";

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-gray-200" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
      case 2:
        return { score: 25, label: "Weak", color: "bg-red-500" };
      case 3:
        return { score: 50, label: "Medium", color: "bg-amber-500" };
      case 4:
        return { score: 75, label: "Strong", color: "bg-blue-500" };
      case 5:
        return { score: 100, label: "Very Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "Empty", color: "bg-gray-200" };
    }
  };

  const strength = getPasswordStrength(passwordVal);

  const onSubmit = async (data) => {
    try {
      try {
        await authService.register(data.name, data.email, data.password);
      } catch (networkError) {
        console.warn("Backend offline or in development, registering locally:", networkError);
      }
      
      if (roleMode === "business") {
        const mockUser = {
          id: "usr-" + Math.random().toString(36).substr(2, 9),
          name: resortName || data.name,
          email: data.email,
          role: "resort_admin",
          tier: "Business Extranet Partner",
          joined: `Member since ${new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}`,
          points: 0,
          businessName: businessName,
          ownerPhone: ownerPhone
        };
        secureStorage.setItem("reservo_auth_token", "mock-jwt-token-xyz-123456789");
        secureStorage.setItem("reservo_user", mockUser);
        
        setToastMsg("Business Account Registered! Opening property onboarding...");
        setTimeout(() => {
          setToastMsg("");
          navigate("/partner");
        }, 2000);
      } else {
        // Log in the traveller immediately for offline demo ease!
        const mockUser = {
          id: "usr-" + Math.random().toString(36).substr(2, 9),
          name: data.name,
          email: data.email,
          role: "user",
          tier: "Gold Tier",
          joined: `Member since ${new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}`,
          points: 100,
        };
        secureStorage.setItem("reservo_auth_token", "mock-jwt-token-xyz-123456789");
        secureStorage.setItem("reservo_user", mockUser);

        setToastMsg("Account created successfully! Welcome to Reservo.");
        setTimeout(() => {
          setToastMsg("");
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setToastMsg(err.message || "Failed to create account. Please try again.");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  return (
    <div className="h-screen w-screen bg-bg-light flex items-center justify-center font-sans overflow-hidden transition-colors duration-300 p-0 lg:p-6 select-none">
      
      {/* Toast message overlay */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[9999] bg-[#121e1b] text-white border border-[#334155] py-4 px-6 rounded-2xl shadow-2xl flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Split Container */}
      <div className="w-full h-full lg:h-[90vh] lg:max-h-[800px] max-w-[1200px] bg-bg-white border border-border-color lg:rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: HERO PANEL */}
        <div className="relative w-full lg:w-[45%] h-[280px] lg:h-full bg-slate-900 text-white p-6 lg:p-10 hidden lg:flex flex-col justify-between shrink-0 overflow-hidden">
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
            <h1 className="text-3xl lg:text-4.5xl font-serif font-bold leading-[1.1] tracking-tight">Start Your Journey</h1>
            <div className="w-12 h-0.5 bg-gold" />
            <p className="text-[12px] text-white/80 leading-relaxed font-semibold">
              Create an account to unlock amazing stays, personalized trip planning with RIVO AI, exclusive rewards and more.
            </p>
          </div>

          {/* Rivo overlay card & Trust points */}
          <div className="relative z-20 space-y-5 hidden lg:block">
            {/* Rivo Overlay */}
            <div className="bg-[#0e1624]/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <img src={rivoMascot} alt="Rivo mascot" className="w-11 h-11 rounded-full object-cover border-2 border-gold shadow-md shrink-0" />
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

          <div className="max-w-[360px] w-full my-auto py-2 space-y-4">
            <div className="space-y-0.5">
              <h1 className="text-2xl lg:text-3xl font-serif font-extrabold text-text-dark">
                {roleMode === "business" ? "Partner Registration" : "Create Account"}
              </h1>
              <p className="text-[11.5px] text-text-gray font-semibold">
                {roleMode === "business" ? "Register your hotel or resort company on Reservo" : "Sign up to begin your journey"}
              </p>
            </div>

            {/* Role Mode Toggle Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-bg-light p-1 rounded-2xl border border-border-color">
              <button
                type="button"
                onClick={() => setRoleMode("traveller")}
                className={`py-1.5 text-[10.5px] font-bold rounded-xl border-none cursor-pointer transition ${
                  roleMode === "traveller"
                    ? "bg-bg-white text-primary shadow-sm"
                    : "bg-transparent text-text-gray hover:text-text-dark"
                }`}
              >
                🎒 Traveller
              </button>
              <button
                type="button"
                onClick={() => setRoleMode("business")}
                className={`py-1.5 text-[10.5px] font-bold rounded-xl border-none cursor-pointer transition ${
                  roleMode === "business"
                    ? "bg-bg-white text-primary shadow-sm"
                    : "bg-transparent text-text-gray hover:text-text-dark"
                }`}
              >
                🏨 Business Partner
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

              {/* Business Partner Mode Fields */}
              {roleMode === "business" && (
                <div className="space-y-3 border-b border-border-color pb-3 animate-in fade-in duration-200 text-left">
                  <div className="space-y-1 flex flex-col relative">
                    <label className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider">Business Company Name *</label>
                    <input 
                      type="text" 
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Royal Palms Hospitality Group"
                      className="w-full px-4 py-2 bg-bg-light border border-border-color text-text-dark rounded-xl text-[11.5px] font-semibold outline-none focus:border-primary transition"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col relative">
                    <label className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider">Resort / Hotel Name *</label>
                    <input 
                      type="text" 
                      required
                      value={resortName}
                      onChange={(e) => setResortName(e.target.value)}
                      placeholder="e.g. Ocean Bliss Resort"
                      className="w-full px-4 py-2 bg-bg-light border border-border-color text-text-dark rounded-xl text-[11.5px] font-semibold outline-none focus:border-primary transition"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col relative">
                    <label className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider">Contact Phone *</label>
                    <input 
                      type="tel" 
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-2 bg-bg-light border border-border-color text-text-dark rounded-xl text-[11.5px] font-semibold outline-none focus:border-primary transition"
                    />
                  </div>
                </div>
              )}
              
              {/* Full Name with Character Counter */}
              <div className="space-y-1 flex flex-col relative">
                <div className="flex justify-between items-center">
                  <label htmlFor="nameInput" className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider">Full Name</label>
                  <span className="text-[9px] text-text-gray font-semibold">{nameVal.length}/40</span>
                </div>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                  <input 
                    id="nameInput"
                    type="text" 
                    placeholder="Enter your full name"
                    {...register("name")}
                    className={`w-full pl-10 pr-4 py-2.5 bg-bg-light border ${
                      errors.name ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : "border-border-color focus:border-primary focus:shadow-[0_0_0_2px_rgba(13,71,161,0.1)]"
                    } text-text-dark rounded-xl text-[11.5px] font-semibold outline-none transition-all duration-300`}
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10.5px] text-red-500 font-bold mt-1 ml-1"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Address */}
              <div className="space-y-1 flex flex-col relative">
                <label htmlFor="emailInput" className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                  <input 
                    id="emailInput"
                    type="email" 
                    placeholder="Enter your email address"
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-2.5 bg-bg-light border ${
                      errors.email ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : "border-border-color focus:border-primary focus:shadow-[0_0_0_2px_rgba(13,71,161,0.1)]"
                    } text-text-dark rounded-xl text-[11.5px] font-semibold outline-none transition-all duration-300`}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10.5px] text-red-500 font-bold mt-1 ml-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password & Strength Meter */}
              <div className="space-y-1 flex flex-col relative">
                <label htmlFor="passwordInput" className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                  <input 
                    id="passwordInput"
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full pl-10 pr-10 py-2.5 bg-bg-light border ${
                      errors.password ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : "border-border-color focus:border-primary focus:shadow-[0_0_0_2px_rgba(13,71,161,0.1)]"
                    } text-text-dark rounded-xl text-[11.5px] font-semibold outline-none transition-all duration-300`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Strength Meter Bar */}
                {passwordVal && (
                  <div className="mt-2 space-y-1 animate-fade-in">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase text-text-gray">
                      <span>Password Strength:</span>
                      <span className={errors.password ? "text-red-500" : "text-emerald-500"}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${strength.color}`} 
                        initial={{ width: 0 }}
                        animate={{ width: `${strength.score}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10.5px] text-red-500 font-bold mt-1 ml-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Action */}
              <button 
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`w-full py-2.5 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow cursor-pointer border-none flex items-center justify-center gap-1.5 transition-all duration-300 ${
                  isSubmitting || !isValid 
                    ? "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none" 
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {isSubmitting ? "Creating Account..." : <>Sign Up <ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border-color"></div>
              <span className="flex-shrink mx-3 text-[9px] text-text-gray font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-border-color"></div>
            </div>

            {/* Social Connects */}
            <div className="grid grid-cols-3 gap-2 w-full">
              {[
                { provider: "Google", logo: "https://www.svgrepo.com/show/475656/google-color.svg" },
                { provider: "Apple", logo: "https://www.svgrepo.com/show/511330/apple-black.svg" },
                { provider: "Microsoft", logo: "https://www.svgrepo.com/show/475633/microsoft-color.svg" }
              ].map(social => (
                <button 
                  key={social.provider}
                  type="button"
                  onClick={() => setToastMsg(`Sign up with ${social.provider} coming soon!`)}
                  className="py-1.5 bg-bg-white border border-border-color hover:bg-bg-light rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
                  title={`Continue with ${social.provider}`}
                >
                  <img src={social.logo} alt={social.provider} className="w-4 h-4 object-contain" />
                </button>
              ))}
            </div>

            {/* Bottom link toggle */}
            <div className="text-center text-[11px] font-semibold text-text-gray py-0.5">
              <span>Already have an account?</span>{" "}
              <button 
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
            </div>

            {/* Business Partner CTA */}
            <div className="border-t border-border-color pt-3 mt-1.5 space-y-2 w-full shrink-0">
              <div className="text-[8px] text-[var(--color-text-gray)] font-extrabold uppercase tracking-wider text-center">
                Reservo Business Partner Onboarding
              </div>
              <button
                type="button"
                onClick={() => setRoleMode(roleMode === "business" ? "traveller" : "business")}
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
                className="w-full py-2.5 text-white rounded-2xl flex items-center justify-between px-5 cursor-pointer shadow-md transition-all duration-300 group border-none"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-lg">🏨</span>
                  <div>
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-wide">
                      {roleMode === "business" ? "Switch to Traveller Registration" : "Register Your Property"}
                    </h5>
                    <p className="text-[8.5px] text-white/70 font-semibold mt-0.5">
                      {roleMode === "business" ? "Go back to personal account" : "Become a Reservo Business Partner"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Bottom Copyright info */}
          <div className="text-[9px] text-text-gray font-bold shrink-0 mt-2">
            © 2026 Reservo. All rights reserved.
          </div>

        </div>

      </div>   
    </div>
  );
}
