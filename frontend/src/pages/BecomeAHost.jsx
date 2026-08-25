import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building2, Sparkles, MapPin, Shield, 
  ArrowRight, ArrowLeft, Check, Camera, 
  Users, Bed, Bath, Plus, Minus, ChevronDown, Award, Zap, HeartHandshake, 
  ShieldCheck, Coffee, Wifi, Tv, Wind, 
  Waves, Mountain, Compass
} from "lucide-react";
import { hostService } from "../services/host.service";
import { authService } from "../services/auth.service";
import { resortService } from "../services/resort.service";
import { secureStorage } from "../services/secureStorage";
import { useToast } from "../context/ToastContext";

const DESTINATIONS = [
  { name: "Goa (North & South)", multiplier: 1.35, baseRate: 22000 },
  { name: "Manali & Himachal", multiplier: 1.15, baseRate: 16500 },
  { name: "Udaipur & Rajasthan", multiplier: 1.45, baseRate: 28000 },
  { name: "Kerala Backwaters", multiplier: 1.25, baseRate: 18500 },
  { name: "Coorg & Nilgiris", multiplier: 1.1, baseRate: 15000 },
  { name: "Bali & Southeast Asia", multiplier: 1.4, baseRate: 25000 },
  { name: "Maldives & Andaman", multiplier: 1.8, baseRate: 38000 }
];

const PROPERTY_CATEGORIES = [
  { id: "Villa", name: "Luxury Villa", icon: "🏰", desc: "Standalone estate with private grounds and premium amenities" },
  { id: "Chalet", name: "Alpine Chalet", icon: "🏔️", desc: "Cozy timber or stone lodge in mountainous retreats" },
  { id: "Heritage Haven", name: "Heritage Haveli", icon: "🕌", desc: "Historic palatial residence or royal courtyard home" },
  { id: "Beachfront", name: "Oceanfront Haven", icon: "🏖️", desc: "Direct beachfront access with panoramic coastal views" },
  { id: "Boutique Resort", name: "Boutique Resort", icon: "🌴", desc: "Curated resort suites with bespoke hospitality services" },
  { id: "Treehouse", name: "Eco Canopy Treehouse", icon: "🌿", desc: "Elevated nature immersion with architectural elegance" }
];

const AMENITY_OPTIONS = [
  { id: "pool", label: "Private Infinity Pool", icon: Waves, category: "Luxury" },
  { id: "wifi", label: "High-Speed WiFi (300Mbps+)", icon: Wifi, category: "Essentials" },
  { id: "chef", label: "Private Chef on Demand", icon: Coffee, category: "Luxury" },
  { id: "ocean_view", label: "Panoramic Ocean / Lake View", icon: Compass, category: "Views" },
  { id: "mountain_view", label: "Snow Peak / Mountain View", icon: Mountain, category: "Views" },
  { id: "jacuzzi", label: "Private Jacuzzi / Hot Tub", icon: Waves, category: "Luxury" },
  { id: "fireplace", label: "Stone Fireplace & Fire Pit", icon: Sparkles, category: "Cozy" },
  { id: "workspace", label: "Dedicated Executive Workspace", icon: Tv, category: "Essentials" },
  { id: "ev_charger", label: "EV Vehicle Charging Station", icon: Zap, category: "Facilities" },
  { id: "air_con", label: "Central Climate Control", icon: Wind, category: "Essentials" },
  { id: "butler", label: "24/7 Dedicated Butler Service", icon: Award, category: "Luxury" },
  { id: "pet_friendly", label: "Pet Friendly Grounds", icon: HeartHandshake, category: "Policies" }
];

