import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Send, Mic, Calendar, Users, MapPin, DollarSign,
  Compass, Shield, Heart, Star, ChevronRight, Check, X,
  ArrowRight, ShieldCheck, Flame, Home, Waves, Mountain,
  Coins, Info, ArrowUpDown, ChevronDown, CheckCircle, Barcode, ClipboardCheck,
  ChevronUp, Map, Compass as WandIcon, Smile
} from "lucide-react";

import { RESORTS } from "../data/resortsData";

// Rivo Mascots
import rivoMascot from "../assets/images/rivo_mascot.jpg";
import rivoSearching from "../assets/images/rivo_searching.png";
import rivoConfirmed from "../assets/images/rivo_confirmed.png";
import rivoPlanner from "../assets/images/rivo_planner.png";
import rivoSupport from "../assets/images/rivo_support.png";

// Region and metadata configurations for parsing
const REGION_METADATA = {
  "goa-coastline": {
    region: "Goa, India",
    nearMumbai: true,
    transportOptions: { flight: 4500, train: 1500, selfDrive: 2000, bus: 1200 },
    activities: [
      { name: "Scuba Diving & Coral Reef Tour", cost: 3500 },
      { name: "Sunset Cruise with Wine Tasting", cost: 2500 },
      { name: "Aura Ayurvedic Couples Massage", cost: 4000 }
    ],
    weather: "28°C • Breezy Coastline",
    bestMonths: "November to February",
    safety: "Very Safe • Tourist Friendly"
  },
  "kerala-backwaters": {
    region: "Kerala, India",
    nearMumbai: false,
    transportOptions: { flight: 6000, train: 2000, selfDrive: 4500, bus: 1800 },
    activities: [
      { name: "Private Houseboat Day Cruise & Lunch", cost: 5000 },
      { name: "Organic Spice Garden Tour", cost: 1500 },
      { name: "Ayurvedic Detox Therapy", cost: 3000 }
    ],
    weather: "27°C • Humid & Tropical",
    bestMonths: "September to March",
    safety: "Safe • Culturally Rich"
  },
  "udaipur-palace": {
    region: "Udaipur, India",
    nearMumbai: true,
    transportOptions: { flight: 5000, train: 1800, selfDrive: 3500, bus: 1400 },
    activities: [
      { name: "Private Sitar & Kathak Performance", cost: 4500 },
      { name: "Sunset Boat Cruise on Lake Pichola", cost: 2000 },
      { name: "Heritage Mewar Walking Tour", cost: 1200 }
    ],
    weather: "24°C • Dry & Cool",
    bestMonths: "October to March",
    safety: "Highly Safe • Historic Zone"
  },
  "himalayan-chalet": {
    region: "Manali, India",
    nearMumbai: false,
    transportOptions: { flight: 9500, train: 3200, selfDrive: 8000, bus: 2500 },
    activities: [
      { name: "Solang Valley Paragliding Tour", cost: 3200 },
      { name: "Heated Cedar Hot Tub Session", cost: 2000 },
      { name: "Pine Forest Trek & Camping Picnic", cost: 1500 }
    ],
    weather: "12°C • Alpine Snow",
    bestMonths: "October to April",
    safety: "Safe • Scenic Valleys"
  },
  "maldives-overwater": {
    region: "Maldives",
    nearMumbai: false,
    transportOptions: { flight: 18000, train: 99999, selfDrive: 99999, bus: 99999 },
    activities: [
      { name: "Underwater Coral Reef Snorkeling Safari", cost: 6500 },
      { name: "Private Sandbank Seafood Barbecue", cost: 8000 },
      { name: "Sunset Dolphin Cruise", cost: 3500 }
    ],
    weather: "31°C • Island Sun",
    bestMonths: "November to April",
    safety: "Highly Safe • Island Privacy"
  }
};

