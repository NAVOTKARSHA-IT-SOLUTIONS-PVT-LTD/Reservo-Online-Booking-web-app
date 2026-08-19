import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Bed, Calendar, Users, DollarSign, Activity, 
  MessageSquare, BarChart3, Check, X, ShieldCheck, 
  ChevronRight, Clock, Star, Lock, Send, Download, 
  TrendingUp, Award, CheckCircle2, Plus, Info, MapPin, FileText, Sparkles, Settings,
  Mail, MailCheck, Bell, Key, Copy, ExternalLink, CheckCheck, Eye, Smartphone
} from "lucide-react";
import { hostService } from "../services/host.service";
import { authService } from "../services/auth.service";
import { useToast } from "../context/ToastContext";

export default function HostAdminPortal() {
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const handleAuth = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    if (authService.refreshCurrentUser) {
      authService.refreshCurrentUser().then((user) => {
        if (user) setCurrentUser(user);
      }).catch(() => {});
    }
    window.addEventListener("storage", handleAuth);
    return () => window.removeEventListener("storage", handleAuth);
  }, []);

  const [hostData, setHostData] = useState(() => hostService.getData());

  const formatName = (name) => {
    if (!name) return "Srushti Salunke";
    return name
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  };

  const hostName = formatName(currentUser?.name || hostData.profile?.name || "Srushti Salunke");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Filter States
  const [resStatusFilter, setResStatusFilter] = useState("all");
  const [selectedListingForCalendar, setSelectedListingForCalendar] = useState(
    hostData.listings[0]?.id || "host-prop-1"
  );

  // Active message thread
  const [activeThreadId, setActiveThreadId] = useState("msg-thread-1");
  const [replyInput, setReplyInput] = useState("");

  // Review reply state
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [reviewReplyText, setReviewReplyText] = useState("");

  // Calendar Custom Price & Date Block State
  const [customPriceDate, setCustomPriceDate] = useState("");
  const [customPriceVal, setCustomPriceVal] = useState("");

  // Selected reservation modal for invoice/voucher
  const [selectedResModal, setSelectedResModal] = useState(null);

  // Booking Confirmation Notification State
  const [selectedNotifResId, setSelectedNotifResId] = useState(null);
  const [notifSendEmail, setNotifSendEmail] = useState(true);
  const [notifSendMessage, setNotifSendMessage] = useState(true);
  const [notifTemplate, setNotifTemplate] = useState("Royal Welcome & Keyless Access");
  const [notifCustomNote, setNotifCustomNote] = useState("");
  const [notifAccessCode, setNotifAccessCode] = useState("");
  const [notifFilter, setNotifFilter] = useState("all"); // 'all', 'pending', 'sent'
  const [notifPreviewTab, setNotifPreviewTab] = useState("email"); // 'email' or 'message'

  // Sync state when local storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setHostData(hostService.getData());
    };
    window.addEventListener("reservo-host-data-updated", handleUpdate);
    return () => window.removeEventListener("reservo-host-data-updated", handleUpdate);
  }, []);

  // Quick stats calculation
  const totalRevenue = hostData.financials?.totalRevenue || 0;
  const activeListingsCount = hostData.listings?.filter(l => l.status === "Active").length || 0;
  const pendingApprovalsCount = hostData.reservations?.filter(r => r.status === "Pending Approval").length || 0;
  const inHouseGuestsCount = hostData.reservations?.filter(r => r.status === "In-House").length || 0;

  const pendingNotificationCount = hostData.reservations?.filter(
    r => r.status !== "Pending Approval" && (!r.confirmationSent?.email || !r.confirmationSent?.message)
  ).length || 0;

  const activeThread = hostData.messages?.find(m => m.id === activeThreadId) || hostData.messages?.[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeThread) return;
    hostService.sendMessage(activeThread.id, replyInput.trim());
    setReplyInput("");
    setHostData(hostService.getData());
    toast("Message sent to guest!", "success");
  };

  const handleApprove = (resId) => {
    hostService.approveReservation(resId);
    setHostData(hostService.getData());
    toast("Reservation approved! Guest notified and escrow secured.", "success");
  };

  const handleDecline = (resId) => {
    hostService.declineReservation(resId);
    setHostData(hostService.getData());
    toast("Reservation declined. Guest refund initiated.", "info");
  };

  const handleStatusChange = (resId, newStatus) => {
    hostService.updateStayStatus(resId, newStatus);
    setHostData(hostService.getData());
    toast(`Stay status updated to "${newStatus}"`, "success");
  };

  const handleToggleBlock = (dateStr) => {
    hostService.toggleDateBlock(selectedListingForCalendar, dateStr);
    setHostData(hostService.getData());
    toast(`Availability updated for ${dateStr}`, "info");
  };

  const handleSaveCustomPrice = (e) => {
    e.preventDefault();
    if (!customPriceDate || !customPriceVal) {
      toast("Please specify both date and price", "error");
      return;
    }
    hostService.setCustomPriceForDate(selectedListingForCalendar, customPriceDate, customPriceVal);
    setHostData(hostService.getData());
    setCustomPriceDate("");
    setCustomPriceVal("");
    toast("Custom surge price applied for date!", "success");
  };

  const handleReviewReplySubmit = (revId) => {
    if (!reviewReplyText.trim()) return;
    hostService.replyToReview(revId, reviewReplyText.trim());
    setHostData(hostService.getData());
    setReplyingReviewId(null);
    setReviewReplyText("");
    toast("Host response posted successfully!", "success");
  };

  const handleSendConfirmation = (reservationId) => {
    const res = hostData.reservations?.find(r => r.id === reservationId);
    if (!res) return;

    const accessCodeToSend = notifAccessCode || res.accessCode || `VS-${Math.floor(1000 + Math.random() * 9000)}#`;

    hostService.sendBookingConfirmation(reservationId, {
      sendEmail: notifSendEmail,
      sendMessage: notifSendMessage,
      templateTitle: notifTemplate,
      customNote: notifCustomNote,
      accessCode: accessCodeToSend
    });

    setHostData(hostService.getData());
    toast(`Booking confirmation ${notifSendEmail && notifSendMessage ? "email & SMS" : notifSendEmail ? "email" : "message"} dispatched to ${res.guest.name}!`, "success");
    setSelectedNotifResId(null);
    setNotifCustomNote("");
  };

  const TABS = [
    { id: "dashboard", label: "Executive Overview", icon: BarChart3, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} action` : null },
    { id: "listings", label: "Property Inventory", icon: Building2, count: hostData.listings?.length },
    { id: "reservations", label: "Reservations & Stays", icon: FileText, count: hostData.reservations?.length },
    { id: "notifications", label: "Booking Confirmation Notifications", icon: MailCheck, badge: pendingNotificationCount > 0 ? `${pendingNotificationCount} ready` : null },
    { id: "calendar", label: "Calendar & Rates", icon: Calendar },
    { id: "earnings", label: "Earnings & Payouts", icon: DollarSign },
    { id: "messages", label: "Guest Messages", icon: MessageSquare, badge: hostData.messages?.some(m => m.unread) ? "New" : null },
    { id: "reviews", label: "Reviews & Quality", icon: Star, count: hostData.reviews?.length },
    { id: "settings", label: "Policies & Settings", icon: Settings }
  ];

  return (
    <div className="w-full font-sans transition-colors duration-300 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Top Host Profile & Control Header */}
      <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={hostData.profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} 
            alt={hostName} 
            className="w-12 h-12 rounded-full object-cover border-2 border-primary/50 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold font-sans text-[var(--color-text-dark)] tracking-tight">
                {hostName}
              </h2>
              <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award size={12} /> Superhost (4.96 ★)
              </span>
            </div>
            <div className="text-xs text-[var(--color-text-gray)] flex items-center gap-2 mt-0.5">
              <span>{activeListingsCount} Active Luxury Properties</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link 
            to="/become-a-host" 
            className="text-xs font-bold bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl shadow flex items-center gap-1.5 no-underline transition-all"
          >
            <Plus size={14} /> + Add Property
          </Link>
        </div>
      </div>

      {/* Horizontal Scrollable Tab Bar */}
      <div 
        className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar no-scrollbar scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive 
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                  : "bg-[var(--color-bg-white)] text-[var(--color-text-dark)] border-[var(--color-border-color)] hover:border-primary/40"
              }`}
            >
              <Icon size={15} className={isActive ? "text-white" : "text-[var(--color-text-gray)]"} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400 text-slate-900 font-extrabold">
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && !tab.badge && (
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-[var(--color-bg-light)] text-[var(--color-text-gray)]"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div>
        {/* TAB 1: EXECUTIVE OVERVIEW / DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            
            {/* Pending Approvals Alert Banner */}
            {pendingApprovalsCount > 0 && (
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--color-text-dark)]">
                      {pendingApprovalsCount} Booking Request Awaiting Host Action
                    </div>
                    <div className="text-[11px] text-[var(--color-text-gray)]">
                      Review guest credentials and confirm stay to secure payout.
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab("reservations")}
                  className="text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl cursor-pointer border-none shadow transition-all"
                >
                  Review Request →
                </button>
              </div>
            )}

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Revenue */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600"><DollarSign size={16} /></div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <TrendingUp size={13} /> +18.4% vs last month
                </div>
              </div>

              {/* Occupancy Rate */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Occupancy Rate</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600"><Activity size={16} /></div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    {hostData.financials?.occupancyRate || 84.5}%
                  </span>
                </div>
                <div className="text-[11px] font-medium text-blue-600">
                  High season pacing across {activeListingsCount} listings
                </div>
              </div>

              {/* Active Stays */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Stays</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600"><Bed size={16} /></div>
                </div>
                <div className="flex items-baseline gap-2 mb-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    {inHouseGuestsCount}
                  </span>
                  <span className="text-xs font-bold text-purple-600 bg-purple-500/10 px-2.5 py-0.5 rounded-md">
                    In-House
                  </span>
                </div>
                <div className="text-[11px] font-medium text-purple-600">
                  1 stay checking out tomorrow
                </div>
              </div>

              {/* Superhost Rating */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Superhost Rating</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600"><Star size={16} /></div>
                </div>
                <div className="flex items-baseline gap-2 mb-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    {hostData.profile?.rating || 4.96}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-gray)]">
                    ({hostData.profile?.totalReviews || 128} reviews)
                  </span>
                </div>
                <div className="text-[11px] font-medium text-amber-600">
                  Response rate: {hostData.profile?.responseRate || "99%"}
                </div>
              </div>

            </div>

            {/* Today's Stays & Quick Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Upcoming & In-House Stays */}
              <div className="lg:col-span-8 bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-border-color)] pb-3">
                  <h3 className="text-base font-bold font-serif text-[var(--color-text-dark)] flex items-center gap-2">
                    <Users size={18} className="text-primary" /> Active & Upcoming Guest Stays
                  </h3>
                  <button 
                    onClick={() => setActiveTab("reservations")}
                    className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer"
                  >
                    View All ({hostData.reservations?.length || 0}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {hostData.reservations?.slice(0, 3).map((res) => (
                    <div 
                      key={res.id} 
                      className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={res.guest.avatar} 
                          alt={res.guest.name} 
                          className="w-11 h-11 rounded-full object-cover border border-primary/40"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--color-text-dark)]">{res.guest.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              res.status === "In-House" ? "bg-purple-100 text-purple-700" :
                              res.status === "Upcoming" ? "bg-blue-100 text-blue-700" :
                              res.status === "Pending Approval" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {res.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--color-text-gray)] mt-0.5 line-clamp-1">
                            {res.listingTitle}
                          </div>
                          <div className="text-[11px] font-medium text-[var(--color-text-dark)] mt-0.5">
                            📅 {res.dates.checkIn} to {res.dates.checkOut} ({res.dates.nights} nights) • ₹{res.payoutAmount.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => { setActiveTab("messages"); }}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--color-border-color)] bg-[var(--color-bg-white)] text-[var(--color-text-dark)] hover:border-primary cursor-pointer flex items-center gap-1"
                        >
                          <MessageSquare size={13} /> Message
                        </button>
                        <button
                          onClick={() => setSelectedResModal(res)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-dark cursor-pointer border-none"
                        >
                          Dossier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Host Actions & Payout Status */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Payout Widget */}
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-[32px] p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Next Payout</span>
                    <span className="text-[10px] font-extrabold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-md">
                      Aug 21, 2026
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold font-sans tabular-nums tracking-tight">
                    ₹105,600
                  </div>
                  <div className="text-xs text-blue-200">
                    Direct Deposit to HDFC Bank (****4910)
                  </div>
                  <button 
                    onClick={() => setActiveTab("earnings")}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 cursor-pointer transition-all text-center"
                  >
                    View Financial Statements →
                  </button>
                </div>

                {/* Quick Controls */}
                <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-5 shadow-xs space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1">
                    Quick Shortcuts
                  </div>
                  <button 
                    onClick={() => setActiveTab("calendar")}
                    className="w-full p-3 rounded-2xl bg-[var(--color-bg-light)] hover:bg-[var(--color-border-color)] text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between border border-[var(--color-border-color)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><Calendar size={15} className="text-primary" /> Block Dates on Calendar</span>
                    <ChevronRight size={14} />
                  </button>
                  <button 
                    onClick={() => setActiveTab("listings")}
                    className="w-full p-3 rounded-2xl bg-[var(--color-bg-light)] hover:bg-[var(--color-border-color)] text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between border border-[var(--color-border-color)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><DollarSign size={15} className="text-emerald-600" /> Adjust Nightly Pricing</span>
                    <ChevronRight size={14} />
                  </button>
                  <button 
                    onClick={() => setActiveTab("settings")}
                    className="w-full p-3 rounded-2xl bg-[var(--color-bg-light)] hover:bg-[var(--color-border-color)] text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between border border-[var(--color-border-color)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-purple-600" /> Edit Cancellation Policy</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PROPERTY INVENTORY & LISTINGS */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)]">
                  Your Property Inventory
                </h2>
                <p className="text-xs text-[var(--color-text-gray)]">
                  Manage active listings, adjust nightly rates, and toggle instant booking.
                </p>
              </div>

              <Link
                to="/become-a-host"
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 no-underline self-start sm:self-auto"
              >
                <Plus size={14} /> + Create New Property
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostData.listings?.map((prop) => (
                <div 
                  key={prop.id}
                  className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[28px] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={prop.coverImage} alt={prop.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow ${
                        prop.status === "Active" ? "bg-emerald-500 text-white" :
                        prop.status === "Paused" ? "bg-amber-500 text-white" : "bg-slate-600 text-white"
                      }`}>
                        {prop.status}
                      </span>
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" /> {prop.rating}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h4 className="text-sm font-bold font-serif text-[var(--color-text-dark)] line-clamp-1">
                        {prop.title}
                      </h4>
                      <div className="text-xs text-[var(--color-text-gray)] flex items-center gap-1">
                        <MapPin size={13} className="text-primary" /> {prop.location.city}, {prop.location.state}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-gray)] border-y border-[var(--color-border-color)] py-2">
                        <span>{prop.specs.guests} Guests</span>
                        <span>•</span>
                        <span>{prop.specs.bedrooms} Beds</span>
                        <span>•</span>
                        <span>{prop.specs.bathrooms} Baths</span>
                      </div>

                      {/* Inline Price Adjuster */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[var(--color-text-gray)] block">Nightly Price</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-extrabold text-primary font-sans">₹</span>
                            <input 
                              type="number" 
                              step="500"
                              value={prop.pricePerNight} 
                              onChange={(e) => {
                                hostService.updateListingPrice(prop.id, e.target.value);
                                setHostData(hostService.getData());
                              }}
                              className="w-24 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-lg p-1 text-xs font-bold text-[var(--color-text-dark)] font-sans tabular-nums"
                            />
                          </div>
                        </div>

                        {/* Instant Book Switch */}
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-[var(--color-text-gray)] block">Instant Book</span>
                          <button
                            onClick={() => {
                              hostService.toggleInstantBook(prop.id);
                              setHostData(hostService.getData());
                              toast(`Instant Book ${!prop.instantBook ? "Enabled" : "Disabled"} for ${prop.title.split(' ')[0]}`, "info");
                            }}
                            className={`text-[10px] font-extrabold px-2 py-1 rounded-md cursor-pointer border-none mt-0.5 ${
                              prop.instantBook ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {prop.instantBook ? "⚡ Enabled" : "Request Only"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--color-bg-light)] border-t border-[var(--color-border-color)] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const nextStatus = prop.status === "Active" ? "Paused" : "Active";
                        hostService.updateListingStatus(prop.id, nextStatus);
                        setHostData(hostService.getData());
                        toast(`Listing status updated to ${nextStatus}`, "success");
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--color-border-color)] bg-[var(--color-bg-white)] text-[var(--color-text-dark)] hover:border-primary cursor-pointer"
                    >
                      {prop.status === "Active" ? "Pause Listing" : "Activate Listing"}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedListingForCalendar(prop.id);
                        setActiveTab("calendar");
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-dark cursor-pointer border-none flex items-center gap-1"
                    >
                      <Calendar size={12} /> Calendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESERVATIONS & GUEST STAYS */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)]">
                  Reservations & Stays Management
                </h2>
                <p className="text-xs text-[var(--color-text-gray)]">
                  Accept booking requests, view guest credentials, and manage check-ins.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {["all", "Pending Approval", "Upcoming", "In-House", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setResStatusFilter(status)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      resStatusFilter === status
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-[var(--color-bg-white)] text-[var(--color-text-dark)] border-[var(--color-border-color)] hover:border-primary/50"
                    }`}
                  >
                    {status === "all" ? "All Bookings" : status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {hostData.reservations
                ?.filter(r => resStatusFilter === "all" || r.status === resStatusFilter)
                .map((res) => (
                  <div
                    key={res.id}
                    className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border-color)] pb-4">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={res.guest.avatar} 
                          alt={res.guest.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-[var(--color-text-dark)]">{res.guest.name}</span>
                            {res.guest.verified && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                                ID Verified
                              </span>
                            )}
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              res.status === "Pending Approval" ? "bg-amber-100 text-amber-800" :
                              res.status === "In-House" ? "bg-purple-100 text-purple-800" :
                              res.status === "Upcoming" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {res.status}
                            </span>
                          </div>
                          <div className="text-xs text-[var(--color-text-gray)] mt-0.5">
                            {res.guest.email} • {res.guest.phone} ({res.guest.country})
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-extrabold font-sans tabular-nums text-primary">
                          ₹{res.payoutAmount.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600">
                          {res.paymentStatus}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 bg-[var(--color-bg-light)] rounded-2xl">
                        <span className="text-[10px] uppercase font-bold text-[var(--color-text-gray)] block">Property</span>
                        <span className="font-bold text-[var(--color-text-dark)] line-clamp-1">{res.listingTitle}</span>
                      </div>
                      <div className="p-3 bg-[var(--color-bg-light)] rounded-2xl">
                        <span className="text-[10px] uppercase font-bold text-[var(--color-text-gray)] block">Dates & Duration</span>
                        <span className="font-bold text-[var(--color-text-dark)]">{res.dates.checkIn} → {res.dates.checkOut} ({res.dates.nights} Nights)</span>
                      </div>
                      <div className="p-3 bg-[var(--color-bg-light)] rounded-2xl">
                        <span className="text-[10px] uppercase font-bold text-[var(--color-text-gray)] block">Guests Breakdown</span>
                        <span className="font-bold text-[var(--color-text-dark)]">{res.guestsCount.adults} Adults, {res.guestsCount.children} Children</span>
                      </div>
                    </div>

                    {res.specialRequest && (
                      <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-900 dark:text-blue-200 text-xs flex items-center gap-2">
                        <Info size={14} className="shrink-0 text-primary" />
                        <span><strong>Special Request:</strong> {res.specialRequest}</span>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedResModal(res)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--color-border-color)] bg-[var(--color-bg-light)] text-[var(--color-text-dark)] hover:border-primary cursor-pointer flex items-center gap-1"
                        >
                          <FileText size={13} /> View Invoice & Voucher
                        </button>
                        <button
                          onClick={() => {
                            setSelectedNotifResId(res.id);
                            setNotifAccessCode(res.accessCode || "VS-8942#");
                            setActiveTab("notifications");
                          }}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <MailCheck size={13} /> Send Confirmation
                        </button>
                        <button
                          onClick={() => setActiveTab("messages")}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--color-border-color)] bg-[var(--color-bg-light)] text-[var(--color-text-dark)] hover:border-primary cursor-pointer flex items-center gap-1"
                        >
                          <MessageSquare size={13} /> Chat Guest
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {res.status === "Pending Approval" && (
                          <>
                            <button
                              onClick={() => handleDecline(res.id)}
                              className="text-xs font-bold px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition-all"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleApprove(res.id)}
                              className="text-xs font-extrabold px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer border-none shadow transition-all flex items-center gap-1"
                            >
                              <Check size={14} /> Approve Booking
                            </button>
                          </>
                        )}

                        {res.status === "Upcoming" && (
                          <button
                            onClick={() => handleStatusChange(res.id, "In-House")}
                            className="text-xs font-bold px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white cursor-pointer border-none shadow transition-all"
                          >
                            Mark Checked-In
                          </button>
                        )}

                        {res.status === "In-House" && (
                          <button
                            onClick={() => handleStatusChange(res.id, "Completed")}
                            className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer border-none shadow transition-all"
                          >
                            Complete Stay & Release Cleaning
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: BOOKING CONFIRMATION NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)] flex items-center gap-2">
                  Booking Confirmation Notifications
                </h2>
                <p className="text-xs text-[var(--color-text-gray)]">
                  Dispatch official booking confirmation emails, SMS/in-app messages, and keyless access codes to guests once payment is confirmed.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {pendingNotificationCount > 0 && (
                  <button 
                    onClick={() => {
                      const firstPending = hostData.reservations?.find(r => r.status !== "Pending Approval" && (!r.confirmationSent?.email || !r.confirmationSent?.message));
                      if (firstPending) {
                        setSelectedNotifResId(firstPending.id);
                        setNotifAccessCode(firstPending.accessCode || "VS-8942#");
                      }
                    }}
                    className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 cursor-pointer border-none transition-all"
                  >
                    <Send size={14} /> Dispatch Pending ({pendingNotificationCount})
                  </button>
                )}
              </div>
            </div>

            {/* Notification Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Confirmed Stays */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Confirmed Stays</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600"><Building2 size={16} /></div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    {hostData.reservations?.filter(r => r.status !== "Pending Approval").length || 0}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-gray)]">Bookings Paid</span>
                </div>
                <div className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
                  <CheckCircle2 size={13} /> 100% Escrow Secured
                </div>
              </div>

              {/* Confirmation Emails Dispatched */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Emails Dispatched</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600"><MailCheck size={16} /></div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    {hostData.reservations?.filter(r => r.confirmationSent?.email).length || 0}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">Sent to Guests</span>
                </div>
                <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <TrendingUp size={13} /> High 99.8% Open Rate
                </div>
              </div>

              {/* In-App / SMS Messages */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider">SMS & In-App Messages</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600"><MessageSquare size={16} /></div>
                </div>
                <div className="flex items-baseline gap-2 mb-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    {hostData.reservations?.filter(r => r.confirmationSent?.message).length || 0}
                  </span>
                  <span className="text-xs font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-md">
                    Direct
                  </span>
                </div>
                <div className="text-[11px] font-medium text-purple-600">
                  Synced with Reservo Chat Inbox
                </div>
              </div>

              {/* Pending Action */}
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Pending Notifications</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600"><Clock size={16} /></div>
                </div>
                <div className="flex items-baseline gap-2 mb-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    {pendingNotificationCount}
                  </span>
                  <span className={`text-xs font-semibold ${pendingNotificationCount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {pendingNotificationCount > 0 ? "Action Ready" : "All Sent"}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-amber-600">
                  Auto-reminder active
                </div>
              </div>

            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-[var(--color-border-color)] pb-3">
              {[
                { id: "all", label: "All Confirmed Bookings" },
                { id: "pending", label: `Pending Dispatch (${pendingNotificationCount})` },
                { id: "sent", label: "Fully Dispatched" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setNotifFilter(f.id)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer border ${
                    notifFilter === f.id 
                      ? "bg-primary text-white border-primary shadow-xs" 
                      : "bg-[var(--color-bg-white)] text-[var(--color-text-gray)] border-[var(--color-border-color)] hover:text-[var(--color-text-dark)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Confirmed Bookings Notification Dispatch Cards */}
            <div className="space-y-4">
              {hostData.reservations
                ?.filter(res => {
                  if (res.status === "Pending Approval") return false;
                  if (notifFilter === "pending") return !res.confirmationSent?.email || !res.confirmationSent?.message;
                  if (notifFilter === "sent") return res.confirmationSent?.email && res.confirmationSent?.message;
                  return true;
                })
                .map((res) => {
                  const isEmailSent = !!res.confirmationSent?.email;
                  const isMessageSent = !!res.confirmationSent?.message;

                  return (
                    <div
                      key={res.id}
                      className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl p-6 shadow-xs space-y-4 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border-color)] pb-4">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={res.guest.avatar} 
                            alt={res.guest.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-[var(--color-text-dark)]">{res.guest.name}</span>
                              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                {res.status}
                              </span>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200">
                                {res.id}
                              </span>
                            </div>
                            <div className="text-xs text-[var(--color-text-gray)] mt-0.5">
                              {res.guest.email} • {res.guest.phone}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-extrabold font-sans tabular-nums text-primary">
                              ₹{res.totalPaid.toLocaleString("en-IN")}
                            </div>
                            <div className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                              <CheckCircle2 size={12} /> {res.paymentStatus}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Property & Stay Summary Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-[var(--color-bg-light)] rounded-2xl">
                          <span className="text-[10px] uppercase font-bold text-[var(--color-text-gray)] block">Property Booked</span>
                          <span className="font-bold text-[var(--color-text-dark)] line-clamp-1">{res.listingTitle}</span>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-light)] rounded-2xl">
                          <span className="text-[10px] uppercase font-bold text-[var(--color-text-gray)] block">Confirmed Stay Dates</span>
                          <span className="font-bold text-[var(--color-text-dark)]">{res.dates.checkIn} → {res.dates.checkOut} ({res.dates.nights} Nights)</span>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-light)] rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[var(--color-text-gray)] block">Keyless Door PIN</span>
                            <span className="font-mono font-bold text-primary text-xs">{res.accessCode || "VS-8942#"}</span>
                          </div>
                          <Key size={16} className="text-primary/70" />
                        </div>
                      </div>

                      {/* Dispatch Status & Action Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Email Status Badge */}
                          {isEmailSent ? (
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 flex items-center gap-1.5">
                              <MailCheck size={13} className="text-emerald-600" /> Confirmation Email Sent ({res.confirmationSent.emailSentAt || "Delivered"})
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 flex items-center gap-1.5">
                              <Clock size={13} className="text-amber-600" /> Email Confirmation Pending
                            </span>
                          )}

                          {/* Message Status Badge */}
                          {isMessageSent ? (
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 flex items-center gap-1.5">
                              <CheckCheck size={13} className="text-blue-600" /> In-App & SMS Sent ({res.confirmationSent.messageSentAt || "Delivered"})
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-500" /> Message Pending
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => {
                              setSelectedNotifResId(res.id);
                              setNotifAccessCode(res.accessCode || "VS-8942#");
                            }}
                            className="bg-primary hover:bg-primary-dark text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow cursor-pointer border-none flex items-center gap-1.5 transition-all"
                          >
                            <Send size={13} /> {isEmailSent && isMessageSent ? "Resend / Update" : "Send Confirmation"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Sent Notification History & Audit Log */}
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-[var(--color-text-dark)]">
                    Confirmation Dispatch Audit Trail
                  </h3>
                  <p className="text-xs text-[var(--color-text-gray)]">
                    Real-time delivery verification for all automated and manual booking confirmation dispatches.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={13} /> SMTP & SMS Gateway Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-color)] text-[var(--color-text-gray)] uppercase text-[10px] font-bold">
                      <th className="pb-3 px-2">Dispatch ID</th>
                      <th className="pb-3 px-2">Guest & Email</th>
                      <th className="pb-3 px-2">Property</th>
                      <th className="pb-3 px-2">Channels</th>
                      <th className="pb-3 px-2">Template</th>
                      <th className="pb-3 px-2">Access PIN</th>
                      <th className="pb-3 px-2">Timestamp</th>
                      <th className="pb-3 px-2 text-right">Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-color)]">
                    {hostData.confirmationLogs?.map((log) => (
                      <tr key={log.id} className="hover:bg-[var(--color-bg-light)]/60 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-primary">{log.id}</td>
                        <td className="py-3 px-2 font-bold text-[var(--color-text-dark)]">
                          {log.guestName}
                          <span className="block text-[11px] font-normal text-[var(--color-text-gray)]">{log.guestEmail}</span>
                        </td>
                        <td className="py-3 px-2 text-[var(--color-text-dark)] font-medium max-w-[180px] truncate">{log.propertyTitle}</td>
                        <td className="py-3 px-2">
                          <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-[var(--color-text-gray)]">{log.template}</td>
                        <td className="py-3 px-2 font-mono font-bold text-emerald-600">{log.accessCode}</td>
                        <td className="py-3 px-2 text-[var(--color-text-gray)] whitespace-nowrap">{log.sentAt}</td>
                        <td className="py-3 px-2 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 size={11} /> Delivered
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

        {/* TAB 4: CALENDAR & DYNAMIC RATES */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)]">
                  Calendar & Dynamic Availability
                </h2>
                <p className="text-xs text-[var(--color-text-gray)]">
                  Click any date to block/unblock, or assign custom high-season prices.
                </p>
              </div>

              <select
                value={selectedListingForCalendar}
                onChange={(e) => setSelectedListingForCalendar(e.target.value)}
                className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-2.5 rounded-2xl text-xs font-bold outline-none focus:border-primary"
              >
                {hostData.listings?.map((l) => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>

            {/* Surge Price Override Bar */}
            <form onSubmit={handleSaveCustomPrice} className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-4 rounded-3xl flex flex-wrap items-center gap-3 shadow-xs">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Sparkles size={14} /> Custom Date Pricing:
              </span>
              <input 
                type="date"
                value={customPriceDate}
                onChange={(e) => setCustomPriceDate(e.target.value)}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border-color)] p-2 rounded-xl text-xs font-bold text-[var(--color-text-dark)] outline-none"
              />
              <input 
                type="number"
                step="500"
                placeholder="Nightly Rate ₹"
                value={customPriceVal}
                onChange={(e) => setCustomPriceVal(e.target.value)}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border-color)] p-2 rounded-xl text-xs font-bold text-[var(--color-text-dark)] outline-none w-36"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer border-none shadow-xs"
              >
                Save Date Price
              </button>
            </form>

            {/* Simulated August 2026 Interactive Calendar Grid */}
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border-color)] pb-3">
                <h3 className="text-base font-bold font-serif text-[var(--color-text-dark)]">
                  August 2026 Availability Schedule
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Available</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Blocked</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Custom Price</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[var(--color-text-gray)]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {/* Empty slots for starting day */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-3 rounded-2xl bg-transparent opacity-0" />
                ))}

                {/* 31 days of August */}
                {Array.from({ length: 31 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = `2026-08-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
                  const isBlocked = (hostData.blockedDates?.[selectedListingForCalendar] || []).includes(dateStr);
                  const customPrice = (hostData.customPricing?.[selectedListingForCalendar] || {})[dateStr];
                  const selectedProp = hostData.listings?.find(l => l.id === selectedListingForCalendar) || hostData.listings?.[0];
                  const priceToShow = customPrice || selectedProp?.pricePerNight || 24500;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => handleToggleBlock(dateStr)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                        isBlocked
                          ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
                          : customPrice
                          ? "bg-amber-500/10 border-amber-500/40 text-[var(--color-text-dark)] shadow-xs"
                          : "bg-[var(--color-bg-light)] border-[var(--color-border-color)] text-[var(--color-text-dark)] hover:border-primary"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-extrabold">{dayNum}</span>
                        {isBlocked && <Lock size={11} className="text-red-500" />}
                        {!isBlocked && customPrice && <Sparkles size={11} className="text-amber-500" />}
                      </div>
                      <div className="text-[10px] font-bold mt-auto">
                        {isBlocked ? "Blocked" : `₹${priceToShow.toLocaleString("en-IN")}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EARNINGS & PAYOUTS */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)]">
                  Financial Statements & Payouts
                </h2>
                <p className="text-xs text-[var(--color-text-gray)]">
                  Track automatic payouts, service fee breakdowns, and export GST statements.
                </p>
              </div>

              <button 
                onClick={() => toast("Exported GST Tax Statement for August 2026 (PDF)", "success")}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Download size={14} /> Download Tax Statement (PDF)
              </button>
            </div>

            {/* Financial Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-3xl shadow-xs flex flex-col justify-between min-h-[148px]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)]">Gross Bookings Volume</span>
                <div className="flex items-baseline gap-1.5 my-2 h-8">
                  <span className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums leading-none tracking-tight">
                    ₹512,800
                  </span>
                </div>
                <div className="text-xs text-[var(--color-text-gray)]">Across 4 luxury stays</div>
              </div>

              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-3xl shadow-xs flex flex-col justify-between min-h-[148px]">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Net Host Earnings</span>
                <div className="flex items-baseline gap-1.5 my-2 h-8">
                  <span className="text-3xl font-extrabold text-emerald-600 tabular-nums leading-none tracking-tight">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-xs text-emerald-600 font-semibold">97% Retained (3% Reservo Platform Fee)</div>
              </div>

              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-6 rounded-3xl shadow-xs flex flex-col justify-between min-h-[148px]">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Projected Next Month</span>
                <div className="flex items-baseline gap-1.5 my-2 h-8">
                  <span className="text-3xl font-extrabold text-blue-600 tabular-nums leading-none tracking-tight">
                    ₹{hostData.financials?.projectedNextMonth?.toLocaleString("en-IN") || "215,000"}
                  </span>
                </div>
                <div className="text-xs text-[var(--color-text-gray)]">Based on confirmed forward bookings</div>
              </div>
            </div>

            {/* Payout History Table */}
            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-serif text-[var(--color-text-dark)]">
                Disbursement & Payout History
              </h3>
              
              <div className="space-y-3">
                {hostData.financials?.payouts?.map((pay) => (
                  <div key={pay.id} className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--color-text-dark)]">{pay.id}</span>
                        <span className="text-[11px] text-[var(--color-text-gray)]">({pay.invoice})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pay.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                          pay.status === "Processing" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {pay.status}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-text-gray)] mt-0.5">
                        {pay.date} • Sent to {pay.method}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold font-sans tabular-nums text-primary">
                        ₹{pay.amount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GUEST MESSAGING INBOX */}
        {activeTab === "messages" && (
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
            
            {/* Thread List */}
            <div className="md:col-span-4 border-r border-[var(--color-border-color)] p-4 space-y-3 bg-[var(--color-bg-light)]">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] px-2">
                Guest Inbox ({hostData.messages?.length || 0})
              </div>

              {hostData.messages?.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    activeThreadId === thread.id
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-[var(--color-bg-white)] text-[var(--color-text-dark)] border-[var(--color-border-color)] hover:border-primary/50"
                  }`}
                >
                  <img src={thread.guestAvatar} alt={thread.guestName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-h-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold truncate">{thread.guestName}</span>
                      <span className={`text-[10px] ${activeThreadId === thread.id ? "text-blue-100" : "text-[var(--color-text-gray)]"}`}>
                        {thread.lastTime}
                      </span>
                    </div>
                    <div className={`text-[11px] truncate mt-0.5 ${activeThreadId === thread.id ? "text-white/90" : "text-[var(--color-text-gray)]"}`}>
                      {thread.lastMessage}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Chat View */}
            <div className="md:col-span-8 flex flex-col justify-between p-6">
              {activeThread ? (
                <>
                  <div className="border-b border-[var(--color-border-color)] pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={activeThread.guestAvatar} alt={activeThread.guestName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-extrabold text-[var(--color-text-dark)]">{activeThread.guestName}</div>
                        <div className="text-[11px] text-[var(--color-text-gray)]">{activeThread.listingTitle}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[350px]">
                    {activeThread.history?.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex flex-col ${msg.sender === "host" ? "items-end" : "items-start"}`}
                      >
                        <div className={`p-3.5 rounded-2xl text-xs max-w-md ${
                          msg.sender === "host" 
                            ? "bg-primary text-white shadow-xs" 
                            : "bg-[var(--color-bg-light)] text-[var(--color-text-dark)] border border-[var(--color-border-color)]"
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-[var(--color-text-gray)] mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="pt-4 border-t border-[var(--color-border-color)] flex items-center gap-2">
                    <input 
                      type="text"
                      placeholder="Type message to guest or send check-in instructions..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      className="flex-1 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] p-3 rounded-2xl text-xs font-medium outline-none focus:border-primary text-[var(--color-text-dark)]"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white p-3 rounded-2xl shadow cursor-pointer border-none"
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-gray)]">
                  Select a conversation thread to view messages.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 7: REVIEWS & QUALITY */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)]">
                  Guest Reviews & Ratings
                </h2>
                <p className="text-xs text-[var(--color-text-gray)]">
                  Maintain a 4.8+ rating to preserve your Superhost badge and boost placement rank.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold font-sans tabular-nums text-amber-500 flex items-center gap-1 justify-end">
                  <Star size={20} className="fill-amber-500" /> {hostData.profile?.rating || 4.96}
                </div>
                <div className="text-[11px] text-[var(--color-text-gray)]">100% 5-Star Reviews this Quarter</div>
              </div>
            </div>

            <div className="space-y-4">
              {hostData.reviews?.map((rev) => (
                <div key={rev.id} className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-[var(--color-text-dark)]">{rev.guestName} ({rev.guestCountry})</div>
                      <div className="text-xs text-[var(--color-text-gray)]">{rev.propertyTitle} • {rev.date}</div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--color-text-dark)] leading-relaxed italic">
                    "{rev.text}"
                  </p>

                  {rev.response ? (
                    <div className="p-3.5 bg-[var(--color-bg-light)] rounded-2xl border-l-4 border-primary text-xs space-y-1">
                      <span className="font-bold text-primary block">Your Public Host Response:</span>
                      <p className="text-[var(--color-text-dark)]">{rev.response}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {replyingReviewId === rev.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            placeholder="Write a gracious host reply visible to future guests..."
                            value={reviewReplyText}
                            onChange={(e) => setReviewReplyText(e.target.value)}
                            className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border-color)] p-3 rounded-2xl text-xs outline-none focus:border-primary text-[var(--color-text-dark)]"
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleReviewReplySubmit(rev.id)}
                              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl border-none cursor-pointer"
                            >
                              Post Public Reply
                            </button>
                            <button 
                              onClick={() => setReplyingReviewId(null)}
                              className="bg-transparent text-[var(--color-text-gray)] text-xs font-bold px-3 py-2 rounded-xl border border-[var(--color-border-color)] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setReplyingReviewId(rev.id); setReviewReplyText(""); }}
                          className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                        >
                          Reply to Review →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: POLICIES & SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)]">
              Host Policies & Verification
            </h2>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)]">
                  Host Protection & Trust Guarantee
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-gray)]">Host Protection Insurance:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1"><ShieldCheck size={14} /> $1M Reservo Cover Active</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)]">
                  Default Cancellation Policy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Flexible (24h prior)", "Moderate (5 days prior)", "Strict (14 days prior)"].map((pol, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] text-xs font-bold">
                      {pol}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)]">
                  Assigned Co-Hosts & Property Managers
                </h4>
                {hostData.profile?.coHosts?.map((ch) => (
                  <div key={ch.id} className="p-3.5 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-[var(--color-text-dark)]">{ch.name}</div>
                      <div className="text-[11px] text-[var(--color-text-gray)]">{ch.email} • {ch.role}</div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                      {ch.access} Access
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reservation Invoice & Voucher Modal */}
      <AnimatePresence>
        {selectedResModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] w-full max-w-lg rounded-[32px] p-6 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-[var(--color-border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <h3 className="text-base font-bold font-serif text-[var(--color-text-dark)]">Booking Dossier & Voucher</h3>
                </div>
                <button 
                  onClick={() => setSelectedResModal(null)}
                  className="p-1 rounded-full text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] bg-transparent border-none cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-gray)]">Booking Reference:</span>
                  <span className="font-bold text-[var(--color-text-dark)]">{selectedResModal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-gray)]">Lead Guest:</span>
                  <span className="font-bold text-[var(--color-text-dark)]">{selectedResModal.guest.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-gray)]">Check-in / Check-out:</span>
                  <span className="font-bold text-[var(--color-text-dark)]">{selectedResModal.dates.checkIn} to {selectedResModal.dates.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-gray)]">Gross Total Paid by Guest:</span>
                  <span className="font-extrabold text-[var(--color-text-dark)] tabular-nums">₹{selectedResModal.totalPaid.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--color-border-color)] pt-2 text-sm font-bold text-primary">
                  <span>Host Net Payout:</span>
                  <span className="tabular-nums">₹{selectedResModal.payoutAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toast(`Booking Voucher ${selectedResModal.id} downloaded!`, "success");
                    setSelectedResModal(null);
                  }}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-2xl cursor-pointer border-none transition-all shadow"
                >
                  Download PDF Voucher
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Notification Composer & Live Preview Modal */}
      <AnimatePresence>
        {selectedNotifResId && (() => {
          const targetRes = hostData.reservations?.find(r => r.id === selectedNotifResId);
          if (!targetRes) return null;

          const currentAccessPin = notifAccessCode || targetRes.accessCode || "VS-8942#";

          return (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] w-full max-w-5xl rounded-[32px] p-6 sm:p-8 shadow-2xl my-8 space-y-6"
              >
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b border-[var(--color-border-color)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                      <MailCheck size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black font-serif text-[var(--color-text-dark)]">
                        Dispatch Booking Confirmation Notification
                      </h3>
                      <p className="text-xs text-[var(--color-text-gray)]">
                        Send official reservation confirmation email and SMS/chat message to <strong>{targetRes.guest.name}</strong>.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedNotifResId(null); setNotifCustomNote(""); }}
                    className="p-2 rounded-full text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] hover:bg-[var(--color-bg-light)] bg-transparent border-none cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Notification Customizer */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* Stay Overview Pill Card */}
                    <div className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[var(--color-text-dark)]">{targetRes.guest.name}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200">
                          ₹{targetRes.totalPaid.toLocaleString("en-IN")} Paid
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--color-text-gray)]">
                        {targetRes.listingTitle}
                      </div>
                      <div className="text-[11px] font-semibold text-[var(--color-text-dark)] flex items-center gap-1.5 pt-1 border-t border-[var(--color-border-color)]">
                        <Calendar size={12} className="text-primary" /> {targetRes.dates.checkIn} → {targetRes.dates.checkOut} ({targetRes.dates.nights} Nights)
                      </div>
                    </div>

                    {/* Delivery Channels */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)] block">
                        Delivery Channels
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] cursor-pointer text-xs font-semibold">
                          <input 
                            type="checkbox" 
                            checked={notifSendEmail} 
                            onChange={(e) => setNotifSendEmail(e.target.checked)}
                            className="rounded accent-primary w-4 h-4 cursor-pointer"
                          />
                          <Mail size={15} className="text-emerald-600" />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-[var(--color-text-dark)] block">Official Confirmation Email</span>
                            <span className="text-[10px] text-[var(--color-text-gray)] truncate block">{targetRes.guest.email}</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] cursor-pointer text-xs font-semibold">
                          <input 
                            type="checkbox" 
                            checked={notifSendMessage} 
                            onChange={(e) => setNotifSendMessage(e.target.checked)}
                            className="rounded accent-primary w-4 h-4 cursor-pointer"
                          />
                          <MessageSquare size={15} className="text-blue-600" />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-[var(--color-text-dark)] block">In-App Message & SMS</span>
                            <span className="text-[10px] text-[var(--color-text-gray)] truncate block">{targetRes.guest.phone} • Reservo Chat</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Keyless Door PIN */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)] flex items-center justify-between">
                        <span>Keyless Access PIN Code</span>
                        <span className="text-[10px] font-normal text-[var(--color-text-gray)]">Smart Lock Synchronized</span>
                      </label>
                      <div className="relative">
                        <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                        <input 
                          type="text" 
                          value={currentAccessPin}
                          onChange={(e) => setNotifAccessCode(e.target.value)}
                          placeholder="e.g. VS-8942#"
                          className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl text-xs font-mono font-bold text-[var(--color-text-dark)] outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Notification Template */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)] block">
                        Confirmation Template
                      </label>
                      <select
                        value={notifTemplate}
                        onChange={(e) => setNotifTemplate(e.target.value)}
                        className="w-full p-2.5 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl text-xs font-semibold text-[var(--color-text-dark)] outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="Royal Welcome & Keyless Access">🏰 Royal Welcome & Keyless Access</option>
                        <option value="Luxury Concierge & Itinerary Guide">🌴 Luxury Concierge & Itinerary Guide</option>
                        <option value="Official Booking Voucher & Invoice">📄 Official Booking Voucher & Tax Invoice</option>
                      </select>
                    </div>

                    {/* Personalized Host Welcome Note */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)] block">
                        Personalized Host Welcome Note (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={notifCustomNote}
                        onChange={(e) => setNotifCustomNote(e.target.value)}
                        placeholder="e.g. We have chilled complimentary sparkling wine and prepared fresh floral arrangements for your check-in!"
                        className="w-full p-3 bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-2xl text-xs text-[var(--color-text-dark)] outline-none focus:border-primary resize-none"
                      />
                    </div>

                    {/* Send Action */}
                    <button
                      onClick={() => handleSendConfirmation(targetRes.id)}
                      disabled={!notifSendEmail && !notifSendMessage}
                      className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-xs font-extrabold rounded-2xl shadow-lg cursor-pointer border-none flex items-center justify-center gap-2 transition-all"
                    >
                      <Send size={15} /> Send Booking Confirmation Now
                    </button>

                  </div>

                  {/* Right Column: Live Real-Time Preview */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)]">
                        Live Real-Time Preview
                      </span>
                      <div className="flex items-center gap-1 bg-[var(--color-bg-light)] p-1 rounded-xl border border-[var(--color-border-color)]">
                        <button
                          onClick={() => setNotifPreviewTab("email")}
                          className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all border-none cursor-pointer flex items-center gap-1 ${
                            notifPreviewTab === "email" ? "bg-primary text-white shadow-xs" : "bg-transparent text-[var(--color-text-gray)]"
                          }`}
                        >
                          <Mail size={12} /> Email Preview
                        </button>
                        <button
                          onClick={() => setNotifPreviewTab("message")}
                          className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all border-none cursor-pointer flex items-center gap-1 ${
                            notifPreviewTab === "message" ? "bg-primary text-white shadow-xs" : "bg-transparent text-[var(--color-text-gray)]"
                          }`}
                        >
                          <MessageSquare size={12} /> SMS / Chat Preview
                        </button>
                      </div>
                    </div>

                    {/* Live Preview Container */}
                    {notifPreviewTab === "email" ? (
                      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl overflow-hidden shadow-inner font-sans text-xs">
                        {/* Email Header */}
                        <div className="bg-[#0A2342] text-white p-5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400 font-serif font-black text-base tracking-wider">RESERVO</span>
                            <span className="text-[10px] text-blue-200 font-bold uppercase px-2 py-0.5 rounded-full bg-blue-900/60 border border-blue-700">
                              Booking Confirmation
                            </span>
                          </div>
                          <span className="text-[11px] text-amber-300 font-mono font-bold">#{targetRes.id}</span>
                        </div>

                        {/* Email Content */}
                        <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
                          <div>
                            <h4 className="text-base font-extrabold font-serif text-slate-900">
                              Your Stay is Confirmed, {targetRes.guest.name.split(" ")[0]}!
                            </h4>
                            <p className="text-xs text-slate-600 mt-1">
                              Payment of <strong>₹{targetRes.totalPaid.toLocaleString("en-IN")}</strong> has been received and verified. Here are your official arrival and check-in credentials.
                            </p>
                          </div>

                          {/* Keyless Access PIN Banner */}
                          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-amber-800 block">Smart Lock Keyless Door PIN</span>
                              <span className="text-2xl font-mono font-black text-amber-900 tracking-wider">
                                {currentAccessPin}
                              </span>
                            </div>
                            <div className="text-right text-[11px] text-amber-800">
                              <div>Check-in: <strong>3:00 PM</strong></div>
                              <div>Check-out: <strong>11:00 AM</strong></div>
                            </div>
                          </div>

                          {/* Property Details */}
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="font-bold text-slate-900">{targetRes.listingTitle}</div>
                            <div className="text-xs text-slate-600 flex items-center justify-between">
                              <span>Dates: <strong>{targetRes.dates.checkIn} to {targetRes.dates.checkOut}</strong> ({targetRes.dates.nights} Nights)</span>
                              <span>Guests: <strong>{targetRes.guestsCount.adults} Adults, {targetRes.guestsCount.children} Children</strong></span>
                            </div>
                          </div>

                          {/* WiFi & Connectivity */}
                          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-blue-700 block">Villa High-Speed WiFi</span>
                              <span className="font-mono font-semibold">Network: <strong>Reservo_Guest_5G</strong> • Password: <strong>LuxuryStay2026!</strong></span>
                            </div>
                          </div>

                          {/* Custom Host Note if provided */}
                          {notifCustomNote && (
                            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                              <span className="text-[10px] font-bold uppercase text-emerald-700 block">Personal Note from Your Host {hostName.split(" ")[0] || "Host"}:</span>
                              <p className="italic">"{notifCustomNote}"</p>
                            </div>
                          )}

                          {/* Host Signature */}
                          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
                            <span>Host: <strong>{hostName}</strong> (Superhost)</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Reservo Escrow Protected
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* SMS / Chat Preview */
                      <div className="bg-[var(--color-bg-light)] border border-[var(--color-border-color)] rounded-3xl p-6 flex flex-col justify-center min-h-[350px]">
                        <div className="max-w-sm mx-auto w-full space-y-3">
                          <div className="text-center text-[10px] font-bold uppercase text-[var(--color-text-gray)]">
                            SMS & Reservo Chat Preview
                          </div>
                          <div className="p-4 rounded-3xl rounded-tl-sm bg-primary text-white text-xs space-y-2 shadow-md">
                            <p className="leading-relaxed">
                              ✨ <strong>Booking Confirmation Dispatched!</strong><br />
                              Dear {targetRes.guest.name.split(" ")[0]}, your stay at <strong>{targetRes.listingTitle}</strong> ({targetRes.dates.checkIn} to {targetRes.dates.checkOut}) is confirmed & fully paid.
                            </p>
                            <div className="p-2 rounded-xl bg-white/20 font-mono font-bold text-xs text-amber-300 flex items-center justify-between">
                              <span>Door PIN: {currentAccessPin}</span>
                              <Key size={13} />
                            </div>
                            {notifCustomNote && (
                              <p className="text-[11px] text-blue-100 italic pt-1 border-t border-white/20">
                                Host Note: "{notifCustomNote}"
                              </p>
                            )}
                            <div className="text-[10px] text-right text-blue-200">
                              Just now • Delivered
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
