import React, { useState } from 'react';
import { CreditCard, Eye, EyeOff, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StripeCardInput({ onPaymentSuccess, grandTotal, currencySymbol = "₹" }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [show3dSecure, setShow3dSecure] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Card brand detection
  const getCardBrand = (number) => {
    const cleanNum = number.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(cleanNum)) return 'mastercard';
    if (/^3[47]/.test(cleanNum)) return 'amex';
    return 'generic';
  };

  const brand = getCardBrand(cardNumber);

  // Expiry date auto formatting
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setExpiry(val);
  };

  // Card number spacing formatting
  const handleNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    // Add spaces every 4 digits
    let formatted = val.match(/.{1,4}/g)?.join(' ') || "";
    setCardNumber(formatted);
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    const limit = brand === 'amex' ? 4 : 3;
    if (val.length > limit) val = val.slice(0, limit);
    setCvv(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3 || cardName.length < 3) {
      alert("Please fill all payment fields correctly.");
      return;
    }
    setShow3dSecure(true);
  };

  const trigger3dSecureAuth = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setShow3dSecure(false);
      if (onPaymentSuccess) onPaymentSuccess();
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* 3D Visual Card Box */}
      <div className="flex justify-center select-none py-2">
        <div className="w-[320px] h-[190px] [perspective:1000px]">
          <motion.div 
            className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-700"
            animate={{ rotateY: focusedField === 'cvv' ? 180 : 0 }}
          >
            {/* Front Card Face */}
            <div className="absolute w-full h-full rounded-[20px] p-5 text-white bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#121824] border border-white/10 [backface-visibility:hidden] flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
              {/* Card top */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="h-6 w-9 bg-amber-400/20 rounded-md border border-amber-400/30 flex items-center justify-center">
                    <div className="w-5 h-3 bg-amber-400/40 rounded-sm" />
                  </div>
                </div>
                {/* Brand asset logo switcher */}
                {brand === 'visa' && <span className="font-extrabold italic text-lg tracking-wider text-white">VISA</span>}
                {brand === 'mastercard' && (
                  <div className="flex -space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-red-500" />
                    <div className="w-5 h-5 rounded-full bg-amber-500" />
                  </div>
                )}
                {brand === 'amex' && <span className="font-extrabold text-sm tracking-wider text-sky-400">AMEX</span>}
                {brand === 'generic' && <CreditCard className="w-5 h-5 text-slate-400" />}
              </div>

              {/* Card Number display */}
              <div className="text-[17px] font-mono tracking-[2.5px] text-center my-3 text-slate-200">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>

              {/* Card Bottom */}
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <div className="text-[8px] uppercase tracking-wider text-slate-400">Card Holder</div>
                  <div className="text-xs font-bold font-mono tracking-wide truncate max-w-[170px] uppercase">
                    {cardName || "Your Full Name"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] uppercase tracking-wider text-slate-400">Expires</div>
                  <div className="text-xs font-bold font-mono tracking-wide">
                    {expiry || "MM/YY"}
                  </div>
                </div>
              </div>
            </div>

            {/* Back Card Face */}
            <div className="absolute w-full h-full rounded-[20px] text-white bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#121824] border border-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between py-5 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
              {/* Magnetic Strip */}
              <div className="w-full h-10 bg-slate-950 mt-1" />
              
              {/* Signature & CVV info */}
              <div className="px-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-8 bg-slate-200/20 rounded-md flex items-center justify-end px-3">
                    <span className="text-[9px] text-slate-400 select-none">AUTHORIZED SIGNATURE</span>
                  </div>
                  <div className="w-12 h-7.5 bg-white text-slate-900 rounded font-mono font-bold text-xs flex items-center justify-center shadow">
                    {cvv || "•••"}
                  </div>
                </div>
                <p className="text-[7.5px] leading-snug text-slate-400 text-left">
                  This card is mock-secured for Reservo instant reservations. Tapping pay activates our client secure authentication portal.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number input */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Card Number</label>
          <input 
            type="text"
            required
            placeholder="4000 1234 5678 9010"
            value={cardNumber}
            onChange={handleNumberChange}
            onFocus={() => setFocusedField("number")}
            onBlur={() => setFocusedField("")}
            className="w-full p-3 bg-bg-light border border-border-color rounded-xl text-xs font-semibold outline-none focus:border-primary transition"
          />
        </div>

        {/* Cardholder Name input */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Cardholder Name</label>
          <input 
            type="text"
            required
            placeholder="John Doe"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField("")}
            className="w-full p-3 bg-bg-light border border-border-color rounded-xl text-xs font-semibold outline-none focus:border-primary transition uppercase"
          />
        </div>

        {/* Expiry & CVV input row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Expiry Date</label>
            <input 
              type="text"
              required
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              onFocus={() => setFocusedField("expiry")}
              onBlur={() => setFocusedField("")}
              className="w-full p-3 bg-bg-light border border-border-color rounded-xl text-xs font-semibold outline-none focus:border-primary transition text-center"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-gray">CVV / CVC</label>
            <input 
              type="password"
              required
              placeholder="•••"
              value={cvv}
              onChange={handleCvvChange}
              onFocus={() => setFocusedField("cvv")}
              onBlur={() => setFocusedField("")}
              className="w-full p-3 bg-bg-light border border-border-color rounded-xl text-xs font-semibold outline-none focus:border-primary transition text-center"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-2 py-3.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg border-none cursor-pointer transition"
        >
          Verify Card & Pay {currencySymbol}{grandTotal.toLocaleString()}
        </button>
      </form>

      {/* 3D Secure Verification Dialog */}
      <AnimatePresence>
        {show3dSecure && (
          <div className="fixed inset-0 z-[10000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-white border border-border-color rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl relative"
            >
              <button 
                onClick={() => setShow3dSecure(false)}
                className="absolute top-5 right-5 w-7 h-7 bg-bg-light border-none rounded-full flex items-center justify-center text-text-dark cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h4 className="text-base font-bold text-text-dark">3D Secure Verification</h4>
              <p className="text-xs text-text-gray mt-1 leading-relaxed">
                Reservo matches transactions with secure protocols. Click authorize to complete payment.
              </p>

              <div className="border border-border-color rounded-2xl p-4 my-5 bg-bg-light text-left text-xs font-semibold space-y-1.5 text-text-dark">
                <div className="flex justify-between"><span>Merchant</span><span>Reservo Online Stays</span></div>
                <div className="flex justify-between"><span>Amount</span><span className="text-primary font-bold">{currencySymbol}{grandTotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Card Number</span><span className="font-mono">•••• {cardNumber.slice(-4)}</span></div>
              </div>

              <button 
                onClick={trigger3dSecureAuth}
                disabled={verifying}
                className="w-full py-3 bg-[#22C55E] hover:bg-[#15803D] text-white text-xs font-bold uppercase rounded-xl border-none shadow transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" /> Authorize Transaction
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
