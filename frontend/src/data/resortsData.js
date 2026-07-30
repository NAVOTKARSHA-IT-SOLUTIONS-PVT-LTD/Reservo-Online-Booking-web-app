export const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: 'Sparkles' },
  { id: 'beach', label: 'Beach Resorts', icon: 'Waves' },
  { id: 'mountain', label: 'Mountain Retreats', icon: 'Mountain' },
  { id: 'chalet', label: 'Forest Chalets', icon: 'Trees' },
  { id: 'villa', label: 'Luxury Villas', icon: 'Home' },
  { id: 'cabin', label: 'Rustic Cabins', icon: 'Tent' },
  { id: 'glamping', label: 'Glamping Stays', icon: 'Flame' },
  { id: 'island', label: 'Private Islands', icon: 'Palmtree' },
  { id: 'eco', label: 'Eco Camping', icon: 'Compass' }
];

export const RESORTS = [
  {
    id: 'goa-coastline',
    name: 'Goa Coastline Luxury Sanctuary',
    category: 'beach',
    categoryLabel: 'Beach Resorts',
    location: 'West Coast, India',
    region: 'Goa',
    rating: 4.9,
    reviewsCount: 128,
    price: 8000,
    currency: '₹',
    badge: 'Trending Stay',
    heroImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse yourself in coastal elegance. Nestled along Goa’s quietest private cove, this resort pairs barefoot luxury with cutting-edge AI concierge service. Wake up to ocean breezes, unwind in your private infinity pool, and enjoy Michelin-crafted seafood dining.',
    highlights: ['Private Beach Access', 'Infinity Edge Pool', 'Aura Ayurvedic Spa', 'Personal AI Butler', 'Private Helipad Access'],
    specs: {
      guests: '2-4 Guests',
      bedrooms: '1-2 Bedrooms',
      bathrooms: '2 En-suite Baths',
      area: '1,450 sq.ft.',
      checkIn: '3:00 PM',
      checkOut: '11:00 AM'
    },
    amenities: [
      { name: 'Private Plunge Pool', icon: 'Waves' },
      { name: 'Aura Luxury Spa', icon: 'Sparkles' },
      { name: 'Oceanfront Dining', icon: 'Utensils' },
      { name: '24/7 Rivo Concierge', icon: 'Bot' },
      { name: 'High-Speed Wi-Fi 6', icon: 'Wifi' },
      { name: 'Cocktail Bar & Lounge', icon: 'Wine' },
      { name: 'Helipad Transfers', icon: 'Navigation' },
      { name: 'Scuba & Jet Ski Center', icon: 'Compass' }
    ],
    roomTypes: [
      {
        id: 'deluxe-ocean',
        title: 'Ocean View Deluxe Suite',
        price: 8000,
        size: '850 sq.ft',
        capacity: '2 Guests',
        features: ['King Bed', 'Private Balcony', 'Ocean View', 'Rivo Smart Hub']
      },
      {
        id: 'beach-villa',
        title: 'Beachfront Villa with Plunge Pool',
        price: 14500,
        size: '1,450 sq.ft',
        capacity: '4 Guests',
        features: ['Direct Beach Access', 'Private Heated Pool', 'Outdoor Rain Shower', 'Dedicated AI Butler']
      },
      {
        id: 'royal-sanctuary',
        title: 'Royal Overwater Sanctuary',
        price: 24000,
        size: '2,200 sq.ft',
        capacity: '6 Guests',
        features: ['360° Ocean Views', 'Jacuzzi Suite', 'Private Dining Pavilion', 'Chauffeur & Helipad Transfer']
      }
    ],
    mapPoints: [
      {
        id: 'p1',
        title: 'Oceanfront Sunset Villas',
        category: 'accommodation',
        x: 28,
        y: 65,
        status: 'Available',
        walkTime: '0 min (On-site)',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        desc: 'Overwater and beachside private suites featuring temperature-controlled plunge pools and panoramic sunset views.'
      },
      {
        id: 'p2',
        title: 'Infinity Sky Pool & Sun Lounge',
        category: 'leisure',
        x: 48,
        y: 42,
        status: 'Open 6 AM - 11 PM',
        walkTime: '2 min walk',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
        desc: 'Tiered multi-level infinity pool looking out into the Arabian Sea with plush cabanas and swim-up bar.'
      },
      {
        id: 'p3',
        title: 'Aura Hydrotherapy & Ayurvedic Spa',
        category: 'wellness',
        x: 72,
        y: 35,
        status: 'Appointments Open',
        walkTime: '4 min walk',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        desc: 'Holistic healing sanctuary offering custom sound bath treatments, hot stone therapy, and herbal wraps.'
      },
      {
        id: 'p4',
        title: 'The Coral Michelin Fine Dining',
        category: 'dining',
        x: 58,
        y: 72,
        status: 'Dinner Reservations Open',
        walkTime: '3 min walk',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
        desc: 'Farm-to-ocean dining featuring world-renowned chefs, wine pairings, and romantic candlelit beachfront tables.'
      },
      {
        id: 'p5',
        title: 'Rivo AI Concierge & Executive Lounge',
        category: 'service',
        x: 35,
        y: 30,
        status: 'Active 24/7',
        walkTime: '1 min walk',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        desc: 'Central lobby and tech-enabled hub for instant bookings, luggage care, excursion planning, and Rivo assistance.'
      },
      {
        id: 'p6',
        title: 'Private Helipad & Yacht Dock',
        category: 'transport',
        x: 85,
        y: 80,
        status: 'On Demand',
        walkTime: '6 min walk',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
        desc: 'Direct helipad for swift aerial transfers and private luxury yacht charters for sunset cruises.'
      }
    ]
  },
  {
    id: 'kerala-backwaters',
    name: 'Kerala Backwaters Estate',
    category: 'villa',
    categoryLabel: 'Luxury Villas',
    location: 'South Coast, India',
    region: 'Kerala',
    rating: 4.9,
    reviewsCount: 96,
    price: 9000,
    currency: '₹',
    badge: 'Popular Choice',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Surround yourself with calm waters and tropical palm canopies. The Kerala Backwaters Estate merges classic heritage Kerala architecture with modern luxury comforts, private floating houseboats, and serene lake views.',
    highlights: ['Private Houseboat Cruise', 'Lakefront Infinity Pool', 'Panchakarma Spa', 'Organic Spice Garden'],
    specs: {
      guests: '2-5 Guests',
      bedrooms: '2 Bedrooms',
      bathrooms: '2 Baths',
      area: '1,800 sq.ft.',
      checkIn: '2:00 PM',
      checkOut: '11:00 AM'
    },
    amenities: [
      { name: 'Private Lake Cruise', icon: 'Waves' },
      { name: 'Ayurvedic Treatment', icon: 'Sparkles' },
      { name: 'Lakefront Dining', icon: 'Utensils' },
      { name: 'Rivo Concierge', icon: 'Bot' }
    ],
    roomTypes: [
      {
        id: 'lake-villa',
        title: 'Heritage Lake Villa',
        price: 9000,
        size: '1,100 sq.ft',
        capacity: '2 Guests',
        features: ['Veranda Lake View', 'Teakwood Furnishings', 'Private Jacuzzi']
      },
      {
        id: 'royal-houseboat',
        title: 'Royal Floating Houseboat Suite',
        price: 15000,
        size: '1,600 sq.ft',
        capacity: '4 Guests',
        features: ['Full Floating Crew', 'Private Chef onboard', 'Sunset Lounge']
      }
    ],
    mapPoints: [
      {
        id: 'kp1',
        title: 'Heritage Lakefront Villas',
        category: 'accommodation',
        x: 35,
        y: 50,
        status: 'Available',
        walkTime: '0 min',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
        desc: 'Traditional wood-carved luxury cottages surrounded by reflective lotus ponds.'
      },
      {
        id: 'kp2',
        title: 'Ayurvedic Healing Center',
        category: 'wellness',
        x: 65,
        y: 40,
        status: 'Open Daily',
        walkTime: '3 min walk',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        desc: 'Traditional Kerala massage, yoga sessions at dawn, and organic herbal oils.'
      }
    ]
  },
  {
    id: 'udaipur-palace',
    name: 'Udaipur Royal Palace Sanctuary',
    category: 'villa',
    categoryLabel: 'Luxury Villas',
    location: 'Lake Pichola, Rajasthan',
    region: 'Udaipur',
    rating: 5.0,
    reviewsCount: 210,
    price: 18500,
    currency: '₹',
    badge: 'Ultra Luxury',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Experience royal treatment fit for kings. Surrounded by Lake Pichola, this heritage palace features handcrafted marble arches, royal courtyards, live Sitar performances, and gold-leaf dining.',
    highlights: ['Royal Butler Service', 'Boat Arrival Experience', 'Private Courtyard Pool', 'Royal Spa Suites'],
    specs: {
      guests: '2-4 Guests',
      bedrooms: '1-2 Royal Suites',
      bathrooms: '2 Marble Baths',
      area: '2,500 sq.ft.',
      checkIn: '2:00 PM',
      checkOut: '12:00 PM'
    },
    amenities: [
      { name: 'Royal Butler', icon: 'Bot' },
      { name: 'Private Boat Charter', icon: 'Waves' },
      { name: 'Palace Dining', icon: 'Utensils' }
    ],
    roomTypes: [
      {
        id: 'royal-suite',
        title: 'Maharaja Lake View Suite',
        price: 18500,
        size: '1,500 sq.ft',
        capacity: '2 Guests',
        features: ['Intricate Carved Balcony', 'Gold Inlay Bathroom', 'Royal Dining']
      }
    ],
    mapPoints: [
      {
        id: 'up1',
        title: 'Maharaja Palace Wing',
        category: 'accommodation',
        x: 45,
        y: 45,
        status: 'Available',
        walkTime: '0 min',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        desc: 'Historic palace rooms preserved with royal antiques and high vaulted ceilings.'
      }
    ]
  },
  {
    id: 'himalayan-chalet',
    name: 'Himalayan Pine Forest Chalet',
    category: 'mountain',
    categoryLabel: 'Mountain Retreats',
    location: 'North Hills, Himachal',
    region: 'Manali',
    rating: 4.8,
    reviewsCount: 84,
    price: 11200,
    currency: '₹',
    badge: 'Mountain Refuge',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Perched among majestic pine forests and snow-capped peaks, this mountain chalet offers cozy stone fireplaces, outdoor heated jacuzzis, and stargazing glass domes.',
    highlights: ['Heated Outdoor Jacuzzi', 'Stone Fireplaces', 'Guided Alpine Treks', 'Glass Stargazing Dome'],
    specs: {
      guests: '2-6 Guests',
      bedrooms: '2 Alpine Bedrooms',
      bathrooms: '2 Cedar Baths',
      area: '1,650 sq.ft.',
      checkIn: '2:00 PM',
      checkOut: '11:00 AM'
    },
    amenities: [
      { name: 'Heated Jacuzzi', icon: 'Waves' },
      { name: 'Fireplace', icon: 'Flame' },
      { name: 'Star Observatory', icon: 'Sparkles' }
    ],
    roomTypes: [
      {
        id: 'alpine-suite',
        title: 'Pine Panorama Chalet',
        price: 11200,
        size: '1,200 sq.ft',
        capacity: '2 Guests',
        features: ['Fireplace', 'Glass Stargazing Roof', 'Cedar Wood Hot Tub']
      }
    ],
    mapPoints: [
      {
        id: 'hp1',
        title: 'Pine Treehouse Suites',
        category: 'accommodation',
        x: 50,
        y: 50,
        status: 'Available',
        walkTime: '0 min',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        desc: 'Elevated wooden chalets nestled right in the pine forest canopy.'
      }
    ]
  },
  {
    id: 'maldives-overwater',
    name: 'Baa Atoll Overwater Sanctuary',
    category: 'island',
    categoryLabel: 'Private Islands',
    location: 'Baa Atoll, Maldives',
    region: 'Maldives',
    rating: 5.0,
    reviewsCount: 315,
    price: 32000,
    currency: '₹',
    badge: 'World Top 10',
    heroImage: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Suspended above crystal turquoise ocean waters, each villa features glass floor viewing panels, slide to ocean, private infinity pool, and round-the-clock butler service.',
    highlights: ['Glass Floor Viewing', 'Ocean Slide', 'Private Lagoon', 'Underwater Restaurant Access'],
    specs: {
      guests: '2-4 Guests',
      bedrooms: '1 Villa',
      bathrooms: '2 Baths',
      area: '2,100 sq.ft.',
      checkIn: '3:00 PM',
      checkOut: '12:00 PM'
    },
    amenities: [
      { name: 'Lagoon Pool', icon: 'Waves' },
      { name: 'Underwater Dining', icon: 'Utensils' },
      { name: 'Personal Butler', icon: 'Bot' }
    ],
    roomTypes: [
      {
        id: 'maldives-villa',
        title: 'Sunset Overwater Villa',
        price: 32000,
        size: '2,100 sq.ft',
        capacity: '2 Guests',
        features: ['Private Infinity Pool', 'Ocean Water Slide', 'Glass Floor Panel']
      }
    ],
    mapPoints: [
      {
        id: 'mp1',
        title: 'Overwater Villa Boardwalk',
        category: 'accommodation',
        x: 40,
        y: 60,
        status: 'Available',
        walkTime: '0 min',
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=600&q=80',
        desc: 'Iconic curved boardwalk connecting private luxury villas over turquoise reefs.'
      }
    ]
  }
];

export const RIVO_QUICK_PROMPTS = [
  '🌴 Find beach resorts under ₹10,000',
  '🗺️ Take me to Goa Resort Interactive Map',
  '✨ Show luxury villas with private pools',
  '🛎️ Help me book Goa Coastline Suite'
];
