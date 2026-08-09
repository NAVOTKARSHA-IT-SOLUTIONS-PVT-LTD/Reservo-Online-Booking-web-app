import React, { useState, useEffect } from "react";
import { 
  Building, Bed, Calendar, Users, DollarSign, Activity, 
  MessageSquare, Gift, Shield, Bell, Settings, LogOut, 
  Search, Plus, Filter, Trash2, Edit3, ArrowLeft, 
  FileText, Sparkles, AlertCircle, CheckCircle, BarChart3, 
  Upload, Check, X, ShieldCheck, PieChart, Layers, HelpCircle, UserCheck,
  Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResortAdminPortal() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Theme Detection & Observer
  const [isDarkMode, setIsDarkMode] = useState(
    document.body.classList.contains("dark-theme") || 
    localStorage.getItem("reservo-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-theme"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Navigation sidebar items
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Modals status
  const [showAddResortModal, setShowAddResortModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showAiOptimizerModal, setShowAiOptimizerModal] = useState(false);
  
  // Notification Toast state
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // State data for Resort Admin Portal
  const [resorts, setResorts] = useState([
    { id: 1, name: "Ocean Bliss Resort", location: "Goa, India", status: "Live", rating: 4.8, occupancy: 87, rooms: 40, revenue: 324500, bookings: 124, description: "Beachfront luxury resort with premium view rooms.", tag: "Breakfast Included", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Royal Palm Retreat", location: "Bali, Indonesia", status: "Live", rating: 4.7, occupancy: 78, rooms: 35, revenue: 218700, bookings: 88, description: "Serene wellness retreat in the heart of lush palms.", tag: "Free Cancellation", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Sunset Lagoon Resort", location: "Maldives", status: "Draft", rating: 4.9, occupancy: 0, rooms: 30, revenue: 0, bookings: 0, description: "Overwater bungalows with glass floor panels.", tag: "All Inclusive", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Hill View Escape", location: "Udaipur, India", status: "Pending", rating: 4.6, occupancy: 42, rooms: 25, revenue: 84300, bookings: 31, description: "Heritage palace overlooking Lake Pichola.", tag: "Pay at Hotel", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" }
  ]);

  const [rooms, setRooms] = useState([
    { id: 101, roomNumber: "101", resortId: 1, type: "Deluxe Sea View", pricePerNight: 8999, status: "Occupied", cleaning: "Clean", maintenance: "None" },
    { id: 102, roomNumber: "102", resortId: 1, type: "Deluxe", pricePerNight: 6999, status: "Available", cleaning: "Cleaning", maintenance: "None" },
    { id: 201, roomNumber: "201", resortId: 2, type: "Suite", pricePerNight: 12499, status: "Blocked", cleaning: "Clean", maintenance: "AC Repair" },
    { id: 301, roomNumber: "301", resortId: 3, type: "Villa with Pool", pricePerNight: 18999, status: "Maintenance", cleaning: "Dirty", maintenance: "Plumbing" },
    { id: 401, roomNumber: "401", resortId: 4, type: "Standard", pricePerNight: 4999, status: "Available", cleaning: "Clean", maintenance: "None" }
  ]);

  const [bookings, setBookings] = useState([
    { id: 201, code: "RS88902", guestName: "Aman Sharma", resortName: "Ocean Bliss Resort", roomNumber: "101", checkIn: "2026-08-06", checkOut: "2026-08-09", amount: 26997, paymentStatus: "Paid", status: "Checked In" },
    { id: 202, code: "RS88903", guestName: "Priya Patel", resortName: "Royal Palm Retreat", roomNumber: "201", checkIn: "2026-08-06", checkOut: "2026-08-08", amount: 24998, paymentStatus: "Paid", status: "Checked In" },
    { id: 203, code: "RS88904", guestName: "Raj Malhotra", resortName: "Ocean Bliss Resort", roomNumber: "102", checkIn: "2026-08-07", checkOut: "2026-08-10", amount: 20997, paymentStatus: "Pending", status: "Upcoming" },
    { id: 204, code: "RS88905", guestName: "Neha Sen", resortName: "Hill View Escape", roomNumber: "401", checkIn: "2026-08-06", checkOut: "2026-08-07", amount: 4999, paymentStatus: "Refunded", status: "Cancelled" }
  ]);

  const [guests, setGuests] = useState([
    { id: 1, name: "Aman Sharma", email: "aman@gmail.com", phone: "+91 98765 43210", bookingsCount: 3, totalSpend: 82400, preferences: "High floor, extra pillows" },
    { id: 2, name: "Priya Patel", email: "priya@yahoo.com", phone: "+91 87654 32109", bookingsCount: 5, totalSpend: 134000, preferences: "Gluten-free diet, Spa lover" },
    { id: 3, name: "Raj Malhotra", email: "raj@outlook.com", phone: "+91 76543 21098", bookingsCount: 1, totalSpend: 20997, preferences: "Near elevator, late check-out" }
  ]);

  const [payments, setPayments] = useState([
    { id: 501, transactionId: "TXN9901", invoiceNumber: "INV-2026-001", amount: 26997, tax: 3240, commission: 2700, status: "Payout Released", date: "2026-08-06" },
    { id: 502, transactionId: "TXN9902", invoiceNumber: "INV-2026-002", amount: 24998, tax: 3000, commission: 2500, status: "Processing", date: "2026-08-06" },
    { id: 503, transactionId: "TXN9903", invoiceNumber: "INV-2026-003", amount: 4999, tax: 600, commission: 500, status: "Refunded", date: "2026-08-05" }
  ]);

  const [offers, setOffers] = useState([
    { id: 1, code: "WEEKEND20", type: "Weekend Pricing", discount: "20% Off", status: "Active", expiry: "2026-09-01" },
    { id: 2, code: "MONSOON30", type: "Season Pricing", discount: "30% Off", status: "Active", expiry: "2026-08-31" },
    { id: 3, code: "FESTIVE15", type: "Festival Pricing", discount: "15% Off", status: "Draft", expiry: "2026-10-31" }
  ]);

  const [documents, setDocuments] = useState([
    { name: "GST Certificate", status: "Verified", expiry: "2028-12-31" },
    { name: "PAN Card Registration", status: "Verified", expiry: "N/A" },
    { name: "Resort License", status: "Verification Pending", expiry: "2027-03-31" }
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: "John Doe", role: "Owner", department: "Administration", email: "john@oceanbliss.com", status: "Active" },
    { id: 2, name: "Karan Singh", role: "Manager", department: "Operations", email: "karan@oceanbliss.com", status: "Active" },
    { id: 3, name: "Maya Sharma", role: "Reception", department: "Front Office", email: "maya@oceanbliss.com", status: "Active" },
    { id: 4, name: "Lakhan Lal", role: "Housekeeping", department: "Service", email: "lakhan@oceanbliss.com", status: "Active" }
  ]);

  const [activities, setActivities] = useState([
    { time: "10 mins ago", user: "Maya Sharma", action: "Check-in Guest", details: "Checked-in Aman Sharma into Room 101" },
    { time: "25 mins ago", user: "System", action: "Payment Received", details: "Received ₹24,500 from Booking #BK1250" },
    { time: "1 hour ago", user: "Platform", action: "Review Submitted", details: "Guest Priya Patel left a 5-star review" },
    { time: "2 hours ago", user: "Admin", action: "Resort Approved", details: "Royal Palm Retreat approved for live status" }
  ]);

  // Social feed posts state for the resort
  const [posts, setPosts] = useState([
    { id: 1, resortId: 1, type: "image", mediaUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80", caption: "🌴 Sunsets & Sanctuary. Our newly updated private infinity pool suite is ready to welcome you.", createdAt: "2026-08-08T10:30:00.000Z" },
    { id: 2, resortId: 1, type: "image", mediaUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80", caption: "🍳 Luxury breakfast by the private beachfront cove. Complimentary for all our premium suite bookings.", createdAt: "2026-08-07T08:15:00.000Z" }
  ]);

  const [newPostForm, setNewPostForm] = useState({
    type: "image",
    mediaUrl: "",
    caption: ""
  });

  useEffect(() => {
    const fetchResortPosts = async () => {
      try {
        const res = await fetch("/api/v1/resorts/1/posts");
        if (res.ok) {
          const body = await res.json();
          if (body.data && body.data.length > 0) {
            setPosts(body.data);
          }
        }
      } catch (err) {
        console.error("Failed to load backend posts, using local defaults:", err);
      }
    };
    fetchResortPosts();
  }, []);

  const handlePublishPost = async (e) => {
    e.preventDefault();
    if (!newPostForm.caption) {
      showToast("Please write a post caption!");
      return;
    }

    let defaultUrl = newPostForm.mediaUrl.trim();
    if (!defaultUrl) {
      defaultUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80";
    }

    const postPayload = {
      type: newPostForm.type,
      mediaUrl: defaultUrl,
      caption: newPostForm.caption
    };

    try {
      const response = await fetch("/api/v1/resorts/1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload)
      });

      if (response.ok) {
        const body = await response.json();
        if (body.data) {
          setPosts(prev => [body.data, ...prev]);
          showToast("Social post published to your resort feed!");
          setNewPostForm({ type: "image", mediaUrl: "", caption: "" });
        }
      } else {
        const localSaved = {
          id: Date.now(),
          resortId: 1,
          type: postPayload.type,
          mediaUrl: postPayload.mediaUrl,
          caption: postPayload.caption,
          createdAt: new Date().toISOString()
        };
        setPosts(prev => [localSaved, ...prev]);
        showToast("Post added (local offline fallback)!");
        setNewPostForm({ type: "image", mediaUrl: "", caption: "" });
      }
    } catch (err) {
      console.error(err);
      const localSaved = {
        id: Date.now(),
        resortId: 1,
        type: postPayload.type,
        mediaUrl: postPayload.mediaUrl,
        caption: postPayload.caption,
        createdAt: new Date().toISOString()
      };
      setPosts(prev => [localSaved, ...prev]);
      showToast("Post added (local offline fallback)!");
      setNewPostForm({ type: "image", mediaUrl: "", caption: "" });
    }
  };

  const [reviews, setReviews] = useState([
    { id: 1, author: "Priya Patel", score: 5, sentiment: "Positive", text: "Exceptional beachfront services, staff was extremely hospitable!", status: "Featured" },
    { id: 2, author: "Rahul Verma", score: 4, sentiment: "Positive", text: "Stunning overwater villas, booking was seamless.", status: "Active" },
    { id: 3, author: "Amit Goel", score: 2, sentiment: "Negative", text: "AC was not working on check-in, repair took 3 hours.", status: "Reported" }
  ]);

  // AI Assistant (RIVO) State
  const [rivoInput, setRivoInput] = useState("");
  const [rivoChat, setRivoChat] = useState([
    { sender: "Rivo", msg: "Hello! I am Rivo, your AI Hospitality Optimizer. Select a quick command or ask me about pricing strategies, occupancy predictions, or competitor analyses." }
  ]);

  const [aiScore, setAiScore] = useState({
    quality: 88, gallery: 92, pricing: 85, description: 78, amenities: 90, reviews: 86, completion: 95, health: 89
  });

  // Modal Input states
  const [addResortForm, setAddResortForm] = useState({ name: "", location: "", pricePerNight: "", description: "" });
  const [addRoomForm, setAddRoomForm] = useState({ roomNumber: "", type: "Deluxe", pricePerNight: "", resortId: "1" });
  const [addOfferForm, setAddOfferForm] = useState({ code: "", type: "Discount Coupon", discount: "", expiry: "" });

  const handleAddResort = (e) => {
    e.preventDefault();
    const newRes = {
      id: Date.now(),
      name: addResortForm.name,
      location: addResortForm.location,
      status: "Pending",
      rating: 4.5,
      occupancy: 0,
      rooms: 10,
      revenue: 0,
      bookings: 0,
      description: addResortForm.description,
      tag: "Breakfast Included",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
    };
    setResorts([...resorts, newRes]);
    setShowAddResortModal(false);
    showToast("Resort registered! Waiting for system approval.");
    setAddResortForm({ name: "", location: "", pricePerNight: "", description: "" });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const newRoomObj = {
      id: Date.now(),
      roomNumber: addRoomForm.roomNumber,
      resortId: parseInt(addRoomForm.resortId, 10),
      type: addRoomForm.type,
      pricePerNight: parseFloat(addRoomForm.pricePerNight),
      status: "Available",
      cleaning: "Clean",
      maintenance: "None"
    };
    setRooms([...rooms, newRoomObj]);
    setShowAddRoomModal(false);
    showToast(`Room #${addRoomForm.roomNumber} added to inventory.`);
    setAddRoomForm({ roomNumber: "", type: "Deluxe", pricePerNight: "", resortId: "1" });
  };

  const handleAddOffer = (e) => {
    e.preventDefault();
    const newOffer = {
      id: Date.now(),
      code: addOfferForm.code,
      type: addOfferForm.type,
      discount: addOfferForm.discount,
      status: "Active",
      expiry: addOfferForm.expiry
    };
    setOffers([...offers, newOffer]);
    setShowAddOfferModal(false);
    showToast(`Promo Offer ${addOfferForm.code} launched successfully!`);
    setAddOfferForm({ code: "", type: "Discount Coupon", discount: "", expiry: "" });
  };

  // Rivo AI Commands
  const executeRivoCommand = (cmd) => {
    let responseMsg = "";
    if (cmd === "pricing") {
      responseMsg = "Based on local Goa hotel rates and weekend occupancy trends, I suggest increasing Ocean Bliss room rates by 12% for the coming Saturday to optimize ADR (Average Daily Rate).";
    } else if (cmd === "occupancy") {
      responseMsg = "I predict an occupancy jump to 94% next week due to the upcoming national holiday weekend. Keep maintenance checks completed by Thursday.";
    } else if (cmd === "seo") {
      responseMsg = "SEO Suggestion: Include terms like 'ocean view villas in Goa' and 'fine dining beach resort Goa' in your property descriptions to boost search visibility by 24%.";
    } else {
      responseMsg = "I've analyzed your photo gallery quality. The current cover photo score is 92%. I recommend uploading 2 high-resolution bathroom images to improve completion index.";
    }
    
    setRivoChat(prev => [
      ...prev, 
      { sender: "User", msg: `Execute Rivo AI ${cmd.toUpperCase()}` },
      { sender: "Rivo", msg: responseMsg }
    ]);
  };

  const handleRivoSend = (e) => {
    e.preventDefault();
    if (!rivoInput.trim()) return;
    const userMsg = rivoInput;
    setRivoInput("");
    setRivoChat(prev => [...prev, { sender: "User", msg: userMsg }]);
    
    setTimeout(() => {
      setRivoChat(prev => [...prev, { sender: "Rivo", msg: `I've processed your query about: "${userMsg}". RIVO predicts optimizing room inventory pricing dynamically will boost yield by 8.5% this month.` }]);
    }, 1000);
  };

  // Filtered Resorts List
  const filteredResorts = resorts.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || res.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesLocation = locationFilter === "all" || res.location.includes(locationFilter);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] text-[var(--color-text-dark)] flex flex-col lg:flex-row transition-all duration-300">
      
      {/* Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-45 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] bg-primary text-white py-4 px-6 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-5 duration-300">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Sidebar Section */}
      <aside className={`fixed inset-y-0 left-0 w-[260px] bg-[var(--color-bg-white)] border-r border-[var(--color-border-color)] flex flex-col shrink-0 z-50 overflow-y-auto transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-screen ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-[var(--color-border-color)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-serif text-lg font-bold">
              R
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-[0.5px]">Reservo PMS</h2>
              <span className="text-[9px] text-primary font-bold uppercase tracking-wider">PMS Enterprise Extranet</span>
            </div>
          </div>
          <button 
            className="lg:hidden p-1 bg-transparent border-none text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex-1 space-y-0.5">
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            { id: "resorts", label: "Resorts", icon: Building },
            { id: "posts", label: "Resort Feed", icon: Camera },
            { id: "rooms", label: "Rooms & Inventory", icon: Bed },
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "calendar", label: "Calendar Matrix", icon: Calendar },
            { id: "guests", label: "Guests Profile", icon: Users },
            { id: "payments", label: "Payments Registry", icon: DollarSign },
            { id: "reviews", label: "Reviews & Sentiment", icon: MessageSquare },
            { id: "offers", label: "Offers & Discounts", icon: Gift },
            { id: "documents", label: "Verification Documents", icon: FileText },
            { id: "staff", label: "Staff Directory", icon: UserCheck },
            { id: "rivo", label: "RIVO AI Optimizer", icon: Sparkles },
            { id: "settings", label: "PMS Settings", icon: Settings }
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full py-2 px-3.5 rounded-xl text-left text-[11.5px] font-bold transition flex items-center gap-3 cursor-pointer border-none bg-transparent ${activeTab === item.id ? "bg-primary text-white" : "text-[var(--color-text-gray)] hover:bg-white/5 hover:text-[var(--color-text-dark)]"}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--color-border-color)] space-y-1">
          <button 
            onClick={() => navigate("/")}
            className="w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold text-[var(--color-text-gray)] hover:bg-white/5 hover:text-[var(--color-text-dark)] transition flex items-center gap-3 cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Customer View</span>
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold text-red-500 hover:bg-red-500/10 transition flex items-center gap-3 cursor-pointer bg-transparent border-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-grow p-4 lg:p-8 overflow-y-auto max-h-screen">
        
        {/* Mobile topbar */}
        <div className="flex items-center justify-between lg:hidden bg-[var(--color-bg-white)] border-b border-[var(--color-border-color)] px-4 py-3 mb-6 -mx-4 -mt-4 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-[var(--color-text-dark)] bg-transparent border-none cursor-pointer flex items-center justify-center rounded-lg hover:bg-[var(--color-border-color)]/20"
            aria-label="Open menu drawer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-sm tracking-wide text-primary">Reservo PMS Console</span>
          <div className="w-6 h-6" />
        </div>

        {/* Sticky Header Actions */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-[var(--color-border-color)] pb-6">
          <div>
            <h1 className="text-xl lg:text-3.5xl font-serif font-bold text-[var(--color-text-dark)]">PMS Extranet Dashboard</h1>
            <p className="text-xs text-[var(--color-text-gray)] font-medium">Enterprise PMS interface matching your Reservo local theme variables.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowAddResortModal(true)}
              className="py-2 px-4 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer border-none flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Property
            </button>
            <button 
              onClick={() => setShowAddRoomModal(true)}
              className="py-2 px-4 bg-[var(--color-bg-white)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Room
            </button>
            <button 
              onClick={() => setShowAiOptimizerModal(true)}
              className="py-2 px-4 bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer border-none flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Optimizer
            </button>
          </div>
        </header>

        {/* -------------------- TAB CONTENT: DASHBOARD -------------------- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Total Resorts", value: resorts.length, trend: "4 active properties", icon: Building, color: "text-blue-500" },
                { title: "Pending Approval", value: resorts.filter(r => r.status === "Pending").length, trend: "Requires team review", icon: AlertCircle, color: "text-amber-500" },
                { title: "Today's Occupancy", value: "82%", trend: "+8% this month", icon: Activity, color: "text-emerald-500" },
                { title: "Monthly Revenue", value: "₹6.27L", trend: "+18% vs last month", icon: DollarSign, color: "text-purple-500" }
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div key={idx} className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase tracking-wider block">{kpi.title}</span>
                      <h3 className="text-xl lg:text-2xl font-serif font-extrabold mt-1">{kpi.value}</h3>
                      <span className="text-[9px] text-[var(--color-text-gray)] font-semibold block mt-1">{kpi.trend}</span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-[var(--color-bg-light)] flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Grid */}
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-gray)] mb-4">Quick Optimizations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => setShowAddResortModal(true)} className="p-4 bg-[var(--color-bg-light)] hover:bg-primary/5 border border-[var(--color-border-color)] rounded-xl text-center cursor-pointer transition">
                  <Building className="w-5 h-5 mx-auto text-primary mb-2" />
                  <span className="text-xs font-bold block">Add Resort</span>
                </button>
                <button onClick={() => setShowAddRoomModal(true)} className="p-4 bg-[var(--color-bg-light)] hover:bg-primary/5 border border-[var(--color-border-color)] rounded-xl text-center cursor-pointer transition">
                  <Bed className="w-5 h-5 mx-auto text-primary mb-2" />
                  <span className="text-xs font-bold block">Add Room</span>
                </button>
                <button onClick={() => setShowAddOfferModal(true)} className="p-4 bg-[var(--color-bg-light)] hover:bg-primary/5 border border-[var(--color-border-color)] rounded-xl text-center cursor-pointer transition">
                  <Gift className="w-5 h-5 mx-auto text-primary mb-2" />
                  <span className="text-xs font-bold block">Create Offer</span>
                </button>
                <button onClick={() => executeRivoCommand("pricing")} className="p-4 bg-[var(--color-bg-light)] hover:bg-primary/5 border border-[var(--color-border-color)] rounded-xl text-center cursor-pointer transition">
                  <Sparkles className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                  <span className="text-xs font-bold block">AI Rate Strategy</span>
                </button>
              </div>
            </div>

            {/* Custom SVG Trend Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Occupancy Line Trend Chart */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
                <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-gray)] mb-4">Occupancy Overview</h3>
                <div className="h-44 w-full flex items-end justify-between gap-1 pt-6 relative border-b border-l border-[var(--color-border-color)]">
                  {[45, 62, 55, 78, 82, 70, 94].map((val, idx) => (
                    <div key={idx} className="flex-grow flex flex-col items-center gap-1 group relative">
                      <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition" style={{ height: `${val * 1.2}px` }} />
                      <span className="text-[9px] text-[var(--color-text-gray)] mt-1">{`Day ${idx + 1}`}</span>
                      <span className="absolute -top-6 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition z-10">{val}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Bar Chart */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
                <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-gray)] mb-4">Revenue Overview</h3>
                <div className="h-44 w-full flex items-end justify-between gap-1 pt-6 relative border-b border-l border-[var(--color-border-color)]">
                  {[2.1, 3.4, 4.2, 5.0, 6.27, 4.8, 7.5].map((val, idx) => (
                    <div key={idx} className="flex-grow flex flex-col items-center gap-1 group relative">
                      <div className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t transition" style={{ height: `${val * 15}px` }} />
                      <span className="text-[9px] text-[var(--color-text-gray)] mt-1">{`Week ${idx + 1}`}</span>
                      <span className="absolute -top-6 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition z-10">₹{val}L</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recent activities & audit logs */}
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-gray)] mb-4">Audit Logs & Recent Operations</h3>
              <div className="space-y-3">
                {activities.map((act, idx) => (
                  <div key={idx} className="p-3 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-xs font-bold block">{act.action} - <span className="text-[var(--color-text-gray)]">{act.details}</span></span>
                        <span className="text-[9px] text-[var(--color-text-gray)] font-semibold">by {act.user}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--color-text-gray)] shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB CONTENT: RESORTS -------------------- */}
        {activeTab === "resorts" && (
          <div className="space-y-6">
            
            {/* Filters bar */}
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl px-3 w-full md:w-80">
                <Search className="w-4 h-4 text-[var(--color-text-gray)]" />
                <input
                  type="text"
                  placeholder="Global search by property or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 bg-transparent text-xs text-[var(--color-text-dark)] outline-none font-semibold border-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-xs text-[var(--color-text-dark)] font-bold rounded-xl outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="live">Live</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                </select>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="p-2 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-xs text-[var(--color-text-dark)] font-bold rounded-xl outline-none"
                >
                  <option value="all">All Locations</option>
                  <option value="Goa">Goa</option>
                  <option value="Bali">Bali</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Udaipur">Udaipur</option>
                </select>
              </div>
            </div>

            {/* Enterprise Resort Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResorts.map(res => (
                <div key={res.id} className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-2xl overflow-hidden shadow-custom flex flex-col">
                  <div className="h-44 w-full relative">
                    <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${res.status === "Live" ? "bg-emerald-500" : res.status === "Pending" ? "bg-amber-500" : "bg-gray-500"}`}>
                      {res.status}
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-serif font-extrabold text-base text-[var(--color-text-dark)]">{res.name}</h3>
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{res.tag}</span>
                      </div>
                      <span className="text-[11px] text-[var(--color-text-gray)] font-semibold mt-1 block">{res.location}</span>
                      <p className="text-xs text-[var(--color-text-gray)] mt-3 leading-relaxed">{res.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-b border-[var(--color-border-color)] my-4 py-3 text-center">
                      <div>
                        <span className="text-[9px] text-[var(--color-text-gray)] font-bold uppercase block">Occupancy</span>
                        <span className="text-xs font-bold text-primary mt-1 block">{res.occupancy > 0 ? `${res.occupancy}%` : "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[var(--color-text-gray)] font-bold uppercase block">Rooms</span>
                        <span className="text-xs font-bold text-[var(--color-text-dark)] mt-1 block">{res.rooms} Rooms</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[var(--color-text-gray)] font-bold uppercase block">Revenue</span>
                        <span className="text-xs font-bold text-emerald-500 mt-1 block">₹{res.revenue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button onClick={() => showToast("Navigating to Pricing editor...")} className="p-1 px-3 border border-solid border-primary/20 text-primary hover:bg-primary/5 rounded-xl text-[10.5px] font-bold cursor-pointer transition">Pricing</button>
                      <button onClick={() => showToast("Opening room inventory...")} className="p-1 px-3 border border-solid border-[var(--color-border-color)] text-[var(--color-text-dark)] hover:bg-white/5 rounded-xl text-[10.5px] font-bold cursor-pointer transition">Inventory</button>
                      <button onClick={() => setResorts(prev => prev.filter(r => r.id !== res.id))} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl cursor-pointer border-none transition"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* -------------------- TAB CONTENT: ROOM INVENTORY -------------------- */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Inventory Availability Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                      <th className="py-3 font-bold">Room #</th>
                      <th className="py-3 font-bold">Category</th>
                      <th className="py-3 font-bold">Rate/Night</th>
                      <th className="py-3 font-bold">Cleaning Status</th>
                      <th className="py-3 font-bold">Maintenance Status</th>
                      <th className="py-3 font-bold">Occupancy State</th>
                      <th className="py-3 text-center font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room.id} className="border-b border-[var(--color-border-color)]/50">
                        <td className="py-3.5 font-mono text-primary font-bold text-sm">{room.roomNumber}</td>
                        <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{room.type}</td>
                        <td className="py-3.5 text-[var(--color-text-gray)]">₹{room.pricePerNight.toLocaleString()}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${room.cleaning === "Clean" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                            {room.cleaning}
                          </span>
                        </td>
                        <td className="py-3.5 text-[var(--color-text-gray)] font-semibold">{room.maintenance}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${room.status === "Available" ? "bg-emerald-500/15 text-emerald-500" : room.status === "Occupied" ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-500"}`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          <button
                            onClick={() => {
                              setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: r.status === "Available" ? "Occupied" : "Available" } : r));
                              showToast(`Room #${room.roomNumber} occupancy updated.`);
                            }}
                            className="py-1 px-3 border border-solid border-[var(--color-border-color)] text-[var(--color-text-dark)] rounded-lg text-[10px] font-bold cursor-pointer hover:bg-white/5 transition"
                          >
                            Toggle State
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB CONTENT: BOOKINGS -------------------- */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Stay & Booking Registrations</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                      <th className="py-3 font-bold">Booking Code</th>
                      <th className="py-3 font-bold">Guest</th>
                      <th className="py-3 font-bold">Property</th>
                      <th className="py-3 font-bold">Stay Timeline</th>
                      <th className="py-3 font-bold">Total Amount</th>
                      <th className="py-3 font-bold">Payment Status</th>
                      <th className="py-3 font-bold">Stay Status</th>
                      <th className="py-3 text-center font-bold">Cancel Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-b border-[var(--color-border-color)]/50">
                        <td className="py-3.5 font-mono text-primary font-bold">{b.code}</td>
                        <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{b.guestName}</td>
                        <td className="py-3.5 text-[var(--color-text-gray)] font-semibold">{b.resortName} (Room {b.roomNumber})</td>
                        <td className="py-3.5 text-[var(--color-text-gray)]">{b.checkIn} to {b.checkOut}</td>
                        <td className="py-3.5 text-[var(--color-text-gray)]">₹{b.amount.toLocaleString()}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${b.paymentStatus === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${b.status === "Checked In" ? "bg-emerald-500/10 text-emerald-500" : b.status === "Cancelled" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          {b.status !== "Cancelled" && (
                            <button
                              onClick={() => {
                                setBookings(prev => prev.map(item => item.id === b.id ? { ...item, status: "Cancelled", paymentStatus: "Refunded" } : item));
                                showToast(`Booking ${b.code} cancelled.`);
                              }}
                              className="p-1 px-2.5 border border-solid border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-[10px] font-bold cursor-pointer transition"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB CONTENT: CALENDAR -------------------- */}
        {activeTab === "calendar" && (
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Availability Calendar Matrix</h3>
            <div className="grid grid-cols-8 gap-2 border border-[var(--color-border-color)] rounded-xl overflow-hidden text-center">
              <div className="p-4 bg-[var(--color-bg-light)] font-bold text-xs border-r border-b border-[var(--color-border-color)]">Room</div>
              {["Mon 06", "Tue 07", "Wed 08", "Thu 09", "Fri 10", "Sat 11", "Sun 12"].map(d => (
                <div key={d} className="p-4 bg-[var(--color-bg-light)] font-bold text-xs border-b border-[var(--color-border-color)]">{d}</div>
              ))}
              
              {["101", "102", "201", "301"].map(room => (
                <React.Fragment key={room}>
                  <div className="p-4 bg-[var(--color-bg-light)] font-bold text-xs border-r border-b border-[var(--color-border-color)]">{room}</div>
                  {[1, 2, 3, 4, 5, 6, 7].map(idx => {
                    const isOccupied = (room === "101" && idx <= 3) || (room === "201" && idx >= 5);
                    return (
                      <div 
                        key={idx} 
                        onClick={() => showToast(`Room ${room} details for Day ${idx}`)}
                        className={`p-4 border-b border-[var(--color-border-color)]/60 cursor-pointer transition ${isOccupied ? "bg-red-500/15 text-red-500 font-bold text-[10px]" : "bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 text-[10px]"}`}
                      >
                        {isOccupied ? "Occupied" : "Available"}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: GUESTS -------------------- */}
        {activeTab === "guests" && (
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Guest Profiler</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                    <th className="py-3 font-bold">Guest Name</th>
                    <th className="py-3 font-bold">Contact Email</th>
                    <th className="py-3 font-bold">Phone Number</th>
                    <th className="py-3 font-bold">Stay Visits</th>
                    <th className="py-3 font-bold">Total Spent</th>
                    <th className="py-3 font-bold">Stay Preferences</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map(g => (
                    <tr key={g.id} className="border-b border-[var(--color-border-color)]/50">
                      <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{g.name}</td>
                      <td className="py-3.5 text-[var(--color-text-gray)]">{g.email}</td>
                      <td className="py-3.5 text-[var(--color-text-gray)]">{g.phone}</td>
                      <td className="py-3.5 text-[var(--color-text-dark)] font-bold">{g.bookingsCount} bookings</td>
                      <td className="py-3.5 text-emerald-500 font-bold">₹{g.totalSpend.toLocaleString()}</td>
                      <td className="py-3.5 text-[var(--color-text-gray)] font-semibold">{g.preferences}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: PAYMENTS -------------------- */}
        {activeTab === "payments" && (
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Payment Invoices & Transits</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                    <th className="py-3 font-bold">Transaction ID</th>
                    <th className="py-3 font-bold">Invoice Number</th>
                    <th className="py-3 font-bold">Base Amount</th>
                    <th className="py-3 font-bold">Taxes (GST)</th>
                    <th className="py-3 font-bold">Platform Commission</th>
                    <th className="py-3 font-bold">Payout Status</th>
                    <th className="py-3 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} className="border-b border-[var(--color-border-color)]/50">
                      <td className="py-3.5 font-mono text-primary font-bold">{p.transactionId}</td>
                      <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{p.invoiceNumber}</td>
                      <td className="py-3.5 text-[var(--color-text-gray)]">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3.5 text-[var(--color-text-gray)]">₹{p.tax.toLocaleString()}</td>
                      <td className="py-3.5 text-[var(--color-text-gray)]">₹{p.commission.toLocaleString()}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${p.status === "Payout Released" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-[var(--color-text-gray)]">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: REVIEWS -------------------- */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Guest Feedbacks & Sentiment Analysis</h3>
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="text-xs font-extrabold text-[var(--color-text-dark)]">{rev.author}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${rev.sentiment === "Positive" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                        {rev.sentiment} Sentiment
                      </span>
                    </div>
                    <div className="flex gap-1 my-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < rev.score ? "text-amber-400" : "text-gray-300"}`}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--color-text-gray)] italic font-medium">"{rev.text}"</p>
                    
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--color-border-color)]/60">
                      <button onClick={() => showToast("Reply modal opened.")} className="py-1 px-3 border border-solid border-primary/20 text-primary hover:bg-primary/5 rounded-lg text-[10px] font-bold cursor-pointer transition">Reply</button>
                      <button onClick={() => showToast("Review hidden from dashboard.")} className="py-1 px-3 border border-solid border-[var(--color-border-color)] text-[var(--color-text-dark)] hover:bg-white/5 rounded-lg text-[10px] font-bold cursor-pointer transition">Hide</button>
                      <button onClick={() => {
                        setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, status: "Featured" } : r));
                        showToast("Marked review as featured.");
                      }} className="py-1 px-3 bg-emerald-500 text-white rounded-lg text-[10px] font-bold cursor-pointer border-none transition">Mark Featured</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: OFFERS -------------------- */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <div className="flex justify-between items-center gap-4 mb-4">
                <h3 className="text-sm font-bold tracking-wider uppercase text-white/70">Promo Coupons & Season Rates</h3>
                <button onClick={() => setShowAddOfferModal(true)} className="py-1.5 px-4 bg-primary text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1 transition">
                  <Plus className="w-3.5 h-3.5" /> Launch Offer
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                      <th className="py-3 font-bold">Promo Code</th>
                      <th className="py-3 font-bold">Offer Strategy</th>
                      <th className="py-3 font-bold">Discount Rate</th>
                      <th className="py-3 font-bold">Status</th>
                      <th className="py-3 font-bold">Expiry Date</th>
                      <th className="py-3 text-center font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map(o => (
                      <tr key={o.id} className="border-b border-[var(--color-border-color)]/50">
                        <td className="py-3.5 font-mono text-primary font-bold">{o.code}</td>
                        <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{o.type}</td>
                        <td className="py-3.5 text-emerald-500 font-bold">{o.discount}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${o.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-500/10 text-gray-500"}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-[var(--color-text-gray)]">{o.expiry}</td>
                        <td className="py-3.5 text-center">
                          <button
                            onClick={() => {
                              setOffers(prev => prev.filter(item => item.id !== o.id));
                              showToast(`Offer ${o.code} deactivated.`);
                            }}
                            className="p-1 px-2.5 border border-solid border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-[10px] font-bold cursor-pointer transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB CONTENT: DOCUMENTS -------------------- */}
        {activeTab === "documents" && (
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Compliance Documents</h3>
            <div className="space-y-4">
              {documents.map((doc, idx) => (
                <div key={idx} className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-text-dark)]">{doc.name}</h4>
                    <span className="text-[9px] text-[var(--color-text-gray)] font-semibold mt-1 block">Expiry Checklist: {doc.expiry}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold ${doc.status === "Verified" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                      {doc.status}
                    </span>
                    <button onClick={() => showToast(`Uploading replacement file for ${doc.name}...`)} className="p-1 px-3 bg-primary text-white text-[10px] font-bold rounded-lg border-none cursor-pointer hover:bg-primary-dark transition">Re-upload</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: STAFF -------------------- */}
        {activeTab === "staff" && (
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Staff Roles & Authorization Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                    <th className="py-3 font-bold">Staff Member</th>
                    <th className="py-3 font-bold">System Role</th>
                    <th className="py-3 font-bold">Business Segment</th>
                    <th className="py-3 font-bold">Email</th>
                    <th className="py-3 font-bold">Status</th>
                    <th className="py-3 text-center font-bold">Edit Authorization</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map(s => (
                    <tr key={s.id} className="border-b border-[var(--color-border-color)]/50">
                      <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{s.name}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[10px] rounded">
                          {s.role}
                        </span>
                      </td>
                      <td className="py-3.5 text-[var(--color-text-gray)] font-semibold">{s.department}</td>
                      <td className="py-3.5 text-[var(--color-text-gray)]">{s.email}</td>
                      <td className="py-3.5 text-[var(--color-text-dark)] font-bold">{s.status}</td>
                      <td className="py-3.5 text-center">
                        <button onClick={() => showToast(`Modifying permissions for ${s.name}...`)} className="py-1 px-3 border border-solid border-[var(--color-border-color)] text-[var(--color-text-dark)] rounded-lg text-[10px] font-bold cursor-pointer hover:bg-white/5 transition">Permissions</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: RIVO AI -------------------- */}
        {activeTab === "rivo" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            
            {/* Rivo Interactive Panel */}
            <div className="xl:col-span-2 bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl flex flex-col h-[550px]">
              <div className="flex items-center justify-between border-b border-[var(--color-border-color)] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-dark)]">RIVO AI Co-Pilot</h3>
                    <span className="text-[10px] text-[var(--color-text-gray)]">Hospitality rate yield predictions & optimizers</span>
                  </div>
                </div>
              </div>

              {/* Chat timeline logs */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                {rivoChat.map((chat, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl max-w-[85%] text-xs ${chat.sender === "Rivo" ? "bg-primary/10 text-[var(--color-text-dark)] border border-primary/20 mr-auto" : "bg-primary text-white ml-auto"}`}>
                    <span className="font-bold block text-[10px] mb-1">{chat.sender}</span>
                    <p className="leading-relaxed">{chat.msg}</p>
                  </div>
                ))}
              </div>

              {/* Rivo Quick Buttons */}
              <div className="flex flex-wrap gap-2 mb-4 p-2 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl">
                <button onClick={() => executeRivoCommand("pricing")} className="p-1 px-3 bg-white/5 hover:bg-white/10 text-[var(--color-text-dark)] border border-solid border-[var(--color-border-color)] rounded-lg text-[10px] font-bold cursor-pointer transition">Optimize Price</button>
                <button onClick={() => executeRivoCommand("occupancy")} className="p-1 px-3 bg-white/5 hover:bg-white/10 text-[var(--color-text-dark)] border border-solid border-[var(--color-border-color)] rounded-lg text-[10px] font-bold cursor-pointer transition">Predict Occupancy</button>
                <button onClick={() => executeRivoCommand("seo")} className="p-1 px-3 bg-white/5 hover:bg-white/10 text-[var(--color-text-dark)] border border-solid border-[var(--color-border-color)] rounded-lg text-[10px] font-bold cursor-pointer transition">SEO Optimizations</button>
              </div>

              {/* Chat Input panel */}
              <form onSubmit={handleRivoSend} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Rivo about room pricing, predictions, competitor analysis..."
                  value={rivoInput}
                  onChange={(e) => setRivoInput(e.target.value)}
                  className="flex-grow p-3 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none focus:border-primary transition"
                />
                <button type="submit" className="py-3 px-5 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer border-none hover:bg-primary-dark transition">Ask AI</button>
              </form>
            </div>

            {/* Rivo Property score metrics */}
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">AI Performance Metrics</h3>
              
              <div className="text-center mb-6">
                <span className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase tracking-wider block">Overall PMS Health</span>
                <h2 className="text-4xl lg:text-5.5xl font-serif font-black text-amber-500 mt-1">{aiScore.health}%</h2>
                <span className="text-[9px] text-emerald-400 font-bold block mt-1">+2.4% vs last week</span>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Resort Listing Quality", val: aiScore.quality },
                  { label: "Gallery Resolution Score", val: aiScore.gallery },
                  { label: "Dynamic Pricing Index", val: aiScore.pricing },
                  { label: "Guest Review Sentiment", val: aiScore.reviews }
                ].map((score, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{score.label}</span>
                      <span className="text-primary">{score.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${score.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB CONTENT: SETTINGS -------------------- */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white/70">PMS Business Profile Configurations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Business Name</label>
                <input type="text" defaultValue="Reservo Partners Inc." className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs font-semibold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Tax Registration (GSTIN)</label>
                <input type="text" defaultValue="30AAAAA1111A1Z1" className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs font-semibold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Registered Address</label>
                <input type="text" defaultValue="Goa Beach Road, India" className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs font-semibold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Support Contact</label>
                <input type="text" defaultValue="support@reservopms.com" className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs font-semibold outline-none" />
              </div>
            </div>

            <button onClick={() => showToast("Business profile updated.")} className="py-2.5 px-6 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer border-none hover:bg-primary-dark transition">Save Settings</button>
          </div>
        )}

        {/* -------------------- TAB CONTENT: RESORT SOCIAL FEED -------------------- */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-4">
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase text-white/75">Resort Social Feed</h3>
                <p className="text-[10px] text-[var(--color-text-gray)] mt-0.5">Publish live visual stories & events to your resort's public detail page tab.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              {/* Publisher Panel */}
              <div className="lg:col-span-1 bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase text-[var(--color-text-dark)] flex items-center gap-1.5 border-b border-[var(--color-border-color)] pb-2.5">
                  <Camera className="w-4 h-4 text-primary animate-pulse" /> Publish Visual Story
                </h4>

                <form onSubmit={handlePublishPost} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[var(--color-text-gray)] font-bold uppercase">Post Type</label>
                    <select
                      value={newPostForm.type}
                      onChange={(e) => setNewPostForm({ ...newPostForm, type: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none cursor-pointer"
                    >
                      <option value="image">📸 Photo Post</option>
                      <option value="video">🎥 Video Story</option>
                      <option value="event">🎉 Special Event</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-[var(--color-text-gray)] font-bold uppercase">Media Asset Image URL (Optional)</label>
                    <input
                      type="url"
                      value={newPostForm.mediaUrl}
                      onChange={(e) => setNewPostForm({ ...newPostForm, mediaUrl: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                    />
                    <p className="text-[8px] text-[var(--color-text-gray)] italic mt-0.5">If left blank, a default luxury resort photo will be assigned.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-[var(--color-text-gray)] font-bold uppercase">Post Caption *</label>
                    <textarea
                      rows="4"
                      required
                      value={newPostForm.caption}
                      onChange={(e) => setNewPostForm({ ...newPostForm, caption: e.target.value })}
                      placeholder="Tell travellers about your beach party, spa discounts, new pool side cocktails, or special menus..."
                      className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold cursor-pointer transition border-none flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" /> Publish to Feed
                  </button>
                </form>
              </div>

              {/* Feed Grid Viewer */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-bold uppercase text-[var(--color-text-dark)] flex items-center gap-1.5">
                  🎥 Live Feed Stream ({posts.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow transition animate-in fade-in duration-200"
                    >
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden shrink-0">
                        <img src={post.mediaUrl} alt="Post Media" className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-[8px] font-bold uppercase tracking-wider">
                          {post.type === "image" ? "📸 Image" : post.type === "video" ? "🎥 Video" : "🎉 Event"}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <p className="text-xs text-[var(--color-text-dark)] font-semibold leading-relaxed line-clamp-3">
                          {post.caption}
                        </p>
                        <div className="flex justify-between items-center text-[9px] text-[var(--color-text-gray)] font-semibold border-t border-[var(--color-border-color)] pt-2.5 mt-auto">
                          <span>Published</span>
                          <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* -------------------- MODAL DIALOGS -------------------- */}
      
      {/* 1. Add Resort Modal */}
      {showAddResortModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] w-full max-w-md p-6 rounded-2xl space-y-4 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-3">
              <h3 className="text-sm font-bold text-[var(--color-text-dark)] uppercase">Add New Resort</h3>
              <button onClick={() => setShowAddResortModal(false)} className="bg-transparent border-none text-[var(--color-text-gray)] cursor-pointer hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddResort} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Property Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Sands Beach Palace"
                  value={addResortForm.name}
                  onChange={(e) => setAddResortForm({ ...addResortForm, name: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa, India"
                  value={addResortForm.location}
                  onChange={(e) => setAddResortForm({ ...addResortForm, location: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief resort description..."
                  value={addResortForm.description}
                  onChange={(e) => setAddResortForm({ ...addResortForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none resize-none"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer border-none hover:bg-primary-dark transition flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Submit Registry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] w-full max-w-md p-6 rounded-2xl space-y-4 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-3">
              <h3 className="text-sm font-bold text-[var(--color-text-dark)] uppercase">Add Room to Inventory</h3>
              <button onClick={() => setShowAddRoomModal(false)} className="bg-transparent border-none text-[var(--color-text-gray)] cursor-pointer hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Select Property</label>
                <select
                  value={addRoomForm.resortId}
                  onChange={(e) => setAddRoomForm({ ...addRoomForm, resortId: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-bold outline-none"
                >
                  {resorts.map(res => (
                    <option key={res.id} value={res.id}>{res.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Room Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 501"
                  value={addRoomForm.roomNumber}
                  onChange={(e) => setAddRoomForm({ ...addRoomForm, roomNumber: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Room Category</label>
                <select
                  value={addRoomForm.type}
                  onChange={(e) => setAddRoomForm({ ...addRoomForm, type: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-bold outline-none"
                >
                  <option value="Deluxe">Deluxe Room</option>
                  <option value="Deluxe Sea View">Deluxe Sea View</option>
                  <option value="Suite">Suite Room</option>
                  <option value="Villa with Pool">Villa with Pool</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Price per Night (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 8500"
                  value={addRoomForm.pricePerNight}
                  onChange={(e) => setAddRoomForm({ ...addRoomForm, pricePerNight: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer border-none hover:bg-primary-dark transition flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Room Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Offer Modal */}
      {showAddOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] w-full max-w-md p-6 rounded-2xl space-y-4 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-3">
              <h3 className="text-sm font-bold text-[var(--color-text-dark)] uppercase">Launch Promo Offer</h3>
              <button onClick={() => setShowAddOfferModal(false)} className="bg-transparent border-none text-[var(--color-text-gray)] cursor-pointer hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Promo Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INDEPENDENCE30"
                  value={addOfferForm.code}
                  onChange={(e) => setAddOfferForm({ ...addOfferForm, code: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Offer Type</label>
                <select
                  value={addOfferForm.type}
                  onChange={(e) => setAddOfferForm({ ...addOfferForm, type: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-bold outline-none"
                >
                  <option value="Discount Coupon">Discount Coupon</option>
                  <option value="Season Pricing">Season Pricing</option>
                  <option value="Festival Pricing">Festival Pricing</option>
                  <option value="Weekend Pricing">Weekend Pricing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Discount Rate (e.g. 30% Off) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25% Off"
                  value={addOfferForm.discount}
                  onChange={(e) => setAddOfferForm({ ...addOfferForm, discount: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={addOfferForm.expiry}
                  onChange={(e) => setAddOfferForm({ ...addOfferForm, expiry: e.target.value })}
                  className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-bold outline-none"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer border-none hover:bg-primary-dark transition flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Deploy Offer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. AI Optimizer Modal */}
      {showAiOptimizerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] w-full max-w-lg p-6 rounded-2xl space-y-4 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-[var(--color-text-dark)] uppercase">AI Yield Optimization Report</h3>
              </div>
              <button onClick={() => setShowAiOptimizerModal(false)} className="bg-transparent border-none text-[var(--color-text-gray)] cursor-pointer hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[var(--color-text-gray)]">
              <p>RIVO has scanned your active resort listings and generated these high-priority suggestions to improve booking volume:</p>
              
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[var(--color-text-dark)] rounded-xl space-y-2">
                <h4 className="font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4 text-amber-500" /> Competitor Pricing Alert</h4>
                <p>Properties in Goa, India within a 2km radius are charging 15% higher rates for beachfront suites. Increase room rates to improve ADR by ₹800/night.</p>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[var(--color-text-dark)] rounded-xl space-y-2">
                <h4 className="font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> Occupancy Projection</h4>
                <p>Due to local festival season next month, booking conversions are predicted to spike by 30%. Implement a "Festival Booking Code" to lock in reservations early.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--color-border-color)] pt-3">
              <button onClick={() => setShowAiOptimizerModal(false)} className="py-2 px-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] rounded-xl text-xs font-bold cursor-pointer transition">Close Report</button>
              <button onClick={() => {
                setShowAiOptimizerModal(false);
                showToast("AI yield suggestions applied globally.");
              }} className="py-2 px-4 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer border-none hover:bg-primary-dark transition">Apply Suggestions</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
