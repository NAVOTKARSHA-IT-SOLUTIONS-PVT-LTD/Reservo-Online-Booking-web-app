import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, MapPin, DollarSign, ArrowRight, ArrowLeft, CheckCircle2, 
  ImageIcon, Mail, User, ShieldAlert, X
} from "lucide-react";
import rivoSearching from "../assets/images/rivo_searching.png";

export default function PartnerOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "beach",
    pricePerNight: "",
    description: "",
    imageUrl: "",
    ownerName: "",
    ownerEmail: "",
    licenseNumber: ""
  });

  const categories = [
    { id: "beach", label: "Beach Resort" },
    { id: "mountain", label: "Mountain Retreat" },
    { id: "chalet", label: "Forest Chalet" },
    { id: "villa", label: "Luxury Villa" },
    { id: "cabin", label: "Rustic Cabin" },
    { id: "glamping", label: "Glamping Stay" },
    { id: "island", label: "Private Island" },
    { id: "eco", label: "Eco Camping" }
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.location || !formData.pricePerNight) {
        setErrorMsg("Please fill in all required fields.");
        return;
      }
    } else if (step === 2) {
      if (!formData.description) {
        setErrorMsg("Please provide a resort description.");
        return;
      }
    }
    setErrorMsg("");
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.ownerEmail || !formData.licenseNumber) {
      setErrorMsg("Please fill in all owner and license details.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    // Set default cover image if empty based on category
    let finalImageUrl = formData.imageUrl.trim();
    if (!finalImageUrl) {
      if (formData.category === "beach") {
        finalImageUrl = "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80";
      } else if (formData.category === "mountain") {
        finalImageUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80";
      } else {
        finalImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
      }
    }

    try {
      const response = await fetch("/api/v1/resorts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          description: formData.description,
          imageUrl: finalImageUrl,
          pricePerNight: parseFloat(formData.pricePerNight),
          status: "PENDING_APPROVAL",
          rating: 4.8,
          reviewCount: 0,
          discountPercentage: 15,
          featuredTag: "Newly Listed"
        })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setErrorMsg("Submission failed. Please check the network connectivity or try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server. Please verify the API is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-[var(--color-bg-light)] flex items-center justify-center px-4 font-sans transition-colors duration-300">
      <div className="w-full max-w-2xl bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side Info Panel */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-primary via-primary-dark to-[#1d4ed8] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6 z-10">
            <div className="inline-flex p-3 bg-white/15 rounded-2xl">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight leading-tight">Partner with Reservo</h2>
            <p className="text-xs text-white/80 leading-relaxed">
              List your luxury resort, villa, or boutique stay. Gain exposure to premium travelers globally.
            </p>
          </div>

          <div className="space-y-4 z-10 mt-8 md:mt-0">
            <div className="flex items-center gap-3 text-xs text-white/90">
              <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full font-bold">1</span>
              <span>Submit Property Details</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/90">
              <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full font-bold">2</span>
              <span>Verification Audit</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/90">
              <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full font-bold">3</span>
              <span>Go Live & Accept Bookings</span>
            </div>
          </div>
        </div>

        {/* Right Side Wizard Form */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center my-auto space-y-6 py-6 animate-in fade-in duration-300">
              <img src={rivoSearching} alt="Rivo Mascot" className="h-44 w-auto object-contain animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[var(--color-text-dark)]">Application Submitted!</h3>
                <p className="text-xs text-[var(--color-text-gray)] max-w-sm mx-auto leading-relaxed">
                  Thank you! Our verification auditors are currently auditing <strong>{formData.name}</strong>. We will contact you at <strong>{formData.ownerEmail}</strong> within 24 hours.
                </p>
              </div>
              <button onClick={() => navigate("/")} className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold border-none cursor-pointer hover:bg-primary-dark transition">
                Return to Home
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {step} of 3</span>
                <span className="text-[10px] text-[var(--color-text-gray)] font-bold">
                  {step === 1 ? "Property Details" : step === 2 ? "Descriptions & Cover" : "Verification Data"}
                </span>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form steps */}
              <div className="flex-1 space-y-4">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Property Name *</label>
                      <div className="relative flex items-center">
                        <Building2 className="absolute left-3 w-4 h-4 text-[var(--color-text-gray)]" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Royal Lagoon Palace"
                          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Location / Region *</label>
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3 w-4 h-4 text-[var(--color-text-gray)]" />
                        <input
                          type="text"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. Udaipur, India"
                          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none cursor-pointer"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Price Per Night (₹) *</label>
                        <div className="relative flex items-center">
                          <DollarSign className="absolute left-3 w-4 h-4 text-[var(--color-text-gray)]" />
                          <input
                            type="number"
                            required
                            value={formData.pricePerNight}
                            onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                            placeholder="e.g. 12000"
                            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Resort Description *</label>
                      <textarea
                        rows="4"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Give a beautiful, luxury description of your hotel amenities, spa, dining, and suites..."
                        className="w-full p-3 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Cover Image URL (Optional)</label>
                      <div className="relative flex items-center">
                        <ImageIcon className="absolute left-3 w-4 h-4 text-[var(--color-text-gray)]" />
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="e.g. https://unsplash.com/... (WebP/JPG)"
                          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                        />
                      </div>
                      <p className="text-[9px] text-[var(--color-text-gray)] italic">Leave blank to let Reservo assign a beautiful default image matching your category.</p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Owner Full Name *</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 w-4 h-4 text-[var(--color-text-gray)]" />
                        <input
                          type="text"
                          required
                          value={formData.ownerName}
                          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                          placeholder="e.g. Devendra Singh"
                          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Business Email Address *</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3 w-4 h-4 text-[var(--color-text-gray)]" />
                        <input
                          type="email"
                          required
                          value={formData.ownerEmail}
                          onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                          placeholder="e.g. partners@royallagoon.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Business Registration / License Number *</label>
                      <div className="relative flex items-center">
                        <Building2 className="absolute left-3 w-4 h-4 text-[var(--color-text-gray)]" />
                        <input
                          type="text"
                          required
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          placeholder="e.g. GSTIN-32AAAAB1234C1Z1"
                          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation controls */}
              <div className="flex gap-4 pt-4 border-t border-[var(--color-border-color)]">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 py-2.5 bg-transparent border border-[var(--color-border-color)] text-[var(--color-text-dark)] hover:bg-[var(--color-bg-light)] rounded-xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 py-2.5 bg-primary text-white hover:bg-primary-dark rounded-xl text-xs font-bold cursor-pointer border-none transition flex items-center justify-center gap-1.5"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-primary text-white hover:bg-primary-dark disabled:bg-primary/50 rounded-xl text-xs font-bold cursor-pointer border-none transition flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Submit Registry <CheckCircle2 className="w-4.5 h-4.5" /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
