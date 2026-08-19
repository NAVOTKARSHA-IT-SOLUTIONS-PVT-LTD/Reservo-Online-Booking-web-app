// Host Service for Reservo Web App

const HOST_STORAGE_KEY = "reservo_host_data_v1";

const INITIAL_HOST_DATA = {
  profile: {
    hostId: "HOST-89421",
    name: "Srushti Salunke",
    email: "srushti.salunke@reservo.com",
    phone: "+91 98450 12345",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    isSuperhost: true,
    rating: 4.96,
    totalReviews: 128,
    responseTime: "< 15 mins",
    responseRate: "99%",
    joinedDate: "January 2024",
    kycVerified: true,
    coHosts: [
      { id: "ch-1", name: "Rohan Varma", email: "rohan@reservo.com", role: "Property Manager", access: "Full" }
    ]
  },
  listings: [
    {
      id: "host-prop-1",
      title: "Villa Solarium Infinity Pool & Ocean Cove",
      category: "Villa",
      location: {
        address: "Plot 14, Candolim Beach Rd",
        city: "Goa",
        state: "Goa",
        country: "India",
        pinCode: "403515",
        latitude: 15.5164,
        longitude: 73.7634
      },
      pricePerNight: 24500,
      currency: "INR",
      rating: 4.98,
      reviewsCount: 64,
      status: "Active", // Active, Paused, Draft, Under Review
      instantBook: true,
      specs: {
        guests: 8,
        bedrooms: 4,
        beds: 5,
        bathrooms: 4.5,
        sqft: 4200
      },
      coverImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Private Infinity Pool", "High-Speed WiFi (300Mbps)", "Chef on Demand", "Direct Beach Access", "EV Charger", "Air Conditioning", "Dedicated Workspace", "Jacuzzi", "BBQ Grill"],
      description: "Perched above the azure Arabian sea, Villa Solarium is an architectural marvel offering unrivaled sunsets, private beach trail, heated infinity pool, and a dedicated butler team.",
      cleaningFee: 2500,
      weekendSurgePercent: 20,
      discounts: { weekly: 10, monthly: 25 },
      cancellationPolicy: "Flexible", // Flexible, Moderate, Strict
      minNights: 2,
      maxNights: 30,
      createdAt: "2024-02-10"
    },
    {
      id: "host-prop-2",
      title: "Himalayan Cedar Chalet & Glass Observatory",
      category: "Chalet",
      location: {
        address: "Old Manali Heights, Club House Rd",
        city: "Manali",
        state: "Himachal Pradesh",
        country: "India",
        pinCode: "175131",
        latitude: 32.2598,
        longitude: 77.1751
      },
      pricePerNight: 16800,
      currency: "INR",
      rating: 4.94,
      reviewsCount: 42,
      status: "Active",
      instantBook: false,
      specs: {
        guests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 3,
        sqft: 2800
      },
      coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Glass Stargazing Roof", "Stone Fireplace", "Heated Floors", "Mountain View Balcony", "Sauna", "Wi-Fi (150Mbps)", "Complimentary Breakfast", "Ski Equipment Storage"],
      description: "Nestled amidst towering deodar cedars, this bespoke wooden chalet features hand-carved pine interiors, a cozy stone fireplace, stargazing glass dome, and panoramic views of snow-capped peaks.",
      cleaningFee: 1800,
      weekendSurgePercent: 15,
      discounts: { weekly: 12, monthly: 30 },
      cancellationPolicy: "Moderate",
      minNights: 2,
      maxNights: 21,
      createdAt: "2024-05-18"
    },
    {
      id: "host-prop-3",
      title: "Lake Palace Royal Suite & Heritage Courtyard",
      category: "Heritage Haven",
      location: {
        address: "Pichola Lakefront Promenade",
        city: "Udaipur",
        state: "Rajasthan",
        country: "India",
        pinCode: "313001",
        latitude: 24.5764,
        longitude: 73.6835
      },
      pricePerNight: 32000,
      currency: "INR",
      rating: 4.97,
      reviewsCount: 22,
      status: "Paused",
      instantBook: true,
      specs: {
        guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        sqft: 2200
      },
      coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Private Lake Deck", "Marble Plunge Pool", "Royal Butler Service", "Antique Jharokha Balcony", "Spa Services", "Sunset Boat Ride Included"],
      description: "A timeless Mewari heritage sanctuary featuring intricate stone carvings, vintage chandeliers, private boat mooring, and direct front-row vistas of the tranquil Lake Pichola.",
      cleaningFee: 3000,
      weekendSurgePercent: 25,
      discounts: { weekly: 15, monthly: 20 },
      cancellationPolicy: "Strict",
      minNights: 1,
      maxNights: 14,
      createdAt: "2024-09-05"
    }
  ],
  reservations: [
    {
      id: "RES-99812",
      listingId: "host-prop-1",
      listingTitle: "Villa Solarium Infinity Pool & Ocean Cove",
      guest: {
        name: "Vikram & Ananya Sengupta",
        email: "vikram.s@gmail.com",
        phone: "+91 98201 54321",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        verified: true,
        country: "India",
        previousStays: 4
      },
      dates: {
        checkIn: "2026-08-16",
        checkOut: "2026-08-20",
        nights: 4
      },
      guestsCount: { adults: 4, children: 2, infants: 0 },
      payoutAmount: 105600,
      totalPaid: 114800,
      cleaningFee: 2500,
      serviceFee: 6700,
      status: "Upcoming", // Upcoming, In-House, Completed, Pending Approval, Cancelled
      paymentStatus: "Escrow Secured",
      notes: "Celebrating 10th anniversary. Requested airport pickup and vegan breakfast preferences.",
      specialRequest: "Early check-in at 1:00 PM if possible.",
      bookedOn: "2026-08-10",
      accessCode: "VS-8942#",
      confirmationSent: {
        email: true,
        message: true,
        emailSentAt: "Aug 10, 2026, 11:15 AM",
        messageSentAt: "Aug 10, 2026, 11:16 AM"
      }
    },
    {
      id: "RES-99805",
      listingId: "host-prop-2",
      listingTitle: "Himalayan Cedar Chalet & Glass Observatory",
      guest: {
        name: "David & Maya Miller",
        email: "david.m@yahoo.com",
        phone: "+1 415 890 2311",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        verified: true,
        country: "United States",
        previousStays: 1
      },
      dates: {
        checkIn: "2026-08-13",
        checkOut: "2026-08-17",
        nights: 4
      },
      guestsCount: { adults: 2, children: 0, infants: 0 },
      payoutAmount: 68500,
      totalPaid: 74200,
      cleaningFee: 1800,
      serviceFee: 3900,
      status: "In-House",
      paymentStatus: "Paid Out",
      notes: "Photographers traveling for mountain landscape series.",
      specialRequest: "Extra firewood bundle requested.",
      bookedOn: "2026-07-28",
      accessCode: "HC-4410#",
      confirmationSent: {
        email: true,
        message: false,
        emailSentAt: "Jul 28, 2026, 4:30 PM",
        messageSentAt: null
      }
    },
    {
      id: "RES-99790",
      listingId: "host-prop-1",
      listingTitle: "Villa Solarium Infinity Pool & Ocean Cove",
      guest: {
        name: "Sophie Chen",
        email: "sophie.c@techsg.com",
        phone: "+65 9123 4567",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        verified: true,
        country: "Singapore",
        previousStays: 6
      },
      dates: {
        checkIn: "2026-08-01",
        checkOut: "2026-08-06",
        nights: 5
      },
      guestsCount: { adults: 6, children: 1, infants: 0 },
      payoutAmount: 132000,
      totalPaid: 143500,
      cleaningFee: 2500,
      serviceFee: 9000,
      status: "Completed",
      paymentStatus: "Paid Out",
      notes: "Family holiday. Left a 5-star review.",
      specialRequest: "None",
      bookedOn: "2026-07-12",
      accessCode: "VS-1200#",
      confirmationSent: {
        email: true,
        message: true,
        emailSentAt: "Jul 12, 2026, 2:00 PM",
        messageSentAt: "Jul 12, 2026, 2:05 PM"
      }
    },
    {
      id: "RES-99824",
      listingId: "host-prop-1",
      listingTitle: "Villa Solarium Infinity Pool & Ocean Cove",
      guest: {
        name: "Karan Johar Group",
        email: "karan.prod@mumbaifilms.in",
        phone: "+91 99300 88221",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        verified: true,
        country: "India",
        previousStays: 0
      },
      dates: {
        checkIn: "2026-08-25",
        checkOut: "2026-08-28",
        nights: 3
      },
      guestsCount: { adults: 8, children: 0, infants: 0 },
      payoutAmount: 79200,
      totalPaid: 86100,
      cleaningFee: 2500,
      serviceFee: 4400,
      status: "Pending Approval",
      paymentStatus: "Hold Authorized",
      notes: "Commercial photo-shoot inquiry with family retreat.",
      specialRequest: "Need permission for drone photography around the perimeter.",
      bookedOn: "2026-08-14",
      accessCode: "VS-9982#",
      confirmationSent: {
        email: false,
        message: false,
        emailSentAt: null,
        messageSentAt: null
      }
    }
  ],
  blockedDates: {
    "host-prop-1": ["2026-08-21", "2026-08-22", "2026-09-02", "2026-09-03"],
    "host-prop-2": ["2026-08-29", "2026-08-30", "2026-08-31"],
    "host-prop-3": []
  },
  customPricing: {
    "host-prop-1": {
      "2026-08-15": 29500,
      "2026-08-16": 29500,
      "2026-08-22": 31000,
      "2026-08-23": 31000
    }
  },
  messages: [
    {
      id: "msg-thread-1",
      reservationId: "RES-99812",
      guestName: "Vikram Sengupta",
      guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      listingTitle: "Villa Solarium Infinity Pool",
      lastMessage: "Thank you Srushti! We look forward to arriving around 1:30 PM.",
      lastTime: "10:45 AM",
      unread: true,
      history: [
        { sender: "guest", text: "Hello Srushti! Is it possible to arrange airport transfers for 4 adults from MOPA airport?", time: "Yesterday, 4:20 PM" },
        { sender: "host", text: "Hello Vikram! Warm greetings. Absolutely, our chauffeur will be ready with a luxury Toyota Innova Crysta. Please share your flight number.", time: "Yesterday, 4:32 PM" },
        { sender: "guest", text: "Flight is 6E-6124 arriving at 12:45 PM. Also we have requested vegan breakfast.", time: "Yesterday, 5:10 PM" },
        { sender: "host", text: "Noted! Chef Deepak has curated an organic farm-to-table coastal vegan spread for your mornings. See you soon!", time: "Today, 9:30 AM" },
        { sender: "guest", text: "Thank you Srushti! We look forward to arriving around 1:30 PM.", time: "10:45 AM" }
      ]
    },
    {
      id: "msg-thread-2",
      reservationId: "RES-99805",
      guestName: "David Miller",
      guestAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      listingTitle: "Himalayan Cedar Chalet",
      lastMessage: "The fireplace is lovely! Could we get an extra bundle of pine logs?",
      lastTime: "Yesterday",
      unread: false,
      history: [
        { sender: "host", text: "Welcome to Manali, David & Maya! The stargazing roof is pre-cleaned for tonight's clear skies.", time: "Aug 13, 2:00 PM" },
        { sender: "guest", text: "The fireplace is lovely! Could we get an extra bundle of pine logs?", time: "Aug 13, 7:15 PM" },
        { sender: "host", text: "Of course! Caretaker Raju will bring seasoned cedar and pine logs right away.", time: "Aug 13, 7:22 PM" }
      ]
    }
  ],
  reviews: [
    {
      id: "rev-1",
      guestName: "Sophie Chen",
      guestCountry: "Singapore",
      rating: 5,
      date: "August 2026",
      propertyTitle: "Villa Solarium Infinity Pool",
      text: "Villa Solarium exceeded every single expectation. The infinity pool overlooks the most stunning sunset in Goa. Srushti and the staff treated us like royalty. We will definitely return!",
      categories: { cleanliness: 5.0, accuracy: 5.0, communication: 5.0, location: 5.0, checkIn: 5.0, value: 4.9 },
      response: "Thank you so much Sophie! It was an absolute delight hosting your lovely family. You are welcome anytime!"
    },
    {
      id: "rev-2",
      guestName: "Rahul & Natasha Bose",
      guestCountry: "India",
      rating: 5,
      date: "July 2026",
      propertyTitle: "Himalayan Cedar Chalet",
      text: "Unbeatable alpine atmosphere. Waking up to the snow peaks through the glass ceiling was magical. Warm heated floors, rich cedar aroma, and top tier hospitality.",
      categories: { cleanliness: 5.0, accuracy: 4.9, communication: 5.0, location: 4.8, checkIn: 5.0, value: 5.0 },
      response: null
    }
  ],
  financials: {
    totalRevenue: 486900,
    monthRevenue: 174100,
    lastMonthRevenue: 152800,
    occupancyRate: 84.5,
    projectedNextMonth: 215000,
    payouts: [
      { id: "PAY-5011", date: "2026-08-08", amount: 132000, method: "HDFC Bank (****4910)", status: "Completed", invoice: "INV-2026-081" },
      { id: "PAY-5012", date: "2026-08-14", amount: 68500, method: "UPI (srushti@okaxis)", status: "Processing", invoice: "INV-2026-082" },
      { id: "PAY-5013", date: "2026-08-21", amount: 105600, method: "HDFC Bank (****4910)", status: "Scheduled", invoice: "INV-2026-083" }
    ],
    payoutMethods: [
      { id: "pm-1", type: "Bank Account", title: "HDFC Priority Business", details: "A/C: ****4910 • IFSC: HDFC000124", isPrimary: true },
      { id: "pm-2", type: "UPI", title: "Unified Payments Interface", details: "srushti@okaxis", isPrimary: false },
      { id: "pm-3", type: "Stripe", title: "International Direct Deposit", details: "acct_1NZxxxxxxx (USD / EUR)", isPrimary: false }
    ]
  },
  confirmationLogs: [
    {
      id: "NOTIF-101",
      reservationId: "RES-99812",
      guestName: "Vikram & Ananya Sengupta",
      guestEmail: "vikram.s@gmail.com",
      guestPhone: "+91 98201 54321",
      propertyTitle: "Villa Solarium Infinity Pool & Ocean Cove",
      type: "Email & SMS",
      template: "Royal Welcome & Keyless Access",
      sentAt: "Aug 10, 2026, 11:16 AM",
      status: "Delivered",
      accessCode: "VS-8942#"
    },
    {
      id: "NOTIF-102",
      reservationId: "RES-99805",
      guestName: "David & Maya Miller",
      guestEmail: "david.m@yahoo.com",
      guestPhone: "+1 415 890 2311",
      propertyTitle: "Himalayan Cedar Chalet & Glass Observatory",
      type: "Email Voucher",
      template: "Standard Booking Voucher & Invoice",
      sentAt: "Jul 28, 2026, 4:30 PM",
      status: "Delivered",
      accessCode: "HC-4410#"
    },
    {
      id: "NOTIF-103",
      reservationId: "RES-99790",
      guestName: "Sophie Chen",
      guestEmail: "sophie.c@techsg.com",
      guestPhone: "+65 9123 4567",
      propertyTitle: "Villa Solarium Infinity Pool & Ocean Cove",
      type: "Email & SMS",
      template: "Royal Welcome & Keyless Access",
      sentAt: "Jul 12, 2026, 2:05 PM",
      status: "Delivered",
      accessCode: "VS-1200#"
    }
  ]
};