// Default setup values matching the requested professional screenshot exactly
const DEFAULT_OPTIONS = [
  {
    id: "opt-1",
    type: "A",
    title: "Goa Beach Escape",
    resortName: "Azure Beach Resort & Spa",
    resortImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80",
    location: "Goa, India",
    roomTitle: "Ocean View Private Pool Villa",
    grandTotal: 48750,
    guests: 2,
    nights: 2,
    weather: "28°C • Breezy Coastline",
    bestMonths: "November to February",
    safety: "Very Safe • Tourist Friendly",
    scores: { luxury: 5.0, romantic: 4.8, family: 4.1, adventure: 3.5, value: 4.5 },
    breakdown: { hotel: 28000, transport: 6500, activities: 7500, food: 4750, taxes: 2000, cab: 0, buffer: 0 },
    activities: [{ name: "Water Sports Adventure" }, { name: "Private Pool & Spa" }],
    pros: ["Michelin dinner included", "Helipad access"],
    cons: ["Higher rate", "No refunds"],
    resortDetails: RESORTS[0] || { id: "goa-coastline" },
    itinerary: {
      day1: [
        { time: "11:30 AM", title: "Arrival in Goa", desc: "Cab pickup from Dabolim Airport / Madgaon Station" },
        { time: "01:00 PM", title: "Check-in at Resort", desc: "Welcome drinks & refreshing towels" },
        { time: "02:00 PM", title: "Lunch by the Pool", desc: "Enjoy delicious lunch with ocean view" },
        { time: "04:00 PM", title: "Relax at the Beach", desc: "Sunset walk & stunning views" },
        { time: "08:00 PM", title: "Candle Light Dinner", desc: "Romantic private dinner by the beach" }
      ],
      day2: [
        { time: "08:00 AM", title: "Breakfast with a View", desc: "Healthy breakfast with ocean view" },
        { time: "10:00 AM", title: "Water Sports Adventure", desc: "Jet ski, Parasailing, Banana ride" },
        { time: "01:00 PM", title: "Lunch at Beach Shack", desc: "Goan specialties" },
        { time: "04:00 PM", title: "Private Pool & Spa", desc: "Relax and unwind with couple spa" },
        { time: "08:00 PM", title: "BBQ Dinner Night", desc: "Live music & BBQ dinner" }
      ],
      day3: [
        { time: "08:00 AM", title: "Breakfast & Leisure", desc: "Relax and enjoy your last morning" },
        { time: "11:00 AM", title: "Checkout", desc: "Check-out and cab drop" },
        { time: "01:00 PM", title: "Departure", desc: "Drive back to Mumbai with memories" }
      ]
    }
  },
  {
    id: "opt-2",
    type: "B",
    title: "Alibaug Coastal Bliss",
    resortName: "Alibaug Coastal Bliss Resort",
    resortImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
    location: "Alibaug, Maharashtra",
    roomTitle: "Luxury Garden Suite",
    grandTotal: 45210,
    guests: 2,
    nights: 2,
    weather: "29°C • Coastal Breeze",
    bestMonths: "November to March",
    safety: "Safe • Peaceful Zone",
    scores: { luxury: 4.3, romantic: 4.5, family: 4.4, adventure: 3.2, value: 4.8 },
    breakdown: { hotel: 25000, transport: 5000, activities: 6500, food: 4210, taxes: 4500, cab: 0, buffer: 0 },
    activities: [{ name: "Sea Fort Jet Skiing" }, { name: "Beachside Barbecue" }],
    pros: ["Close driving distance", "Spa massage included"],
    cons: ["Ferry schedule binding"],
    resortDetails: RESORTS[1] || { id: "goa-coastline" },
    itinerary: {
      day1: [
        { time: "10:00 AM", title: "Ferry Departure", desc: "Speedboat ferry from Gateway of India to Mandwa" },
        { time: "12:00 PM", title: "Resort Check-In", desc: "Check-in to your luxury garden suite" },
        { time: "02:00 PM", title: "Sea Fort Tour", desc: "Explore Kolaba Fort walking inside the sea water" }
      ],
      day2: [
        { time: "09:00 AM", title: "Resort Spa Session", desc: "Traditional ayurvedic full body therapy" },
        { time: "04:00 PM", title: "Sunset Beach Walk", desc: "Walk along Alibaug black sand beach" }
      ],
      day3: [
        { time: "09:00 AM", title: "Poolside Breakfast", desc: "Relaxed outdoor breakfast buffet" },
        { time: "12:00 PM", title: "Ferry Return", desc: "Speedboat ride back to Mumbai" }
      ]
    }
  },
  {
    id: "opt-3",
    type: "C",
    title: "Dapoli Serenity Stays",
    resortName: "Dapoli Serenity Heights Resort",
    resortImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    location: "Dapoli, Maharashtra",
    roomTitle: "Executive Suite",
    grandTotal: 41890,
    guests: 2,
    nights: 2,
    weather: "26°C • Hillside Breeze",
    bestMonths: "October to March",
    safety: "Safe • Hill Escape",
    scores: { luxury: 3.8, romantic: 4.1, family: 4.5, adventure: 4.0, value: 5.0 },
    breakdown: { hotel: 22000, transport: 4000, activities: 5500, food: 3890, taxes: 6500, cab: 0, buffer: 0 },
    activities: [{ name: "Dolphin Watch boat ride" }, { name: "Hot Water Spring Tour" }],
    pros: ["Quiet & less crowded", "Authentic Konkan meals"],
    cons: ["5-hour road journey"],
    resortDetails: RESORTS[2] || { id: "goa-coastline" },
    itinerary: {
      day1: [
        { time: "08:00 AM", title: "Road Journey Start", desc: "Drive from Mumbai through scenic Western Ghats" },
        { time: "02:00 PM", title: "Resort Check-In", desc: "Check-in and traditional lunch" }
      ],
      day2: [
        { time: "07:00 AM", title: "Dolphin Safari", desc: "Early morning boat ride in Harnai port" },
        { time: "03:00 PM", title: "Hot Springs", desc: "Visit Unhavare hot sulfur springs" }
      ],
      day3: [
        { time: "09:00 AM", title: "Local Konkan Breakfast", desc: "Ukadiche Modak and Ghavan tasting" },
        { time: "11:00 AM", title: "Drive Return", desc: "Check-out and road transit back to Mumbai" }
      ]
    }
  }
];

