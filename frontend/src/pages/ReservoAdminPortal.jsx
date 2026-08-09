import React, { useState, useEffect } from "react";
import { 
  Building, Bed, Calendar, Users, DollarSign, Activity, 
  MessageSquare, Gift, Shield, Bell, Settings, LogOut, 
  Search, Plus, Filter, Trash2, Edit3, ArrowLeft, 
  FileText, Sparkles, AlertCircle, CheckCircle, BarChart3, 
  Upload, Check, X, ShieldCheck, PieChart, Layers, HelpCircle, 
  UserCheck, Heart, MapPin, ToggleLeft, ToggleRight, Database, 
  Wifi, Sliders, RefreshCw, Command, Smile, Frown, ShieldAlert,
  Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReservoAdminPortal() {
  const navigate = useNavigate();
  
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

  // Navigation state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [showRivoAi, setShowRivoAi] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Keyboard shortcut listener for Command Palette (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // System Health state indicators
  const [healthStatus, setHealthStatus] = useState({
    api: "OPERATIONAL",
    db: "OPERATIONAL",
    storage: "OPERATIONAL",
    ai: "OPERATIONAL",
    payments: "OPERATIONAL",
    maps: "OPERATIONAL"
  });

  // Mock data for Platform Admin Control Center
  const [users, setUsers] = useState([
    { id: 1, name: "Aman Sharma", email: "aman@gmail.com", tripsCount: 3, role: "ROLE_CUSTOMER", status: "Active", wallet: 4500, phone: "9876543210" },
    { id: 2, name: "Karan Singh", email: "karan@paradise.com", tripsCount: 12, role: "ROLE_OWNER", status: "Active", wallet: 82400, phone: "8888888888" },
    { id: 3, name: "Suresh Gupta", email: "suresh@gmail.com", tripsCount: 0, role: "ROLE_CUSTOMER", status: "Suspended", wallet: 0, phone: "7777777777" },
    { id: 4, name: "Priya Patel", email: "priya@gmail.com", tripsCount: 8, role: "ROLE_CUSTOMER", status: "Active", wallet: 12500, phone: "6666666666" }
  ]);

  const [resorts, setResorts] = useState([
    { id: 1, name: "Ocean Bliss Resort", location: "Goa, India", status: "Live", rating: 4.8, occupancy: 87, rooms: 40, revenue: 1845230, bookings: 124, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Royal Palm Retreat", location: "Bali, Indonesia", status: "Live", rating: 4.7, occupancy: 78, rooms: 35, revenue: 1520430, bookings: 88, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Sunset Lagoon Resort", location: "Maldives", status: "Pending", rating: 4.9, occupancy: 74, rooms: 30, revenue: 1210900, bookings: 0, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Hill View Escape", location: "Udaipur, India", status: "Pending", rating: 4.5, occupancy: 68, rooms: 25, revenue: 945780, bookings: 31, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" }
  ]);

  const [bookings, setBookings] = useState([
    { id: 1, code: "BK12580", guest: "Rahul Mehta", resortName: "Ocean Bliss Resort", dates: "20 May - 23 May", amount: 18999, status: "Confirmed" },
    { id: 2, code: "BK12579", guest: "Priya Sharma", resortName: "Royal Palm Retreat", dates: "19 May - 21 May", amount: 24500, status: "Confirmed" },
    { id: 3, code: "BK12578", guest: "Amit Verma", resortName: "Sunset Lagoon Resort", dates: "18 May - 22 May", amount: 32000, status: "Pending" },
    { id: 4, code: "BK12577", guest: "Neha Kapoor", resortName: "Hill View Escape", dates: "18 May - 20 May", amount: 15800, status: "Cancelled" }
  ]);

  const [supportTickets, setSupportTickets] = useState([
    { id: 701, subject: "Refund request delay", guest: "Rahul Mehta", priority: "High", status: "Open", assignee: "Maya Sharma" },
    { id: 702, subject: "Booking confirmation not received", guest: "Amit Verma", priority: "Medium", status: "Assigned", assignee: "Karan Singh" }
  ]);

  const [aiAuditLogs, setAiAuditLogs] = useState([
    { id: 1, type: "Fake Review Detected", target: "Ocean Bliss Resort", score: "94% Confidence", action: "Flagged", timestamp: "5 mins ago" },
    { id: 2, type: "Price Anomaly Alert", target: "Sunset Lagoon Resort", score: "Price hike +80%", action: "Requires Audit", timestamp: "20 mins ago" }
  ]);

  const [cmsSections, setCmsSections] = useState([
    { page: "Homepage", section: "Hero Caption", content: "Book Luxury Resorts & Experiences Online" },
    { page: "Homepage", section: "Discount Banner", content: "Unlock 20% on your first domestic resort booking" }
  ]);

  const [destinations, setDestinations] = useState([
    { name: "Goa, India", count: 12, rating: 4.8, season: "Oct - May", status: "Trending" },
    { name: "Udaipur, India", count: 8, rating: 4.7, season: "Nov - Feb", status: "Featured" }
  ]);

  const [rewardsList, setRewardsList] = useState([
    { rule: "Referral signup bonus", rewardValue: "200 Coins", status: "Active" },
    { rule: "Premium card cashback", rewardValue: "5% wallet cash", status: "Active" }
  ]);

  const [featureFlags, setFeatureFlags] = useState([
    { flag: "dynamic-pricing-engine", description: "Enables AI dynamic season pricing", enabled: true },
    { flag: "rivo-ai-planner", description: "Enables RIVO AI personalized trip planners", enabled: true },
    { flag: "instant-refund-gateway", description: "Enables automatic payouts on cancellation", enabled: false }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { time: "2 mins ago", user: "Admin", action: "BAN_USER", details: "Suspended user suresh@gmail.com for fraud suspicion" },
    { time: "10 mins ago", user: "RIVO_AI", action: "SUSPICIOUS_REVIEW_FLAG", details: "Flagged 2 fake reviews on Royal Palm Retreat" }
  ]);

  // Command palette execution
  const executeCommand = (cmd) => {
    let output = "";
    if (cmd.toLowerCase().includes("approve")) {
      setResorts(prev => prev.map(r => r.name.toLowerCase().includes("sunset") ? { ...r, status: "Live" } : r));
      output = "Approved Sunset Lagoon Resort successfully!";
    } else if (cmd.toLowerCase().includes("ban")) {
      setUsers(prev => prev.map(u => u.email.includes("suresh") ? { ...u, status: "Banned" } : u));
      output = "User Suresh Gupta has been banned.";
    } else if (cmd.toLowerCase().includes("refund")) {
      output = "Refund of ₹24,500 processed for booking #BK12579.";
    } else {
      output = `Executed platform control command: "${cmd}"`;
    }
    showToast(output);
    setShowCommandPalette(false);
    setCommandInput("");
  };

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
              <h2 className="text-sm font-bold tracking-[0.5px]">Reservo Platform</h2>
              <span className="text-[9px] text-primary font-bold uppercase tracking-wider">ECOSYSTEM COMMAND</span>
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
            { id: "dashboard", label: "Dashboard Hub", icon: Activity },
            { id: "users", label: "Users Management", icon: Users },
            { id: "resorts", label: "Resort Directory", icon: Building },
            { id: "bookings", label: "Booking Registry", icon: Calendar },
            { id: "payments", label: "Payments & Payouts", icon: DollarSign },
            { id: "reviews", label: "Reviews & Moderation", icon: MessageSquare },
            { id: "moderation", label: "AI Moderation", icon: ShieldCheck },
            { id: "cms", label: "CMS Management", icon: Layers },
            { id: "destinations", label: "Destinations Hub", icon: MapPin },
            { id: "rewards", label: "Rewards Program", icon: Gift },
            { id: "support", label: "Support Center", icon: HelpCircle },
            { id: "flags", label: "Feature Flags", icon: Sliders },
            { id: "logs", label: "Ecosystem Audit Logs", icon: Shield }
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

        <div className="p-4 border-t border-[var(--color-border-color)]">
          <button 
            onClick={() => navigate("/login")}
            className="w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold text-red-500 hover:bg-red-500/10 transition flex items-center gap-3 cursor-pointer bg-transparent border-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-grow p-4 lg:p-8 overflow-y-auto max-h-screen flex flex-col justify-between">
        
        <div>
          {/* Mobile top-bar */}
          <div className="flex items-center justify-between lg:hidden bg-[var(--color-bg-white)] border-b border-[var(--color-border-color)] px-4 py-3 mb-6 -mx-4 -mt-4 shadow-sm">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 text-[var(--color-text-dark)] bg-transparent border-none cursor-pointer flex items-center justify-center rounded-lg hover:bg-[var(--color-border-color)]/20"
              aria-label="Open menu drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-serif font-bold text-sm tracking-wide text-primary">Reservo Administrator</span>
            <div className="w-6 h-6" />
          </div>

          {/* Global Sticky Header Actions */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-[var(--color-border-color)] pb-6">
            <div>
              <h1 className="text-xl lg:text-3.5xl font-serif font-bold text-[var(--color-text-dark)]">Platform Administration</h1>
              <p className="text-xs text-[var(--color-text-gray)] font-medium">Control center managing properties, approvals, CMS components, AI scoring parameters, and user wallets.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setShowCommandPalette(true)}
                className="py-2 px-4 bg-[var(--color-bg-white)] border border-[var(--color-border-color)] text-[var(--color-text-gray)] rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2 transition"
              >
                <Command className="w-3.5 h-3.5" />
                <span>Search Console (Ctrl+K)</span>
              </button>
              <button 
                onClick={() => setShowRivoAi(true)}
                className="py-2 px-4 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer border-none flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> RIVO AI Insights
              </button>
            </div>
          </header>

          {/* -------------------- TAB CONTENT: DASHBOARD -------------------- */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Stats KPI Widgets Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Total Users", value: "24,568", growth: "+18.6% vs last week", icon: Users, color: "text-blue-500" },
                  { title: "Active Resorts", value: resorts.filter(r => r.status === "Live").length, growth: "+12.4% vs last week", icon: Building, color: "text-emerald-500" },
                  { title: "Weekly Bookings", value: "2,843", growth: "+22.7% vs last week", icon: Calendar, color: "text-purple-500" },
                  { title: "Pending Approvals", value: resorts.filter(r => r.status === "Pending").length, growth: "-2 vs last week", icon: AlertCircle, color: "text-amber-500" }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase tracking-wider block">{kpi.title}</span>
                        <h3 className="text-xl lg:text-2xl font-serif font-extrabold mt-1">{kpi.value}</h3>
                        <span className="text-[9px] text-emerald-400 font-bold block mt-1">{kpi.growth}</span>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-[var(--color-bg-light)] flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${kpi.color}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIVO AI Insights Board */}
              <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-extrabold text-[var(--color-text-dark)]">AI Insights (RIVO)</h4>
                    <p className="text-[11px] text-[var(--color-text-gray)] font-semibold mt-1">Goa bookings surged 32% this week | 2 pending approval flags | 5 low-quality gallery listings detected.</p>
                  </div>
                </div>
                <button onClick={() => setShowRivoAi(true)} className="py-1.5 px-4 bg-primary text-white rounded-xl text-[10.5px] font-bold border-none cursor-pointer hover:bg-primary-dark transition shrink-0">Open Rivo</button>
              </div>

              {/* Custom SVG Trend Graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue Line Graph */}
                <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-gray)] mb-4">Revenue Overview (₹12,45,890)</h3>
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

                {/* Bookings Bar Graph */}
                <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-gray)] mb-4">Bookings Overview (8,732 bookings)</h3>
                  <div className="h-44 w-full flex items-end justify-between gap-1 pt-6 relative border-b border-l border-[var(--color-border-color)]">
                    {[2.1, 3.4, 4.2, 5.0, 6.2, 4.8, 7.5].map((val, idx) => (
                      <div key={idx} className="flex-grow flex flex-col items-center gap-1 group relative">
                        <div className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t transition" style={{ height: `${val * 15}px` }} />
                        <span className="text-[9px] text-[var(--color-text-gray)] mt-1">{`Week ${idx + 1}`}</span>
                        <span className="absolute -top-6 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition z-10">{val}k</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Bookings Table */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
                <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-gray)] mb-4">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                        <th className="py-2.5 font-bold">Booking ID</th>
                        <th className="py-2.5 font-bold">Guest</th>
                        <th className="py-2.5 font-bold">Property</th>
                        <th className="py-2.5 font-bold">Check-in</th>
                        <th className="py-2.5 font-bold">Check-out</th>
                        <th className="py-2.5 font-bold">Amount</th>
                        <th className="py-2.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id} className="border-b border-[var(--color-border-color)]/60">
                          <td className="py-3 font-mono font-bold text-primary">{b.code}</td>
                          <td className="py-3 font-bold text-[var(--color-text-dark)]">{b.guest}</td>
                          <td className="py-3 text-[var(--color-text-gray)]">{b.resortName}</td>
                          <td className="py-3 text-[var(--color-text-gray)]">{b.dates.split(" - ")[0]}</td>
                          <td className="py-3 text-[var(--color-text-gray)]">{b.dates.split(" - ")[1]}</td>
                          <td className="py-3 text-emerald-500 font-bold">₹{b.amount.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${b.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* -------------------- TAB CONTENT: USERS -------------------- */}
          {activeTab === "users" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Ecosystem Users Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                      <th className="py-3 font-bold">Name</th>
                      <th className="py-3 font-bold">Email</th>
                      <th className="py-3 font-bold">Trips</th>
                      <th className="py-3 font-bold">System Role</th>
                      <th className="py-3 font-bold">Wallet Value</th>
                      <th className="py-3 font-bold">Account Status</th>
                      <th className="py-3 text-center font-bold">Ban Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-[var(--color-border-color)]/50">
                        <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{u.name}</td>
                        <td className="py-3.5 text-[var(--color-text-gray)]">{u.email}</td>
                        <td className="py-3.5 text-[var(--color-text-dark)] font-bold">{u.tripsCount} trips</td>
                        <td className="py-3.5">
                          <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 text-emerald-500 font-bold">₹{u.wallet.toLocaleString()}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          <button
                            onClick={() => {
                              setUsers(prev => prev.map(item => item.id === u.id ? { ...item, status: item.status === "Active" ? "Suspended" : "Active" } : item));
                              showToast(`Updated account status for ${u.name}`);
                            }}
                            className={`p-1 px-3 border border-solid rounded-lg text-[10px] font-bold cursor-pointer transition ${u.status === "Active" ? "border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10" : "border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10"}`}
                          >
                            {u.status === "Active" ? "Suspend Account" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: RESORTS -------------------- */}
          {activeTab === "resorts" && (
            <div className="space-y-6">
              
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
                <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Pending Resort Registrations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                        <th className="py-3 font-bold">Resort Name</th>
                        <th className="py-3 font-bold">Location</th>
                        <th className="py-3 font-bold">Total Rooms</th>
                        <th className="py-3 font-bold">Approval Status</th>
                        <th className="py-3 text-center font-bold">Moderator Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resorts.map(res => (
                        <tr key={res.id} className="border-b border-[var(--color-border-color)]/50">
                          <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{res.name}</td>
                          <td className="py-3.5 text-[var(--color-text-gray)] font-semibold">{res.location}</td>
                          <td className="py-3.5 text-[var(--color-text-dark)] font-bold">{res.rooms} Rooms</td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${res.status === "Live" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-center flex items-center justify-center gap-1.5">
                            {res.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => {
                                    setResorts(prev => prev.map(item => item.id === res.id ? { ...item, status: "Live" } : item));
                                    showToast(`${res.name} approved and now live!`);
                                  }}
                                  className="p-1 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10.5px] font-bold cursor-pointer border-none flex items-center gap-1 transition"
                                >
                                  <Check className="w-3 h-3" /> Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setResorts(prev => prev.map(item => item.id === res.id ? { ...item, status: "Rejected" } : item));
                                    showToast(`${res.name} rejected.`);
                                  }}
                                  className="p-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10.5px] font-bold cursor-pointer border-none flex items-center gap-1 transition"
                                >
                                  <X className="w-3 h-3" /> Reject
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setResorts(prev => prev.map(item => item.id === res.id ? { ...item, status: "Pending" } : item));
                                  showToast(`Suspended ${res.name} back to pending approval.`);
                                }}
                                className="p-1 px-3 border border-solid border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-[10px] font-bold cursor-pointer transition"
                              >
                                Suspend Listing
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

          {/* -------------------- TAB CONTENT: BOOKINGS -------------------- */}
          {activeTab === "bookings" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Ecosystem Booking Registry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                      <th className="py-3 font-bold">Booking Code</th>
                      <th className="py-3 font-bold">Guest</th>
                      <th className="py-3 font-bold">Property Name</th>
                      <th className="py-3 font-bold">Stay Dates</th>
                      <th className="py-3 font-bold">Base Amount</th>
                      <th className="py-3 font-bold">Status</th>
                      <th className="py-3 text-center font-bold">Cancel Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-b border-[var(--color-border-color)]/50">
                        <td className="py-3.5 font-mono text-primary font-bold">{b.code}</td>
                        <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{b.guest}</td>
                        <td className="py-3.5 text-[var(--color-text-gray)] font-semibold">{b.resortName}</td>
                        <td className="py-3.5 text-[var(--color-text-gray)]">{b.dates}</td>
                        <td className="py-3.5 text-emerald-500 font-bold">₹{b.amount.toLocaleString()}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${b.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          {b.status !== "Cancelled" && (
                            <button
                              onClick={() => {
                                setBookings(prev => prev.map(item => item.id === b.id ? { ...item, status: "Cancelled" } : item));
                                showToast(`Booking ${b.code} has been cancelled.`);
                              }}
                              className="p-1 px-2.5 border border-solid border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-[10px] font-bold cursor-pointer transition"
                            >
                              Cancel Stay
                            </button>
                          )}
                        </td>
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
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Payout Commissions & Revenue Share</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl">
                  <span className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Average Commission Fee</span>
                  <h4 className="text-lg font-bold mt-1 text-primary">15% Commission</h4>
                </div>
                <div className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl">
                  <span className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Platform Revenue Share</span>
                  <h4 className="text-lg font-bold mt-1 text-emerald-500">₹36,870 this week</h4>
                </div>
                <div className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl">
                  <span className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Payout Status</span>
                  <h4 className="text-lg font-bold mt-1 text-amber-500">All payouts released</h4>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: REVIEWS -------------------- */}
          {activeTab === "reviews" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Reviews & Sentiment Analysis</h3>
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[var(--color-text-dark)]">{rev.author}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${rev.sentiment === "Positive" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                          {rev.sentiment}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-gray)] italic mt-2">"{rev.text}"</p>
                    </div>
                    
                    <button
                      onClick={() => showToast("Review hidden from public feed.")}
                      className="py-1 px-3 border border-solid border-[var(--color-border-color)] text-[var(--color-text-dark)] rounded-lg text-[10px] font-bold cursor-pointer hover:bg-white/5 transition"
                    >
                      Hide Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: MODERATION -------------------- */}
          {activeTab === "moderation" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">AI Moderation Panel</h3>
              <div className="space-y-4">
                {aiAuditLogs.map(log => (
                  <div key={log.id} className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 font-bold text-[9px] uppercase rounded">
                          {log.type}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-gray)] font-bold">{log.target}</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-gray)] font-semibold mt-1">Audit Score: {log.score}</p>
                    </div>
                    <button onClick={() => showToast(`Executing moderation: ${log.action}...`)} className="p-1 px-3 bg-primary text-white text-[10px] font-bold rounded-lg border-none cursor-pointer hover:bg-primary-dark transition">{log.action}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: CMS -------------------- */}
          {activeTab === "cms" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70">Content Management (CMS)</h3>
              {cmsSections.map((cms, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">{cms.page} - {cms.section}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={cms.content}
                      onChange={(e) => showToast("CMS updates queued.")}
                      className="flex-grow p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs font-semibold outline-none"
                    />
                    <button onClick={() => showToast("CMS section saved.")} className="py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl border-none cursor-pointer hover:bg-primary-dark transition">Save</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* -------------------- TAB CONTENT: DESTINATIONS -------------------- */}
          {activeTab === "destinations" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Ecosystem Destinations</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[var(--color-text-gray)] border-b border-[var(--color-border-color)]">
                      <th className="py-3 font-bold">Destination Name</th>
                      <th className="py-3 font-bold">Resorts count</th>
                      <th className="py-3 font-bold">Rating</th>
                      <th className="py-3 font-bold">Trending Status</th>
                      <th className="py-3 font-bold">Peak Season</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((dest, idx) => (
                      <tr key={idx} className="border-b border-[var(--color-border-color)]/50">
                        <td className="py-3.5 font-bold text-[var(--color-text-dark)]">{dest.name}</td>
                        <td className="py-3.5 text-[var(--color-text-gray)] font-bold">{dest.count} properties</td>
                        <td className="py-3.5 text-[var(--color-text-gray)]">★ {dest.rating}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[10px] rounded">
                            {dest.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-[var(--color-text-gray)]">{dest.season}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: REWARDS -------------------- */}
          {activeTab === "rewards" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Loyalty Rewards Rules</h3>
              <div className="space-y-4">
                {rewardsList.map((reward, idx) => (
                  <div key={idx} className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-text-dark)]">{reward.rule}</h4>
                      <span className="text-[9px] text-primary font-bold mt-1 block">Value: {reward.rewardValue}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold">
                      {reward.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: SUPPORT -------------------- */}
          {activeTab === "support" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Support Center Tickets</h3>
              <div className="space-y-4">
                {supportTickets.map(ticket => (
                  <div key={ticket.id} className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 font-bold text-[9px] uppercase rounded">
                          {ticket.priority} Priority
                        </span>
                        <span className="text-[10px] text-[var(--color-text-gray)] font-bold">Ticket #{ticket.id}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-[var(--color-text-dark)] mt-1.5">{ticket.subject}</h4>
                      <p className="text-[11px] text-[var(--color-text-gray)] mt-1">Requested by: {ticket.guest} | Assigned: {ticket.assignee}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSupportTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: "Resolved" } : t));
                        showToast(`Ticket #${ticket.id} resolved.`);
                      }}
                      className="py-1 px-3 bg-emerald-500 text-white rounded-lg text-[10.5px] font-bold cursor-pointer border-none transition"
                    >
                      Mark Resolved
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: FLAGS -------------------- */}
          {activeTab === "flags" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70">System Feature Flags</h3>
              {featureFlags.map((flag, idx) => (
                <div key={idx} className="p-4 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-text-dark)]">{flag.flag}</h4>
                    <p className="text-[10px] text-[var(--color-text-gray)] font-semibold mt-1">{flag.description}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setFeatureFlags(prev => prev.map((f, i) => i === idx ? { ...f, enabled: !f.enabled } : f));
                      showToast(`Toggle feature flag: ${flag.flag}`);
                    }}
                    className="bg-transparent border-none cursor-pointer"
                  >
                    {flag.enabled ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-[var(--color-text-gray)]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* -------------------- TAB CONTENT: AUDIT LOGS -------------------- */}
          {activeTab === "logs" && (
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider uppercase text-white/70 mb-4">Platform Audit Logs</h3>
              <div className="space-y-3">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-xs font-bold block">{log.action} - <span className="text-[var(--color-text-gray)]">{log.details}</span></span>
                        <span className="text-[9px] text-[var(--color-text-gray)] font-semibold">Logged by {log.user}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--color-text-gray)] shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Global Ecosystem Health Footer */}
        <footer className="mt-8 border-t border-[var(--color-border-color)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-bold">System Health: All Systems Operational (Uptime 99.98%)</span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-[var(--color-text-gray)]">
            <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-500" /> API: {healthStatus.api}</span>
            <span className="flex items-center gap-1"><Database className="w-3 h-3 text-emerald-500" /> DB: {healthStatus.db}</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Security: SECURE</span>
          </div>
        </footer>

      </main>

      {/* -------------------- COMMAND PALETTE MODAL (Ctrl + K) -------------------- */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] w-full max-w-lg p-5 rounded-2xl space-y-4 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Command className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Command Console</span>
              </div>
              <button onClick={() => setShowCommandPalette(false)} className="bg-transparent border-none text-[var(--color-text-gray)] cursor-pointer hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); executeCommand(commandInput); }} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                placeholder="Type command: 'Approve Sunset', 'Ban Suresh', 'Refund BK12579'..."
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="w-full p-3 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-xl text-xs text-[var(--color-text-dark)] font-semibold outline-none focus:border-primary transition"
              />
              <div className="text-[10px] text-[var(--color-text-gray)] font-bold uppercase">Suggestions:</div>
              <div className="space-y-1">
                {["Approve Sunset Lagoon Resort", "Ban User Suresh Gupta", "Refund Booking #BK12579"].map(sug => (
                  <button 
                    key={sug} 
                    type="button" 
                    onClick={() => { setCommandInput(sug); }}
                    className="w-full text-left p-2 hover:bg-primary/5 rounded-lg text-xs text-[var(--color-text-dark)] font-semibold transition border-none bg-transparent cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
              <button type="submit" className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl border-none cursor-pointer hover:bg-primary-dark transition">Execute</button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- RIVO AI INSIGHTS SIDE-PANEL DRAWER -------------------- */}
      {showRivoAi && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[var(--color-bg-white)] border-l border-[var(--color-border-color)] shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-dark)]">Rivo AI Co-Pilot</h3>
                <span className="text-[10px] text-[var(--color-text-gray)]">Dynamic pricing Yield Analysis</span>
              </div>
            </div>
            <button onClick={() => setShowRivoAi(false)} className="bg-transparent border-none text-[var(--color-text-gray)] cursor-pointer hover:text-white"><X className="w-4.5 h-4.5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-[var(--color-text-gray)] leading-relaxed">
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-2">
              <h4 className="font-extrabold text-[var(--color-text-dark)] flex items-center gap-1"><Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Weekly Report Summary</h4>
              <p>Bookings have increased by **24%** this week. High demand triggers Goa destinations to trend in general searches.</p>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/15 text-[var(--color-text-dark)] rounded-2xl space-y-2">
              <h4 className="font-bold flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-amber-500" /> AI Moderation Warnings</h4>
              <p>AI identified **12 suspicious reviews** written by duplicate devices. Access the AI Moderation panel to review details.</p>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/15 text-[var(--color-text-dark)] rounded-2xl space-y-2">
              <h4 className="font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> Projected Yield Revenue</h4>
              <p>Predicted monthly platform yield: **₹1.8 Cr** (+14.5% vs previous projection models).</p>
            </div>
          </div>

          <button 
            onClick={() => {
              setShowRivoAi(false);
              showToast("Yield strategies applied globally.");
            }}
            className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer border-none hover:bg-primary-dark transition mt-4"
          >
            Apply Strategies
          </button>
        </div>
      )}

    </div>
  );
}
