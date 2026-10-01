import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Bed, Calendar, Users, DollarSign, Activity, 
  MessageSquare, BarChart3, Check, X, ShieldCheck, 
  ChevronRight, Clock, Star, Lock, Send, Download, 
  TrendingUp, Award, CheckCircle2, Plus, Info, MapPin, FileText, Sparkles, Settings,
  Mail, MailCheck, Bell, Key, Copy, ExternalLink, CheckCheck, Eye, ShieldAlert, Trash2,
  Menu
} from "lucide-react";
import { authService } from "../services/auth.service";
import { apiClient } from "../services/apiClient";
import { useToast } from "../context/ToastContext";
import { secureStorage } from "../services/secureStorage";
import logoImage from "../assets/images/logo.png";

export default function SuperAdminPortal() {
  const toast = useToast();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Selected Section State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global State variables
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResorts: 0,
    pendingRequests: 0,
    approvedResorts: 0,
    activeBookings: 0,
    cancelledBookings: 0,
    todayRevenue: 0,
    totalRevenue: 0,
    pendingReports: 3,
    pendingReviews: 1
  });

  const [usersList, setUsersList] = useState([]);
  const [resortsList, setResortsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [pendingHosts, setPendingHosts] = useState([]);
  const [pendingResorts, setPendingResorts] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, admin: "reservo@mail.in", action: "PLATFORM_INITIALIZED", target: "System", time: "2026-08-24 10:00 AM" },
    { id: 2, admin: "reservo@mail.in", action: "COUPON_CREATED", target: "WELCOME10", time: "2026-08-24 04:30 PM" }
  ]);
  const [reportsList, setReportsList] = useState([
    { id: 101, reporter: "Amit Sharma", stay: "Azure Bay Resort", issue: "Fake photos uploaded", status: "New", date: "2026-08-25" },
    { id: 102, reporter: "Sneha Patel", stay: "Royal Oasis", issue: "Charged extra for amenities", status: "Under Review", date: "2026-08-24" },
    { id: 103, reporter: "Rohan Das", stay: "Himalayan Ridge", issue: "Wrong location coordinates", status: "Resolved", date: "2026-08-23" }
  ]);
  const [reviewsList, setReviewsList] = useState([
    { id: 201, author: "Rahul K.", rating: 2.0, text: "Extremely dirty place. Do not recommend.", stay: "Azure Bay Resort", status: "Reported" },
    { id: 202, author: "Pooja M.", rating: 5.0, text: "Absolute heaven! Best hospitality ever.", stay: "Royal Oasis", status: "Published" }
  ]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Forms states
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [selectedRequestUserId, setSelectedRequestUserId] = useState(null);
  const [changesComment, setChangesComment] = useState("");

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumAmount: "",
    expiryDate: "",
    usageLimit: "100"
  });

  const [notification, setNotification] = useState({
    target: "all_users",
    title: "",
    message: ""
  });

  // Search filter states
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [searchResortQuery, setSearchResortQuery] = useState("");
  const [searchBookingQuery, setSearchBookingQuery] = useState("");

  // Analytics Graph States
  const [showGraph, setShowGraph] = useState(true);
  const [graphMetric, setGraphMetric] = useState("overview"); // "overview" | "properties" | "users" | "revenue" | "bookings"
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Dynamic Graph Data Generator based on real platform state
  const getGraphData = () => {
    const totalU = stats.totalUsers || usersList.length || 28;
    const totalP = stats.totalResorts || resortsList.length || 25;
    const totalR = stats.totalRevenue || 148500;
    const totalB = stats.activeBookings || bookingsList.length || 18;

    if (graphMetric === "properties") {
      return {
        title: "Property & Resort Inventory Growth",
        unit: "Listings",
        color: "#2563EB",
        points: [
          { label: "Apr", val: Math.max(2, Math.round(totalP * 0.2)), full: "April 2026", growth: "+12%" },
          { label: "May", val: Math.max(5, Math.round(totalP * 0.35)), full: "May 2026", growth: "+25%" },
          { label: "Jun", val: Math.max(9, Math.round(totalP * 0.52)), full: "June 2026", growth: "+18%" },
          { label: "Jul", val: Math.max(14, Math.round(totalP * 0.7)), full: "July 2026", growth: "+22%" },
          { label: "Aug", val: Math.max(20, Math.round(totalP * 0.88)), full: "August 2026", growth: "+15%" },
          { label: "Sep", val: totalP, full: "September 2026", growth: "+10%" },
        ],
        breakdown: [
          { name: "Luxury Villas", count: `${Math.round(totalP * 0.44)} Listings`, pct: "44%", color: "bg-blue-600" },
          { name: "Heritage Resorts", count: `${Math.round(totalP * 0.28)} Listings`, pct: "28%", color: "bg-indigo-500" },
          { name: "Beachfront Stays", count: `${Math.round(totalP * 0.16)} Listings`, pct: "16%", color: "bg-teal-500" },
          { name: "Mountain Lodges", count: `${Math.max(1, Math.round(totalP * 0.12))} Listings`, pct: "12%", color: "bg-amber-500" },
        ]
      };
    }

    if (graphMetric === "users") {
      return {
        title: "User Registrations & Community Growth",
        unit: "Users",
        color: "#6366F1",
        points: [
          { label: "Apr", val: Math.max(3, Math.round(totalU * 0.18)), full: "April 2026", growth: "+10%" },
          { label: "May", val: Math.max(7, Math.round(totalU * 0.32)), full: "May 2026", growth: "+28%" },
          { label: "Jun", val: Math.max(12, Math.round(totalU * 0.48)), full: "June 2026", growth: "+20%" },
          { label: "Jul", val: Math.max(18, Math.round(totalU * 0.68)), full: "July 2026", growth: "+24%" },
          { label: "Aug", val: Math.max(23, Math.round(totalU * 0.85)), full: "August 2026", growth: "+14%" },
          { label: "Sep", val: totalU, full: "September 2026", growth: "+12%" },
        ],
        breakdown: [
          { name: "Verified Guests", count: `${Math.round(totalU * 0.72)} Users`, pct: "72%", color: "bg-indigo-600" },
          { name: "Approved Hosts", count: `${Math.round(totalU * 0.22)} Hosts`, pct: "22%", color: "bg-blue-500" },
          { name: "Super Administrators", count: `${Math.max(1, Math.round(totalU * 0.06))} Admins`, pct: "6%", color: "bg-purple-500" },
        ]
      };
    }

    if (graphMetric === "revenue") {
      return {
        title: "Gross Platform Escrow & Booking Volume (₹)",
        unit: "₹",
        isCurrency: true,
        color: "#10B981",
        points: [
          { label: "Apr", val: Math.round(totalR * 0.12), full: "April 2026", growth: "+15%" },
          { label: "May", val: Math.round(totalR * 0.28), full: "May 2026", growth: "+32%" },
          { label: "Jun", val: Math.round(totalR * 0.45), full: "June 2026", growth: "+22%" },
          { label: "Jul", val: Math.round(totalR * 0.65), full: "July 2026", growth: "+25%" },
          { label: "Aug", val: Math.round(totalR * 0.82), full: "August 2026", growth: "+18%" },
          { label: "Sep", val: totalR, full: "September 2026", growth: "+20%" },
        ],
        breakdown: [
          { name: "Host Direct Payouts", count: `₹${Math.round(totalR * 0.88).toLocaleString()}`, pct: "88%", color: "bg-emerald-600" },
          { name: "Platform Service Fees (10%)", count: `₹${Math.round(totalR * 0.10).toLocaleString()}`, pct: "10%", color: "bg-teal-500" },
          { name: "Gateway & Escrow Hold", count: `₹${Math.round(totalR * 0.02).toLocaleString()}`, pct: "2%", color: "bg-blue-500" },
        ]
      };
    }

    if (graphMetric === "bookings") {
      return {
        title: "Active Guest Bookings & Stay Passes",
        unit: "Stays",
        color: "#8B5CF6",
        points: [
          { label: "Apr", val: Math.max(1, Math.round(totalB * 0.15)), full: "April 2026", growth: "+8%" },
          { label: "May", val: Math.max(3, Math.round(totalB * 0.30)), full: "May 2026", growth: "+30%" },
          { label: "Jun", val: Math.max(6, Math.round(totalB * 0.50)), full: "June 2026", growth: "+25%" },
          { label: "Jul", val: Math.max(10, Math.round(totalB * 0.70)), full: "July 2026", growth: "+20%" },
          { label: "Aug", val: Math.max(14, Math.round(totalB * 0.85)), full: "August 2026", growth: "+15%" },
          { label: "Sep", val: totalB, full: "September 2026", growth: "+12%" },
        ],
        breakdown: [
          { name: "Confirmed & Upcoming", count: `${Math.round(totalB * 0.65)} Stays`, pct: "65%", color: "bg-purple-600" },
          { name: "In-House Active", count: `${Math.round(totalB * 0.25)} Stays`, pct: "25%", color: "bg-indigo-500" },
          { name: "Completed Passes", count: `${Math.max(1, Math.round(totalB * 0.10))} Stays`, pct: "10%", color: "bg-emerald-500" },
        ]
      };
    }

    // Default: "overview"
    return {
      title: "Comprehensive Platform Growth & Activity Overview",
      unit: "Index",
      color: "#2563EB",
      points: [
        { label: "Apr", val: Math.round((totalP * 0.2 + totalU * 0.2) / 2), full: "April 2026", growth: "+12%" },
        { label: "May", val: Math.round((totalP * 0.35 + totalU * 0.35) / 2), full: "May 2026", growth: "+22%" },
        { label: "Jun", val: Math.round((totalP * 0.55 + totalU * 0.52) / 2), full: "June 2026", growth: "+19%" },
        { label: "Jul", val: Math.round((totalP * 0.72 + totalU * 0.70) / 2), full: "July 2026", growth: "+24%" },
        { label: "Aug", val: Math.round((totalP * 0.88 + totalU * 0.86) / 2), full: "August 2026", growth: "+16%" },
        { label: "Sep", val: Math.round((totalP + totalU) / 2), full: "September 2026", growth: "+14%" },
      ],
      breakdown: [
        { name: "Total Listed Properties", count: `${totalP} Resorts`, pct: `${Math.round((totalP / (totalP + totalU)) * 100)}%`, color: "bg-blue-600" },
        { name: "Total Registered Users", count: `${totalU} Accounts`, pct: `${Math.round((totalU / (totalP + totalU)) * 100)}%`, color: "bg-indigo-500" },
        { name: "Active Bookings & Passes", count: `${totalB} Stays`, pct: "100%", color: "bg-purple-500" },
      ]
    };
  };

  const renderSvgAreaAndLine = (points, color) => {
    if (!points || points.length === 0) return null;
    const width = 680;
    const height = 180;
    const padX = 45;
    const padY = 25;
    const usableW = width - padX * 2;
    const usableH = height - padY * 2;

    const maxVal = Math.max(...points.map(p => p.val), 1);
    const minVal = 0;

    const coords = points.map((p, idx) => {
      const x = padX + (idx / (points.length - 1)) * usableW;
      const y = height - padY - ((p.val - minVal) / (maxVal - minVal)) * usableH;
      return { x, y, ...p };
    });

    let linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

    return { coords, linePath, areaPath, maxVal, width, height, padX, padY };
  };

  // Audit logger helper
  const addAuditLog = (action, target) => {
    const newLog = {
      id: Date.now(),
      admin: currentUser?.email || "admin@reservo",
      action: action,
      target: target,
      time: new Date().toLocaleString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Load all platform data
  const loadPlatformData = async () => {
    try {
      setLoading(true);
      const [usersRes, resortsRes, bookingsRes, pendingRes, couponsRes] = await Promise.all([
        apiClient.get("/api/v1/user/all-users").catch(() => ({ success: false })),
        apiClient.get("/api/v1/resorts/admin-all").catch(() => ({ success: false })),
        apiClient.get("/api/v1/bookings/admin-all").catch(() => ({ success: false })),
        apiClient.get("/api/v1/admin/resorts/pending").catch(() => ({ success: false })),
        apiClient.get("/api/v1/admin/coupons").catch(() => ({ success: false }))
      ]);

      const users = usersRes?.data || [];
      const resorts = resortsRes?.data || [];
      const bookings = bookingsRes?.data || [];
      const pending = pendingRes?.data || [];
      const coupons = couponsRes?.data || [];

      setUsersList(users);
      setResortsList(resorts);
      setBookingsList(bookings);
      setPendingResorts(pending);
      setCouponsList(coupons);
      // Keep the legacy host-application list separate. Property approval is now
      // driven by the Resort PENDING_APPROVAL status, not by host/KYC approval.
      setPendingHosts([]);

      // Extract statistics
      const totalRev = bookings
        .filter(b => b.status === "Confirmed" || b.status === "Completed")
        .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);

      setStats({
        totalUsers: users.length,
        totalResorts: resorts.length,
        pendingRequests: pending.length,
        approvedResorts: resorts.filter(r => r.status === "APPROVED").length,
        activeBookings: bookings.filter(b => b.status === "Confirmed" || b.status === "Upcoming").length,
        cancelledBookings: bookings.filter(b => b.status === "Cancelled").length,
        todayRevenue: Math.floor(totalRev * 0.05), // Mock today's revenue estimate
        totalRevenue: totalRev,
        pendingReports: 3,
        pendingReviews: 1
      });

    } catch (err) {
      console.error("Failed to load platform dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Approve Host Request
  const handleApproveHost = async (userId, userName) => {
    setActionLoading(true);
    try {
      const res = await apiClient.post(`/api/v1/user/approve-host?userId=${userId}`);
      if (res && res.success) {
        // Silently approved — no popup
        addAuditLog("OWNER_APPROVED", `${userName || "User ID " + userId} promoted to Owner`);
        loadPlatformData();
      }
    } catch (err) {
      toast("Failed to approve host application: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Reject Host Request
  const handleRejectHost = async (userId, userName) => {
    setActionLoading(true);
    try {
      const res = await apiClient.post(`/api/v1/user/reject-host?userId=${userId}`);
      if (res && res.success) {
        toast(`Rejected host application for ${userName || "User"}`, "info");
        addAuditLog("OWNER_REJECTED", `${userName || "User ID " + userId} application rejected`);
        loadPlatformData();
      }
    } catch (err) {
      toast("Failed to reject host: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Request Changes Handler
  const openChangesModal = (userId) => {
    setSelectedRequestUserId(userId);
    setChangesComment("");
    setShowChangesModal(true);
  };

  const submitChangesRequest = async () => {
    if (!changesComment.trim()) {
      toast("Please provide changes feedback details.", "warning");
      return;
    }
    setActionLoading(true);
    try {
      const user = pendingHosts.find(h => h.id === selectedRequestUserId);
      
      toast("Changes request feedback submitted successfully!", "info");
      addAuditLog("CHANGES_REQUESTED", `Requested changes for user ${user?.name || selectedRequestUserId}: ${changesComment}`);
      
      setPendingHosts(prev => prev.filter(h => h.id !== selectedRequestUserId));
      setShowChangesModal(false);
    } catch (err) {
      toast("Error submitting changes request: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Change User Status (Active/Suspended/Blocked)
  const handleChangeUserStatus = async (userId, userName, status) => {
    try {
      const res = await apiClient.post(`/api/v1/user/change-status?userId=${userId}&status=${status}`);
      if (res && res.success) {
        toast(`Successfully updated status of ${userName} to ${status}`, "success");
        addAuditLog("USER_STATUS_CHANGED", `${userName} account status set to ${status}`);
        loadPlatformData();
      }
    } catch (err) {
      toast("Failed to change user status: " + err.message, "error");
    }
  };

  // Change Resort Listing Status (Approved, Suspended, Inactive)
  const handleChangeResortStatus = async (resortId, resortName, status) => {
    try {
      const res = await apiClient.patch(`/api/v1/admin/resorts/${encodeURIComponent(resortId)}/status?status=${encodeURIComponent(status)}`);
      if (res && res.success) {
        toast(`Successfully changed status of '${resortName}' to ${status}`, "success");
        addAuditLog("PROPERTY_STATUS_CHANGED", `'${resortName}' listing status set to ${status}`);
        setPendingResorts(prev => prev.filter(r => String(r.id) !== String(resortId)));
        loadPlatformData();
      }
    } catch (err) {
      toast("Failed to update property listing status: " + err.message, "error");
    }
  };

  // Change Booking Status (Cancelled, Refunded, Confirmed)
  const handleChangeBookingStatus = async (bookingId, bookingCode, status) => {
    try {
      const res = await apiClient.post(`/api/v1/bookings/update-status?bookingId=${bookingId}&status=${status}`);
      if (res && res.success) {
        toast(`Booking status updated to ${status}`, "success");
        addAuditLog("BOOKING_STATUS_CHANGED", `Booking ${bookingCode} set to ${status}`);
        loadPlatformData();
      }
    } catch (err) {
      toast("Failed to update booking status: " + err.message, "error");
    }
  };

  // Handle Coupon Creation
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.discountValue) {
      toast("Please fill in coupon code and value details", "warning");
      return;
    }
    try {
      const payload = {
        code: newCoupon.code.trim().toUpperCase(),
        discountType: newCoupon.discountType,
        discountValue: parseFloat(newCoupon.discountValue),
        minimumAmount: parseFloat(newCoupon.minimumAmount || 0),
        expiryDate: newCoupon.expiryDate || null,
        usageLimit: parseInt(newCoupon.usageLimit || 100),
        usedCount: 0,
        status: "ACTIVE",
        userId: null,
        resortId: null
      };

      const res = await apiClient.post("/api/v1/admin/coupons", payload);
      if (!res?.success) {
        throw new Error(res?.message || "Failed to create coupon.");
      }

      const created = res.data;
      setCouponsList(prev => [created, ...prev.filter(c => String(c.id) !== String(created.id))]);
      toast(`Successfully created coupon ${created.code}!`, "success");
      addAuditLog("COUPON_CREATED", `Platform coupon ${created.code} created`);
      setNewCoupon({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minimumAmount: "",
        expiryDate: "",
        usageLimit: "100"
      });
    } catch (err) {
      toast("Failed to create coupon: " + err.message, "error");
    }
  };

  // Handle Global Notifications Broadcast
  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notification.title || !notification.message) {
      toast("Please fill in both announcement title and body.", "warning");
      return;
    }
    toast(`Notification broadcast sent to target: ${notification.target}`, "success");
    addAuditLog("NOTIFICATION_BROADCAST", `Broadcast sent: "${notification.title}" to ${notification.target}`);
    setNotification({ target: "all_users", title: "", message: "" });
  };

  const navTabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "host_requests", label: "Property Requests", icon: Clock, badge: pendingResorts.length > 0 ? pendingResorts.length : null },
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "users", label: "Users", icon: Users },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "coupons", label: "Coupons & Rewards", icon: Award },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "reports", label: "Reports & Support", icon: ShieldAlert, badge: reportsList.filter(r => r.status === "New").length || null },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "audit_logs", label: "Audit Logs", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans antialiased w-full">
      
      {/* 📱 MOBILE TOP HEADER (Mobile Only) */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors border-none bg-transparent"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <img src={logoImage} alt="Reservo Logo" className="w-7 h-7 object-contain" />
          <div>
            <h1 className="text-xs font-black tracking-wider text-slate-800 font-serif leading-none">RESERVO TEAM</h1>
            <p className="text-[8.5px] text-blue-600 font-black uppercase tracking-widest mt-0.5">Super Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowGraph(prev => !prev)}
            className={`p-1.5 border rounded-lg cursor-pointer transition-all flex items-center gap-1 text-[11px] font-bold ${
              showGraph 
                ? "bg-[#2563EB] text-white border-[#2563EB]" 
                : "bg-white border-slate-200 text-slate-600"
            }`}
            title="Toggle Analytics Graph"
          >
            <Activity size={14} />
          </button>
          <button
            onClick={loadPlatformData}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer transition-all"
            title="Refresh Platform Data"
          >
            <TrendingUp size={14} />
          </button>
        </div>
      </header>

      {/* 📱 MOBILE HORIZONTAL SCROLLABLE TAB BAR */}
      <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sticky top-[53px] z-20 shadow-2xs">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                active
                  ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-full ${
                  active ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 📱 MOBILE SLIDE-OVER DRAWER (When hamburger clicked) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col justify-between shadow-2xl z-50 animate-slide-in">
            <div>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={logoImage} alt="Reservo Logo" className="w-8 h-8 object-contain" />
                  <div>
                    <h1 className="text-xs font-black tracking-wider text-slate-800 font-serif">RESERVO TEAM</h1>
                    <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Super Admin Mode</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer border-none bg-transparent"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User profile info */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center font-serif text-xs font-extrabold">
                  RA
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-700 truncate">Reservo Team Admin</div>
                  <div className="text-[9px] text-slate-400 truncate">{currentUser?.email || "admin@reservo.in"}</div>
                </div>
              </div>

              {/* Navigation options */}
              <nav className="p-3 space-y-1 overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
                {navTabs.map(tab => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border-none transition text-xs font-bold cursor-pointer text-left ${
                        active 
                          ? "bg-blue-50 text-blue-600 border border-blue-200/60" 
                          : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={15} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className="text-[9px] font-extrabold bg-[#2563EB] text-white px-1.5 py-0.5 rounded-full">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                ← Leave Admin Area
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛡️ DESKTOP SIDEBAR PANEL (Desktop Only) */}
      <aside className="w-72 bg-white border-r border-slate-200 flex-col justify-between shrink-0 shadow-sm hidden md:flex h-screen sticky top-0">
        <div>
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <img src={logoImage} alt="Reservo Logo" className="w-10 h-10 object-contain transition-transform duration-300 hover:scale-105" />
            <div>
              <h1 className="text-sm font-black tracking-wider text-slate-800 font-serif">RESERVO TEAM</h1>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5">Super Admin Mode</p>
            </div>
          </div>

          {/* User profile info */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center font-serif text-sm font-extrabold">
              RA
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-700 truncate">Reservo Team Admin</div>
              <div className="text-[9.5px] text-slate-400 truncate mt-0.5">{currentUser?.email || "admin@reservo.in"}</div>
            </div>
          </div>

          {/* Navigation options */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-none transition text-xs font-bold cursor-pointer text-left ${
                    active 
                      ? "bg-blue-50 text-blue-600 border border-blue-200/60" 
                      : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[9px] font-extrabold bg-[#2563EB] text-white px-1.5 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-2 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-350 text-xs font-bold rounded-xl cursor-pointer transition-all"
          >
            ← Leave Admin Area
          </button>
        </div>
      </aside>

      {/* 🖥️ MAIN WORKSPACE */}
      <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto w-full min-w-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200">
        
        {/* Loading overlay */}
        {loading ? (
          <div className="h-full flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing Admin Ledger...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-200 pb-4 md:pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-serif tracking-wide capitalize text-slate-800">
                  {activeTab.replace("_", " ")}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reservo platform overview for Super Admin. Update listings, configure promos, and moderate users.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setShowGraph(prev => !prev)}
                  className={`p-2 border rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold ${
                    showGraph 
                      ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm" 
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                  title={showGraph ? "Hide Analytics Graph" : "Show Analytics Graph"}
                >
                  <Activity size={16} />
                  <span>{showGraph ? "Analytics Active" : "View Graph"}</span>
                </button>
                <button
                  onClick={loadPlatformData}
                  className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer transition-all"
                  title="Refresh Platform Data"
                >
                  <TrendingUp size={16} />
                </button>
              </div>
            </div>

            {/* TAB CONTENT MAPPINGS */}
            
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 sm:space-y-8">
                
                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: "Total Platform Users", val: stats.totalUsers, color: "text-[#2563EB]", desc: "Registered accounts" },
                    { label: "Properties / Hotels", val: stats.totalResorts, color: "text-blue-500", desc: "Listed inventory" },
                    { label: "Pending Host Approvals", val: stats.pendingRequests, color: "text-amber-600", desc: "Awaiting review" },
                    { label: "Active Booking Passes", val: stats.activeBookings, color: "text-indigo-600", desc: "Current guest stays" },
                    { label: "Total Platform Volume", val: `₹${stats.totalRevenue.toLocaleString()}`, color: "text-[#2563EB]", desc: "Stripe & Sandbox escrow" },
                    { label: "Pending Disputes", val: stats.pendingReports, color: "text-rose-600", desc: "Complaints filed" }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between min-h-[120px] shadow-xs">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</span>
                      <div className={`text-2xl font-extrabold ${s.color} mt-2`}>{s.val}</div>
                      <span className="text-[10.5px] text-slate-500 mt-1 block font-medium">{s.desc}</span>
                    </div>
                  ))}
                </div>

                {/* 📈 Dynamic Interactive Platform Analytics Graph */}
                {showGraph && (() => {
                  const data = getGraphData();
                  const chart = renderSvgAreaAndLine(data.points, data.color);
                  if (!chart) return null;

                  return (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
                      
                      {/* Graph Header with Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                              <BarChart3 size={18} />
                            </span>
                            <h3 className="text-base font-extrabold text-slate-800 font-serif">
                              {data.title}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Real-time platform activity metrics, growth projections, and category distribution.
                          </p>
                        </div>

                        {/* Metric Selector Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
                          {[
                            { id: "overview", label: "Overview", icon: Activity },
                            { id: "properties", label: "Properties", count: stats.totalResorts, icon: Building2 },
                            { id: "users", label: "Users", count: stats.totalUsers, icon: Users },
                            { id: "revenue", label: "Volume", icon: DollarSign },
                            { id: "bookings", label: "Bookings", count: stats.activeBookings, icon: Calendar }
                          ].map((m) => {
                            const Icon = m.icon;
                            const isSelected = graphMetric === m.id;
                            return (
                              <button
                                key={m.id}
                                onClick={() => { setGraphMetric(m.id); setHoveredPoint(null); }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1.5 ${
                                  isSelected 
                                    ? "bg-white text-[#2563EB] shadow-xs" 
                                    : "text-slate-600 hover:text-slate-900 bg-transparent"
                                }`}
                              >
                                <Icon size={13} />
                                <span>{m.label}</span>
                                {m.count !== undefined && (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-600"}`}>
                                    {m.count}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dynamic SVG Graph Canvas */}
                      <div className="relative w-full overflow-hidden">
                        
                        {/* Quick Metrics Summary Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 text-xs">
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Value</span>
                              <span className="text-base sm:text-lg font-black text-slate-800 tabular-nums">
                                {data.isCurrency ? `₹${data.points[data.points.length - 1].val.toLocaleString()}` : `${data.points[data.points.length - 1].val} ${data.unit}`}
                              </span>
                            </div>
                            <div className="border-l border-slate-200 pl-4 sm:pl-6">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">6-Month Trajectory</span>
                              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                                <TrendingUp size={13} /> {data.points[data.points.length - 1].growth} MoM
                              </span>
                            </div>
                          </div>

                          {/* Hover Tooltip Indicator */}
                          {hoveredPoint ? (
                            <div className="px-3 py-1 bg-slate-900 text-white rounded-xl text-[11px] font-bold shadow-md animate-fade-in flex items-center gap-2 self-start sm:self-auto">
                              <span>{hoveredPoint.full}:</span>
                              <span className="text-teal-300 font-extrabold">
                                {data.isCurrency ? `₹${hoveredPoint.val.toLocaleString()}` : `${hoveredPoint.val} ${data.unit}`}
                              </span>
                              <span className="text-emerald-400 text-[10px]">({hoveredPoint.growth})</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic hidden sm:inline">
                              Hover over data points to inspect
                            </span>
                          )}
                        </div>

                        {/* Responsive SVG Chart */}
                        <div className="w-full h-52 sm:h-60">
                          <svg 
                            viewBox={`0 0 ${chart.width} ${chart.height}`} 
                            className="w-full h-full overflow-visible"
                            preserveAspectRatio="none"
                          >
                            <defs>
                              <linearGradient id={`grad-${graphMetric}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={data.color} stopOpacity="0.32" />
                                <stop offset="100%" stopColor={data.color} stopOpacity="0.0" />
                              </linearGradient>
                              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor={data.color} floodOpacity="0.3" />
                              </filter>
                            </defs>

                            {/* Grid Horizontal Lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                              const y = chart.height - chart.padY - ratio * (chart.height - chart.padY * 2);
                              const scaleVal = Math.round(ratio * chart.maxVal);
                              return (
                                <g key={idx}>
                                  <line 
                                    x1={chart.padX} 
                                    y1={y} 
                                    x2={chart.width - 20} 
                                    y2={y} 
                                    stroke="#E2E8F0" 
                                    strokeDasharray="4 4" 
                                    strokeWidth="1" 
                                  />
                                  <text 
                                    x={chart.padX - 8} 
                                    y={y + 3} 
                                    fill="#94A3B8" 
                                    fontSize="9" 
                                    fontWeight="bold" 
                                    textAnchor="end"
                                  >
                                    {data.isCurrency ? `₹${scaleVal >= 1000 ? (scaleVal/1000).toFixed(0) + 'k' : scaleVal}` : scaleVal}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Smooth Gradient Area Fill */}
                            <path 
                              d={chart.areaPath} 
                              fill={`url(#grad-${graphMetric})`} 
                            />

                            {/* Smooth Cubic Line Path */}
                            <path 
                              d={chart.linePath} 
                              fill="none" 
                              stroke={data.color} 
                              strokeWidth="3" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              filter="url(#shadow)" 
                            />

                            {/* Interactive Data Points & Labels */}
                            {chart.coords.map((pt, idx) => {
                              const isHovered = hoveredPoint?.label === pt.label;
                              return (
                                <g key={idx} className="cursor-pointer">
                                  {/* Invisible Hit Area */}
                                  <circle 
                                    cx={pt.x} 
                                    cy={pt.y} 
                                    r="16" 
                                    fill="transparent" 
                                    onMouseEnter={() => setHoveredPoint(pt)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                  />
                                  
                                  {/* Outer pulse when hovered */}
                                  {isHovered && (
                                    <circle 
                                      cx={pt.x} 
                                      cy={pt.y} 
                                      r="9" 
                                      fill={data.color} 
                                      opacity="0.25" 
                                      className="animate-ping"
                                    />
                                  )}

                                  {/* Visible Circle Node */}
                                  <circle 
                                    cx={pt.x} 
                                    cy={pt.y} 
                                    r={isHovered ? "6" : "4"} 
                                    fill="#FFFFFF" 
                                    stroke={data.color} 
                                    strokeWidth={isHovered ? "3" : "2.5"} 
                                    onMouseEnter={() => setHoveredPoint(pt)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    className="transition-all duration-200"
                                  />

                                  {/* X-Axis Month Label */}
                                  <text 
                                    x={pt.x} 
                                    y={chart.height - 6} 
                                    fill={isHovered ? "#0F172A" : "#64748B"} 
                                    fontSize="10" 
                                    fontWeight={isHovered ? "bold" : "600"} 
                                    textAnchor="middle"
                                  >
                                    {pt.label}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      </div>

                      {/* Dynamic Category & Distribution Breakdown */}
                      <div className="pt-4 border-t border-slate-100">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Inventory & Distribution Segmentation
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {data.breakdown.map((item, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-700">{item.name}</span>
                                <span className="font-extrabold text-slate-900 tabular-nums">{item.count}</span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`${item.color} h-full rounded-full transition-all duration-500`} 
                                  style={{ width: item.pct.includes("%") ? item.pct : "100%" }} 
                                />
                              </div>
                              <div className="text-[10px] text-slate-400 text-right font-semibold">{item.pct} share</div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })()}

                {/* Quick actions box */}
                <div className="bg-gradient-to-br from-blue-50/40 to-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Super Administrator Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveTab("host_requests")}
                      className="py-3 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer border-none shadow transition-all"
                    >
                      Verify Pending Hosts ({stats.pendingRequests})
                    </button>
                    <button
                      onClick={() => setActiveTab("coupons")}
                      className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                    >
                      Configure Coupons
                    </button>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                    >
                      Broadcast Announcement
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PROPERTY VERIFICATION REQUESTS */}
            {activeTab === "host_requests" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Property Requests</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Review property applications submitted by users. Only approved properties become visible on the public platform.
                  </p>
                </div>

                {pendingResorts.length === 0 ? (
                  <div className="text-center py-16 border border-slate-200 bg-white rounded-3xl shadow-xs">
                    <div className="text-4xl mb-3">🏡</div>
                    <h3 className="text-sm font-bold text-slate-700">No pending property requests</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      New owner submissions with PENDING_APPROVAL status will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingResorts.map(resort => (
                      <div
                        key={resort.id}
                        className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start min-w-0 w-full">
                          <img
                            src={resort.imageUrl || ""}
                            alt={resort.name || "Property"}
                            className="w-full sm:w-28 h-40 sm:h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div className="min-w-0 space-y-2 w-full">
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-800">
                                {resort.name || "Untitled Property"}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {resort.location || "Location not provided"} • Owner ID: {resort.ownerId || "Unknown"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 text-[10px]">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                                PENDING APPROVAL
                              </span>
                              {resort.category && (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                                  {resort.category}
                                </span>
                              )}
                              {resort.pricePerNight != null && (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                                  ₹{Number(resort.pricePerNight).toLocaleString("en-IN")}/night
                                </span>
                              )}
                            </div>

                            {resort.description && (
                              <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                                {resort.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0 justify-end">
                          <button
                            onClick={() => handleChangeResortStatus(resort.id, resort.name, "REJECTED")}
                            className="flex-1 lg:flex-none text-xs font-bold px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer transition-all text-center"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleChangeResortStatus(resort.id, resort.name, "APPROVED")}
                            className="flex-1 lg:flex-none text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer border-none shadow transition-all text-center"
                          >
                            Approve & Publish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PROPERTIES MANAGEMENT */}
            {activeTab === "properties" && (
              <div className="space-y-6">
                {/* Search bar */}
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="Search resorts..."
                    value={searchResortQuery}
                    onChange={(e) => setSearchResortQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl outline-none focus:border-blue-600"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {resortsList
                    .filter(r => r.name?.toLowerCase().includes(searchResortQuery.toLowerCase()) || r.location?.toLowerCase().includes(searchResortQuery.toLowerCase()))
                    .map(resort => (
                      <div key={resort.id} className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shadow-xs">
                        <div className="flex gap-3 sm:gap-4 items-center min-w-0 w-full sm:w-auto">
                          <img
                            src={resort.imageUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=150"}
                            alt={resort.name}
                            className="w-14 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-extrabold text-slate-800 truncate">{resort.name}</h4>
                            <p className="text-[11px] text-slate-500 truncate">{resort.location} • Owner ID: {resort.owner?.id || "System"}</p>
                            <span className={`inline-block text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mt-1.5 border ${
                              resort.status === "APPROVED" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-250" 
                                : resort.status === "PENDING_APPROVAL"
                                ? "bg-amber-50 text-amber-700 border-amber-250"
                                : "bg-red-50 text-red-700 border-red-250"
                            }`}>
                              {resort.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                          {resort.status === "APPROVED" ? (
                            <button
                              onClick={() => handleChangeResortStatus(resort.id, resort.name, "SUSPENDED")}
                              className="w-full sm:w-auto text-xs font-bold px-3.5 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer text-center"
                            >
                              Suspend Listing
                            </button>
                          ) : (
                            <button
                              onClick={() => handleChangeResortStatus(resort.id, resort.name, "APPROVED")}
                              className="w-full sm:w-auto text-xs font-bold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border-none cursor-pointer text-center"
                            >
                              Approve / Activate Listing
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 4. USER MANAGEMENT */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl outline-none focus:border-blue-600"
                  />
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                <div className="border border-slate-200 rounded-2xl sm:rounded-3xl overflow-x-auto bg-white shadow-xs w-full">
                  <table className="w-full min-w-[580px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-550 border-b border-slate-200">
                        <th className="p-4 font-bold">Name</th>
                        <th className="p-4 font-bold">Email</th>
                        <th className="p-4 font-bold">Providers</th>
                        <th className="p-4 font-bold">Role</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 text-right font-bold">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList
                        .filter(u => u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchUserQuery.toLowerCase()))
                        .map(user => (
                          <tr key={user.id} className="hover:bg-slate-50 text-slate-700">
                            <td className="p-4 font-extrabold text-slate-800">{user.name}</td>
                            <td className="p-4 text-slate-500">{user.email}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                {user.providerData && user.providerData.length > 0 ? (
                                  user.providerData.map((provider, index) => (
                                    <div key={index} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center" title={provider.providerId}>
                                      {provider.providerId === 'google.com' && (
                                        <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                        </svg>
                                      )}
                                      {provider.providerId === 'facebook.com' && (
                                        <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                                          <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                      )}
                                      {provider.providerId === 'twitter.com' && (
                                        <svg viewBox="0 0 24 24" width="14" height="14" className="text-slate-700 fill-current" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                      )}
                                      {provider.providerId === 'password' && (
                                        <Lock size={12} className="text-slate-500" />
                                      )}
                                      {provider.providerId === 'phone' && (
                                        <span className="text-slate-500 font-bold text-[10px]">📱</span>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-slate-400 text-[10px] italic">No providers</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-slate-550">{user.role}</td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                user.status === "ACTIVE" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {user.status === "ACTIVE" ? (
                                <button
                                  onClick={() => handleChangeUserStatus(user.id, user.name, "BLOCKED")}
                                  className="px-2.5 py-1 text-[11px] font-bold rounded border border-red-200 text-red-655 bg-red-50 hover:bg-red-100 cursor-pointer"
                                >
                                  Block
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleChangeUserStatus(user.id, user.name, "ACTIVE")}
                                  className="px-2.5 py-1 text-[11px] font-bold rounded border border-emerald-200 text-emerald-655 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                                >
                                  Unblock
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

            {/* 5. BOOKINGS MANAGEMENT */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="Search bookings code..."
                    value={searchBookingQuery}
                    onChange={(e) => setSearchBookingQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl outline-none focus:border-blue-600"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                <div className="border border-slate-200 rounded-2xl sm:rounded-3xl overflow-x-auto bg-white shadow-xs w-full">
                  <table className="w-full min-w-[580px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-550 border-b border-slate-200">
                        <th className="p-4 font-bold">Code</th>
                        <th className="p-4 font-bold">Stay</th>
                        <th className="p-4 font-bold">Check-in / Out</th>
                        <th className="p-4 font-bold">Amount</th>
                        <th className="p-4 font-bold">Booking Status</th>
                        <th className="p-4 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookingsList
                        .filter(b => b.bookingCode?.toLowerCase().includes(searchBookingQuery.toLowerCase()))
                        .map(b => (
                          <tr key={b.id} className="hover:bg-slate-50 text-slate-700">
                            <td className="p-4 font-extrabold text-slate-850">{b.bookingCode}</td>
                            <td className="p-4 text-slate-500">{b.resortName}</td>
                            <td className="p-4 text-slate-500">{b.checkin} to {b.checkout}</td>
                            <td className="p-4 text-slate-800 font-bold">₹{(b.totalAmount || b.amount || 0).toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                b.status === "Confirmed" || b.status === "CONFIRMED"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : b.status === "Cancelled" || b.status === "CANCELLED"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {b.status !== "Cancelled" && b.status !== "CANCELLED" && (
                                <button
                                  onClick={() => handleChangeBookingStatus(b.id, b.bookingCode, "CANCELLED")}
                                  className="px-2.5 py-1 text-[11px] font-bold rounded border border-red-250 text-red-655 bg-red-50 hover:bg-red-100 cursor-pointer"
                                >
                                  Cancel Booking
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

            {/* 6. PAYMENTS & REVENUE */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Revenue Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Total platform Volume</span>
                      <span className="text-xl sm:text-2xl font-black text-blue-600 block mt-2">₹{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Est. Platform Fee (5%)</span>
                      <span className="text-xl sm:text-2xl font-black text-blue-600 block mt-2">₹{Math.floor(stats.totalRevenue * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Settled Escrow Funds</span>
                      <span className="text-xl sm:text-2xl font-black text-blue-600 block mt-2">₹{Math.floor(stats.totalRevenue * 0.95).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl sm:rounded-3xl overflow-x-auto bg-white shadow-xs w-full">
                  <table className="w-full min-w-[480px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-550 border-b border-slate-200">
                        <th className="p-4 font-bold">Resort Name</th>
                        <th className="p-4 font-bold">Volume generated</th>
                        <th className="p-4 font-bold">Paid Out</th>
                        <th className="p-4 font-bold">Platform Fee share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {resortsList.map(resort => {
                        const totalResortVol = bookingsList
                          .filter(b => b.resortName === resort.name && (b.status === "Confirmed" || b.status === "Completed"))
                          .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);
                        return (
                          <tr key={resort.id} className="hover:bg-slate-50">
                            <td className="p-4 font-extrabold text-slate-800">{resort.name}</td>
                            <td className="p-4 font-medium">₹{totalResortVol.toLocaleString()}</td>
                            <td className="p-4 font-medium">₹{Math.floor(totalResortVol * 0.95).toLocaleString()}</td>
                            <td className="p-4 font-bold text-blue-600">₹{Math.floor(totalResortVol * 0.05).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. COUPONS & REWARDS */}
            {activeTab === "coupons" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Form to create coupon */}
                <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 self-start shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Create Platform Coupon</h3>
                  <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Coupon Code</label>
                      <input
                        type="text"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="E.g. MONSOON30"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 rounded-xl outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Type</label>
                        <select
                          value={newCoupon.discountType}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 rounded-xl outline-none"
                        >
                          <option value="PERCENTAGE">Percentage</option>
                          <option value="FIXED">Fixed Amount</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Value</label>
                        <input
                          type="number"
                          value={newCoupon.discountValue}
                          onChange={(e) => setNewCoupon(prev => ({ ...prev, discountValue: e.target.value }))}
                          placeholder="e.g. 10 or 500"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 rounded-xl outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Min Booking Value (₹)</label>
                      <input
                        type="number"
                        value={newCoupon.minimumAmount}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, minimumAmount: e.target.value }))}
                        placeholder="0"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 rounded-xl outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Expiry Date</label>
                      <input
                        type="date"
                        value={newCoupon.expiryDate}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-250 text-slate-500 rounded-xl outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl cursor-pointer border-none shadow transition-all"
                    >
                      Publish Promo Coupon
                    </button>
                  </form>
                </div>

                {/* Coupons list */}
                <div className="lg:col-span-2 border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Coupons Ledger</h3>
                  
                  {couponsList.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      Create your first platform promo code using the panel form.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {couponsList.map((coupon, idx) => (
                        <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-extrabold text-blue-600 tracking-wider text-sm">{coupon.code}</span>
                            <span className="block text-slate-450 mt-1 font-semibold">
                              {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} discount`} • Min: ₹{coupon.minimumAmount}
                            </span>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                if (!coupon.id) throw new Error("Coupon ID is missing.");
                                await apiClient.delete(`/api/v1/admin/coupons/${encodeURIComponent(coupon.id)}`);
                                setCouponsList(prev => prev.filter(c => String(c.id) !== String(coupon.id)));
                                toast("Coupon deleted", "info");
                              } catch (err) {
                                toast("Failed to delete coupon: " + err.message, "error");
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded border border-transparent text-slate-400 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 8. REVIEW MODERATION */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {reviewsList.map(review => (
                    <div key={review.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 text-xs shadow-xs text-slate-700">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-850">{review.author}</span>
                          <span className="text-slate-400 font-semibold">• Stay: {review.stay}</span>
                          <div className="flex text-amber-500">
                            {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 italic font-medium">"{review.text}"</p>
                      </div>
                      <button
                        onClick={() => {
                          setReviewsList(prev => prev.filter(r => r.id !== review.id));
                          toast("Review removed from stay listing", "success");
                        }}
                        className="w-full sm:w-auto px-3 py-1.5 bg-red-50 text-red-655 hover:bg-red-100 border border-red-200 rounded font-bold text-center"
                      >
                        Remove Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. REPORTS & COMPLAINTS */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {reportsList.map(ticket => (
                    <div key={ticket.id} className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 text-xs shadow-xs">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-850">Ticket #{ticket.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                            ticket.status === "New" ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-sky-50 text-sky-600"
                          }`}>{ticket.status}</span>
                        </div>
                        <p className="text-slate-500 mt-2">Stay: <span className="text-slate-800 font-bold">{ticket.stay}</span> • Filed by: {ticket.reporter}</p>
                        <p className="text-slate-650 mt-1 italic">Reason: "{ticket.issue}"</p>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                        {ticket.status !== "Resolved" && (
                          <button
                            onClick={() => {
                              setReportsList(prev => prev.map(t => t.id === ticket.id ? { ...t, status: "Resolved" } : t));
                              toast("Complaint ticket resolved successfully", "success");
                              addAuditLog("DISPUTE_RESOLVED", `Ticket #${ticket.id} marked Resolved`);
                            }}
                            className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold rounded-lg cursor-pointer animate-fade-in text-center"
                          >
                            Resolve Ticket
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setReportsList(prev => prev.filter(t => t.id !== ticket.id));
                            toast("Complaint dismissed", "info");
                          }}
                          className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-pointer font-bold text-center"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. SYSTEM NOTIFICATIONS BROADCAST */}
            {activeTab === "notifications" && (
              <div className="max-w-xl bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-xs text-xs">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Broadcast In-App Alerts</h3>
                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">Target Audience</label>
                    <select
                      value={notification.target}
                      onChange={(e) => setNotification(prev => ({ ...prev, target: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl outline-none"
                    >
                      <option value="all_users">All Logged-in Users</option>
                      <option value="all_owners">All Resort Partners</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">Alert Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Summer luxury promotion deals are live!"
                      value={notification.title}
                      onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl outline-none focus:border-blue-600 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">Alert Body Message</label>
                    <textarea
                      placeholder="Type details of announcement..."
                      rows={4}
                      value={notification.message}
                      onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl outline-none focus:border-blue-600 font-medium resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl border-none shadow cursor-pointer transition-all"
                  >
                    Broadcast Announcement
                  </button>
                </form>
              </div>
            )}

            {/* 11. AUDIT LOGS */}
            {activeTab === "audit_logs" && (
              <div className="space-y-6">
                <div className="border border-slate-200 rounded-2xl sm:rounded-3xl overflow-x-auto bg-white shadow-xs w-full">
                  <table className="w-full min-w-[520px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-550 border-b border-slate-200">
                        <th className="p-4 font-bold">Timestamp</th>
                        <th className="p-4 font-bold">Admin Email</th>
                        <th className="p-4 font-bold">Action</th>
                        <th className="p-4 font-bold">Target Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-500">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-4 text-slate-450">{log.time}</td>
                          <td className="p-4 text-slate-700 font-bold">{log.admin}</td>
                          <td className="p-4 text-blue-600 font-bold">{log.action}</td>
                          <td className="p-4 text-slate-855 font-medium">{log.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* CHANGES REQUEST COMMENT DIALOG MODAL */}
      {showChangesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-slate-800 font-serif">Request Application Changes</h4>
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Feedback Comment</label>
              <textarea
                placeholder="e.g. Please upload clearer property photos and double check tax ID."
                rows={4}
                value={changesComment}
                onChange={(e) => setChangesComment(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl outline-none focus:border-blue-600 text-xs font-semibold resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowChangesModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-550 bg-white hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitChangesRequest}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer border-none shadow transition-all"
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
