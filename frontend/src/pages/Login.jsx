import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Globe,
  ChevronDown,
  HeadphonesIcon,
  Star
} from "lucide-react";
import { authService } from "../services/auth.service";
import { oauth2Service } from "../services/oauth2.service";
import logoImage from "../assets/images/logo.png";
import hero1 from "../assets/images/hero1.jpg";

// Define validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [language, setLanguage] = useState("English");
  const [toastMsg, setToastMsg] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtpVerified, setResetOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const [roleMode, setRoleMode] = useState("traveller");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("role");
    if (r === "resort_admin" || r === "host") {
      setRoleMode("business");
    }
  }, []);

  // Setup React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange" // Live Validation
  });

  const onSubmit = async (data) => {
    try {
      const result = await authService.login(data.email, data.password);
      const finalRole = result.role;

      setToastMsg("Signed in successfully! Redirecting...");
      setTimeout(() => {
        setToastMsg("");
        if (finalRole === "ROLE_ADMIN") {
          navigate("/admin/reservo", { replace: true });
        } else if (finalRole === "ROLE_OWNER") {
          // Redirect resort managers straight to their administrative Extranet PMS!
          navigate("/admin/resort", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 1500);
    } catch (err) {
      setToastMsg(err.message || "Failed to sign in. Please check your credentials.");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  const requestPasswordReset = async () => {
    const email = resetEmail.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setToastMsg("Enter your email address first.");
      return;
    }
    try {
      setIsResetting(true);
      const message = await authService.requestPasswordReset(email);
      setResetOtpSent(true);
      setResetOtp("");
      setResetOtpVerified(false);
      setToastMsg(message);
    } catch (err) {
      setToastMsg(err.message || "Could not request a password reset.");
    } finally {
      setIsResetting(false);
    }
  };

  const verifyResetOtp = async () => {
    const email = resetEmail.trim();
    if (resetOtp.length !== 6) {
      setToastMsg("Enter the 6-digit code from your email.");
      return;
    }
    try {
      setIsResetting(true);
      await authService.verifyOtp(email, resetOtp);
      setResetOtpVerified(true);
      setToastMsg("Code verified. Enter your new password.");
    } catch (err) {
      setResetOtpVerified(false);
      setToastMsg(err.message || "Verification code is invalid.");
    } finally {
      setIsResetting(false);
    }
  };

  const confirmPasswordReset = async () => {
    const email = resetEmail.trim();
    if (!resetOtpVerified) {
      setToastMsg("Verify the email code first.");
      return;
    }
    if (newPassword.length < 6) {
      setToastMsg("Your new password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setToastMsg("New password and confirmation do not match.");
      return;
    }
    try {
      setIsResetting(true);
      const message = await authService.resetPassword(email, resetOtp, newPassword);
      setShowReset(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setResetOtp("");
      setResetOtpVerified(false);
      setResetOtpSent(false);
      setToastMsg(message);
    } catch (err) {
      setToastMsg(err.message || "Could not reset your password.");
    } finally {
      setIsResetting(false);
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
              src={hero1} 
              alt="Luxury Pool Beachfront Resort" 
              className="w-full h-full object-cover filter brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/70 z-10" />
          </div>

          {/* Logo & Tagline */}
          <div className="relative z-20 flex items-center gap-2.5">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
              <img src={logoImage} alt="Logo" className="w-9 h-9 object-contain" />
            </div>
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
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-white/10">
                <img src={logoImage} alt="Logo" className="w-9 h-9 object-contain" />
              </div>
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
                {["English", "Hindi"].map(lang => (
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
          <div className="max-w-[360px] w-full my-auto py-2 space-y-4">
            <div className="space-y-0.5">
              <h1 className="text-2xl lg:text-3xl font-serif font-extrabold text-text-dark">
                {roleMode === "business" ? "Host Portal Sign In" : "Welcome Back"}
              </h1>
              <p className="text-[11.5px] text-text-gray font-semibold">
                {roleMode === "business" ? "Access your Reservo host account extranet" : "Sign in to continue your journey"}
              </p>
            </div>



            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Email Address with Floating Label Effect */}
              <div className="space-y-1 flex flex-col relative">
                <label htmlFor="emailInput" className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider block w-full text-left">Email Address</label>
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

              {/* Password */}
              <div className="space-y-1 flex flex-col relative">
                <label htmlFor="passwordInput" className="text-[9.5px] font-bold text-text-gray uppercase tracking-wider block w-full text-left">Password</label>
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

              <div className="text-right">
                <button 
                  type="button"
                  onClick={() => {
                    setShowReset(true);
                    setResetEmail(getValues("email") || "");
                    setResetOtpSent(false);
                    setResetOtpVerified(false);
                    setResetOtp("");
                  }}
                  className="text-[10px] font-bold text-primary hover:underline bg-transparent border-none cursor-pointer"
                >
                  {isResetting ? "Please wait..." : "Forgot Password?"}
                </button>
              </div>

              {showReset && (
                <div className="space-y-2 rounded-xl border border-border-color bg-bg-light p-3">
                  <p className="text-[10px] font-bold text-text-dark">Reset password with email code</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(event) => {
                        setResetEmail(event.target.value);
                        setResetOtpSent(false);
                        setResetOtpVerified(false);
                      }}
                      placeholder="Email address"
                      className="min-w-0 flex-1 rounded-lg border border-border-color bg-bg-white px-3 py-2 text-[11px] font-semibold outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={requestPasswordReset}
                      disabled={isResetting}
                      className="rounded-lg border-none bg-primary px-3 py-1.5 text-[9px] font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isResetting ? "Sending..." : resetOtpSent ? "Resend" : "Send code"}
                    </button>
                  </div>
                  {resetOtpSent && <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={resetOtp}
                      onChange={(event) => {
                        setResetOtp(event.target.value.replace(/\D/g, ""));
                        setResetOtpVerified(false);
                      }}
                      placeholder="6-digit OTP"
                      className="min-w-0 flex-1 rounded-lg border border-border-color bg-bg-white px-3 py-2 text-[11px] font-semibold outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={verifyResetOtp}
                      disabled={isResetting || resetOtp.length !== 6}
                      className="rounded-lg border border-primary bg-bg-white px-3 py-1.5 text-[9px] font-bold text-primary disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                    >
                      {resetOtpVerified ? "Verified" : "Verify"}
                    </button>
                  </div>
                  {resetOtpVerified && (
                    <>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="New password (6+ characters)"
                        className="w-full rounded-lg border border-border-color bg-bg-white px-3 py-2 text-[11px] font-semibold outline-none focus:border-primary"
                      />
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(event) => setConfirmNewPassword(event.target.value)}
                        placeholder="Confirm new password"
                        className="w-full rounded-lg border border-border-color bg-bg-white px-3 py-2 text-[11px] font-semibold outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={confirmPasswordReset}
                        disabled={isResetting}
                        className="w-full rounded-lg border-none bg-primary px-3 py-2 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {isResetting ? "Resetting..." : "Set New Password"}
                      </button>
                    </>
                  )}
                  </>}
                </div>
              )}

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
                {isSubmitting ? "Authenticating..." : <>Sign In <ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border-color"></div>
              <span className="flex-shrink mx-3 text-[9px] text-text-gray font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-border-color"></div>
            </div>

            {/* Social Connects */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <button 
                type="button"
                onClick={() => oauth2Service.initiateOAuth2Login("google").catch(err => setToastMsg(err.message))}
                className="py-1.5 bg-bg-white border border-border-color hover:bg-bg-light rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
                title="Continue with Google"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </button>
              <button 
                type="button"
                onClick={() => oauth2Service.initiateOAuth2Login("apple").catch(err => setToastMsg(err.message))}
                className="py-1.5 bg-bg-white border border-border-color hover:bg-bg-light rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
                title="Continue with Apple"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-text-dark" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94.1.08.2.12.3.12.87 0 1.95-.57 2.51-1.45z"/>
                </svg>
              </button>
              <button 
                type="button"
                onClick={() => oauth2Service.initiateOAuth2Login("microsoft").catch(err => setToastMsg(err.message))}
                className="py-1.5 bg-bg-white border border-border-color hover:bg-bg-light rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
                title="Continue with Microsoft"
              >
                <svg viewBox="0 0 23 23" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#7fba00" d="M12 1h10v10H12z"/>
                  <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                  <path fill="#ffb900" d="M12 12h10v10H12z"/>
                </svg>
              </button>
            </div>

            {/* Bottom link toggle */}
            <div className="text-center text-[11px] font-semibold text-text-gray py-0.5">
              <span>Don't have an account?</span>{" "}
              <button 
                type="button"
                onClick={() => navigate("/register")}
                className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign Up
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