export const hostService = {
  getData: () => {
    try {
      const stored = localStorage.getItem(HOST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.profile) {
          parsed.profile.name = "Srushti Salunke";
          parsed.profile.email = "srushti.salunke@reservo.com";
        }
        if (!parsed.confirmationLogs) {
          parsed.confirmationLogs = INITIAL_HOST_DATA.confirmationLogs;
        }
        if (parsed.reservations) {
          parsed.reservations = parsed.reservations.map(res => {
            const initialMatch = INITIAL_HOST_DATA.reservations.find(r => r.id === res.id);
            return {
              ...res,
              accessCode: res.accessCode || initialMatch?.accessCode || `VS-${Math.floor(1000 + Math.random() * 9000)}#`,
              confirmationSent: res.confirmationSent || initialMatch?.confirmationSent || {
                email: res.status !== "Pending Approval",
                message: res.status === "Upcoming" || res.status === "Completed",
                emailSentAt: res.status !== "Pending Approval" ? "Aug 10, 2026, 11:15 AM" : null,
                messageSentAt: (res.status === "Upcoming" || res.status === "Completed") ? "Aug 10, 2026, 11:16 AM" : null
              }
            };
          });
        }
        return parsed;
      }
    } catch (e) {
      console.error("Error loading host data from storage:", e);
    }
    localStorage.setItem(HOST_STORAGE_KEY, JSON.stringify(INITIAL_HOST_DATA));
    return INITIAL_HOST_DATA;
  },

  saveData: (data) => {
    try {
      localStorage.setItem(HOST_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event("reservo-host-data-updated"));
    } catch (e) {
      console.error("Error saving host data:", e);
    }
  },

  addListing: (newListing) => {
    const data = hostService.getData();
    const listingWithId = {
      ...newListing,
      id: `host-prop-${Date.now()}`,
      status: "Active",
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };
    data.listings = [listingWithId, ...data.listings];
    hostService.saveData(data);
    return listingWithId;
  },

  updateListingStatus: (listingId, newStatus) => {
    const data = hostService.getData();
    data.listings = data.listings.map(item => 
      item.id === listingId ? { ...item, status: newStatus } : item
    );
    hostService.saveData(data);
    return data.listings;
  },

  updateListingPrice: (listingId, newPrice) => {
    const data = hostService.getData();
    data.listings = data.listings.map(item => 
      item.id === listingId ? { ...item, pricePerNight: Number(newPrice) } : item
    );
    hostService.saveData(data);
    return data.listings;
  },

  toggleInstantBook: (listingId) => {
    const data = hostService.getData();
    data.listings = data.listings.map(item => 
      item.id === listingId ? { ...item, instantBook: !item.instantBook } : item
    );
    hostService.saveData(data);
    return data.listings;
  },

  approveReservation: (resId) => {
    const data = hostService.getData();
    data.reservations = data.reservations.map(res => 
      res.id === resId ? { ...res, status: "Upcoming", paymentStatus: "Escrow Secured" } : res
    );
    hostService.saveData(data);
    return data.reservations;
  },

  declineReservation: (resId) => {
    const data = hostService.getData();
    data.reservations = data.reservations.map(res => 
      res.id === resId ? { ...res, status: "Cancelled", paymentStatus: "Refunded to Guest" } : res
    );
    hostService.saveData(data);
    return data.reservations;
  },

  updateStayStatus: (resId, newStatus) => {
    const data = hostService.getData();
    data.reservations = data.reservations.map(res => 
      res.id === resId ? { ...res, status: newStatus } : res
    );
    hostService.saveData(data);
    return data.reservations;
  },

  toggleDateBlock: (listingId, dateStr) => {
    const data = hostService.getData();
    if (!data.blockedDates[listingId]) {
      data.blockedDates[listingId] = [];
    }
    const exists = data.blockedDates[listingId].includes(dateStr);
    if (exists) {
      data.blockedDates[listingId] = data.blockedDates[listingId].filter(d => d !== dateStr);
    } else {
      data.blockedDates[listingId].push(dateStr);
    }
    hostService.saveData(data);
    return data.blockedDates[listingId];
  },

  setCustomPriceForDate: (listingId, dateStr, price) => {
    const data = hostService.getData();
    if (!data.customPricing[listingId]) {
      data.customPricing[listingId] = {};
    }
    if (price <= 0 || price === null) {
      delete data.customPricing[listingId][dateStr];
    } else {
      data.customPricing[listingId][dateStr] = Number(price);
    }
    hostService.saveData(data);
    return data.customPricing[listingId];
  },

  replyToReview: (reviewId, replyText) => {
    const data = hostService.getData();
    data.reviews = data.reviews.map(rev => 
      rev.id === reviewId ? { ...rev, response: replyText } : rev
    );
    hostService.saveData(data);
    return data.reviews;
  },

  sendMessage: (threadId, text) => {
    const data = hostService.getData();
    data.messages = data.messages.map(thread => {
      if (thread.id === threadId) {
        const newMsg = {
          sender: "host",
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...thread,
          lastMessage: text,
          lastTime: "Just now",
          unread: false,
          history: [...thread.history, newMsg]
        };
      }
      return thread;
    });
    hostService.saveData(data);
    return data.messages;
  },

  addPayoutMethod: (method) => {
    const data = hostService.getData();
    const newMethod = {
      id: `pm-${Date.now()}`,
      ...method,
      isPrimary: data.financials.payoutMethods.length === 0
    };
    data.financials.payoutMethods.push(newMethod);
    hostService.saveData(data);
    return data.financials.payoutMethods;
  },

  sendBookingConfirmation: (reservationId, options = {}) => {
    const { 
      sendEmail = true, 
      sendMessage = true, 
      templateTitle = "Royal Welcome & Keyless Access", 
      customNote = "", 
      accessCode = "" 
    } = options;

    const data = hostService.getData();
    const nowStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + 
                   " at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let targetReservation = null;

    data.reservations = data.reservations.map(res => {
      if (res.id === reservationId) {
        targetReservation = res;
        const currentConfirmation = res.confirmationSent || {};
        const assignedCode = accessCode || res.accessCode || `VS-${Math.floor(1000 + Math.random() * 9000)}#`;
        return {
          ...res,
          accessCode: assignedCode,
          confirmationSent: {
            email: sendEmail ? true : currentConfirmation.email || false,
            message: sendMessage ? true : currentConfirmation.message || false,
            emailSentAt: sendEmail ? nowStr : currentConfirmation.emailSentAt || null,
            messageSentAt: sendMessage ? nowStr : currentConfirmation.messageSentAt || null,
            lastTemplate: templateTitle
          }
        };
      }
      return res;
    });

    if (targetReservation) {
      let typeLabel = "Email Voucher";
      if (sendEmail && sendMessage) typeLabel = "Email & SMS";
      else if (sendMessage) typeLabel = "SMS / In-App Message";

      const finalCode = accessCode || targetReservation.accessCode || "VS-8942#";

      const newLog = {
        id: `NOTIF-${Date.now()}`,
        reservationId: targetReservation.id,
        guestName: targetReservation.guest?.name || "Valued Guest",
        guestEmail: targetReservation.guest?.email || "",
        guestPhone: targetReservation.guest?.phone || "",
        propertyTitle: targetReservation.listingTitle || "Luxury Stay",
        type: typeLabel,
        template: templateTitle,
        sentAt: nowStr,
        status: "Delivered",
        accessCode: finalCode
      };

      if (!data.confirmationLogs) data.confirmationLogs = [];
      data.confirmationLogs = [newLog, ...data.confirmationLogs];

      if (sendMessage) {
        const matchingThread = data.messages?.find(m => m.reservationId === targetReservation.id);
        const confirmMsgText = `✨ Booking Confirmation Dispatched!\nDear ${targetReservation.guest?.name?.split(" ")[0] || "Guest"}, your stay at ${targetReservation.listingTitle} (${targetReservation.dates?.checkIn} to ${targetReservation.dates?.checkOut}) is confirmed and fully paid. Your keyless access code is ${finalCode}.${customNote ? `\nHost Note: "${customNote}"` : ""}`;

        if (matchingThread) {
          data.messages = data.messages.map(thread => {
            if (thread.id === matchingThread.id) {
              const newMsg = {
                sender: "host",
                text: confirmMsgText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              return {
                ...thread,
                lastMessage: "✨ Booking Confirmation Dispatched",
                lastTime: "Just now",
                unread: false,
                history: [...thread.history, newMsg]
              };
            }
            return thread;
          });
        }
      }
    }

    hostService.saveData(data);
    return data;
  },

  resetToDefault: () => {
    localStorage.setItem(HOST_STORAGE_KEY, JSON.stringify(INITIAL_HOST_DATA));
    window.dispatchEvent(new Event("reservo-host-data-updated"));
    return INITIAL_HOST_DATA;
  }
};
