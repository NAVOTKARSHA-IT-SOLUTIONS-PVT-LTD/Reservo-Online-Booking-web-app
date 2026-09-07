import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Bed, Calendar, Users, DollarSign, Activity, 
  MessageSquare, BarChart3, Check, X, ShieldCheck, 
  ChevronRight, Clock, Star, Lock, Send, Download, 
  TrendingUp, Award, CheckCircle2, Plus, Info, MapPin, FileText, Sparkles, Settings,
  Mail, MailCheck, Bell, Key, Copy, ExternalLink, CheckCheck, Eye, Smartphone, Trash2,
  Edit, Save, Upload, Image as ImageIcon, Loader2, Camera, Video, Globe, Waves, Wifi, Coffee, Compass, Mountain, Wind, HeartHandshake, Zap, Tv
} from "lucide-react";
import { hostService } from "../services/host.service";
import { resortService } from "../services/resort.service";
import { authService } from "../services/auth.service";
import { useToast } from "../context/ToastContext";
import { apiClient } from "../services/apiClient";

const splitUrls = (urlStr) => {
  if (!urlStr) return [];
  if (urlStr.includes("|")) {
    return urlStr.split("|").filter(Boolean);
  }
  if (urlStr.includes("data:") && urlStr.includes(",")) {
    const rawParts = urlStr.split(",");
    const cleaned = [];
    for (let i = 0; i < rawParts.length; i++) {
      if (rawParts[i].startsWith("data:") || rawParts[i].startsWith("http")) {
        if (rawParts[i].startsWith("data:") && i + 1 < rawParts.length) {
          cleaned.push(rawParts[i] + "," + rawParts[i+1]);
          i++;
        } else {
          cleaned.push(rawParts[i]);
        }
      } else {
        cleaned.push(rawParts[i]);
      }
    }
    return cleaned.filter(Boolean);
  }
  return urlStr.split(",").filter(Boolean);
};


const PROPERTY_CATEGORIES = [
  { id: "Villa", name: "Luxury Villa", icon: "🏰", desc: "Standalone estate with private grounds and premium amenities" },
  { id: "Chalet", name: "Alpine Chalet", icon: "🏔️", desc: "Cozy timber or stone lodge in mountainous retreats" },
  { id: "Heritage Haven", name: "Heritage Haveli", icon: "🕌", desc: "Historic palatial residence or royal courtyard home" },
  { id: "Beachfront", name: "Oceanfront Haven", icon: "🏖️", desc: "Direct beachfront access with panoramic coastal views" },
  { id: "Boutique Resort", name: "Boutique Resort", icon: "🌴", desc: "Curated resort suites with bespoke hospitality services" },
  { id: "Treehouse", name: "Eco Canopy Treehouse", icon: "🌿", desc: "Elevated nature immersion with architectural elegance" }
];

const AMENITY_OPTIONS = [
  { id: "pool", label: "Private Infinity Pool", icon: Waves },
  { id: "wifi", label: "High-Speed WiFi (300Mbps+)", icon: Wifi },
  { id: "chef", label: "Private Chef on Demand", icon: Coffee },
  { id: "ocean_view", label: "Panoramic Ocean / Lake View", icon: Compass },
  { id: "mountain_view", label: "Snow Peak / Mountain View", icon: Mountain },
  { id: "jacuzzi", label: "Private Jacuzzi / Hot Tub", icon: Waves },
  { id: "fireplace", label: "Stone Fireplace & Fire Pit", icon: Sparkles },
  { id: "workspace", label: "Dedicated Executive Workspace", icon: Tv },
  { id: "ev_charger", label: "EV Vehicle Charging Station", icon: Zap },
  { id: "air_con", label: "Central Climate Control", icon: Wind },
  { id: "butler", label: "24/7 Dedicated Butler Service", icon: Award },
  { id: "pet_friendly", label: "Pet Friendly Grounds", icon: HeartHandshake }
];

const DEFAULT_ROOM_TYPES = [
  { name: "Small Room", pricePerNight: 5000, count: 1, capacity: 2 },
  { name: "Master Room", pricePerNight: 8000, count: 0, capacity: 4 },
  { name: "Luxury Room", pricePerNight: 12000, count: 0, capacity: 4 },
  { name: "AC Room", pricePerNight: 6000, count: 0, capacity: 2 }
];