export default function AIPlanner() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Tab State
  const [activeTab, setActiveTab] = useState("chat"); // "chat" or "form"
  const [activeMobileTab, setActiveMobileTab] = useState("chat"); // "chat", "itinerary", "checkout"
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Chat dialogue state
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "rivo",
      text: "Hi! I'm RIVO 👋\n\nTell me your travel plan or choose from suggestions below.",
      avatar: rivoMascot,
      time: "10:30 AM"
    }
  ]);

  // Search Loading / AI Thinking state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [thinkingStep, setThinkingStep] = useState("");

  // Extracted Preferences
  const [preferences, setPreferences] = useState({
    budget: 50000,
    travellers: 2,
    nights: 2,
    style: "Relaxation",
    departure: "Mumbai",
    transport: "selfDrive",
    amenities: ["Private Pool"],
    food: "Veg"
  });

  // Generated options
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Expanded days state
  const [expandedDays, setExpandedDays] = useState({ day1: true, day2: true, day3: true, day4: false });

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAnalyzing]);

  // Form handlers
  const handleFormChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggleAmenity = (amenity) => {
    setPreferences(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Natural Language Parser & Decision Generator
  const runAIEngine = (userInputText) => {
    setIsAnalyzing(true);
    
    const steps = [
      "Analyzing travel intent...",
      "Extracting budget & headcount...",
      "Searching resort inventories...",
      "Calculating transport estimates...",
      "Curating customized activities...",
      "Optimizing costs...",
      "Almost ready..."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setThinkingStep(step);
      }, idx * 400);
    });

    setTimeout(() => {
      let parsedBudget = preferences.budget;
      let parsedGuests = preferences.travellers;
      let parsedNights = preferences.nights;
      let isNearMumbai = false;

      if (userInputText) {
        const text = userInputText.toLowerCase();
        
        // 1. Match Indian Lakhs financial scaling (e.g. 5 lakhs, 5lakh, 5l)
        const lakhsMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l)\b/);
        if (lakhsMatch) {
          parsedBudget = parseFloat(lakhsMatch[1]) * 100000;
        } else {
          // Standard budget check
          const budgetMatch = text.match(/(?:budget|under|for|around)\s*(?:₹|rs)?\s*(\d+)\s*(?:k)?/);
          if (budgetMatch) {
            let val = parseInt(budgetMatch[1], 10);
            if (text.includes(budgetMatch[1] + "k")) val *= 1000;
            parsedBudget = val;
          } else {
            const kMatch = text.match(/(\d+)\s*k/);
            if (kMatch) parsedBudget = parseInt(kMatch[1], 10) * 1000;
          }
        }

        // 2. Headcount parsing
        if (text.includes("couple") || text.includes("honeymoon") || text.includes("2 people") || text.includes("2 adults")) {
          parsedGuests = 2;
        } else {
          const guestMatch = text.match(/(\d+)\s*(?:people|person|guest|adult|members)/);
          if (guestMatch) parsedGuests = parseInt(guestMatch[1], 10);
        }

        // 3. Nights duration parsing
        const nightMatch = text.match(/(\d+)\s*(?:night|day)/);
        if (nightMatch) parsedNights = parseInt(nightMatch[1], 10);

        if (text.includes("mumbai") || text.includes("near mumbai") || text.includes("maharashtra")) {
          isNearMumbai = true;
        }
      }

      // 4. Strict inventory verification from local RESORTS database
      let queryLoc = "";
      if (userInputText) {
        const text = userInputText.toLowerCase();
        const locations = ["goa", "kerala", "udaipur", "manali", "maldives"];
        for (const loc of locations) {
          if (text.includes(loc)) {
            queryLoc = loc;
            break;
          }
        }
      }

      let matchedResorts = RESORTS;
      if (queryLoc) {
        matchedResorts = RESORTS.filter(r => (r.region || "").toLowerCase() === queryLoc);
      } else if (isNearMumbai) {
        matchedResorts = RESORTS.filter(r => {
          const meta = REGION_METADATA[r.id];
          return meta && meta.nearMumbai;
        });
      }

      // Fallback message if requested location is not in our inventory
      if (userInputText && queryLoc && matchedResorts.length === 0) {
        setIsAnalyzing(false);
        setOptions([]);
        setSelectedOption(null);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: "rivo",
            text: `I couldn't find any resorts in **${queryLoc.toUpperCase()}** in our database. Currently, Reservo specializes in handpicked premium properties in **Goa**, **Udaipur**, **Kerala**, **Manali**, and the **Maldives**. Let's plan an amazing trip to one of these spots instead!`,
            avatar: rivoMascot,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }

      const resort = matchedResorts[0] || RESORTS[0];
      const meta = REGION_METADATA[resort.id] || REGION_METADATA["goa-coastline"];

      // 5. Dynamic cost scaling & room capacity allocations
      // We map the resort's roomTypes to Option A, B, C. 
      // If roomTypes is less than 3, we pad by varying transport & activities bundles
      const roomTypes = resort.roomTypes;
      const baseRoomTypes = [
        roomTypes[roomTypes.length - 1] || roomTypes[0], // Option A (Luxury / highest suite)
        roomTypes[1] || roomTypes[0],                     // Option B (Balanced / mid suite)
        roomTypes[0]                                      // Option C (Budget / standard suite)
      ];

      const generated = baseRoomTypes.map((room, idx) => {
        // Extract room capacity (e.g. "2 Guests" -> 2)
        const cap = parseInt(room.capacity.replace(/\D/g, ""), 10) || 2;
        
        // Calculate dynamic room count needed
        const roomsNeeded = Math.ceil(parsedGuests / cap);

        // Core cost sums
        const hotelCost = room.price * parsedNights * roomsNeeded;
        
        // Transport costs (Option A: flight, Option B: flight/train, Option C: train/self drive)
        let transportMode = preferences.transport;
        if (idx === 0) transportMode = "flight";
        else if (idx === 2) transportMode = "train";
        
        const transportCost = (meta.transportOptions[transportMode] || 3000) * parsedGuests;
        
        // Food costs
        const foodCostPerDay = preferences.food === "Veg" ? 800 : 1200;
        const totalFoodCost = foodCostPerDay * parsedGuests * parsedNights;

        // Activities
        const selectedActivities = meta.activities.slice(0, idx === 0 ? 3 : idx === 1 ? 2 : 1);
        const activitiesCost = selectedActivities.reduce((sum, a) => sum + a.cost, 0) * parsedGuests;

        const cabCost = 1500 * parsedNights;
        const subtotal = hotelCost + transportCost + totalFoodCost + activitiesCost + cabCost;
        const taxes = Math.round(subtotal * 0.12);
        const grandTotal = subtotal + taxes;

        // Option rating scores
        let luxuryScore = idx === 0 ? 5.0 : idx === 1 ? 4.3 : 3.8;
        let romanticScore = resort.category === "beach" ? 4.8 : 4.2;
        let familyScore = resort.category === "mountain" ? 4.7 : 4.1;
        let adventureScore = resort.category === "mountain" ? 4.9 : 3.5;
        let valueScore = idx === 2 ? 4.9 : idx === 1 ? 4.5 : 3.9;

        const label = idx === 0 ? "Luxury Escape" : idx === 1 ? "Balanced / Recommended" : "Budget Value";

        // Day-wise hourly timeline mapping
        const day1Events = [
          { time: "11:30 AM", title: `Arrival in ${meta.region}`, desc: `Cab pick-up transit to ${resort.name}` },
          { time: "01:00 PM", title: "Resort Check-In", desc: `Welcome drinks and check-in to ${roomsNeeded}x ${room.title}` },
          { time: "02:00 PM", title: "Lunch by the Pool", desc: "Enjoy delicious local delicacies with a view" },
          { time: "08:00 PM", title: "Dinner Night", desc: "Fine course dinner served by the resort beachside" }
        ];

        const day2Events = [
          { time: "08:00 AM", title: "Breakfast with a View", desc: "Healthy buffet breakfast selection" },
          { time: "10:00 AM", title: `${selectedActivities[0]?.name || "Local Excursions"}`, desc: "Included resort activity excursion" },
          { time: "04:00 PM", title: "Leisure & Spa", desc: "Access to private sauna and pool facilities" },
          { time: "08:00 PM", title: "BBQ Dinner Night", desc: "Live music acoustic show & grill BBQ dinner" }
        ];

        const day3Events = [
          { time: "09:00 AM", title: "Buffet Breakfast", desc: "Final morning breakfast and pool walk" },
          { time: "11:00 AM", title: "Resort Checkout", desc: "Checkout from room and baggage assistance" },
          { time: "01:00 PM", title: "Departure Transit", desc: "Cab drop back to airport / station" }
        ];

        return {
          id: `opt-${idx + 1}`,
          type: idx === 0 ? "A" : idx === 1 ? "B" : "C",
          title: `${resort.name} - ${label}`,
          resortName: resort.name,
          resortImage: resort.heroImage,
          location: resort.location,
          roomTitle: `${roomsNeeded}x ${room.title}`,
          grandTotal,
          guests: parsedGuests,
          nights: parsedNights,
          weather: meta.weather,
          bestMonths: meta.bestMonths,
          safety: meta.safety,
          scores: { luxury: luxuryScore, romantic: romanticScore, family: familyScore, adventure: adventureScore, value: valueScore },
          breakdown: { hotel: hotelCost, transport: transportCost, food: totalFoodCost, activities: activitiesCost, taxes, cab: cabCost, buffer: 0 },
          activities: selectedActivities,
          pros: idx === 0 ? ["All activities included", "Butler service"] : ["Free cancellation", "Spa voucher"],
          cons: idx === 0 ? ["Premium rate"] : ["Standard suite"],
          resortDetails: resort,
          itinerary: { day1: day1Events, day2: day2Events, day3: day3Events }
        };
      });

      const sorted = [...generated].sort((a, b) => b.grandTotal - a.grandTotal);
      sorted[0].type = "A"; 
      if (sorted[1]) sorted[1].type = "B"; 
      if (sorted[2]) sorted[2].type = "C"; 

      const recommended = sorted[0]; // Set Option A as default selection
      
      let replyText = "";
      if (recommended.grandTotal > parsedBudget) {
        const overshoot = recommended.grandTotal - parsedBudget;
        replyText = `Hi! I'm RIVO 👋\n\nI parsed your Goa request for ${parsedGuests} guests. The premium Option A slightly exceeds your ₹${parsedBudget.toLocaleString()} budget by ₹${overshoot.toLocaleString()}.\n\n⚠️ **Rivo Budget Optimization options:**\n- Switch to **Option B** or **C** (saves up to ₹${(recommended.grandTotal - sorted[2].grandTotal).toLocaleString()} by selecting lower suite allocations).\n- Change dates to mid-week rates (saves 15%).`;
      } else {
        const savings = parsedBudget - recommended.grandTotal;
        replyText = `Hi! I'm RIVO 👋\n\nI parsed your Goa request for ${parsedGuests} guests. Option A is fully under your ₹${parsedBudget.toLocaleString()} budget (saves ₹${savings.toLocaleString()})! I've booked ${recommended.roomTitle} at *${recommended.resortName}*. Enjoy your luxury vacation!`;
      }

      setOptions(sorted);
      setSelectedOption(sorted[0]); 
      setIsAnalyzing(false);
      setActiveMobileTab("itinerary");

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "rivo",
          text: replyText,
          avatar: rivoMascot,
          time: timeStr
        }
      ]);

      setPreferences(prev => ({
        ...prev,
        budget: parsedBudget,
        travellers: parsedGuests,
        nights: parsedNights
      }));

    }, 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "user", text: userText, time: timeStr }
    ]);
    setChatInput("");
    runAIEngine(userText);
  };

  const triggerAdjustment = (type) => {
    let currentBudget = preferences.budget;
    let textPrompt = "";

    if (type === "luxury") {
      currentBudget = Math.round(currentBudget * 1.3);
      textPrompt = "Upgrading stays for high luxury options...";
      setPreferences(prev => ({ ...prev, budget: currentBudget }));
    } else if (type === "budget") {
      currentBudget = Math.round(currentBudget * 0.75);
      textPrompt = "Reducing budget for economical deals...";
      setPreferences(prev => ({ ...prev, budget: currentBudget }));
    } else if (type === "adventure") {
      textPrompt = "Optimizing tours for high adventure sports...";
    } else if (type === "romantic") {
      textPrompt = "Filtering for romantic honeymoon couples view...";
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "user", text: `Quick Adjust: ${type.toUpperCase()}`, time: timeStr }
    ]);

    runAIEngine(textPrompt);
  };

  const handleToggleExpandAll = (val) => {
    setExpandedDays({ day1: val, day2: val, day3: val, day4: val });
  };

  const handleBookEntireTrip = () => {
    setShowBookingModal(true);
  };

  const handleConfirmCheckout = () => {
    setIsBooked(true);
    setShowBookingModal(false);

    try {
      const existing = JSON.parse(localStorage.getItem("reservo-bookings") || "[]");
      const bookingCode = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking = {
        id: bookingCode,
        resortName: selectedOption.resortName,
        checkin: "2026-05-12",
        checkout: "2026-05-14",
        status: "Confirmed",
        total: selectedOption.grandTotal
      };
      existing.unshift(newBooking);
      localStorage.setItem("reservo-bookings", JSON.stringify(existing));
    } catch(e) {
      console.error(e);
    }
  };

  const formatMessageText = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, lineIdx) => {
      const boldSplit = line.split("**");
      const elements = boldSplit.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-extrabold text-primary">{part}</strong>;
        }
        const italicSplit = part.split("*");
        return italicSplit.map((subpart, subindex) => {
          if (subindex % 2 === 1) {
            return <em key={`${index}-${subindex}`} className="italic text-primary font-semibold">{subpart}</em>;
          }
          return subpart;
        });
      });
      return <span key={lineIdx} className="block min-h-[1.2em]">{elements}</span>;
    });
  };

  return (
    <div className="h-[calc(100vh-112px)] flex flex-col bg-bg-light text-text-dark transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Mobile Sub-Navigation Tabs */}
      <div className="md:hidden flex border-b border-border-color bg-bg-white shrink-0 p-2 gap-2">
        <button 
          onClick={() => setActiveMobileTab("chat")}
          className={`flex-1 py-2 text-center text-[10.5px] font-extrabold rounded-xl transition cursor-pointer ${
            activeMobileTab === "chat" 
              ? "bg-primary text-white shadow-sm" 
              : "bg-bg-light text-text-gray hover:text-text-dark"
          }`}
        >
          💬 Chat Feed
        </button>
        <button 
          onClick={() => options.length > 0 && setActiveMobileTab("itinerary")}
          disabled={options.length === 0}
          className={`flex-1 py-2 text-center text-[10.5px] font-extrabold rounded-xl transition ${
            options.length === 0 ? "opacity-35 cursor-not-allowed" : "cursor-pointer"
          } ${
            activeMobileTab === "itinerary" 
              ? "bg-primary text-white shadow-sm" 
              : "bg-bg-light text-text-gray hover:text-text-dark"
          }`}
        >
          📅 Day Timeline
        </button>
        <button 
          onClick={() => options.length > 0 && setActiveMobileTab("checkout")}
          disabled={options.length === 0}
          className={`flex-1 py-2 text-center text-[10.5px] font-extrabold rounded-xl transition ${
            options.length === 0 ? "opacity-35 cursor-not-allowed" : "cursor-pointer"
          } ${
            activeMobileTab === "checkout" 
              ? "bg-primary text-white shadow-sm" 
              : "bg-bg-light text-text-gray hover:text-text-dark"
          }`}
        >
          💳 Checkout Specs
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ── COLUMN 1: RIVO CHAT SIDEBAR (Width: 350px) ─────────────────── */}
        <div className={`border-r border-border-color bg-bg-white flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarCollapsed ? "w-0 opacity-0 border-r-0 pointer-events-none" : "w-full md:w-[350px] shrink-0"
        } ${activeMobileTab === "chat" ? "flex" : "hidden md:flex"}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border-color flex items-center justify-between bg-bg-white shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-primary text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> RIVO AI Travel Planner
              <span className="bg-bg-light text-text-gray text-[8px] font-bold px-1.5 py-0.5 rounded-full ml-1.5 uppercase">BETA</span>
            </div>
            <p className="text-[10px] text-text-gray mt-0.5 font-medium">Your AI travel buddy for perfect trips</p>
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(true)}
            className="w-7 h-7 rounded-lg hover:bg-bg-light border-none cursor-pointer flex items-center justify-center text-text-gray"
            title="Collapse Sidebar"
          >
            <ChevronRight className="w-4 h-4 transform rotate-180" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 py-3 border-b border-border-color bg-bg-light/50 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 rounded-xl text-[10px] font-extrabold transition flex items-center justify-center gap-1.5 border-none cursor-pointer ${
              activeTab === "chat"
                ? "bg-primary text-white shadow"
                : "bg-transparent text-text-gray hover:text-text-dark"
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Chat with RIVO
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-2 rounded-xl text-[10px] font-extrabold transition flex items-center justify-center gap-1.5 border-none cursor-pointer ${
              activeTab === "form"
                ? "bg-primary text-white shadow"
                : "bg-transparent text-text-gray hover:text-text-dark"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Smart Form
          </button>
        </div>

        {/* Dynamic chat feed */}
        {activeTab === "chat" ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fcfdfe] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 max-w-[85%] ${
                  msg.sender === "user" ? "self-end flex-row-reverse ml-auto" : "self-start"
                }`}>
                  {msg.sender === "rivo" && (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 bg-white shrink-0 shadow-sm mt-0.5">
                      <img src={msg.avatar} alt="Rivo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-[0_1px_4px_rgba(0,0,0,0.01)] ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-bg-white text-text-dark border border-border-color rounded-tl-none"
                    }`}>
                      {formatMessageText(msg.text)}
                    </div>
                    <span className={`text-[8px] text-text-gray mt-1 block font-medium ${
                      msg.sender === "user" ? "text-right" : ""
                    }`}>{msg.time}</span>
                  </div>
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex gap-2 max-w-[85%] self-start animate-pulse">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-border-color shrink-0 bg-bg-white mt-0.5">
                    <img src={rivoSearching} alt="Rivo" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-bg-white border border-border-color p-3 rounded-2xl rounded-tl-none shadow-sm flex flex-col gap-1.5 min-w-[150px]">
                    <span className="text-[10px] font-bold text-text-dark">{thinkingStep}</span>
                    <div className="w-full h-1 bg-bg-light rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-[shimmer_1.5s_infinite] w-1/3 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggetions pills */}
            <div className="p-3 border-t border-border-color bg-bg-light/50 shrink-0">
              <span className="text-[9px] font-bold text-text-gray uppercase tracking-wider block mb-2">Try these:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Surprise me ✨", prompt: "Surprise me with a trip under 40k" },
                  { label: "Budget trip 🌴", prompt: "Budget trip for 2 nights under 30k" },
                  { label: "Honeymoon 💖", prompt: "Romantic honeymoon couple trip to Maldives" },
                  { label: "Weekend getaway 🏖️", prompt: "Weekend getaway near Mumbai for 2 nights" }
                ].map(s => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setActiveTab("chat");
                      setChatInput(s.prompt);
                      setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: s.prompt, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                      runAIEngine(s.prompt);
                    }}
                    className="bg-bg-white border border-border-color py-1.5 px-2 rounded-xl text-[10px] font-bold text-text-dark hover:border-primary transition cursor-pointer text-center"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Send input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border-color flex items-center gap-2 bg-bg-white shrink-0">
              <input
                type="text"
                placeholder="Type your travel plan..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-bg-light border border-border-color text-text-dark rounded-full px-4 py-2.5 text-[11px] outline-none focus:border-primary transition"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={isAnalyzing || !chatInput.trim()}
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center border-none shadow hover:bg-primary-dark disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="bg-bg-light text-center py-1 text-[8px] text-text-gray font-medium border-t border-border-color shrink-0">
              RIVO can make mistakes. Please review details before booking.
            </div>
          </div>
        ) : (
          /* Form Inputs inside left sidebar */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-white/50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-gray uppercase">
                <span>Budget Cap</span>
                <span className="text-primary text-xs">₹{preferences.budget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="15000"
                max="150000"
                step="5000"
                value={preferences.budget}
                onChange={(e) => handleFormChange("budget", Number(e.target.value))}
                className="w-full accent-primary cursor-pointer mt-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-text-gray uppercase">Guests Count</label>
              <select
                value={preferences.travellers}
                onChange={(e) => handleFormChange("travellers", Number(e.target.value))}
                className="w-full border border-border-color rounded-lg p-2 text-[10.5px] font-semibold bg-bg-white text-text-dark outline-none"
              >
                <option value="1">1 Adult (Solo)</option>
                <option value="2">2 Adults (Couples)</option>
                <option value="4">4 Adults (Family)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-text-gray uppercase">Departure City</label>
              <input
                type="text"
                value={preferences.departure}
                onChange={(e) => handleFormChange("departure", e.target.value)}
                className="w-full border border-border-color rounded-lg p-2 text-[10.5px] font-semibold bg-bg-white text-text-dark outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-text-gray uppercase">Trip Duration</label>
              <select
                value={preferences.nights}
                onChange={(e) => handleFormChange("nights", Number(e.target.value))}
                className="w-full border border-border-color rounded-lg p-2 text-[10.5px] font-semibold bg-bg-white text-text-dark outline-none"
              >
                <option value="1">1 Night (Weekend)</option>
                <option value="2">2 Nights</option>
                <option value="3">3 Nights</option>
                <option value="5">5 Nights</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-text-gray uppercase">Preferred Transport</label>
              <select
                value={preferences.transport}
                onChange={(e) => handleFormChange("transport", e.target.value)}
                className="w-full border border-border-color rounded-lg p-2 text-[10.5px] font-semibold bg-bg-white text-text-dark outline-none"
              >
                <option value="flight">✈️ Flight Route</option>
                <option value="train">🚂 Train Express</option>
                <option value="selfDrive">🚗 Road Trip (Self Drive)</option>
              </select>
            </div>

            <button
              onClick={() => {
                setActiveTab("chat");
                runAIEngine("");
              }}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Generate Plan
            </button>

          </div>
        )}

      </div>

      {/* Collapse Restore Button */}
      {isSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="absolute top-[135px] left-0 z-50 bg-bg-white border border-border-color border-l-0 shadow rounded-r-lg w-7 h-10 flex items-center justify-center cursor-pointer text-text-gray hover:text-text-dark"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {options.length === 0 ? (
        /* INITIAL WELCOME STATE covering both Middle and Right Columns */
        <div className="flex-1 bg-bg-light/50 overflow-y-auto p-6 flex flex-col justify-center items-center animate-fade-in">
          <div className="max-w-[550px] w-full space-y-6 text-center">
            
            <div className="bg-[#1E293B] text-white p-6 rounded-3xl border border-[#334155] shadow-lg flex flex-col sm:flex-row gap-5 items-center text-left">
              <img src={rivoPlanner} alt="Rivo Mascot" className="w-16 h-16 rounded-full object-cover border-2 border-gold shrink-0 shadow-md animate-pulse" />
              <div>
                <h4 className="text-base font-bold text-white">Hi! I'm RIVO 👋 Your AI Travel Concierge</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                  "I will compare hotels, flights, and activities across thousands of destinations to build your perfect custom itinerary. Tell me your budget, nights, or preferences in the chat panel to begin!"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg-white border border-border-color rounded-2xl p-5 text-left shadow-sm space-y-2.5">
                <h5 className="text-[10px] font-bold text-text-dark uppercase tracking-wider pb-1 border-b border-border-color">Setup Settings</h5>
                <div className="space-y-1.5 text-[11px] font-semibold text-text-dark">
                  <div className="flex justify-between">
                    <span className="text-text-gray">Budget limit:</span>
                    <span className="text-primary font-bold">₹{preferences.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-gray">Nights stay:</span>
                    <span>{preferences.nights} Nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-gray">Guests count:</span>
                    <span>{preferences.travellers} Adults</span>
                  </div>
                </div>
              </div>

              <div className="bg-bg-white border border-border-color rounded-2xl p-5 text-left shadow-sm space-y-2.5">
                <h5 className="text-[10px] font-bold text-text-dark uppercase tracking-wider pb-1 border-b border-border-color">Trust Badges</h5>
                <div className="space-y-1.5 text-[10px] text-text-gray font-semibold">
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> <span className="text-text-dark">Best Price Match Guarantee</span></div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> <span className="text-text-dark">Unified Complete Checkout</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : selectedOption && (
        <>
          {/* ── COLUMN 2: MIDDLE DETAILED ACCORDION TIMELINE (Flex-1) ────────── */}
          <div className={`flex-1 bg-bg-light flex flex-col overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full ${
            activeMobileTab === "itinerary" ? "flex" : "hidden md:flex"
          }`}>
        
        {/* OPTION SELECTOR & ADJUSTRS HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-bg-white border border-border-color rounded-2xl p-4.5 shadow-sm">
          
          {/* SELECT OPTION */}
          <div className="md:col-span-8">
            <span className="text-[9px] font-bold text-text-gray uppercase tracking-widest block mb-2">SELECT OPTION</span>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {options.map((opt) => {
                const active = selectedOption?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`flex-1 min-w-[130px] border rounded-xl p-3 text-left transition cursor-pointer relative ${
                      active
                        ? "bg-bg-light border-primary ring-2 ring-primary/5"
                        : "bg-bg-white border-border-color hover:border-primary/40"
                    }`}
                  >
                    {opt.type === "A" && (
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow">★ BEST</span>
                    )}
                    <span className="text-[10px] text-text-gray font-bold block">Option {opt.type}</span>
                    <span className="text-[13px] font-extrabold text-text-dark block mt-0.5">₹{opt.grandTotal.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUICK ADJUST */}
          <div className="md:col-span-4 border-l border-border-color pl-4">
            <span className="text-[9px] font-bold text-text-gray uppercase tracking-widest block mb-2">QUICK ADJUST</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button onClick={() => triggerAdjustment("luxury")} className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 rounded-lg py-1.5 text-[9px] font-bold transition cursor-pointer">👑 More Luxury</button>
              <button onClick={() => triggerAdjustment("budget")} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-lg py-1.5 text-[9px] font-bold transition cursor-pointer">💰 Save Money</button>
              <button onClick={() => triggerAdjustment("adventure")} className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/60 rounded-lg py-1.5 text-[9px] font-bold transition cursor-pointer">🏂 Adventure</button>
              <button onClick={() => triggerAdjustment("romantic")} className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 rounded-lg py-1.5 text-[9px] font-bold transition cursor-pointer">💖 Romantic</button>
            </div>
          </div>

        </div>

        {/* SELECTED RESORT OVERVIEW CARD */}
        <div className="bg-bg-white border border-border-color rounded-3xl p-5 shadow-sm flex flex-col md:flex-row gap-5">
          <div 
            onClick={() => navigate(`/resort/${selectedOption.resortDetails.id}`)}
            className="w-full md:w-[180px] h-[110px] rounded-2xl overflow-hidden shrink-0 bg-bg-light cursor-pointer hover:opacity-90 hover:scale-[1.02] transition duration-300"
            title="Click to view resort details"
          >
            <img src={selectedOption.resortImage} alt={selectedOption.resortName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Option {selectedOption.type} - {selectedOption.type === "A" ? "Best Match" : selectedOption.type === "B" ? "Recommended" : "Economic"}</span>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-dark bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-current text-yellow-500" /> {selectedOption.scores.luxury}/5
                </div>
              </div>
              <h2 
                onClick={() => navigate(`/resort/${selectedOption.resortDetails.id}`)}
                className="text-xl font-extrabold text-text-dark mt-1 font-serif cursor-pointer hover:text-primary transition"
                title="Click to view resort details"
              >
                {selectedOption.resortName}
              </h2>
              <p className="text-[10.5px] text-text-gray font-semibold mt-0.5">{selectedOption.nights} Nights • {selectedOption.guests} Adults • Route {preferences.departure}</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {["Beachfront", "Private Pool", "Relaxation", "Romantic"].map(t => (
                <span key={t} className="bg-bg-light border border-border-color text-text-dark text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ACCORDION DAY-BY-DAY TIMELINE */}
        <div className="bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border-color">
            <h3 className="text-[15px] font-bold text-text-dark font-serif">Day-by-Day Itinerary</h3>
            <div className="flex gap-3 text-[10px] font-extrabold text-primary">
              <button onClick={() => handleToggleExpandAll(true)} className="bg-transparent border-none cursor-pointer hover:underline">Expand All</button>
              <button onClick={() => handleToggleExpandAll(false)} className="bg-transparent border-none cursor-pointer hover:underline">Collapse All</button>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Day 1 Accordion */}
            <div className="border border-border-color rounded-2xl overflow-hidden">
              <div 
                onClick={() => setExpandedDays(prev => ({ ...prev, day1: !prev.day1 }))}
                className="bg-bg-light/50 p-4 flex justify-between items-center cursor-pointer select-none"
              >
                <div>
                  <h4 className="text-xs font-bold text-text-dark">Day 1 - Arrival & Relax</h4>
                  <p className="text-[9px] text-text-gray mt-0.5">Welcome reception, suite setup & sunset view</p>
                </div>
                {expandedDays.day1 ? <ChevronUp className="w-4 h-4 text-text-gray" /> : <ChevronDown className="w-4 h-4 text-text-gray" />}
              </div>
              
              {expandedDays.day1 && (
                <div className="p-4 bg-bg-white border-t border-border-color pl-8 space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-border-color">
                  {selectedOption.itinerary?.day1?.map((item, idx) => (
                    <div key={idx} className="relative pl-6 text-[11px] leading-relaxed">
                      <div className="absolute -left-7.5 top-1.5 w-2 h-2 rounded-full bg-primary border-4 border-bg-white shadow-sm ring-1 ring-primary/20" />
                      <span className="text-[9px] font-bold text-primary block mb-0.5">{item.time}</span>
                      <strong className="text-text-dark block">{item.title}</strong>
                      <span className="text-text-gray text-[10.5px] font-medium mt-0.5 block">{item.desc}</span>
                    </div>
                  )) || (
                    <p className="text-xs text-text-gray">No structured timeline generated for this day.</p>
                  )}
                </div>
              )}
            </div>

            {/* Day 2 Accordion */}
            <div className="border border-border-color rounded-2xl overflow-hidden">
              <div 
                onClick={() => setExpandedDays(prev => ({ ...prev, day2: !prev.day2 }))}
                className="bg-bg-light/50 p-4 flex justify-between items-center cursor-pointer select-none"
              >
                <div>
                  <h4 className="text-xs font-bold text-text-dark">Day 2 - Explore & Enjoy</h4>
                  <p className="text-[9px] text-text-gray mt-0.5">Active sports, fine lunch, and spa therapies</p>
                </div>
                {expandedDays.day2 ? <ChevronUp className="w-4 h-4 text-text-gray" /> : <ChevronDown className="w-4 h-4 text-text-gray" />}
              </div>
              
              {expandedDays.day2 && (
                <div className="p-4 bg-bg-white border-t border-border-color pl-8 space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-border-color">
                  {selectedOption.itinerary?.day2?.map((item, idx) => (
                    <div key={idx} className="relative pl-6 text-[11px] leading-relaxed">
                      <div className="absolute -left-7.5 top-1.5 w-2 h-2 rounded-full bg-primary border-4 border-bg-white shadow-sm ring-1 ring-primary/20" />
                      <span className="text-[9px] font-bold text-primary block mb-0.5">{item.time}</span>
                      <strong className="text-text-dark block">{item.title}</strong>
                      <span className="text-text-gray text-[10.5px] font-medium mt-0.5 block">{item.desc}</span>
                    </div>
                  )) || (
                    <p className="text-xs text-text-gray">No structured timeline generated for this day.</p>
                  )}
                </div>
              )}
            </div>

            {/* Day 3 Accordion */}
            <div className="border border-border-color rounded-2xl overflow-hidden">
              <div 
                onClick={() => setExpandedDays(prev => ({ ...prev, day3: !prev.day3 }))}
                className="bg-bg-light/50 p-4 flex justify-between items-center cursor-pointer select-none"
              >
                <div>
                  <h4 className="text-xs font-bold text-text-dark">Day 3 - Checkout & Return</h4>
                  <p className="text-[9px] text-text-gray mt-0.5">Leisure checkouts and airport drops</p>
                </div>
                {expandedDays.day3 ? <ChevronUp className="w-4 h-4 text-text-gray" /> : <ChevronDown className="w-4 h-4 text-text-gray" />}
              </div>
              
              {expandedDays.day3 && (
                <div className="p-4 bg-bg-white border-t border-border-color pl-8 space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-border-color">
                  {selectedOption.itinerary?.day3?.map((item, idx) => (
                    <div key={idx} className="relative pl-6 text-[11px] leading-relaxed">
                      <div className="absolute -left-7.5 top-1.5 w-2 h-2 rounded-full bg-primary border-4 border-bg-white shadow-sm ring-1 ring-primary/20" />
                      <span className="text-[9px] font-bold text-primary block mb-0.5">{item.time}</span>
                      <strong className="text-text-dark block">{item.title}</strong>
                      <span className="text-text-gray text-[10.5px] font-medium mt-0.5 block">{item.desc}</span>
                    </div>
                  )) || (
                    <p className="text-xs text-text-gray">No structured timeline generated for this day.</p>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ── COLUMN 3: RIGHT PANEL DETAILED STATS (Width: 360px) ─────────────────── */}
      <div className={`w-full md:w-[360px] border-l border-border-color bg-bg-white flex flex-col overflow-y-auto p-6 space-y-6 shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.01)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full ${
        activeMobileTab === "checkout" ? "flex" : "hidden md:flex"
      }`}>
        
        {/* TRIP SUMMARY */}
        <div className="bg-bg-light border border-border-color rounded-2xl p-4.5 space-y-3">
          <div className="flex justify-between items-center border-b border-border-color pb-2">
            <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider">Trip Summary</h4>
            <span className="bg-rose-500/10 text-rose-500 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Romantic Getaway</span>
          </div>

          <div className="space-y-2.5 text-[11.5px] font-semibold text-text-dark">
            <div className="flex justify-between">
              <span className="text-text-gray flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> Destination</span>
              <span>{selectedOption.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-primary" /> Resort</span>
              <span className="text-right max-w-[180px] truncate">{selectedOption.resortName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray flex items-center gap-1.5"><Waves className="w-3.5 h-3.5 text-primary" /> Suite Room</span>
              <span className="text-right max-w-[180px] truncate">{selectedOption.roomTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Check-in</span>
              <span>12 May 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Check-out</span>
              <span>14 May 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /> Guests</span>
              <span>{selectedOption.guests} Adults</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5 text-primary" /> From City</span>
              <span>{preferences.departure}</span>
            </div>
          </div>
        </div>

        {/* PRICE BREAKDOWN TABLE */}
        <div className="bg-bg-white border border-border-color rounded-2xl p-5 shadow-sm space-y-3.5 text-[11.5px]">
          <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-color pb-2">Price Breakdown</h4>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-text-gray">
              <span>🏨 Resort ({selectedOption.nights} Nights)</span>
              <span className="font-bold text-text-dark">₹{selectedOption.breakdown.hotel.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-text-gray">
              <span>✈️ Transport (Cab + Airport)</span>
              <span className="font-bold text-text-dark">₹{selectedOption.breakdown.transport.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-text-gray">
              <span>🏄 Activities & Experiences</span>
              <span className="font-bold text-text-dark">₹{selectedOption.breakdown.activities.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-text-gray">
              <span>🥗 Food & Beverages</span>
              <span className="font-bold text-text-dark">₹{selectedOption.breakdown.food.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-text-gray border-b border-border-color pb-2.5">
              <span>🛡️ Taxes & Service Fees</span>
              <span className="font-bold text-text-dark">₹{selectedOption.breakdown.taxes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-extrabold text-primary pt-0.5">
              <span>Total Trip Cost</span>
              <span>₹{selectedOption.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS GRID */}
        <div className="bg-bg-white border border-border-color rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-color pb-2">Trip Highlights</h4>
          <div className="grid grid-cols-2 gap-2 text-[10.5px] font-bold text-text-dark">
            <div className="flex items-center gap-2 bg-bg-light border border-border-color p-2.5 rounded-xl"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Private Pool</div>
            <div className="flex items-center gap-2 bg-bg-light border border-border-color p-2.5 rounded-xl"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Beachfront</div>
            <div className="flex items-center gap-2 bg-bg-light border border-border-color p-2.5 rounded-xl"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Spa & Wellness</div>
            <div className="flex items-center gap-2 bg-bg-light border border-border-color p-2.5 rounded-xl"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Water Sports</div>
          </div>
        </div>

        {/* LOCATION MAP SECTION */}
        <div className="bg-bg-white border border-border-color rounded-2xl p-4.5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider">Location</h4>
          <div className="w-full h-32 rounded-xl overflow-hidden border border-border-color bg-bg-light relative">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=350&q=80" alt="Map View" className="w-full h-full object-cover opacity-85 filter brightness-95" />
            <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/50 via-transparent to-transparent">
              <button className="w-full py-2 bg-bg-white text-text-dark text-[10px] font-bold rounded-lg border-none shadow cursor-pointer hover:bg-bg-light transition flex items-center justify-center gap-1.5">
                <Map className="w-3.5 h-3.5 text-primary" /> View on Map
              </button>
            </div>
            <div className="absolute top-8 left-1/3 w-3 h-3 rounded-full bg-primary border-2 border-bg-white shadow animate-ping" />
            <div className="absolute top-8 left-1/3 w-3 h-3 rounded-full bg-primary border-2 border-bg-white shadow" />
          </div>
        </div>

        {/* BOOK ENTIRE TRIP CTA */}
        <div className="space-y-2 pt-2">
          {!isBooked ? (
            <button
              onClick={handleBookEntireTrip}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-lg border-none cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-300" /> Book Entire Trip (Single Checkout)
            </button>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4.5 rounded-2xl flex flex-col items-center text-center gap-2 animate-fade-in">
              <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />
              <div>
                <h4 className="text-xs font-extrabold text-emerald-500">Unified Vacation Confirmed!</h4>
                <p className="text-[9.5px] text-text-gray">Hotel room, transfers and flights details saved to your profile booking tab.</p>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg border-none cursor-pointer"
              >
                View Passes in Profile
              </button>
            </div>
          )}
          <div className="flex justify-between items-center text-[10px] font-semibold text-text-gray px-1">
            <span>Free cancellation up to 24 hours</span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-[#2F80ED]">RIVO Chat</span>
              <Smile className="w-3.5 h-3.5 text-[#2F80ED]" />
            </div>
          </div>
        </div>

      </div>
      </>
      )}

      </div>

      {/* ── ONE CHECKOUT BUNDLE MODAL ───────────────────── */}
      {showBookingModal && selectedOption && (
        <div className="fixed inset-0 z-[5000] bg-[#0A1120]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-bg-white rounded-3xl border border-border-color max-w-[420px] w-full shadow-2xl overflow-hidden animate-scale-in-center">
            
            <div className="bg-primary p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[8px] font-bold text-blue-200 uppercase tracking-widest block">RESERVO UNIFIED CHECKOUT</span>
                <h4 className="text-base font-bold mt-0.5">{selectedOption.resortName} Bundle</h4>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div className="bg-bg-light border border-border-color p-3.5 rounded-xl space-y-2 text-[10px]">
                <div className="flex justify-between pb-2 border-b border-border-color">
                  <span>🏨 Stays: {selectedOption.resortName}</span>
                  <span className="font-bold">₹{selectedOption.breakdown.hotel.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border-color">
                  <span>✈️ Transit Flight Flights</span>
                  <span className="font-bold">₹{selectedOption.breakdown.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border-color">
                  <span>🥗 Food & Meal Plans</span>
                  <span className="font-bold">₹{selectedOption.breakdown.food.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>🛡️ Taxes & Service Fees</span>
                  <span className="font-bold">₹{selectedOption.breakdown.taxes.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-extrabold text-primary border-t border-border-color pt-2.5">
                <span>Unified Total</span>
                <span>₹{selectedOption.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-5 bg-bg-light border-t border-border-color flex gap-2">
              <button onClick={handleConfirmCheckout} className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg shadow cursor-pointer border-none text-center">
                Pay ₹{selectedOption.grandTotal.toLocaleString()}
              </button>
              <button onClick={() => setShowBookingModal(false)} className="px-4 py-3 bg-bg-light hover:bg-border-color text-text-dark text-[11px] font-bold rounded-lg border-none cursor-pointer">
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