export default function BecomeAHost() {
  const navigate = useNavigate();
  const toast = useToast();

  const [mode, setMode] = useState("landing"); // 'landing' or 'wizard'
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  // Earnings Estimator States
  const [estLocation, setEstLocation] = useState(DESTINATIONS[0].name);
  const [estType, setEstType] = useState("Villa");
  const [estBedrooms, setEstBedrooms] = useState(3);
  const [estOccupancy, setEstOccupancy] = useState(70); // %

  // Calculator logic
  const selectedDestObj = DESTINATIONS.find(d => d.name === estLocation) || DESTINATIONS[0];
  const typeMultiplier = estType === "Villa" ? 1.3 : estType === "Heritage Haven" ? 1.5 : estType === "Beachfront" ? 1.4 : 1.1;
  const estimatedNightlyRate = Math.round(selectedDestObj.baseRate * typeMultiplier * (1 + (estBedrooms - 1) * 0.22));
  const estimatedMonthlyBookedNights = Math.round((30 * estOccupancy) / 100);
  const estimatedMonthlyEarnings = estimatedNightlyRate * estimatedMonthlyBookedNights;
  const estimatedAnnualEarnings = estimatedMonthlyEarnings * 12;

  // Wizard Form Data State
  const [formData, setFormData] = useState({
    title: "",
    category: "Villa",
    location: {
      address: "",
      city: "Goa",
      state: "Goa",
      country: "India",
      pinCode: "",
      landmark: ""
    },
    pricePerNight: estimatedNightlyRate,
    instantBook: true,
    specs: {
      guests: 6,
      bedrooms: 3,
      beds: 3,
      bathrooms: 3,
      sqft: 2500
    },
    amenities: ["Private Infinity Pool", "High-Speed WiFi (300Mbps+)", "Central Climate Control"],
    coverImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    videos: [
      "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-swimming-pool-42244-large.mp4"
    ],
    description: "",
    cleaningFee: 2000,
    weekendSurgePercent: 15,
    discounts: { weekly: 10, monthly: 20 },
    cancellationPolicy: "Flexible",
    minNights: 2,
    maxNights: 30,
    // KYC
    hostName: "",
    hostEmail: "",
    hostPhone: "",
    payoutType: "bank",
    bankAccount: "",
    upiId: "",
    govIdNumber: ""
  });

  const [aiGenerating, setAiGenerating] = useState(false);

  // AI Description Generator Simulation
  const handleGenerateAiCopy = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const generatedTitle = `The Royal ${formData.category} Sanctuary at ${formData.location.city || "Scenic Coast"}`;
      const generatedDesc = `Escape to this ultra-exclusive ${formData.category.toLowerCase()} nestled in prime ${formData.location.city || "prime sanctuary"}. Featuring ${formData.specs.bedrooms} lavish master suites, ${formData.specs.bathrooms} marble bathrooms, and breathtaking views, this retreat combines bespoke artisan elegance with modern comforts like ${formData.amenities.slice(0, 3).join(", ")}. Enjoy curated dining, complete privacy, and unparalleled luxury.`;
      setFormData(prev => ({
        ...prev,
        title: generatedTitle,
        description: generatedDesc
      }));
      setAiGenerating(false);
      toast("AI generated a luxury listing title and description!", "success");
    }, 800);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.category) {
      toast("Please select a property category", "error");
      return;
    }
    if (currentStep === 2 && (!formData.location.address || !formData.location.city)) {
      toast("Please provide the property address and city", "error");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePublishListing = async () => {
    try {
      const finalTitle = formData.title || `Bespoke ${formData.category} in ${formData.location.city}`;
      const newListing = {
        ...formData,
        title: finalTitle,
        description: formData.description || `Exquisite luxury ${formData.category.toLowerCase()} designed for unforgettable stays.`
      };

      const resortData = {
        name: finalTitle,
        location: `${formData.location.city}, ${formData.location.state}, ${formData.location.country}`,
        description: formData.description || `Exquisite luxury ${formData.category.toLowerCase()} designed for unforgettable stays.`,
        imageUrl: formData.coverImage || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
        pricePerNight: formData.pricePerNight,
        status: "PENDING_APPROVAL",
        rating: 5.0,
        reviewCount: 0
      };

      try {
        await resortService.createResort(resortData);
      } catch (apiErr) {
        console.warn("API failed, using local storage fallback", apiErr);
      }

      hostService.addListing(newListing);

      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.role !== "ROLE_ADMIN") {
        currentUser.role = "ROLE_HOST";
        secureStorage.setItem("reservo_user", currentUser);
      }

      toast("Congratulations! Your listing has been submitted for Admin approval.", "success");
      navigate("/host/dashboard");
    } catch (err) {
      toast("Failed to publish listing: " + err.message, "error");
    }
  };

  const toggleAmenity = (label) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(label);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== label)
          : [...prev.amenities, label]
      };
    });
  };

  const handleAddSamplePhoto = (url) => {
    if (formData.images.length >= 10) {
      toast("Security limit reached: Maximum 10 photos allowed.", "warning");
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    toast("Image added to gallery", "info");
  };

  const handleAddSampleVideo = (url) => {
    const currentVideos = formData.videos || [];
    if (currentVideos.length >= 2) {
      toast("Security limit reached: Maximum 2 videos allowed.", "warning");
      return;
    }
    setFormData(prev => ({
      ...prev,
      videos: [...currentVideos, url]
    }));
    toast("Video added to gallery", "info");
  };

  return (
    <div className="w-full font-sans transition-colors duration-300 pb-16">
      
      {/* Sub-Header Host Control Bar */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Building2 size={16} />
            </span>
            <div>
              <div className="text-xs font-extrabold text-[var(--color-text-dark)] flex items-center gap-2">
                Reservo Host Hub
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                  Verified Partner
                </span>
              </div>
              <div className="text-[11px] text-[var(--color-text-gray)]">
                {mode === "wizard" ? `Property Creation Wizard (Step ${currentStep} of ${totalSteps})` : "Host your luxury property with $1M coverage"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {mode === "wizard" ? (
              <button 
                onClick={() => setMode("landing")} 
                className="text-xs font-bold text-[var(--color-text-gray)] hover:text-red-500 bg-transparent border border-[var(--color-border-color)] px-3.5 py-2 rounded-xl cursor-pointer transition-all"
              >
                Save & Exit to Overview
              </button>
            ) : (
              <button 
                onClick={() => { setMode("wizard"); setCurrentStep(1); }} 
                className="text-xs font-bold bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer border-none flex items-center gap-1.5"
              >
                <Plus size={14} /> + Create New Listing
              </button>
            )}
          </div>
        </div>

        {/* Wizard Progress Line */}
        {mode === "wizard" && (
          <div className="w-full bg-[var(--color-border-color)] h-1.5 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* LANDING VIEW */}
      {mode === "landing" && (
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-8 md:p-12 shadow-2xl border border-slate-700/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                <Sparkles size={14} /> Luxury Hosting with Reservo
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold font-serif tracking-tight leading-tight">
                Turn your sanctuary into a high-yield luxury stay.
              </h1>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                Host your villa, boutique chalet, or heritage haven with complete peace of mind. Benefit from verified ultra-high-net-worth guests, $1M damage protection, and automated payouts.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={() => { setMode("wizard"); setCurrentStep(1); }}
                  className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer border-none"
                >
                  Start Setup Wizard <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Earnings Estimator */}
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 md:p-10 shadow-xl space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Earnings Simulator</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-[var(--color-text-dark)]">
                Estimate your hosting revenue
              </h2>
              <p className="text-xs text-[var(--color-text-gray)]">
                Calculated in real-time from high-season luxury travel booking demand.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Controls Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-2">
                    Select Destination
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DESTINATIONS.map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => setEstLocation(dest.name)}
                        className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          estLocation === dest.name
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-[var(--color-bg-light)] text-[var(--color-text-dark)] border-[var(--color-border-color)] hover:border-primary/50"
                        }`}
                      >
                        {dest.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-2">
                      Property Category
                    </label>
                    <select
                      value={estType}
                      onChange={(e) => setEstType(e.target.value)}
                      className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3 rounded-2xl text-xs font-bold outline-none focus:border-primary"
                    >
                      {PROPERTY_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)]">
                        Bedrooms
                      </label>
                      <span className="text-xs font-bold text-primary">{estBedrooms} Bedrooms</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="8" 
                      value={estBedrooms} 
                      onChange={(e) => setEstBedrooms(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)]">
                      Monthly Occupancy Rate
                    </label>
                    <span className="text-xs font-bold text-emerald-600">{estOccupancy}% (~{estimatedMonthlyBookedNights} nights/mo)</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="95" 
                    step="5"
                    value={estOccupancy} 
                    onChange={(e) => setEstOccupancy(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Live Calculator Result Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-[28px] p-8 shadow-2xl space-y-6 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Estimated Host Earnings</span>
                  <div className="text-4xl md:text-5xl font-black font-serif tracking-tight">
                    ₹{estimatedMonthlyEarnings.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-blue-200 font-semibold">
                    per month (${Math.round(estimatedMonthlyEarnings * 0.012).toLocaleString()} USD)
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4 space-y-2.5 text-xs text-blue-100">
                  <div className="flex justify-between">
                    <span>Estimated Nightly Rate:</span>
                    <span className="font-bold text-white">₹{estimatedNightlyRate.toLocaleString("en-IN")} / night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projected Annual Income:</span>
                    <span className="font-bold text-amber-300">₹{estimatedAnnualEarnings.toLocaleString("en-IN")} / year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reservo Service Fee:</span>
                    <span className="font-bold text-emerald-300">Flat 3% (Lowest in Industry)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      category: estType,
                      pricePerNight: estimatedNightlyRate,
                      specs: { ...prev.specs, bedrooms: estBedrooms }
                    }));
                    setMode("wizard");
                    setCurrentStep(1);
                  }}
                  className="w-full py-3.5 bg-white text-primary hover:bg-blue-50 font-extrabold text-xs rounded-2xl shadow transition-all cursor-pointer border-none text-center"
                >
                  List with this Estimate
                </button>
              </div>
            </div>
          </div>

          {/* Pillars of Trust */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-3xl space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-dark)]">$1M Host Cover</h3>
              <p className="text-xs text-[var(--color-text-gray)] leading-relaxed">
                Comprehensive damage protection and liability guarantee covering rare property incidents and fine art.
              </p>
            </div>

            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-3xl space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Award size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-dark)]">Verified Elite Guests</h3>
              <p className="text-xs text-[var(--color-text-gray)] leading-relaxed">
                Government ID verification, credit card pre-authorization, and guest reviews before any key is handed over.
              </p>
            </div>

            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-3xl space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                <Zap size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-dark)]">Automated Payouts</h3>
              <p className="text-xs text-[var(--color-text-gray)] leading-relaxed">
                Direct bank transfer (IMPS/NEFT) or UPI within 24 hours of guest check-in without hidden escrow delays.
              </p>
            </div>
          </div>

          {/* Quick FAQ */}
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-lg font-bold font-serif text-[var(--color-text-dark)]">Frequently Asked Questions</h3>
            <div className="space-y-3">
              <details className="group p-4 bg-[var(--color-bg-light)] rounded-2xl cursor-pointer">
                <summary className="text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between list-none">
                  How does Reservo verify guests?
                  <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <p className="text-xs text-[var(--color-text-gray)] mt-2 leading-relaxed">
                  All guests must verify government ID (Passport, Aadhaar, Driving License) and link valid payment credentials prior to booking confirmation.
                </p>
              </details>
              <details className="group p-4 bg-[var(--color-bg-light)] rounded-2xl cursor-pointer">
                <summary className="text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between list-none">
                  Can I set custom pricing for peak holiday dates?
                  <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <p className="text-xs text-[var(--color-text-gray)] mt-2 leading-relaxed">
                  Yes! Your Host Administration includes an interactive Calendar tool where you can block dates and set custom nightly surge prices at any time.
                </p>
              </details>
              <details className="group p-4 bg-[var(--color-bg-light)] rounded-2xl cursor-pointer">
                <summary className="text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between list-none">
                  What is the commission fee structure?
                  <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <p className="text-xs text-[var(--color-text-gray)] mt-2 leading-relaxed">
                  Reservo charges a flat 3% host service fee per completed booking, ensuring you keep 97% of your earned nightly revenue.
                </p>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* 10-STEP INTERACTIVE LISTING WIZARD */}
      {mode === "wizard" && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 md:p-10 shadow-xl space-y-8">
            
            {/* Step 1: Category Selection */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 1 • Basics</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    Which best describes your luxury property?
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    This helps guests find your sanctuary under the correct curation style.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {PROPERTY_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        formData.category === cat.id
                          ? "bg-primary/5 border-primary ring-2 ring-primary/20 shadow-md"
                          : "bg-[var(--color-bg-light)] border-[var(--color-border-color)] hover:border-primary/50"
                      }`}
                    >
                      <div className="text-3xl">{cat.icon}</div>
                      <div>
                        <div className="text-sm font-bold text-[var(--color-text-dark)]">{cat.name}</div>
                        <div className="text-[11px] text-[var(--color-text-gray)] leading-snug mt-1">{cat.desc}</div>
                      </div>
                      {formData.category === cat.id && (
                        <div className="self-end text-primary font-bold text-xs flex items-center gap-1">
                          <Check size={14} /> Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Location & Address */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 2 • Location</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    Where is your property situated?
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    Your exact address is only shared with confirmed guests with paid bookings.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                      Street Address / Estate Name *
                    </label>
                    <input 
                      type="text" 
                      value={formData.location.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, address: e.target.value } }))}
                      placeholder="e.g., Villa No. 12, Aguada Foothills Road"
                      className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                        City / Destination *
                      </label>
                      <input 
                        type="text" 
                        value={formData.location.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, city: e.target.value } }))}
                        placeholder="e.g., Goa"
                        className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                        State / Province
                      </label>
                      <input 
                        type="text" 
                        value={formData.location.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, state: e.target.value } }))}
                        placeholder="e.g., Goa"
                        className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                        PIN / Postal Code
                      </label>
                      <input 
                        type="text" 
                        value={formData.location.pinCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, pinCode: e.target.value } }))}
                        placeholder="e.g., 403515"
                        className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                        Country
                      </label>
                      <input 
                        type="text" 
                        value={formData.location.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, country: e.target.value } }))}
                        className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Simulated Map Pin Card */}
                  <div className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[var(--color-text-dark)]">Pinpoint Map Coordinates</div>
                        <div className="text-[11px] text-[var(--color-text-gray)]">Lat: 15.5164 • Long: 73.7634 (Auto-detected)</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200">
                      Coordinates Verified
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Capacity & Specifications */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 3 • Floor Plan</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    Share the essentials about your space
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    Let guests know the maximum occupancy and bed layouts.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Maximum Guests", key: "guests", min: 1, max: 24, icon: Users },
                    { label: "Bedrooms", key: "bedrooms", min: 1, max: 12, icon: Bed },
                    { label: "Beds", key: "beds", min: 1, max: 20, icon: Bed },
                    { label: "Bathrooms", key: "bathrooms", min: 1, max: 12, icon: Bath }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-white)] border border-[var(--color-border-color)] flex items-center justify-center text-primary">
                            <Icon size={16} />
                          </div>
                          <span className="text-xs font-bold text-[var(--color-text-dark)]">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              specs: { ...prev.specs, [item.key]: Math.max(item.min, prev.specs[item.key] - 1) }
                            }))}
                            className="w-8 h-8 rounded-full border border-[var(--color-border-color)] bg-[var(--color-bg-white)] flex items-center justify-center text-[var(--color-text-dark)] hover:border-primary cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-extrabold text-[var(--color-text-dark)] w-6 text-center">
                            {formData.specs[item.key]}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              specs: { ...prev.specs, [item.key]: Math.min(item.max, prev.specs[item.key] + 1) }
                            }))}
                            className="w-8 h-8 rounded-full border border-[var(--color-border-color)] bg-[var(--color-bg-white)] flex items-center justify-center text-[var(--color-text-dark)] hover:border-primary cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                      Approximate Area (Sq. Ft.)
                    </label>
                    <input 
                      type="number"
                      value={formData.specs.sqft}
                      onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, sqft: Number(e.target.value) } }))}
                      className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Amenities Picker */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 4 • Amenities</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    What standout amenities do you offer?
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    Select all that apply. Luxury amenities drastically boost booking conversion.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.label);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.label)}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                            : "bg-[var(--color-bg-light)] border-[var(--color-border-color)] text-[var(--color-text-dark)] hover:border-primary/50"
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isSelected ? "bg-primary text-white" : "bg-[var(--color-bg-white)] text-[var(--color-text-gray)]"}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-semibold">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 5: Photos & Gallery */}
            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 5 • Photography</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    Add photos & videos of your luxury stay
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    High-resolution imagery and video tours are the #1 deciding factor for luxury guests (Max 10 photos, Max 2 videos).
                  </p>
                </div>

                {/* Upload Photos box */}
                <div className="border-2 border-dashed border-[var(--color-border-color)] hover:border-primary rounded-3xl p-6 text-center space-y-3 bg-[var(--color-bg-light)]">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Camera size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[var(--color-text-dark)]">Drag and drop high-res photos here ({formData.images.length}/10)</div>
                    <div className="text-[11px] text-[var(--color-text-gray)]">Supports JPG, PNG, WEBP up to 25MB each</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddSamplePhoto("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80");
                    }}
                    className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer border-none"
                  >
                    + Add Luxury Stock Photo
                  </button>
                </div>

                {/* Gallery Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden group aspect-[4/3] border border-[var(--color-border-color)]">
                      <img src={imgUrl} alt={`Space ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImage: imgUrl }))}
                        className="absolute bottom-2 right-2 bg-black/60 hover:bg-primary text-white text-[9px] font-bold px-2 py-1 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                      >
                        Set Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                        className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Videos Box */}
                <div className="border-2 border-dashed border-[var(--color-border-color)] hover:border-primary rounded-3xl p-6 text-center space-y-3 bg-[var(--color-bg-light)] mt-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                    <Camera size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[var(--color-text-dark)]">Upload property video tours ({(formData.videos || []).length}/2)</div>
                    <div className="text-[11px] text-[var(--color-text-gray)]">Supports MP4, MOV, WebM up to 100MB each</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddSampleVideo("https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-resort-with-palm-trees-42232-large.mp4");
                    }}
                    className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer border-none"
                  >
                    + Add Luxury Resort Loop Video
                  </button>
                </div>

                {/* Video Previews */}
                <div className="grid grid-cols-2 gap-3">
                  {(formData.videos || []).map((videoUrl, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden group aspect-[16/9] border border-[var(--color-border-color)] bg-black">
                      <video src={videoUrl} controls className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }))}
                        className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none z-20"
                      >
                        Delete Video
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 6: AI Copywriting Title & Description */}
            {currentStep === 6 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 6 • Story & Copy</span>
                    <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                      Craft your property title & story
                    </h2>
                    <p className="text-xs text-[var(--color-text-gray)]">
                      Highlight the architectural charm, views, and bespoke atmosphere.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAiCopy}
                    disabled={aiGenerating}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md cursor-pointer border-none flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <Sparkles size={14} className={aiGenerating ? "animate-spin" : ""} />
                    {aiGenerating ? "Generating..." : "AI Auto-Write"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                      Catchy Listing Title *
                    </label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Villa Solarium Infinity Pool & Ocean Cove"
                      className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-semibold outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                      Detailed Luxury Description *
                    </label>
                    <textarea 
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the atmosphere, private pool, dining service, nearby beach access, and what makes your property extraordinary..."
                      className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 7: House Rules & Safety */}
            {currentStep === 7 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 7 • House Rules</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    Set your expectations & safety guidelines
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    Guests must agree to these rules prior to booking confirmation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[var(--color-text-dark)]">Minimum Stay (Nights)</div>
                      <div className="text-[11px] text-[var(--color-text-gray)]">Default is 2 nights</div>
                    </div>
                    <input 
                      type="number" 
                      min="1" 
                      max="14" 
                      value={formData.minNights} 
                      onChange={(e) => setFormData(prev => ({ ...prev, minNights: Number(e.target.value) }))}
                      className="w-16 bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-2 rounded-xl text-xs font-bold text-center outline-none focus:border-primary"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[var(--color-text-dark)]">Cancellation Policy</div>
                      <div className="text-[11px] text-[var(--color-text-gray)]">Flexible, Moderate, or Strict</div>
                    </div>
                    <select
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                      className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-2 rounded-xl text-xs font-bold outline-none focus:border-primary"
                    >
                      <option value="Flexible">Flexible (24h)</option>
                      <option value="Moderate">Moderate (5 days)</option>
                      <option value="Strict">Strict (14 days)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Shield size={14} /> Reservo Quiet Hours Standard
                  </div>
                  <div>Quiet hours are automatically enforced between 10:00 PM and 7:00 AM for residential tranquility.</div>
                </div>
              </motion.div>
            )}

            {/* Step 8: Nightly Pricing & Discounts */}
            {currentStep === 8 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 8 • Pricing</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    Set your nightly rates & discounts
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    You can easily override rates for weekends or holidays later in your calendar.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-slate-700 rounded-3xl space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                      Base Nightly Price (INR ₹)
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary font-serif">₹</span>
                      <input 
                        type="number"
                        step="500"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                        className="text-2xl font-black text-[var(--color-text-dark)] bg-transparent border-b-2 border-primary outline-none w-48 font-serif"
                      />
                      <span className="text-xs font-bold text-[var(--color-text-gray)]">/ night</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                        Cleaning & Sanitization Fee (₹)
                      </label>
                      <input 
                        type="number"
                        value={formData.cleaningFee}
                        onChange={(e) => setFormData(prev => ({ ...prev, cleaningFee: Number(e.target.value) }))}
                        className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                        Weekend Surge (% Surcharge)
                      </label>
                      <input 
                        type="number"
                        value={formData.weekendSurgePercent}
                        onChange={(e) => setFormData(prev => ({ ...prev, weekendSurgePercent: Number(e.target.value) }))}
                        className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 9: Host KYC & Payout Details */}
            {currentStep === 9 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 9 • Verification & Payouts</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    Where should we deposit your earnings?
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    Reservo disburses earnings automatically via IMPS/NEFT or instant UPI.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                        Host Full Legal Name
                      </label>
                      <input 
                        type="text"
                        value={formData.hostName}
                        onChange={(e) => setFormData(prev => ({ ...prev, hostName: e.target.value }))}
                        placeholder="e.g., Srushti Salunke"
                        className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                        Government ID / GST No.
                      </label>
                      <input 
                        type="text"
                        value={formData.govIdNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, govIdNumber: e.target.value }))}
                        placeholder="e.g., Aadhaar / Passport / GSTIN"
                        className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1.5">
                      Bank Account / UPI ID for Payouts
                    </label>
                    <input 
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                      placeholder="e.g., srushti@okhdfcbank or HDFC A/C No."
                      className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-3.5 rounded-2xl text-xs font-medium outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 10: Review & Instant Publish */}
            {currentStep === 10 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Final Step • Live Preview</span>
                  <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] mt-1">
                    Review and publish your listing!
                  </h2>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    Everything looks exceptional. Once published, your listing will appear in your Host Portal.
                  </p>
                </div>

                {/* Preview Card */}
                <div className="max-w-md mx-auto bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl overflow-hidden shadow-2xl space-y-4">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[var(--color-text-dark)] text-[11px] font-bold px-3 py-1 rounded-full shadow">
                      {formData.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold font-serif text-[var(--color-text-dark)] line-clamp-1">
                          {formData.title || `Luxury ${formData.category} in ${formData.location.city}`}
                        </h4>
                        <div className="text-xs text-[var(--color-text-gray)] flex items-center gap-1 mt-0.5">
                          <MapPin size={13} className="text-primary" /> {formData.location.city}, {formData.location.state}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-primary font-serif">
                          ₹{formData.pricePerNight.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-gray)]">/ night</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-gray)] border-t border-[var(--color-border-color)] pt-3">
                      <span>{formData.specs.guests} Guests</span>
                      <span>•</span>
                      <span>{formData.specs.bedrooms} Bedrooms</span>
                      <span>•</span>
                      <span>{formData.specs.bathrooms} Baths</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {formData.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-[var(--color-bg-light)] px-2 py-0.5 rounded-md text-[var(--color-text-gray)]">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Wizard Navigation Actions */}
            <div className="border-t border-[var(--color-border-color)] pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`text-xs font-bold px-5 py-3 rounded-xl border border-[var(--color-border-color)] transition-all flex items-center gap-1.5 ${
                  currentStep === 1 
                    ? "opacity-40 cursor-not-allowed bg-transparent text-[var(--color-text-gray)]" 
                    : "cursor-pointer bg-[var(--color-bg-light)] hover:bg-[var(--color-border-color)] text-[var(--color-text-dark)]"
                }`}
              >
                <ArrowLeft size={14} /> Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md cursor-pointer border-none flex items-center gap-1.5 transition-all"
                >
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublishListing}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold px-7 py-3 rounded-xl shadow-lg cursor-pointer border-none flex items-center gap-2 transition-all"
                >
                  <Sparkles size={15} /> Publish to Host Administration
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