export default function HostAdminPortal() {
  const toast = useToast();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const role = authService.getUserRole();
    if (role !== "ROLE_OWNER" && role !== "ROLE_ADMIN") {
      toast("Only approved property owners can access the Host Administration Dashboard.", "info");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, toast]);

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
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  // Property editing / re-approval state
  const [editingProperty, setEditingProperty] = useState(null);
  const [savingProperty, setSavingProperty] = useState(false);
  const [uploadingPropertyImages, setUploadingPropertyImages] = useState(false);
  const [propertyEditRooms, setPropertyEditRooms] = useState([]);
  const [newPropertyRoom, setNewPropertyRoom] = useState(null);
  const [propertyEditForm, setPropertyEditForm] = useState({
    name: "",
    category: "Villa",
    listingMode: "VILLA",
    location: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    landmark: "",
    description: "",
    pricePerNight: "",
    guests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    sqft: "",
    featuredTag: "",
    discountPercentage: "",
    galleryUrls: [],
    imageUrl: "",
    videoUrls: [],
    amenities: [],
    roomTypes: DEFAULT_ROOM_TYPES.map(r => ({ ...r })),
    minNights: 2,
    cancellationPolicy: "Flexible",
    instantBook: true
  });

  // States for new Host Panel Tabs
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [roomsList, setRoomsList] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [realReviews, setRealReviews] = useState([]);
  const [ownerRooms, setOwnerRooms] = useState([]);
  const [financialRefresh, setFinancialRefresh] = useState(0);
  const [selectedRoomForCalendar, setSelectedRoomForCalendar] = useState("");
  const [calendarViewMode, setCalendarViewMode] = useState("overview");
  const [roomCalendarBlocks, setRoomCalendarBlocks] = useState([]);
  const [roomBlocksById, setRoomBlocksById] = useState({});
  const [loadingRoomCalendar, setLoadingRoomCalendar] = useState(false);
  const [selectedPropertySubTab, setSelectedPropertySubTab] = useState("details"); // 'details', 'photos', 'amenities', 'settings'
  const [editingRooms, setEditingRooms] = useState(false);
  const [roomDrafts, setRoomDrafts] = useState([]);
  const [offersList, setOffersList] = useState([
    { code: "SUMMER20", discountType: "PERCENTAGE", discountValue: 20, minAmount: 5000, usageLimit: 100, status: "ACTIVE" },
    { code: "WELCOME10", discountType: "PERCENTAGE", discountValue: 10, minAmount: 2000, usageLimit: 500, status: "ACTIVE" }
  ]);
  const [selectedOfferPropertyId, setSelectedOfferPropertyId] = useState("all");
  const [selectedBookingPropertyId, setSelectedBookingPropertyId] = useState("all");
  const [selectedReviewPropertyId, setSelectedReviewPropertyId] = useState("all");
  const [selectedPostPropertyId, setSelectedPostPropertyId] = useState("");
  const [newOffer, setNewOffer] = useState({ code: "", discountType: "PERCENTAGE", discountValue: 10, minAmount: 1000, usageLimit: 100 });
  
  const [postsList, setPostsList] = useState(() => {
    try {
      const saved = localStorage.getItem("reservo_resort_posts");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, resortId: "home-1", resortName: "Goa Coastline Villa", title: "🌊 Monsoon Special Offer!", content: "Stay 2 nights and get breakfast absolutely free! Valid till end of August.", date: "2026-08-20" },
      { id: 2, resortId: "home-2", resortName: "Kerala Backwaters Resort", title: "🧘 Aura Spa Renovation Complete", content: "We are thrilled to launch our new outdoor ayurvedic massage pavilion overlooking the lake.", date: "2026-08-15" }
    ];
  });
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const fetchRooms = async (resortId) => {
    if (!resortId) return;
    setLoadingRooms(true);
    try {
      const res = await apiClient.get(`/api/v1/rooms/resort/${resortId}`);
      if (res && res.success) {
        const rooms = res.data || [];
        setRoomsList(rooms);
        setSelectedRoomForCalendar(prev => rooms.some(r => String(r.id) === String(prev)) ? prev : (rooms[0]?.id || ""));
      }
    } catch (e) {
      console.error("Failed to fetch rooms:", e);
    } finally {
      setLoadingRooms(false);
    }
  };

  const openRoomEditor = () => {
    setRoomDrafts((roomsList || []).map(room => ({
      id: room.id,
      roomNumber: room.roomNumber || "",
      roomType: room.roomType || room.type || "Room",
      pricePerNight: Number(room.pricePerNight || 0),
      capacity: Number(room.capacity || 2)
    })));
    setEditingRooms(true);
  };

  const handleRoomDraftChange = (roomId, field, value) => {
    setRoomDrafts(prev => prev.map(room =>
      String(room.id) === String(roomId) ? { ...room, [field]: value } : room
    ));
  };

  const handleSaveRoomEdits = async () => {
    if (!selectedPropertyId || !roomDrafts.length) return;
    const invalid = roomDrafts.find(room =>
      !String(room.roomNumber || "").trim() ||
      !String(room.roomType || "").trim() ||
      Number(room.pricePerNight) <= 0 ||
      Number(room.capacity) <= 0
    );
    if (invalid) {
      toast("Every room needs a room number, room type, valid price and guest capacity.", "error");
      return;
    }

    try {
      for (const room of roomDrafts) {
        const res = await apiClient.put(`/api/v1/rooms/${room.id}`, {
          roomNumber: String(room.roomNumber).trim(),
          roomType: String(room.roomType).trim(),
          pricePerNight: Number(room.pricePerNight),
          capacity: Number(room.capacity)
        });
        if (!res?.success) throw new Error(res?.message || `Could not update room #${room.roomNumber}`);
      }

      // Room inventory changes are part of the property listing. Re-submit the
      // property through the normal owner-edit endpoint so the listing becomes
      // PENDING_APPROVAL and cannot silently change while published.
      const property = myProperties.find(p => String(p.id) === String(selectedPropertyId));
      if (property) {
        await resortService.updateResort(selectedPropertyId, {
          name: property.name || "",
          location: property.location || "",
          description: property.description || "",
          imageUrl: property.imageUrl || null,
          galleryUrls: property.galleryUrls || "",
          videoUrls: property.videoUrls || null,
          highlights: Array.isArray(property.highlights) ? property.highlights.join(",") : (property.highlights || null),
          amenities: Array.isArray(property.amenities) ? property.amenities.map(a => typeof a === "string" ? a : a?.name).filter(Boolean).join(",") : (property.amenities || null),
          pricePerNight: property.pricePerNight == null ? null : Number(property.pricePerNight),
          category: property.category || null,
          guests: property.guests == null ? null : Number(property.guests),
          bedrooms: property.bedrooms == null ? null : Number(property.bedrooms),
          beds: property.beds == null ? null : Number(property.beds),
          bathrooms: property.bathrooms == null ? null : Number(property.bathrooms),
          featuredTag: property.featuredTag || null,
          discountPercentage: property.discountPercentage == null ? null : Number(property.discountPercentage),
          listingMode: property.listingMode || "ROOMS"
        });
      }

      setEditingRooms(false);
      toast("Room details updated. Property sent for Admin approval again.", "success");
      await fetchRooms(selectedPropertyId);
      await fetchMyProperties();
    } catch (err) {
      toast(err.message || "Could not update rooms", "error");
    }
  };

  const handleUpdateRoomAvailability = async (room) => {
    const nextStatus = room.status === "AVAILABLE" ? "BLOCKED" : "AVAILABLE";
    try {
      const res = await apiClient.patch(`/api/v1/rooms/${room.id}/status`, {
        status: nextStatus
      });
      if (res?.success) {
        toast(nextStatus === "AVAILABLE" ? "Room marked Available." : "Room marked Not Available.", "success");
        await fetchRooms(selectedPropertyId);
      } else {
        throw new Error(res?.message || "Could not update room status");
      }
    } catch (err) {
      toast(err.message || "Could not update room status", "error");
    }
  };

  const handleGlobalPropertyChange = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setSelectedListingForCalendar(propertyId);
    // Bookings tab intentionally remains on All Properties by default.
    // Property-specific filtering is only changed by the booking tab selector.
    setSelectedOfferPropertyId(propertyId);
    setSelectedReviewPropertyId(propertyId);
    setSelectedPostPropertyId(propertyId);
    fetchRooms(propertyId);
  };

  const fetchMyProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await apiClient.get("/api/v1/resorts/my-properties");
      if (res && res.success) {
        const props = res.data || [];
        setMyProperties(props);
        if (props.length > 0 && !selectedPropertyId) {
          handleGlobalPropertyChange(props[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load owner properties:", e);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleThumbnailClick = (propertyId, imageUrl) => {
    setMyProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, activePhoto: imageUrl };
      }
      return p;
    }));
  };

  const openPropertyEditor = async (property) => {
    const gallery = splitUrls(property.galleryUrls || property.imageUrl);
    const amenities = Array.isArray(property.amenities)
      ? property.amenities.map(a => typeof a === "string" ? a.trim() : a?.name).filter(Boolean)
      : String(property.amenities || "").split(",").map(a => a.trim()).filter(Boolean);
    const videoUrls = splitUrls(property.videoUrls || "");

    let rooms = [];
    if (String(property.listingMode || "").toUpperCase() === "ROOMS") {
      try {
        const roomResponse = await apiClient.get(`/api/v1/rooms/resort/${property.id}`);
        rooms = Array.isArray(roomResponse?.data) ? roomResponse.data : [];
      } catch (_) {
        rooms = [];
      }
    }

    const grouped = {};
    rooms.forEach(room => {
      const type = String(room.roomType || room.type || "Room").trim() || "Room";
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(room);
    });

    const roomTypes = rooms.length
      ? Object.entries(grouped).map(([name, list]) => ({
          name,
          pricePerNight: Number(list[0]?.pricePerNight || 0),
          capacity: Number(list[0]?.capacity || 2),
          count: list.length
        }))
      : DEFAULT_ROOM_TYPES.map(r => ({ ...r }));

    const locationParts = String(property.location || "").split(",").map(s => s.trim());

    setEditingProperty(property);
    setPropertyEditRooms(rooms);
    setPropertyEditForm({
      name: property.name || "",
      category: property.category || "Villa",
      listingMode: String(property.listingMode || "VILLA").toUpperCase(),
      location: property.location || "",
      address: property.address || "",
      city: property.city || locationParts[0] || "",
      state: property.state || locationParts[1] || "",
      country: property.country || locationParts[2] || "India",
      pinCode: property.pinCode || "",
      landmark: property.landmark || "",
      description: property.description || "",
      pricePerNight: property.pricePerNight ?? "",
      guests: property.guests ?? "",
      bedrooms: property.bedrooms ?? "",
      beds: property.beds ?? "",
      bathrooms: property.bathrooms ?? "",
      sqft: property.sqft ?? "",
      featuredTag: property.featuredTag || "",
      discountPercentage: property.discountPercentage ?? "",
      galleryUrls: gallery,
      imageUrl: property.imageUrl || gallery[0] || "",
      videoUrls,
      amenities,
      roomTypes,
      minNights: property.minNights ?? 2,
      cancellationPolicy: property.cancellationPolicy || "Flexible",
      instantBook: property.instantBook !== false
    });
    setNewPropertyRoom(null);
  };

  const closePropertyEditor = () => {
    if (!savingProperty && !uploadingPropertyImages) {
      setEditingProperty(null);
    }
  };

  const handlePropertyEditField = (field, value) => {
    setPropertyEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePropertyImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadingPropertyImages(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image`);
        }
        uploadedUrls.push(await resortService.uploadMedia(file));
      }

      setPropertyEditForm(prev => ({
        ...prev,
        galleryUrls: [...prev.galleryUrls, ...uploadedUrls],
        imageUrl: prev.imageUrl || uploadedUrls[0] || ""
      }));

      toast(`${uploadedUrls.length} photo${uploadedUrls.length > 1 ? "s" : ""} uploaded`, "success");
    } catch (err) {
      toast("Photo upload failed: " + err.message, "error");
    } finally {
      setUploadingPropertyImages(false);
      event.target.value = "";
    }
  };

  const handlePropertyVideoUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if ((propertyEditForm.videoUrls || []).length + files.length > 2) {
      toast("Maximum 2 videos allowed.", "warning");
      return;
    }

    setUploadingPropertyImages(true);
    try {
      const uploadedUrls = [];
      for (const file of files.slice(0, 2 - (propertyEditForm.videoUrls || []).length)) {
        if (!file.type.startsWith("video/")) {
          throw new Error(`${file.name} is not a video`);
        }
        uploadedUrls.push(await resortService.uploadMedia(file));
      }
      setPropertyEditForm(prev => ({
        ...prev,
        videoUrls: [...(prev.videoUrls || []), ...uploadedUrls]
      }));
      toast(`${uploadedUrls.length} video${uploadedUrls.length > 1 ? "s" : ""} uploaded`, "success");
    } catch (err) {
      toast("Video upload failed: " + err.message, "error");
    } finally {
      setUploadingPropertyImages(false);
      event.target.value = "";
    }
  };

  const removePropertyImage = (url) => {
    setPropertyEditForm(prev => {
      const gallery = prev.galleryUrls.filter(item => item !== url);
      return {
        ...prev,
        galleryUrls: gallery,
        imageUrl: prev.imageUrl === url ? (gallery[0] || "") : prev.imageUrl
      };
    });
  };

  const handleSavePropertyEdit = async (event) => {
    event.preventDefault();
    if (!editingProperty?.id) return;

    if (!String(propertyEditForm.name || "").trim()) {
      toast("Property title is required", "error");
      return;
    }
    if (!String(propertyEditForm.city || "").trim()) {
      toast("City / Destination is required", "error");
      return;
    }

    if (propertyEditForm.listingMode === "VILLA" && Number(propertyEditForm.pricePerNight || 0) <= 0) {
      toast("Please enter a valid whole-villa price per night.", "error");
      return;
    }

    const roomTypes = (propertyEditForm.roomTypes || [])
      .map(r => ({
        name: String(r.name || "").trim(),
        pricePerNight: Number(r.pricePerNight || 0),
        capacity: Math.max(1, Number(r.capacity || 2)),
        count: Math.max(0, Number(r.count || 0))
      }))
      .filter(r => r.name);

    if (propertyEditForm.listingMode === "ROOMS") {
      if (!roomTypes.some(r => r.count > 0)) {
        toast("Please add at least one physical room.", "error");
        return;
      }
      if (roomTypes.some(r => r.count > 0 && r.pricePerNight <= 0)) {
        toast("Every listed room type must have a valid price.", "error");
        return;
      }
    }

    setSavingProperty(true);
    try {
      const locationText = [propertyEditForm.city, propertyEditForm.state, propertyEditForm.country]
        .map(v => String(v || "").trim()).filter(Boolean).join(", ");

      const payload = {
        name: String(propertyEditForm.name).trim(),
        location: locationText || String(propertyEditForm.location || "").trim(),
        address: String(propertyEditForm.address || "").trim() || null,
        city: String(propertyEditForm.city || "").trim() || null,
        state: String(propertyEditForm.state || "").trim() || null,
        country: String(propertyEditForm.country || "").trim() || null,
        pinCode: String(propertyEditForm.pinCode || "").trim() || null,
        landmark: String(propertyEditForm.landmark || "").trim() || null,
        description: String(propertyEditForm.description || "").trim(),
        imageUrl: propertyEditForm.imageUrl || null,
        galleryUrls: (propertyEditForm.galleryUrls || []).join("|"),
        videoUrls: (propertyEditForm.videoUrls || []).join("|") || null,
        amenities: (propertyEditForm.amenities || []).join(",") || null,
        pricePerNight: propertyEditForm.listingMode === "VILLA"
          ? Number(propertyEditForm.pricePerNight || 0)
          : (roomTypes.find(r => r.count > 0)?.pricePerNight || Number(propertyEditForm.pricePerNight || 0)),
        category: propertyEditForm.category || null,
        guests: propertyEditForm.guests === "" ? null : Number(propertyEditForm.guests),
        bedrooms: propertyEditForm.bedrooms === "" ? null : Number(propertyEditForm.bedrooms),
        beds: propertyEditForm.beds === "" ? null : Number(propertyEditForm.beds),
        bathrooms: propertyEditForm.bathrooms === "" ? null : Number(propertyEditForm.bathrooms),
        sqft: propertyEditForm.sqft === "" ? null : Number(propertyEditForm.sqft),
        featuredTag: String(propertyEditForm.featuredTag || "").trim() || null,
        discountPercentage: propertyEditForm.discountPercentage === "" ? null : Number(propertyEditForm.discountPercentage),
        listingMode: propertyEditForm.listingMode,
        instantBook: Boolean(propertyEditForm.instantBook),
        minNights: Number(propertyEditForm.minNights || 1),
        cancellationPolicy: propertyEditForm.cancellationPolicy || "Flexible"
      };

      const updated = await resortService.updateResort(editingProperty.id, payload);

      // Keep room inventory changes inside Edit Property. The resort has already
      // moved to PENDING_APPROVAL through updateResort, so inventory changes need
      // Admin approval before becoming public.
      if (propertyEditForm.listingMode === "ROOMS") {
        const existing = [...(propertyEditRooms || [])];
        const usedIds = new Set();

        for (const type of roomTypes.filter(r => r.count > 0)) {
          const sameType = existing.filter(r => String(r.roomType || r.type || "").trim() === type.name);
          const keep = sameType.slice(0, type.count);

          for (const room of keep) {
            usedIds.add(String(room.id));
            await apiClient.put(`/api/v1/rooms/${room.id}`, {
              roomNumber: String(room.roomNumber || ""),
              roomType: type.name,
              pricePerNight: type.pricePerNight,
              capacity: type.capacity,
              status: room.status || "AVAILABLE"
            });
          }

          for (let i = keep.length; i < type.count; i++) {
            const maxNumber = existing.reduce((max, room) => {
              const n = parseInt(String(room.roomNumber || "").replace(/\D/g, ""), 10);
              return Number.isFinite(n) ? Math.max(max, n) : max;
            }, 100);
            const roomNumber = String(maxNumber + (i - (keep.length - 1 || 0)));
            const created = await apiClient.post(`/api/v1/rooms/resort/${editingProperty.id}`, {
              roomNumber,
              roomType: type.name,
              pricePerNight: type.pricePerNight,
              capacity: type.capacity,
              status: "AVAILABLE"
            });
            if (!created?.success) throw new Error(created?.message || "Could not add room.");
          }
        }

        // Remove surplus rooms only when they are not part of the requested inventory.
        // Backend protects booked rooms from deletion.
        for (const room of existing) {
          if (!usedIds.has(String(room.id))) {
            const matchingType = roomTypes.find(r => r.name === String(room.roomType || room.type || "").trim());
            const targetCount = matchingType?.count || 0;
            const keptForType = existing.filter(r => String(r.roomType || r.type || "").trim() === (matchingType?.name || "__none__"))
              .filter(r => usedIds.has(String(r.id))).length;
            if (!matchingType || keptForType >= targetCount) {
              try {
                await apiClient.delete(`/api/v1/rooms/${room.id}`);
              } catch (deleteErr) {
                // A booked room cannot be deleted; keep it and surface a clear message.
                throw new Error(deleteErr?.message || `Room ${room.roomNumber || ""} cannot be removed.`);
              }
            }
          }
        }
      }

      setMyProperties(prev => prev.map(p =>
        String(p.id) === String(editingProperty.id)
          ? { ...updated, activePhoto: propertyEditForm.imageUrl || p.activePhoto }
          : p
      ));

      setEditingProperty(null);
      setNewPropertyRoom(null);
      toast("Property changes submitted for Admin approval.", "success");
      await fetchMyProperties();
    } catch (err) {
      toast("Failed to update property: " + (err?.message || "Unknown error"), "error");
    } finally {
      setSavingProperty(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyProperties();
    }
  }, [currentUser]);

  // Dashboard financials, ratings and room availability are derived from the
  // authenticated owner's backend data. No demo financial figures are used.
  useEffect(() => {
    let cancelled = false;
    const loadRealHostMetrics = async () => {
      if (!myProperties.length) {
        if (!cancelled) setRealReviews([]);
        return;
      }
      try {
        const roomResults = await Promise.all(myProperties.map(async (property) => {
          try {
            const result = await apiClient.get(`/api/v1/rooms/resort/${property.id}`);
            return (Array.isArray(result?.data) ? result.data : []).map(room => ({ ...room, resortId: property.id }));
          } catch (_) { return []; }
        }));
        if (!cancelled) setOwnerRooms(roomResults.flat());

        const reviewResults = await Promise.all(myProperties.map(async (property) => {
          try {
            const result = await apiClient.get(`/api/v1/reviews/resort/${property.id}`);
            return (Array.isArray(result?.data) ? result.data : []).map(review => ({
              ...review,
              id: review.id,
              resortId: property.id,
              resortName: property.name,
              author: review.author || review.user?.name || "Guest",
              guestName: review.author || review.user?.name || "Guest",
              guestCountry: "",
              propertyTitle: property.name,
              text: review.comment || "",
              content: review.comment || ""
            }));
          } catch (_) { return []; }
        }));
        if (!cancelled) setRealReviews(reviewResults.flat());
      } catch (_) {
        if (!cancelled) setRealReviews([]);
      }
    };
    loadRealHostMetrics();
    return () => { cancelled = true; };
  }, [myProperties, financialRefresh]);

  const formatName = (name) => {
    if (!name) return "Resort Owner";
    return name
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  };

  const hostName = formatName(currentUser?.name || hostData.profile?.name || currentUser?.email || hostData.profile?.email || "Resort Owner");
  const [activeTab, setActiveTab] = useState(() => {
    const userObj = authService.getCurrentUser();
    return userObj?.role === "ROLE_ADMIN" ? "host_applications" : "dashboard";
  });

  const [pendingHosts, setPendingHosts] = useState([]);
  const [loadingPendingHosts, setLoadingPendingHosts] = useState(false);

  useEffect(() => {
    if (currentUser?.role === "ROLE_ADMIN") {
      setLoadingPendingHosts(true);
      apiClient.get("/api/v1/user/pending-hosts")
        .then(res => {
          if (res && res.success) {
            setPendingHosts(res.data || []);
          }
        })
        .catch(err => console.error("Failed to load pending hosts", err))
        .finally(() => setLoadingPendingHosts(false));
    }
  }, [currentUser]);

  const handleApproveHost = async (userId) => {
    try {
      const res = await apiClient.post(`/api/v1/user/approve-host?userId=${userId}`);
      if (res && res.success) {
        // Silently approved — no popup
        setPendingHosts(prev => prev.filter(h => h.id !== userId));
      }
    } catch (e) {
      toast("Failed to approve host: " + e.message, "error");
    }
  };

  const handleRejectHost = async (userId) => {
    try {
      const res = await apiClient.post(`/api/v1/user/reject-host?userId=${userId}`);
      if (res && res.success) {
        toast("Host request rejected", "info");
        setPendingHosts(prev => prev.filter(h => h.id !== userId));
      }
    } catch (e) {
      toast("Failed to reject host: " + e.message, "error");
    }
  };

  // Load real Firestore bookings for the authenticated owner.
  // Host reservations must never come from the demo/localStorage reservation list.
  useEffect(() => {
    const loadOwnerBookings = async () => {
      if (!currentUser || (currentUser.role !== "ROLE_OWNER" && currentUser.role !== "ROLE_ADMIN")) {
        return;
      }

      try {
        const res = await apiClient.get("/api/v1/bookings/owner-bookings");
        if (!res?.success) {
          throw new Error(res?.message || "Could not load owner bookings");
        }

        const backendBookings = Array.isArray(res.data) ? res.data : [];

        const realReservations = backendBookings.map((booking) => {
          const checkIn = booking.checkInDate || "";
          const checkOut = booking.checkOutDate || "";
          const start = checkIn ? new Date(`${checkIn}T00:00:00`) : null;
          const end = checkOut ? new Date(`${checkOut}T00:00:00`) : null;
          const nights = start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
            ? Math.max(1, Math.round((end - start) / 86400000))
            : 1;

          const statusMap = {
            PENDING: "Pending Approval",
            CONFIRMED: "Upcoming",
            IN_HOUSE: "In-House",
            CANCELLED: "Cancelled",
            COMPLETED: "Completed"
          };

          return {
            id: booking.id,
            bookingId: booking.id,
            bookingCode: booking.bookingCode,
            resortId: booking.resortId,
            roomId: booking.roomId,
            assignedRoomIds: Array.isArray(booking.assignedRoomIds) ? booking.assignedRoomIds : (booking.roomId ? [booking.roomId] : []),
            listingTitle: booking.resortName || "Property",
            listingLocation: booking.resortLocation || "India",
            listingImage: booking.resortImage || "",
            status: statusMap[booking.status] || booking.status || "Pending Approval",
            paymentStatus: Number(booking.totalAmount || 0) === 0
              ? "Fully Comped / ₹0 Paid"
              : (booking.status === "CONFIRMED" ? "Payment Confirmed" : "Payment Pending"),
            totalPaid: Number(booking.totalAmount || 0),
            payoutAmount: Number(booking.totalAmount || 0),
            guest: {
              name: booking.guestName || booking.guestEmail || "Guest",
              email: booking.guestEmail || "",
              phone: booking.guestPhone || "",
              country: booking.guestCountry || "India",
              avatar: booking.guestAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
              verified: true
            },
            dates: {
              checkIn,
              checkOut,
              nights
            },
            guestsCount: {
              adults: Number(booking.adults || booking.guestsCount || 2),
              children: Number(booking.children || 0)
            },
            specialRequest: booking.specialRequest || "",
            roomType: booking.roomType || (Array.isArray(booking.roomTypes) ? booking.roomTypes.join(", ") : "Room"),
            roomNumber: booking.roomNumber || (Array.isArray(booking.roomNumbers) ? booking.roomNumbers.join(", ") : ""),
            accessCode: booking.accessCode || "",
            confirmationSent: booking.confirmationSent || {}
          };
        });

        setHostData((previous) => ({
          ...previous,
          reservations: realReservations
        }));
      } catch (error) {
        console.error("Failed to load owner bookings:", error);
        // Do not replace the real booking list with demo reservations.
        setHostData((previous) => ({
          ...previous,
          reservations: []
        }));
      }
    };

    loadOwnerBookings();

    // Refresh owner bookings when the host returns to the tab/window so a
    // cancelled customer booking immediately becomes available again.
    const refreshOnFocus = () => loadOwnerBookings();
    const refreshOnVisibility = () => {
      if (document.visibilityState === "visible") loadOwnerBookings();
    };
    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnVisibility);

    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadOwnerBookings();
    }, 15000);

    return () => {
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnVisibility);
      window.clearInterval(refreshTimer);
    };
  }, [currentUser]);

  // Filter States
  const [resStatusFilter, setResStatusFilter] = useState("all");
  useEffect(() => {
    if (activeTab === "bookings") {
      setSelectedBookingPropertyId(prev => prev || "all");
    }
  }, [activeTab]);
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
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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

  // Real dashboard metrics. Revenue is calculated only from backend bookings
  // belonging to this owner; cancelled bookings are excluded.
  const ownerReservations = hostData.reservations || [];
  const revenueBookings = ownerReservations.filter(r => r.status !== "Cancelled" && r.status !== "Pending Approval");
  const totalRevenue = revenueBookings.reduce((sum, r) => sum + Number(r.totalPaid ?? r.payoutAmount ?? 0), 0);
  const inHouseGuestsCount = ownerReservations.filter(r => r.status === "In-House").length;
  const hostRating = realReviews.length
    ? realReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / realReviews.length
    : 0;
  const hostReviewCount = realReviews.length;
  const pendingApprovalsCount = ownerReservations.filter(r => r.status === "Pending Approval").length;
  const upcomingReservations = ownerReservations.filter(r => r.status === "Upcoming");
  const todayIso = new Date().toISOString().slice(0, 10);
  const availableRoomsCount = ownerRooms.filter(room => {
        if (room.status !== "AVAILABLE") return false;
        const occupied = ownerReservations.some(r => {
          if (r.status === "Cancelled" || r.status === "Completed") return false;
          if (r.dates?.checkIn > todayIso || r.dates?.checkOut <= todayIso) return false;
          const ids = Array.isArray(r.assignedRoomIds) ? r.assignedRoomIds.map(String) : [String(r.roomId || "")];
          return ids.includes(String(room.id));
        });
        return !occupied;
      }).length


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

  const handleCancelBooking = async (resId) => {
    const reservation = hostData.reservations?.find(r => r.id === resId);
    if (!reservation || reservation.status === "Cancelled" || reservation.status === "Completed") {
      return;
    }

    const confirmed = window.confirm(
      `Cancel booking ${reservation.bookingCode || ""} for ${reservation.guest?.name || "this guest"}? This will immediately release the booked dates.`
    );
    if (!confirmed) return;

    try {
      await hostService.cancelBooking(resId);

      // Update the local host view immediately. The backend is the source of
      // truth; this only avoids waiting for the next polling/focus refresh.
      setHostData(previous => ({
        ...previous,
        reservations: (previous.reservations || []).map(item =>
          item.id === resId
            ? { ...item, status: "Cancelled", paymentStatus: "Refunded / Cancelled" }
            : item
        )
      }));

      toast("Booking cancelled successfully. The reserved dates are available again.", "success");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast(error.message || "Could not cancel booking.", "error");
    }
  };

  const handleStatusChange = async (resId, newStatus) => {
    try {
      const result = await apiClient.patch(`/api/v1/bookings/owner/${encodeURIComponent(resId)}/status`, { status: newStatus });
      if (!result?.success) throw new Error(result?.message || "Could not update booking status");
      const statusMap = { CONFIRMED: "Upcoming", IN_HOUSE: "In-House", COMPLETED: "Completed", CANCELLED: "Cancelled", PENDING: "Pending Approval" };
      setHostData(previous => ({
        ...previous,
        reservations: (previous.reservations || []).map(item => item.id === resId ? { ...item, status: statusMap[newStatus] || newStatus } : item)
      }));
      toast(newStatus === "IN_HOUSE" ? "Guest checked in. Booking is now active." : `Stay status updated to "${statusMap[newStatus] || newStatus}"`, "success");
      setFinancialRefresh(v => v + 1);
    } catch (error) {
      toast(error.message || "Could not update booking status", "error");
    }
  };

  const handleCheckIn = (resId) => handleStatusChange(resId, "IN_HOUSE");

  const isVillaListing = (myProperties.find(p => String(p.id) === String(selectedListingForCalendar))?.listingMode || "").toUpperCase() === "VILLA";

  const isReservationForRoom = (reservation, roomId) => {
    if (reservation.status === "Cancelled") return false;
    const ids = Array.isArray(reservation.assignedRoomIds) ? reservation.assignedRoomIds.map(String) : [];
    if (roomId && ids.length) return ids.includes(String(roomId));
    return roomId ? String(reservation.roomId || "") === String(roomId) : true;
  };

  const reservationOccupiesDate = (reservation, dateStr) => {
    const checkIn = reservation.dates?.checkIn || reservation.checkInDate;
    const checkOut = reservation.dates?.checkOut || reservation.checkOutDate;
    return checkIn && checkOut && dateStr >= checkIn && dateStr < checkOut;
  };

  const handleToggleBlock = async (dateStr) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(`${dateStr}T00:00:00`);
    if (clickedDate < today) return;

    try {
      if (isVillaListing || calendarViewMode === "overview" || !selectedRoomForCalendar) {
        const booked = (hostData.reservations || []).some(r => String(r.resortId) === String(selectedListingForCalendar) && reservationOccupiesDate(r, dateStr));
        if (booked) return;
        await hostService.toggleDateBlock(selectedListingForCalendar, dateStr);
      } else {
        const booked = (hostData.reservations || []).some(r => String(r.resortId) === String(selectedListingForCalendar) && isReservationForRoom(r, selectedRoomForCalendar) && reservationOccupiesDate(r, dateStr));
        if (booked) return;
        await hostService.toggleRoomDateBlock(selectedRoomForCalendar, dateStr);
        setRoomCalendarBlocks(prev => prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]);
        setRoomBlocksById(prev => ({ ...prev, [String(selectedRoomForCalendar)]: (prev[String(selectedRoomForCalendar)] || []).includes(dateStr) ? (prev[String(selectedRoomForCalendar)] || []).filter(d => d !== dateStr) : [...(prev[String(selectedRoomForCalendar)] || []), dateStr] }));
      }
      setHostData(hostService.getData());
      toast(`Availability updated for ${dateStr}`, "info");
    } catch (e) { toast(e.message || "Could not update availability.", "error"); }
  };

  const loadRoomCalendar = async (roomId = selectedRoomForCalendar) => {
    if (!roomId) { setRoomCalendarBlocks([]); return; }
    const from = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).toISOString().slice(0,10);
    const to = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()+1, 1).toISOString().slice(0,10);
    setLoadingRoomCalendar(true);
    try {
      const entries = await Promise.all((roomsList || []).map(async room => [String(room.id), await hostService.getRoomBlockedDates(room.id, from, to)]));
      const map = Object.fromEntries(entries);
      setRoomBlocksById(map);
      setRoomCalendarBlocks(map[String(roomId)] || []);
    } catch (e) { console.error(e); setRoomCalendarBlocks([]); }
    finally { setLoadingRoomCalendar(false); }
  };

  useEffect(() => {
    if (activeTab === "calendar" && selectedRoomForCalendar && !isVillaListing) loadRoomCalendar();
  }, [activeTab, selectedRoomForCalendar, calendarMonth, selectedListingForCalendar]);

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
    ...(currentUser?.role === "ROLE_ADMIN" ? [
      { id: "host_applications", label: "Host Applications", icon: ShieldCheck, badge: pendingHosts.length > 0 ? `${pendingHosts.length} pending` : null }
    ] : []),
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "property", label: "My Property", icon: Building2, count: myProperties?.length },
    { id: "rooms", label: "Rooms & Accommodation", icon: Bed },
    { id: "bookings", label: "Bookings", icon: FileText, count: hostData.reservations?.length },
    { id: "calendar", label: "Availability & Calendar", icon: Calendar },
    { id: "earnings", label: "Earnings & Payments", icon: DollarSign },
    { id: "offers", label: "Offers & Promotions", icon: Award },
    { id: "posts", label: "Property Posts", icon: Send },
    { id: "reviews", label: "Reviews & Ratings", icon: Star, count: hostData.reviews?.length },
    { id: "messages", label: "Guest Messages", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "notifications", label: "Notifications", icon: Bell, badge: pendingNotificationCount > 0 ? `${pendingNotificationCount} ready` : null },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#111827] flex font-sans transition-colors duration-300 w-full">
      
      {/* Left Sidebar Panel (Desktop only) */}
      <aside className="w-64 bg-white dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#334155] p-5 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-serif font-black text-lg select-none shrink-0 shadow-sm">
              R
            </div>
            <div>
              <span className="font-extrabold text-slate-800 dark:text-white text-[13px] block tracking-tight font-serif">Reservo Host Hub</span>
              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full mt-0.5 inline-block border border-emerald-200">Active Partner</span>
            </div>
          </div>

          <Link
            to="/"
            className="w-full py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 no-underline transition-all"
          >
            ← Back to Home
          </Link>

          <Link 
            to="/become-a-host" 
            className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 no-underline transition-all"
          >
            <Plus size={14} /> Add Property
          </Link>

          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border-none text-left ${
                    isActive 
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/10" 
                      : "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-white" : "text-slate-400"} />
                  <span className="flex-1">{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-extrabold">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && !tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 border-t border-[#E2E8F0] dark:border-[#334155] pt-4">
          <img 
            src={hostData.profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} 
            alt={hostName} 
            className="w-9 h-9 rounded-full object-cover border"
          />
          <div className="truncate">
            <span className="block text-[11px] font-black text-slate-800 dark:text-white truncate">{hostName}</span>
            <span className="block text-[9px] text-slate-400 truncate">{currentUser?.email}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl w-full">
        
        {/* Mobile-Only Header bar & Scroll Tab list */}
        <div className="flex flex-col gap-4 md:hidden mb-6 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] p-4 rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-serif font-black text-sm select-none shrink-0 shadow-sm">
                R
              </div>
              <span className="font-extrabold text-slate-800 dark:text-white text-xs">Host Panel</span>
            </div>
            <Link 
              to="/become-a-host" 
              className="text-[10px] font-bold bg-[#2563EB] text-white px-3 py-1.5 rounded-xl shadow no-underline"
            >
              + Add Property
            </Link>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${
                    isActive 
                      ? "bg-[#2563EB] text-white border-[#2563EB]" 
                      : "bg-transparent text-slate-600 dark:text-slate-300 border-[#E2E8F0] dark:border-[#334155]"
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT AREA */}
      <div>
        {/* TAB 0: HOST APPLICATIONS (ADMIN ONLY) */}
        {activeTab === "host_applications" && currentUser?.role === "ROLE_ADMIN" && (
          <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--color-border-color)] pb-3">
              <h3 className="text-base font-bold font-serif text-[var(--color-text-dark)] flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" /> Pending Host Applications
              </h3>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                {pendingHosts.length} Pending Approval
              </span>
            </div>

            {loadingPendingHosts ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : pendingHosts.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-gray)]">
                <div className="text-3xl mb-2">🏖️</div>
                <h4 className="text-sm font-bold text-[var(--color-text-dark)]">All caught up!</h4>
                <p className="text-xs mt-1">There are no pending host registration requests currently awaiting approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingHosts.map((host) => (
                  <div key={host.id} className="p-5 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm">
                          {host.name?.charAt(0).toUpperCase() || "H"}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[var(--color-text-dark)]">{host.name}</h4>
                          <p className="text-[11px] text-[var(--color-text-gray)]">{host.email} • {host.phone || "No phone"}</p>
                        </div>
                      </div>
                      <div className="bg-[var(--color-bg-white)] p-3 rounded-xl border border-[var(--color-border-color)] text-[11px]">
                        <span className="text-[10px] text-[var(--color-text-gray)] block font-semibold mb-1">VERIFICATION KYC INFO:</span>
                        <span className="font-bold text-[var(--color-text-dark)] block">Document Type: {host.kycDocumentType || "Aadhaar Card"}</span>
                        {host.kycDocumentUrl && (
                          <span className="block text-[var(--color-text-gray)] mt-1">
                            Verification Scan: <a href={host.kycDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline font-bold">View Uploaded Scan / Media</a>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                      <button
                        onClick={() => handleRejectHost(host.id)}
                        className="flex-1 md:flex-none text-xs font-bold px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer transition-all"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveHost(host.id)}
                        className="flex-1 md:flex-none text-xs font-bold px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark cursor-pointer border-none shadow transition-all"
                      >
                        Approve Host
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl cursor-pointer border-none shadow transition-all"
                >
                  Review Request →
                </button>
              </div>
            )}

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button onClick={() => setActiveTab("earnings")} className="text-left bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs min-h-[140px] cursor-pointer hover:border-primary/50 transition-all">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3"><span className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</span><div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600"><DollarSign size={16} /></div></div>
                <div className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums">₹{totalRevenue.toLocaleString("en-IN")}</div>
                <div className="text-[11px] font-medium text-emerald-600 mt-2">Real confirmed booking revenue • View earnings →</div>
              </button>

              <button onClick={() => { setSelectedBookingPropertyId("all"); setResStatusFilter("In-House"); setActiveTab("bookings"); }} className="text-left bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs min-h-[140px] cursor-pointer hover:border-primary/50 transition-all">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3"><span className="text-[11px] font-bold uppercase tracking-wider">Active Guests</span><div className="p-2 rounded-xl bg-purple-500/10 text-purple-600"><Users size={16} /></div></div>
                <div className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums">{inHouseGuestsCount}</div>
                <div className="text-[11px] font-medium text-purple-600 mt-2">In-house now • Open all properties →</div>
              </button>

              <button onClick={() => setActiveTab("calendar")} className="text-left bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs min-h-[140px] cursor-pointer hover:border-primary/50 transition-all">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3"><span className="text-[11px] font-bold uppercase tracking-wider">Available Rooms</span><div className="p-2 rounded-xl bg-blue-500/10 text-blue-600"><Bed size={16} /></div></div>
                <div className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums">{availableRoomsCount}</div>
                <div className="text-[11px] font-medium text-blue-600 mt-2">Available today • Open calendar →</div>
              </button>

              <button onClick={() => setActiveTab("reviews")} className="text-left bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-5 rounded-3xl shadow-xs min-h-[140px] cursor-pointer hover:border-primary/50 transition-all">
                <div className="flex justify-between items-center text-[var(--color-text-gray)] mb-3"><span className="text-[11px] font-bold uppercase tracking-wider">Host Rating</span><div className="p-2 rounded-xl bg-amber-500/10 text-amber-600"><Star size={16} /></div></div>
                <div className="text-3xl font-extrabold text-[var(--color-text-dark)] tabular-nums">{hostReviewCount ? hostRating.toFixed(1) : "0.0"}</div>
                <div className="text-[11px] font-medium text-amber-600 mt-2">{hostReviewCount} review{hostReviewCount === 1 ? "" : "s"} • View reviews →</div>
              </button>
            </div>

            {/* Today's Stays & Quick Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Upcoming Guest Stays */}
              <div className="lg:col-span-8 bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-border-color)] pb-3">
                  <h3 className="text-base font-bold font-serif text-[var(--color-text-dark)] flex items-center gap-2"><Users size={18} className="text-primary" /> Upcoming Guest Stays</h3>
                  <button onClick={() => { setSelectedBookingPropertyId("all"); setResStatusFilter("all"); setActiveTab("bookings"); }} className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer">View All →</button>
                </div>
                <div className="space-y-3">
                  {upcomingReservations.length ? upcomingReservations.slice(0, 5).map(res => (
                    <div key={res.id} className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={res.guest.avatar} alt={res.guest.name} className="w-11 h-11 rounded-full object-cover border border-primary/40" />
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-[var(--color-text-dark)]">{res.guest.name}</div>
                          <div className="text-[11px] text-[var(--color-text-gray)] mt-0.5">{res.listingTitle}</div>
                          <div className="text-[11px] font-medium text-[var(--color-text-dark)] mt-0.5">📅 {res.dates.checkIn} → {res.dates.checkOut} • {res.dates.nights} night{res.dates.nights === 1 ? "" : "s"}</div>
                          <div className="text-[11px] font-semibold text-[var(--color-text-gray)] mt-0.5">Room {res.roomNumber || "Assigned"} • {res.roomType || "Room"}</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-2 shrink-0">
                        <div className="text-xs font-extrabold text-primary text-center sm:text-right lg:text-center xl:text-right">₹{Number(res.totalPaid ?? res.payoutAmount ?? 0).toLocaleString("en-IN")}<div className="text-[10px] font-semibold text-emerald-600">{Number(res.totalPaid ?? 0) > 0 ? "Paid" : "Payable ₹0"}</div></div>
                        <button onClick={() => setActiveTab("messages")} className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--color-border-color)] bg-[var(--color-bg-white)] text-[var(--color-text-dark)] hover:border-primary cursor-pointer flex items-center justify-center gap-1"><MessageSquare size={13}/> Contact</button>
                        {res.guest.phone && <a href={`tel:${res.guest.phone}`} className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--color-border-color)] bg-[var(--color-bg-white)] text-[var(--color-text-dark)] hover:border-primary no-underline flex items-center justify-center gap-1"><Smartphone size={13}/> Call</a>}
                        <button onClick={() => handleCheckIn(res.id)} className="text-xs font-extrabold px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white cursor-pointer border-none flex items-center justify-center gap-1"><CheckCircle2 size={14}/> Check in</button>
                      </div>
                    </div>
                  )) : <div className="text-center py-10 text-stone-400 text-xs">No upcoming guest stays currently scheduled.</div>}
                </div>
              </div>

              {/* Quick Host Actions & Payout Status */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-[32px] p-6 shadow-xl space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-300">Current Host Revenue</div>
                  <div className="text-3xl font-extrabold tabular-nums">₹{totalRevenue.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-blue-200">Calculated from your real confirmed, in-house and completed bookings.</div>
                  <button onClick={() => setActiveTab("earnings")} className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 cursor-pointer">View Earnings & Payments →</button>
                </div>
                <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-5 shadow-xs space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-gray)] mb-1">Quick Shortcuts</div>
                  <button onClick={() => setActiveTab("calendar")} className="w-full p-3 rounded-2xl bg-[var(--color-bg-light)] text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between border border-[var(--color-border-color)] cursor-pointer"><span className="flex items-center gap-2"><Calendar size={15} className="text-primary"/> Availability Calendar</span><ChevronRight size={14}/></button>
                  <button onClick={() => setActiveTab("earnings")} className="w-full p-3 rounded-2xl bg-[var(--color-bg-light)] text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between border border-[var(--color-border-color)] cursor-pointer"><span className="flex items-center gap-2"><DollarSign size={15} className="text-emerald-600"/> Earnings & Payments</span><ChevronRight size={14}/></button>
                  <button onClick={() => setActiveTab("reviews")} className="w-full p-3 rounded-2xl bg-[var(--color-bg-light)] text-xs font-bold text-[var(--color-text-dark)] flex items-center justify-between border border-[var(--color-border-color)] cursor-pointer"><span className="flex items-center gap-2"><Star size={15} className="text-amber-500"/> Reviews & Ratings</span><ChevronRight size={14}/></button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PROPERTY INVENTORY & LISTINGS (LEGACY) */}
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
              {hostData.listings?.map((prop) => {
                const cardCover = prop.coverImage || prop.images?.[0] || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80";
                const cityStr = typeof prop.location === 'string' ? prop.location : `${prop.location?.city || 'Goa'}`;

                return (
                  <div 
                    key={prop.id}
                    className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[28px] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                        <img src={cardCover} alt={prop.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow ${
                          prop.status === "Active" ? "bg-emerald-500 text-white" :
                          prop.status === "Paused" ? "bg-amber-500 text-white" : "bg-slate-600 text-white"
                        }`}>
                          {prop.status}
                        </span>
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" /> {prop.rating || 5.0}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h4 className="text-sm font-bold font-serif text-[var(--color-text-dark)] line-clamp-1">
                          {prop.title}
                        </h4>
                        <div className="text-xs text-[var(--color-text-gray)] flex items-center gap-1">
                          <MapPin size={13} className="text-primary" /> {cityStr}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-gray)] border-y border-[var(--color-border-color)] py-2">
                          <span>{prop.specs?.guests || 6} Guests</span>
                          <span>•</span>
                          <span>{prop.specs?.bedrooms || 3} Beds</span>
                          <span>•</span>
                          <span>{prop.specs?.bathrooms || 3} Baths</span>
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

                    <div className="p-4 bg-[var(--color-bg-light)] border-t border-[var(--color-border-color)] flex items-center justify-between gap-2 flex-wrap">
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

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedListingForCalendar(prop.id);
                            setActiveTab("calendar");
                          }}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-dark cursor-pointer border-none flex items-center gap-1"
                        >
                          <Calendar size={12} /> Calendar
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${prop.title}" from your Host Inventory?`)) {
                              hostService.deleteListing(prop.id);
                              setHostData(hostService.getData());
                              toast(`Property "${prop.title}" has been deleted.`, "success");
                            }
                          }}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white cursor-pointer transition-all flex items-center gap-1"
                          title="Delete Property"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NEW TAB: MY PROPERTY */}
        {activeTab === "property" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-slate-800 dark:text-white">
                  My Property Details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your hosted properties, cover images, amenities, and approval status.
                </p>
              </div>
              <Link
                to="/become-a-host"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md no-underline flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Another Property
              </Link>
            </div>

            {loadingProperties ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : myProperties.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-3xl space-y-4">
                <div className="text-4xl">🏨</div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">No properties registered on the database yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the button below to launch the host wizard and register your first luxury resort, villa, or boutique chalet.
                </p>
                <Link
                  to="/become-a-host"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md no-underline inline-block"
                >
                  Register Your First Property
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {myProperties.map((prop) => (
                  <div key={prop.id} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-3xl p-4 shadow-sm space-y-4">
                    
                    {/* Status Alerts if action required */}
                    {prop.status === "CHANGES_REQUESTED" && (
                      <div className="bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 rounded-2xl p-4 flex gap-3 text-xs text-amber-800 dark:text-amber-300 font-medium">
                        <span className="text-lg">⚠️</span>
                        <div>
                          <strong className="block font-bold">Action Required: Changes Requested by Admin</strong>
                          <span className="block mt-0.5">{prop.featuredTag || "Please review property details."}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      {/* Left: Photos & Cover */}
                      <div className="w-full space-y-3 flex flex-col justify-start">
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border">
                          <img src={prop.activePhoto || prop.imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80"} alt={prop.name} className="w-full h-full object-cover" />
                          <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow text-white ${
                            prop.status === "APPROVED" ? "bg-emerald-600" :
                            prop.status === "PENDING_APPROVAL" ? "bg-amber-500" :
                            prop.status === "CHANGES_REQUESTED" ? "bg-red-500" : "bg-slate-600"
                          }`}>
                            {prop.status}
                          </span>
                        </div>
                        
                        {/* Gallery List */}
                        <div className="grid grid-cols-5 gap-1.5 mt-1">
                          {splitUrls(prop.galleryUrls || prop.imageUrl).map((url, i) => (
                            <div 
                              key={i} 
                              onClick={() => handleThumbnailClick(prop.id, url)}
                              className={`aspect-[4/3] rounded-lg overflow-hidden border cursor-pointer transition-all duration-200 ${
                                (prop.activePhoto === url || (!prop.activePhoto && i === 0))
                                  ? "border-blue-600 border-2 scale-[1.03] shadow-xs"
                                  : "border-slate-200 hover:border-blue-400"
                              }`}
                            >
                              <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Info & Settings */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#2563EB] font-bold uppercase tracking-wider">
                            <MapPin size={13} /> {prop.location}
                          </div>
                          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1 font-serif">
                            {prop.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {prop.description}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border text-center">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Base Price</span>
                            <span className="text-sm font-black text-slate-800 dark:text-white">₹{Number(prop.pricePerNight).toLocaleString("en-IN")}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Guests</span>
                            <span className="text-sm font-black text-slate-800 dark:text-white">{prop.guests || 4} Guests</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Bedrooms</span>
                            <span className="text-sm font-black text-slate-800 dark:text-white">{prop.bedrooms || 2} Rooms</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Rating</span>
                            <span className="text-sm font-black text-slate-800 dark:text-white">★ {prop.rating || 5.0}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Standout Amenities</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(prop.amenities ? prop.amenities.split(",") : ["Wi-Fi", "Pool", "Spa", "Butler Service"]).map((am, i) => (
                              <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openPropertyEditor(prop)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-extrabold border-none cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                          >
                            <Edit size={14} /> Edit Property
                          </button>
                          <span className="text-[10px] text-slate-400">
                            Editing any property information or photos sends it back for Admin approval.
                          </span>
                        </div>

                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NEW TAB: ROOMS & ACCOMMODATION */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-slate-800 dark:text-white">Rooms & Accommodation</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage the rooms submitted with your property. New rooms can only be added through Edit Property and must be approved again.
                </p>
              </div>
              {myProperties.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Property:</span>
                  <select value={selectedPropertyId} onChange={(e) => { setSelectedPropertyId(e.target.value); fetchRooms(e.target.value); }} className="p-2.5 rounded-xl border bg-white dark:bg-slate-800 text-xs font-bold outline-none cursor-pointer">
                    {myProperties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            {myProperties.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#1E293B] border rounded-3xl">
                <div className="text-3xl mb-2">🛏️</div>
                <h3 className="text-sm font-bold">No active properties</h3>
                <p className="text-xs text-slate-400 mt-1">Please register your property under My Property before managing rooms.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Registered Rooms ({roomsList.length})</h3>
                    <p className="text-[10px] text-slate-400 mt-1">All rooms were created when this property was listed. Availability is Available by default.</p>
                  </div>
                  <button type="button" onClick={openRoomEditor} disabled={!roomsList.length} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    <Edit size={14} /> Edit all rooms
                  </button>
                </div>

                {loadingRooms ? (
                  <div className="flex justify-center py-10"><div className="w-7 h-7 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" /></div>
                ) : roomsList.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">No rooms were registered with this property.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold">
                          <th className="py-2.5">Room No</th>
                          <th className="py-2.5">Room Type</th>
                          <th className="py-2.5">Guest Capacity</th>
                          <th className="py-2.5">Price / Night</th>
                          <th className="py-2.5">Availability</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomsList.map(room => (
                          <tr key={room.id} className="border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            <td className="py-3 font-extrabold text-slate-900 dark:text-white">#{room.roomNumber}</td>
                            <td className="py-3">{room.roomType || room.type || "Room"}</td>
                            <td className="py-3">{Number(room.capacity || 2)} Guests</td>
                            <td className="py-3 font-bold text-primary">₹{Number(room.pricePerNight || 0).toLocaleString("en-IN")}</td>
                            <td className="py-3">
                              <button type="button" onClick={() => handleUpdateRoomAvailability(room)} className={`px-3 py-1.5 rounded-full text-[9px] font-extrabold border cursor-pointer ${room.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                                {room.status === "AVAILABLE" ? "Available" : "Not Available"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {editingRooms && (
              <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onMouseDown={() => setEditingRooms(false)}>
                <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl p-6" onMouseDown={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white">Edit all rooms</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Update room number, room type, guest capacity and price together. Changes to room inventory require property approval again.</p>
                    </div>
                    <button type="button" onClick={() => setEditingRooms(false)} className="w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer"><X size={16}/></button>
                  </div>

                  <div className="space-y-3">
                    {roomDrafts.map(room => (
                      <div key={room.id} className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr_150px_150px] gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Room Number</label>
                          <input value={room.roomNumber} onChange={e => handleRoomDraftChange(room.id, "roomNumber", e.target.value)} className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Room Type</label>
                          <input value={room.roomType} onChange={e => handleRoomDraftChange(room.id, "roomType", e.target.value)} className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Guest Capacity</label>
                          <input type="number" min="1" max="20" value={room.capacity} onChange={e => handleRoomDraftChange(room.id, "capacity", Number(e.target.value))} className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Price / Night ₹</label>
                          <input type="number" min="1" value={room.pricePerNight} onChange={e => handleRoomDraftChange(room.id, "pricePerNight", Number(e.target.value))} className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-primary" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button type="button" onClick={() => setEditingRooms(false)} className="px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer">Cancel</button>
                    <button type="button" onClick={handleSaveRoomEdits} className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold border-none cursor-pointer inline-flex items-center gap-2"><Save size={14}/> Save changes</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NEW TAB: OFFERS & PROMOTIONS */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-slate-800 dark:text-white">
                  Offers & Promotions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Create coupon codes and custom percentage discounts exclusive to your property.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Active Coupons List */}
              <div className="lg:col-span-8 bg-white dark:bg-[#1E293B] border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  🎟️ Active Promotions & Codes
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offersList.map((off, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-[#2563EB]/40 flex justify-between items-center">
                      <div>
                        <span className="font-mono text-sm font-extrabold bg-[#2563EB]/10 text-[#2563EB] px-3 py-1 rounded-md border border-[#2563EB]/20 uppercase">
                          {off.code}
                        </span>
                        <div className="text-xs text-slate-800 dark:text-white font-extrabold mt-2">
                          {off.discountValue}% OFF
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Min purchase: ₹{off.minAmount} • Limit: {off.usageLimit}
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                        {off.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Coupon form */}
              <div className="lg:col-span-4 bg-white dark:bg-[#1E293B] border rounded-3xl p-5 shadow-sm space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  ✨ + Create Custom Offer
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Select Target Property</label>
                    <select
                      value={selectedOfferPropertyId}
                      onChange={(e) => setSelectedOfferPropertyId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none text-xs font-bold cursor-pointer"
                    >
                      <option value="all">All Properties</option>
                      {myProperties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Promo Code Name</label>
                    <input
                      type="text"
                      value={newOffer.code}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. MONSOON30"
                      className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none font-extrabold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Discount (%)</label>
                      <input
                        type="number"
                        value={newOffer.discountValue}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, discountValue: parseInt(e.target.value, 10) }))}
                        className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Usage Limit</label>
                      <input
                        type="number"
                        value={newOffer.usageLimit}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, usageLimit: parseInt(e.target.value, 10) }))}
                        className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newOffer.code) return;
                      setOffersList(prev => [...prev, { ...newOffer, status: "ACTIVE" }]);
                      setNewOffer({ code: "", discountType: "PERCENTAGE", discountValue: 10, minAmount: 1000, usageLimit: 100 });
                      toast("Promotion coupon created!", "success");
                    }}
                    className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer border-none shadow transition-all"
                  >
                    Deploy Promo Code
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* NEW TAB: PROPERTY POSTS */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-slate-800 dark:text-white">
                  Property Feed & Posts
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Publish announcement cards (monsoon offers, aura spa events) directly on your property detail page.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Posts Feed */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    📢 Published Announcements & Posts ({postsList.length})
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {postsList.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 border rounded-3xl bg-white dark:bg-[#1E293B]">
                      No announcements posted yet. Use the form on the right to post your first update!
                    </div>
                  ) : (
                    postsList.map((post) => (
                      <div key={post.id} className="bg-white dark:bg-[#1E293B] border rounded-3xl p-5 shadow-xs space-y-2 relative">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white font-serif">{post.title}</h4>
                            {post.resortName && (
                              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200">
                                🏨 {post.resortName}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{post.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Create Post form */}
              <div className="lg:col-span-4 bg-white dark:bg-[#1E293B] border rounded-3xl p-5 shadow-sm space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  ✍️ Create Announcement Card
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Select Target Property</label>
                    <select
                      value={selectedPostPropertyId || (myProperties[0]?.id || "")}
                      onChange={(e) => setSelectedPostPropertyId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none text-xs font-bold cursor-pointer"
                    >
                      {myProperties.length > 0 ? (
                        myProperties.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.location})</option>
                        ))
                      ) : (
                        <>
                          <option value="home-1">Goa Coastline Villa</option>
                          <option value="home-2">Kerala Backwaters Resort</option>
                          <option value="home-3">Himalayan Luxury Chalet</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Headline / Title</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Monsoon Special Offer"
                      className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">Card Description / Message</label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your event announcement or coupon description..."
                      rows="4"
                      className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none text-xs font-bold leading-relaxed resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newPost.title || !newPost.content) {
                        toast("Please provide both title and content", "error");
                        return;
                      }
                      const activePropId = selectedPostPropertyId || (myProperties[0]?.id || "home-1");
                      const activeProp = myProperties.find(p => String(p.id) === String(activePropId)) || myProperties[0];
                      const propName = activeProp?.name || "Target Property";

                      const newCard = {
                        id: Date.now(),
                        resortId: activePropId,
                        resortName: propName,
                        title: newPost.title,
                        content: newPost.content,
                        caption: newPost.content,
                        mediaUrl: activeProp?.imageUrl || activeProp?.image || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
                        type: "image",
                        date: new Date().toISOString().split('T')[0],
                        createdAt: new Date().toISOString()
                      };

                      const updatedList = [newCard, ...postsList];
                      setPostsList(updatedList);
                      try {
                        localStorage.setItem("reservo_resort_posts", JSON.stringify(updatedList));
                      } catch (e) {}

                      setNewPost({ title: "", content: "" });
                      toast(`Announcement published for ${propName}!`, "success");
                    }}
                    className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer border-none shadow transition-all"
                  >
                    Publish Post Card
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* NEW TAB: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-slate-800 dark:text-white">
                  Property Analytics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Measure conversion rates, property views, and popular accommodation suites.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white dark:bg-[#1E293B] border rounded-3xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Property Views</span>
                <span className="text-xl font-black text-slate-800 dark:text-white block mt-1">14,208</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ 12% vs last month</span>
              </div>
              <div className="bg-white dark:bg-[#1E293B] border rounded-3xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Booking Conversion</span>
                <span className="text-xl font-black text-slate-800 dark:text-white block mt-1">3.24%</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ 0.5% vs last month</span>
              </div>
              <div className="bg-white dark:bg-[#1E293B] border rounded-3xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Occupancy Rate</span>
                <span className="text-xl font-black text-slate-800 dark:text-white block mt-1">74.5%</span>
                <span className="text-[10px] text-indigo-600 font-bold block mt-1">Stable peak season</span>
              </div>
              <div className="bg-white dark:bg-[#1E293B] border rounded-3xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Average Rating</span>
                <span className="text-xl font-black text-slate-800 dark:text-white block mt-1">4.96 ★</span>
                <span className="text-[10px] text-amber-500 font-bold block mt-1">Superhost status active</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#1E293B] border rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white font-serif mb-4">Popular Accommodation Categories</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Deluxe Sea View Suite</span>
                    <span>45% of Bookings</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full w-[45%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Luxury Pool Villa</span>
                    <span>35% of Bookings</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full w-[35%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Standard Double Room</span>
                    <span>20% of Bookings</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full w-[20%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RESERVATIONS & GUEST STAYS */}
        {activeTab === "bookings" && (
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

              <div className="flex flex-wrap items-center gap-2">
                {myProperties.length > 0 && (
                  <select
                    value={selectedBookingPropertyId}
                    onChange={(e) => setSelectedBookingPropertyId(e.target.value)}
                    className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-2 rounded-xl text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="all">All Properties</option>
                    {myProperties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}

                {["all", "Pending Approval", "Upcoming", "In-House", "Completed", "Cancelled"].map((status) => (
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
                ?.filter(r => {
                  const matchesStatus = resStatusFilter === "all" || r.status === resStatusFilter;
                  const matchesProp = selectedBookingPropertyId === "all"
                    || String(r.resortId) === String(selectedBookingPropertyId);
                  return matchesStatus && matchesProp;
                })
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
                              res.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
                              res.status === "Cancelled" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
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
                        {res.status !== "Cancelled" && res.status !== "Completed" && (
                          <button
                            onClick={() => handleCancelBooking(res.id)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer flex items-center gap-1 transition-all"
                          >
                            <X size={13} /> Cancel Booking
                          </button>
                        )}
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)]">Calendar & Dynamic Availability</h2>
                <p className="text-xs text-[var(--color-text-gray)]">Manage the whole property or select one physical room to manage its individual calendar.</p>
              </div>
              <select value={selectedListingForCalendar} onChange={e => { setSelectedListingForCalendar(e.target.value); fetchRooms(e.target.value); }} className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-2.5 rounded-2xl text-xs font-bold outline-none focus:border-primary cursor-pointer">
                {(myProperties.length ? myProperties : hostData.listings || []).map(p => <option key={p.id} value={p.id}>{p.name || p.title} ({p.location?.city || p.location || "India"})</option>)}
              </select>
            </div>

            {!isVillaListing && (
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-xs font-extrabold text-[var(--color-text-dark)] whitespace-nowrap">Calendar view</div>
                  <select value={calendarViewMode} onChange={e => setCalendarViewMode(e.target.value)} className="p-2.5 rounded-xl border border-[var(--color-border-color)] bg-[var(--color-bg-light)] text-xs font-bold outline-none">
                    <option value="overview">Main Calendar — Rooms Available</option>
                    <option value="room">Room-wise Calendar</option>
                  </select>
                  {calendarViewMode === "room" && <select value={selectedRoomForCalendar} onChange={e => { setSelectedRoomForCalendar(e.target.value); setRoomCalendarBlocks(roomBlocksById[String(e.target.value)] || []); }} className="p-2.5 rounded-xl border border-primary bg-[var(--color-bg-light)] text-xs font-bold outline-none flex-1">
                    <option value="">Select a room</option>
                    {roomsList.map(room => <option key={room.id} value={room.id}>Room #{room.roomNumber} — {room.roomType || room.type} — ₹{Number(room.pricePerNight || 0).toLocaleString("en-IN")}/night</option>)}
                  </select>}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveCustomPrice} className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] p-4 rounded-3xl flex flex-wrap items-center gap-3 shadow-xs">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5"><Sparkles size={14} /> Custom Date Pricing:</span>
              <input type="date" value={customPriceDate} onChange={e=>setCustomPriceDate(e.target.value)} className="bg-[var(--color-bg-light)] border border-[var(--color-border-color)] p-2 rounded-xl text-xs font-bold text-[var(--color-text-dark)] outline-none" />
              <input type="number" step="100" placeholder="Nightly Rate ₹" value={customPriceVal} onChange={e=>setCustomPriceVal(e.target.value)} className="bg-[var(--color-bg-light)] border border-[var(--color-border-color)] p-2 rounded-xl text-xs font-bold text-[var(--color-text-dark)] outline-none w-36" />
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer border-none shadow-xs">Save Date Price</button>
            </form>

            <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-[32px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border-color)] pb-3">
                <div>
                  <h3 className="text-base font-bold font-serif text-[var(--color-text-dark)]">{calendarMonth.toLocaleDateString("en-IN", {month:"long",year:"numeric"})} {calendarViewMode === "room" && selectedRoomForCalendar ? `— Room #${roomsList.find(r=>String(r.id)===String(selectedRoomForCalendar))?.roomNumber || ""}` : "— Main Availability"}</h3>
                  <p className="text-[10px] text-[var(--color-text-gray)] mt-1">{isVillaListing ? "One whole-villa calendar. Available dates are green; booked and past dates are read-only." : calendarViewMode === "room" && selectedRoomForCalendar ? "Room-wise calendar. Green = available, grey = booked, red = blocked." : "Main calendar shows how many rooms are available each day."}</p>
                </div>
                <div className="flex items-center gap-2"><button type="button" onClick={()=>setCalendarMonth(prev=>new Date(prev.getFullYear(),prev.getMonth()-1,1))} className="p-2 rounded-xl border border-[var(--color-border-color)] hover:border-primary cursor-pointer bg-transparent"><ChevronRight size={15} className="rotate-180"/></button><button type="button" onClick={()=>setCalendarMonth(prev=>new Date(prev.getFullYear(),prev.getMonth()+1,1))} className="p-2 rounded-xl border border-[var(--color-border-color)] hover:border-primary cursor-pointer bg-transparent"><ChevronRight size={15}/></button></div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"/> Available</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"/> Blocked</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-400"/> Booked</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-300"/> Past</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400"/> Custom Price</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[var(--color-text-gray)]">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="py-1">{d}</div>)}</div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({length:calendarMonth.getDay()}).map((_,i)=><div key={`empty-${i}`} className="h-20"/>)}
                {Array.from({length:new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,0).getDate()}).map((_,idx)=>{
                  const dayNum=idx+1, y=calendarMonth.getFullYear(), m=String(calendarMonth.getMonth()+1).padStart(2,'0'), dateStr=`${y}-${m}-${String(dayNum).padStart(2,'0')}`;
                  const cellDate=new Date(`${dateStr}T00:00:00`); const today=new Date(); today.setHours(0,0,0,0); const past=cellDate<today;
                  const propertyBlocked=(hostData.blockedDates?.[selectedListingForCalendar]||[]).includes(dateStr);
                  const roomBlocked=selectedRoomForCalendar && roomCalendarBlocks.includes(dateStr);
                  const targetRoomId=calendarViewMode === "room" ? selectedRoomForCalendar : "";
                  const bookedRooms=(hostData.reservations||[]).filter(r=>String(r.resortId)===String(selectedListingForCalendar)&&reservationOccupiesDate(r,dateStr)&&r.status!=="Cancelled");
                  const bookedForRoom=targetRoomId ? bookedRooms.some(r=>isReservationForRoom(r,targetRoomId)) : bookedRooms.length>0;
                  const roomCount=roomsList.length;
                  const occupiedIds=new Set(bookedRooms.flatMap(r=>Array.isArray(r.assignedRoomIds)&&r.assignedRoomIds.length?r.assignedRoomIds:[r.roomId]).filter(Boolean).map(String));
                  const propertyBlocks = (hostData.blockedDates?.[selectedListingForCalendar] || []).includes(dateStr);
                  const blockedRoomCount=roomsList.filter(room=>(roomBlocksById[String(room.id)] || []).includes(dateStr)).length;
                  const availableCount=propertyBlocks ? 0 : Math.max(0,roomCount-occupiedIds.size-blockedRoomCount);
                  const selectedProp=myProperties.find(l=>String(l.id)===String(selectedListingForCalendar))||hostData.listings?.find(l=>String(l.id)===String(selectedListingForCalendar))||{};
                  const customPrice=(hostData.customPricing?.[selectedListingForCalendar]||{})[dateStr];
                  const basePrice=Number(selectedRoomForCalendar ? roomsList.find(r=>String(r.id)===String(selectedRoomForCalendar))?.pricePerNight : selectedProp.pricePerNight ?? selectedProp.price ?? 0);
                  const blocked=propertyBlocked || (calendarViewMode === "room" && selectedRoomForCalendar && roomBlocked);
                  const booked=calendarViewMode === "room" && selectedRoomForCalendar ? bookedForRoom : (isVillaListing ? bookedForRoom : false);
                  const fullyBooked=calendarViewMode === "overview"&&!isVillaListing&&!propertyBlocked&&availableCount===0&&roomCount>0;
                  const readOnly=past||booked||fullyBooked||(!isVillaListing&&calendarViewMode==="overview");
                  const cellClass=past?'bg-slate-200/80 border-slate-300 text-slate-500 cursor-not-allowed':booked||fullyBooked?'bg-slate-300/80 border-slate-400 text-slate-600 cursor-not-allowed':blocked?'bg-red-500/10 border-red-500/30 text-red-700':customPrice?'bg-amber-500/10 border-amber-500/40 text-[var(--color-text-dark)]':'bg-emerald-500/10 border-emerald-500/20 text-[var(--color-text-dark)] hover:border-primary';
                  let bottom=past?'Past':booked?'Booked':fullyBooked?'Fully booked':blocked?'Blocked':(!isVillaListing&&calendarViewMode === "overview"?`${availableCount} room${availableCount===1?'':'s'} available`:basePrice>0?`₹${basePrice.toLocaleString('en-IN')}`:'Available');
                  return <button key={dateStr} type="button" disabled={readOnly} onClick={()=>handleToggleBlock(dateStr)} title={past?'Past date':booked?'Booked':blocked?'Blocked — click to make available':(!isVillaListing&&calendarViewMode === "overview"?'Select a room above to block individual dates':'Available — click to block')} className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all ${cellClass}`}><div className="flex justify-between items-center w-full"><span className="text-xs font-extrabold">{dayNum}</span>{past?<Clock size={11}/>:booked||fullyBooked?<Lock size={11}/>:blocked?<Lock size={11} className="text-red-500"/>:<Check size={11} className="text-emerald-600"/>}</div><div className="text-[10px] font-bold mt-auto">{bottom}</div></button>;
                })}
              </div>
              {loadingRoomCalendar && <div className="text-[10px] text-slate-400">Refreshing room calendar…</div>}
            </div>

            {!isVillaListing && roomsList.length > 0 && (
              <div className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl p-5 shadow-xs">
                <h3 className="text-sm font-extrabold text-[var(--color-text-dark)] mb-3">Room Inventory & Calendars</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {roomsList.map(room => <button type="button" key={room.id} onClick={()=>{setCalendarViewMode("room");setSelectedRoomForCalendar(room.id);setRoomCalendarBlocks(roomBlocksById[String(room.id)] || []);}} className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${String(room.id)===String(selectedRoomForCalendar)?'border-primary bg-primary/10':'border-[var(--color-border-color)] bg-[var(--color-bg-light)] hover:border-primary/50'}`}><div className="flex justify-between"><span className="text-sm font-extrabold text-[var(--color-text-dark)]">Room #{room.roomNumber}</span><span className="text-[10px] font-bold text-primary">₹{Number(room.pricePerNight||0).toLocaleString('en-IN')}/night</span></div><div className="text-[10px] text-[var(--color-text-gray)] mt-1">{room.roomType||room.type||'Room'} • {room.capacity||4} guests</div></button>)}
                </div>
              </div>
            )}
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
                onClick={() => toast("Exported GST Tax Statement for selected month (PDF)", "success")}
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
                    ₹{revenueBookings.reduce((sum, r) => sum + Number(r.totalPaid ?? r.payoutAmount ?? 0), 0).toLocaleString("en-IN")}
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
                    ₹0
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
                {revenueBookings.length ? revenueBookings.map((pay) => (
                  <div key={pay.id} className="p-4 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-color)] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--color-text-dark)]">{pay.bookingCode || pay.id}</span>
                        <span className="text-[11px] text-[var(--color-text-gray)]">({pay.listingTitle || "Booking"})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pay.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                          pay.status === "In-House" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {pay.status}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-text-gray)] mt-0.5">
                        {pay.dates?.checkIn || ""} → {pay.dates?.checkOut || ""} • {pay.status}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold font-sans tabular-nums text-primary">
                        ₹{Number(pay.totalPaid ?? pay.payoutAmount ?? 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-sm text-[var(--color-text-gray)]">
                    No payment records found yet.
                  </div>
                )}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-serif text-[var(--color-text-dark)]">
                  Guest Reviews & Ratings
                </h2>
                <p className="text-xs text-[var(--color-text-gray)]">
                  Maintain a 4.8+ rating to preserve your Superhost badge and boost placement rank.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {myProperties.length > 0 && (
                  <select
                    value={selectedReviewPropertyId}
                    onChange={(e) => setSelectedReviewPropertyId(e.target.value)}
                    className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] text-[var(--color-text-dark)] p-2.5 rounded-2xl text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="all">All Properties</option>
                    {myProperties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}
                <div className="text-right">
                  <div className="text-2xl font-extrabold font-sans tabular-nums text-amber-500 flex items-center gap-1 justify-end">
                    <Star size={20} className="fill-amber-500" /> {hostReviewCount ? hostRating.toFixed(1) : "0.0"}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-gray)]">100% 5-Star Reviews this Quarter</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {realReviews
                .filter(rev => selectedReviewPropertyId === "all" || String(rev.resortId) === String(selectedReviewPropertyId))
                .map((rev) => (
                <div key={rev.id} className="bg-[var(--color-bg-white)] border border-[var(--color-border-color)] rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-[var(--color-text-dark)]">{rev.guestName} ({rev.guestCountry})</div>
                      <div className="text-xs text-[var(--color-text-gray)]">{rev.propertyTitle} • {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-IN") : ""}</div>
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


      {/* PROPERTY EDITOR */}
      <AnimatePresence>
        {editingProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onSubmit={handleSavePropertyEdit}
              className="w-full max-w-5xl max-h-[94vh] overflow-y-auto bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold font-serif text-slate-900 dark:text-white">Edit Property</h3>
                  <p className="text-xs text-slate-500 mt-1">Edit the same property information used during New Property Listing.</p>
                </div>
                <button type="button" onClick={closePropertyEditor} disabled={savingProperty || uploadingPropertyImages}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 cursor-pointer flex items-center justify-center disabled:opacity-50">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* STEP 1 — BASICS: exactly the property category choices from New Property Listing */}
                <section className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 1 • Basics</span>
                    <h4 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">Which best describes your luxury property?</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PROPERTY_CATEGORIES.map(cat => (
                      <button key={cat.id} type="button"
                        onClick={() => setPropertyEditForm(prev => ({ ...prev, category: cat.id }))}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer ${
                          propertyEditForm.category === cat.id
                            ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                        }`}>
                        <div className="text-2xl">{cat.icon}</div>
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white">{cat.name}</div>
                        <div className="text-[11px] text-slate-500">{cat.desc}</div>
                        {propertyEditForm.category === cat.id && <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1"><Check size={13}/> Selected</div>}
                      </button>
                    ))}
                  </div>
                </section>

                {/* STEP 2 — LOCATION: same fields as New Property Listing */}
                <section className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 2 • Location</span>
                    <h4 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">Where is your property situated?</h4>
                  </div>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Street Address / Estate Name *</span>
                      <input value={propertyEditForm.address} onChange={e => setPropertyEditForm(p => ({...p,address:e.target.value}))}
                        placeholder="e.g., Villa No. 12, Aguada Foothills Road" required
                        className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:border-blue-500" />
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label><span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">City / Destination *</span>
                        <input value={propertyEditForm.city} onChange={e => setPropertyEditForm(p=>({...p,city:e.target.value}))} required placeholder="e.g., Goa" className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-blue-500"/></label>
                      <label><span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">State / Province</span>
                        <input value={propertyEditForm.state} onChange={e => setPropertyEditForm(p=>({...p,state:e.target.value}))} placeholder="e.g., Goa" className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-blue-500"/></label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label><span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">PIN / Postal Code</span>
                        <input value={propertyEditForm.pinCode} onChange={e => setPropertyEditForm(p=>({...p,pinCode:e.target.value}))} placeholder="e.g., 403515" className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-blue-500"/></label>
                      <label><span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Country</span>
                        <input value={propertyEditForm.country} onChange={e => setPropertyEditForm(p=>({...p,country:e.target.value}))} placeholder="e.g., India" className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-blue-500"/></label>
                    </div>
                    <label><span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Landmark</span>
                      <input value={propertyEditForm.landmark} onChange={e => setPropertyEditForm(p=>({...p,landmark:e.target.value}))} placeholder="Nearby landmark" className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-blue-500"/></label>
                  </div>
                </section>

                {/* STEP 3 — ACCOMMODATION: same mode and inventory controls as New Property Listing */}
                <section className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 3 • Accommodation Setup</span>
                    <h4 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">How do you want to list your property?</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      {value:"VILLA", title:"Whole Villa", desc:"One bookable property with one calendar and one nightly price.", icon:"🏡"},
                      {value:"ROOMS", title:"List rooms separately", desc:"Create room types, quantities, prices and separate room calendars.", icon:"🛏️"}
                    ].map(option => (
                      <button key={option.value} type="button" onClick={() => setPropertyEditForm(p=>({...p,listingMode:option.value}))}
                        className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                          propertyEditForm.listingMode === option.value ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20" : "border-slate-200 bg-slate-50 hover:border-blue-400"
                        }`}>
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="text-sm font-extrabold text-slate-900">{option.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>

                  {propertyEditForm.listingMode === "VILLA" ? (
                    <div className="space-y-4 p-5 rounded-3xl border border-slate-200 bg-slate-50">
                      <div className="p-4 rounded-2xl bg-white border border-slate-200">
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-blue-600 mb-1.5">Price / Night ₹</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-extrabold text-blue-600">₹</span>
                          <input type="number" min="1" value={propertyEditForm.pricePerNight}
                            onChange={e=>setPropertyEditForm(p=>({...p,pricePerNight:Math.max(0,Number(e.target.value))}))}
                            className="w-full p-3 rounded-xl border border-slate-200 text-sm font-black outline-none focus:border-blue-500"/>
                          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">/ night</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          ["Guests","guests"],["Bedrooms","bedrooms"],["Beds","beds"],["Bathrooms","bathrooms"]
                        ].map(([label,key]) => (
                          <label key={key} className="p-3 rounded-2xl bg-white border border-slate-200">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
                            <input type="number" min="1" value={propertyEditForm[key]}
                              onChange={e=>setPropertyEditForm(p=>({...p,[key]:Math.max(1,Number(e.target.value))}))}
                              className="mt-2 w-full text-sm font-black outline-none"/>
                          </label>
                        ))}
                      </div>
                      <label className="block p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Area (Sq Ft)</span>
                        <input type="number" min="0" value={propertyEditForm.sqft}
                          onChange={e=>setPropertyEditForm(p=>({...p,sqft:Math.max(0,Number(e.target.value))}))}
                          className="mt-2 w-full text-sm font-black outline-none"/>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4 p-5 rounded-3xl border border-slate-200 bg-slate-50">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          ["Guests","guests"],["Bedrooms","bedrooms"],["Beds","beds"],["Bathrooms","bathrooms"]
                        ].map(([label,key]) => (
                          <label key={key} className="p-3 rounded-2xl bg-white border border-slate-200">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
                            <input type="number" min="1" value={propertyEditForm[key]}
                              onChange={e=>setPropertyEditForm(p=>({...p,[key]:Math.max(1,Number(e.target.value))}))}
                              className="mt-2 w-full text-sm font-black outline-none"/>
                          </label>
                        ))}
                      </div>
                      <label className="block p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Area (Sq Ft)</span>
                        <input type="number" min="0" value={propertyEditForm.sqft}
                          onChange={e=>setPropertyEditForm(p=>({...p,sqft:Math.max(0,Number(e.target.value))}))}
                          className="mt-2 w-full text-sm font-black outline-none"/>
                      </label>

                      <div className="space-y-3 p-4 rounded-3xl border border-slate-200 bg-white">
                        <div>
                          <h5 className="text-sm font-extrabold text-slate-900">Room types & inventory</h5>
                          <p className="text-[10px] text-slate-500 mt-1">Same room type, price, capacity and quantity controls used during New Property Listing.</p>
                        </div>
                        {(propertyEditForm.roomTypes || []).map((type,index) => (
                          <div key={`${type.name}-${index}`} className="grid grid-cols-1 sm:grid-cols-[1fr_150px_130px_110px] gap-3 items-end p-3 rounded-2xl bg-slate-50 border border-slate-200">
                            <label><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Room Type</span>
                              <input value={type.name} onChange={e=>setPropertyEditForm(p=>({...p,roomTypes:p.roomTypes.map((r,i)=>i===index?{...r,name:e.target.value}:r)}))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-blue-500"/>
                            </label>
                            <label><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Price / Night ₹</span>
                              <input type="number" min="1" value={type.pricePerNight} onChange={e=>setPropertyEditForm(p=>({...p,roomTypes:p.roomTypes.map((r,i)=>i===index?{...r,pricePerNight:Number(e.target.value)}:r)}))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-blue-500"/>
                            </label>
                            <label><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Guest Capacity</span>
                              <input type="number" min="1" max="20" value={type.capacity} onChange={e=>setPropertyEditForm(p=>({...p,roomTypes:p.roomTypes.map((r,i)=>i===index?{...r,capacity:Math.max(1,Number(e.target.value))}:r)}))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-blue-500"/>
                            </label>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Rooms</span>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={()=>setPropertyEditForm(p=>({...p,roomTypes:p.roomTypes.map((r,i)=>i===index?{...r,count:Math.max(0,Number(r.count||0)-1)}:r)}))}
                                  className="w-8 h-8 rounded-full border border-slate-300 bg-white cursor-pointer"><span className="text-base leading-none">−</span></button>
                                <span className="w-7 text-center text-xs font-black">{type.count}</span>
                                <button type="button" onClick={()=>setPropertyEditForm(p=>({...p,roomTypes:p.roomTypes.map((r,i)=>i===index?{...r,count:Number(r.count||0)+1}:r)}))}
                                  className="w-8 h-8 rounded-full border border-slate-300 bg-white cursor-pointer"><span className="text-base leading-none">+</span></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="text-[11px] font-bold text-blue-600">
                          Total physical rooms: {(propertyEditForm.roomTypes || []).reduce((sum,r)=>sum+Number(r.count||0),0)}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* STEP 4 — AMENITIES: same selectable cards as New Property Listing */}
                <section className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 4 • Amenities</span>
                    <h4 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">What standout amenities do you offer?</h4>
                    <p className="text-xs text-slate-500">Select all that apply.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {AMENITY_OPTIONS.map(option => {
                      const Icon = option.icon;
                      const selected = (propertyEditForm.amenities || []).includes(option.label);
                      return (
                        <button type="button" key={option.id}
                          onClick={()=>setPropertyEditForm(p=>({...p,amenities:(p.amenities||[]).includes(option.label) ? p.amenities.filter(a=>a!==option.label) : [...(p.amenities||[]),option.label]}))}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-3 cursor-pointer transition-all ${
                            selected ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500/20" : "bg-white border-slate-200 hover:border-blue-400"
                          }`}>
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}><Icon size={19}/></span>
                          <span className={`text-xs font-extrabold flex-1 ${selected ? "text-blue-700" : "text-slate-700"}`}>{option.label}</span>
                          {selected && <Check size={16} className="text-blue-600"/>}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* STEP 5 — PHOTOGRAPHY */}
                <section className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 5 • Photography</span>
                    <h4 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">Add photos & videos of your luxury stay</h4>
                    <p className="text-xs text-slate-500">Maximum 10 photos and 2 videos, same as New Property Listing.</p>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-5 text-center bg-slate-50 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto"><Camera size={22}/></div>
                    <div className="text-xs font-extrabold text-slate-800">Add property photos ({propertyEditForm.galleryUrls.length}/10)</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <label className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5">
                        <Upload size={14}/> Upload from Device
                        <input type="file" accept="image/*" multiple className="hidden" disabled={uploadingPropertyImages} onChange={handlePropertyImageUpload}/>
                      </label>
                      <label className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5">
                        <Camera size={14} className="text-blue-600"/> Take Photo (Camera)
                        <input type="file" accept="image/*" capture="environment" className="hidden" disabled={uploadingPropertyImages} onChange={handlePropertyImageUpload}/>
                      </label>
                      <button type="button" onClick={()=>{const url=window.prompt("Paste Google Drive photo link"); if(url?.trim()) setPropertyEditForm(p=>({...p,galleryUrls:[...p.galleryUrls,url.trim()],imageUrl:p.imageUrl||url.trim()}));}}
                        className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5"><Globe size={14} className="text-blue-500"/> Google Drive Link</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(propertyEditForm.galleryUrls || []).map((url,index)=>(
                      <div key={`${url}-${index}`} className="relative rounded-2xl overflow-hidden group aspect-[4/3] border border-slate-200">
                        <img src={url} alt={`Property ${index+1}`} className="w-full h-full object-cover"/>
                        {propertyEditForm.imageUrl === url && <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">Cover</span>}
                        <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {propertyEditForm.imageUrl !== url && <button type="button" onClick={()=>handlePropertyEditField("imageUrl",url)} className="flex-1 py-1.5 rounded-lg bg-white text-slate-800 text-[9px] font-bold cursor-pointer">Set Cover</button>}
                          <button type="button" onClick={()=>removePropertyImage(url)} className="px-2 py-1.5 rounded-lg bg-red-600 text-white text-[9px] font-bold cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-3xl p-5 text-center bg-slate-50 space-y-3">
                    <Video size={22} className="mx-auto text-indigo-600"/>
                    <div className="text-xs font-extrabold">Upload property video tours ({(propertyEditForm.videoUrls || []).length}/2)</div>
                    <div className="flex justify-center gap-2">
                      <label className="bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5">
                        <Upload size={14}/> Upload Video Tour
                        <input type="file" accept="video/*" multiple className="hidden" disabled={uploadingPropertyImages} onChange={handlePropertyVideoUpload}/>
                      </label>
                      <button type="button" onClick={()=>{const url=window.prompt("Paste Google Drive video link"); if(url?.trim() && (propertyEditForm.videoUrls||[]).length<2) setPropertyEditForm(p=>({...p,videoUrls:[...(p.videoUrls||[]),url.trim()]}));}}
                        className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5"><Globe size={14}/> Google Drive Video Link</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(propertyEditForm.videoUrls || []).map((url,index)=>(
                      <div key={`${url}-${index}`} className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-200">
                        <video src={url} controls className="w-full h-full object-cover"/>
                        <button type="button" onClick={()=>setPropertyEditForm(p=>({...p,videoUrls:p.videoUrls.filter((_,i)=>i!==index)}))}
                          className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-lg cursor-pointer">Delete</button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* STEP 6 — STORY & COPY */}
                <section className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 6 • Story & Copy</span>
                    <h4 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">Craft your property title & story</h4>
                  </div>
                  <label className="block">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Catchy Listing Title *</span>
                    <input required value={propertyEditForm.name} onChange={e=>setPropertyEditForm(p=>({...p,name:e.target.value}))}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-blue-500"/>
                  </label>
                  <label className="block">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Detailed Luxury Description *</span>
                    <textarea required rows={6} value={propertyEditForm.description} onChange={e=>setPropertyEditForm(p=>({...p,description:e.target.value}))}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none resize-y focus:border-blue-500"/>
                  </label>
                </section>

                {/* STEP 7 — HOUSE RULES: same fields as New Property Listing */}
                <section className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 7 • House Rules</span>
                    <h4 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">Set your expectations & safety guidelines</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="block text-xs font-bold text-slate-700">Minimum Stay (Nights)</span>
                      <input type="number" min="1" max="14" value={propertyEditForm.minNights} onChange={e=>setPropertyEditForm(p=>({...p,minNights:Math.max(1,Number(e.target.value))}))}
                        className="mt-2 w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold outline-none"/>
                    </label>
                    <label className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="block text-xs font-bold text-slate-700">Cancellation Policy</span>
                      <select value={propertyEditForm.cancellationPolicy} onChange={e=>setPropertyEditForm(p=>({...p,cancellationPolicy:e.target.value}))}
                        className="mt-2 w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold outline-none">
                        <option value="Flexible">Flexible (24h)</option>
                        <option value="Moderate">Moderate (5 days)</option>
                        <option value="Strict">Strict (14 days)</option>
                      </select>
                    </label>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <strong>Reservo Quiet Hours Standard:</strong> Quiet hours are automatically enforced between 10:00 PM and 7:00 AM.
                  </div>
                </section>

                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
                  <strong>Approval required:</strong> Saving any change sends this property back to
                  <strong> PENDING_APPROVAL</strong>. It will not be public until Admin approves the changes.
                </div>
              </div>

              <div className="sticky bottom-0 z-20 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-end gap-2">
                <button type="button" onClick={closePropertyEditor} disabled={savingProperty || uploadingPropertyImages}
                  className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-extrabold cursor-pointer disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={savingProperty || uploadingPropertyImages}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-extrabold cursor-pointer flex items-center gap-2 disabled:opacity-60">
                  {savingProperty ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>}
                  {savingProperty ? "Submitting..." : "Save & Request Approval"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      </main>
    </div>
  );
}
