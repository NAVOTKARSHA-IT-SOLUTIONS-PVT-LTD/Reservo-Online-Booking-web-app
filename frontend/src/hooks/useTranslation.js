import { useState, useEffect } from "react";

const TRANSLATIONS = {
  en: {
    home: "Home",
    explore: "Explore",
    ai_planner: "AI Planner",
    why_us: "Why Us",
    experiences: "Experiences",
    rewards: "Rewards",
    reviews: "Reviews",
    contact: "Contact",
    my_bookings: "My Bookings",
    wishlist: "Wishlist",
    about_us: "About Us",
    meet_rivo: "MEET RIVO",
    companion: "Your AI Travel Companion",
    concierge_service: "Rivo is your personal travel concierge, powered by AI to seamlessly curate and manage every aspect of your trip.",
    always_service: "Always at your service",
    friction_free: "From crafting bespoke itineraries to live key handovers, Rivo takes the friction out of luxury hospitality.",
    select_vibe: "Select your holiday vibe:",
    start_over: "Start Over",
    ask_rivo: "Ask Rivo anything...",
    from: "from",
    per_night: "per night",
    best_price: "Best Price",
    verified_stays: "Verified Stays",
    quality_checked: "Quality checked",
    value_guaranteed: "Value guaranteed",
    support_247: "24/7 Support",
    secure_booking: "100% Secure Booking",
    connecting: "Connecting...",
    connected: "Connected",
    telephony_concierge: "Rivo AI Concierge",
    secure_line: "Reservo Secure Line",
    quick_book: "Quick Book",
    view_details: "View Details →",
    popular_destinations: "Popular Stays",
    discover_stays: "Discover curated retreats tailored for luxury escapes.",
    m1_greeting: "Hi! I'm Rivo, your personal travel concierge. Tell me what kind of vibe you're looking for, and I'll find the perfect stay.",
    connecting_sip: "Initializing secure SIP VoIP channel...",
    telephony_greeting: "\"Hello! I am Rivo, your Reservo Telephony concierge. How can I assist you with your luxury booking today?\""
  },
  hi: {
    home: "मुख्य पृष्ठ",
    explore: "खोजें",
    ai_planner: "एआई प्लानर",
    why_us: "हमें क्यों चुनें",
    experiences: "अनुभव",
    rewards: "पुरस्कार",
    reviews: "समीक्षाएं",
    contact: "संपर्क",
    my_bookings: "मेरी बुकिंग",
    wishlist: "पसंदीदा",
    about_us: "हमारे बारे में",
    meet_rivo: "रिवो से मिलें",
    companion: "आपका एआई यात्रा साथी",
    concierge_service: "रिवो आपका व्यक्तिगत यात्रा सहायक है, जो आपकी यात्रा के हर पहलू को व्यवस्थित करने के लिए एआई द्वारा संचालित है।",
    always_service: "हमेशा आपकी सेवा में",
    friction_free: "कस्टम यात्रा कार्यक्रम तैयार करने से लेकर लाइव सहायता तक, रिवो आपकी यात्रा को आसान बनाता है।",
    select_vibe: "अपनी छुट्टियों का मिजाज चुनें:",
    start_over: "शुरू से शुरू करें",
    ask_rivo: "रिवो से कुछ भी पूछें...",
    from: "से",
    per_night: "प्रति रात",
    best_price: "सर्वोत्तम मूल्य",
    verified_stays: "सत्यापित ठहरने के स्थान",
    quality_checked: "गुणवत्ता जांची गई",
    value_guaranteed: "मूल्य की गारंटी",
    support_247: "24/7 सहायता",
    secure_booking: "100% सुरक्षित बुकिंग",
    connecting: "कनेक्ट हो रहा है...",
    connected: "कनेक्टेड",
    telephony_concierge: "रिवो एआई कंसीयज",
    secure_line: "रिजर्वो सुरक्षित लाइन",
    quick_book: "त्वरित बुकिंग",
    view_details: "विवरण देखें →",
    popular_destinations: "लोकप्रिय ठहरने के स्थान",
    discover_stays: "लक्ज़री गेटअवे के लिए क्यूरेटेड रिट्रीट खोजें।",
    m1_greeting: "नमस्ते! मैं रिवो हूँ, आपका व्यक्तिगत यात्रा सहायक। मुझे बताएं कि आप किस तरह का माहौल तलाश रहे हैं, और मैं आपके लिए सही ठहराव ढूंढ लूंगा।",
    connecting_sip: "सुरक्षित एसआईपी वीओआईपी चैनल प्रारंभ किया जा रहा है...",
    telephony_greeting: "\"नमस्ते! मैं रिवो हूँ, आपका रिजर्वो टेलीफोनी कंसीयज। आज मैं आपकी लक्ज़री बुकिंग में कैसे मदद कर सकता हूँ?\""
  }
};

export function useTranslation() {
  const [lang, setLang] = useState(() => localStorage.getItem("reservo-language") || "en");

  useEffect(() => {
    const handleStorage = () => {
      setLang(localStorage.getItem("reservo-language") || "en");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = (key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return { t, lang };
}
