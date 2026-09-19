import { secureStorage } from "./secureStorage";

const STORAGE_KEY = "reservo_blogs";

export const BLOG_CATEGORIES = [
  { id: "all", label: "All Stories" },
  { id: "coastal", label: "Beach & Coastal" },
  { id: "mountains", label: "Mountains & Hills" },
  { id: "heritage", label: "Heritage & Palaces" },
  { id: "wellness", label: "Wellness & Spa" },
  { id: "guides", label: "Curator Guides" },
  { id: "culinary", label: "Culinary Escapes" },
];

export const PRESET_COVER_IMAGES = [
  {
    label: "Goa Beachfront Villa",
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    category: "coastal",
  },
  {
    label: "Himalayan Alpine Chalet",
    url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    category: "mountains",
  },
  {
    label: "Udaipur Royal Lakeside",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    category: "heritage",
  },
  {
    label: "Kerala Backwater Houseboat",
    url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    category: "wellness",
  },
  {
    label: "Coorg Mist Coffee Plantation",
    url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    category: "mountains",
  },
  {
    label: "Andaman Private Cove",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    category: "coastal",
  },
];

const INITIAL_BLOGS = [
  {
    id: "blog-1",
    title: "Hidden Jewels of South Goa: Beyond the Beaches to Coastal Heritage",
    slug: "hidden-jewels-of-south-goa",
    category: "coastal",
    categoryLabel: "Beach & Coastal",
    author: {
      name: "Aarav Deshmukh",
      role: "Chief Luxury Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    },
    date: "Sep 12, 2026",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Discover quiet palm-fringed lagoons, 400-year-old Portuguese mansions, and private beach villas where time slows down to the rhythm of ocean swells.",
    content: `When travelers think of Goa, vibrant beachfront shacks and bustling night markets often take center stage. Yet, along the gentle curves of South Goa lies an entirely different dimension of luxury—one defined by silence, architectural grandeur, and virgin sands.

### 1. The Heritage Mansions of Chandor
Step inland away from the coastline and you encounter aristocratic palatial homes dating back to the 16th century. Grand ballrooms adorned with Belgian crystal chandeliers, polished rosewood furniture, and hidden courtyards narrate the confluence of Goan and Portuguese aristocracy.

### 2. Private Beach Coves of Canacona
Further south, secluded strips like Butterfly Beach and Cola Beach offer true natural exclusivity. Nestled between emerald cliffs, Cola features a natural freshwater lagoon running parallel to the turquoise sea—a breathtaking sanctuary best experienced from a cliffside luxury tent or eco-suite.

### 3. Curated Gastronomy
Culinary travel in South Goa is reaching new heights. Heritage boutique villas now host private chef degustations, reviving centuries-old Saraswat and Indo-Portuguese recipes featuring slow-simmered balchão and coconut-fennel infused seafood, paired with rare reserve wines under lantern-lit banyan groves.`,
    tags: ["Goa", "Coastal", "Heritage", "Luxury Villas"],
    likes: 124,
    isLiked: false,
    featured: true,
  },
  {
    id: "blog-2",
    title: "High-Altitude Solitude: The Architecture of Himalayan Alpine Chalets",
    slug: "architecture-of-himalayan-alpine-chalets",
    category: "mountains",
    categoryLabel: "Mountains & Hills",
    author: {
      name: "Meera Sen",
      role: "Architectural Travel Writer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
    },
    date: "Sep 08, 2026",
    readTime: "7 min read",
    coverImage: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    excerpt: "How traditional Kath-Kuni timber construction is being reimagined into ultra-modern mountain hideaways overlooking snow-dusted pine forests.",
    content: `Perched at 8,500 feet above sea level, modern mountain hospitality is undergoing a quiet renaissance. The alpine chalets rising in Solang Valley, Manali, and Shimla are no longer just shelters against cold—they are triumphs of ecological design and mindful opulence.

### The Revival of Kath-Kuni Architecture
Kath-Kuni, meaning 'wood and corner', is an indigenous masonry technique that interlocks cedar beams with heavy river stones without cement or mortar. This ingenious design yields natural seismic resilience and passive thermal insulation, keeping interiors warm during sub-zero winters.

### Floor-to-Ceiling Glazed Vistas
Modern architects have blended this centuries-old technique with triple-glazed heated glass facades. Guests awake to 180-degree panoramic sweeps of the Pir Panjal mountain range right from their plush goose-down duvets, complete with roaring stone fireplaces and heated slate bathroom floors.

### Forest Foraging & Stargazing
The luxury alpine experience extends far beyond the bedroom. Private stargazing telescopes on cedar decks, guided forest foraging for wild morels and pine mushrooms, and evening fireside cider tastings offer intimate connections with the pristine mountain wilderness.`,
    tags: ["Manali", "Himalayas", "Architecture", "Mountain Chalets"],
    likes: 98,
    isLiked: false,
    featured: false,
  },
  {
    id: "blog-3",
    title: "Udaipur by Water: Royalty, Floating Palaces, and Lake Pichola Evenings",
    slug: "udaipur-royalty-floating-palaces",
    category: "heritage",
    categoryLabel: "Heritage & Palaces",
    author: {
      name: "Vikramaditya Rathore",
      role: "Heritage Historian",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    },
    date: "Aug 29, 2026",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    excerpt: "An intimate insider look into the royal hospitality of Rajasthan's City of Lakes, where every archway and jharokha tells an imperial story.",
    content: `There are few sights in the world that rival Lake Pichola at sunset, as the amber sun dips behind the Aravali mountains, casting a liquid-gold glow across marble domes and floating palaces.

### Living Like Royalty
In Udaipur, luxury is steeped in royal lineage. Heritage havelis converted into premier boutique retreats greet guests with ceremonial rose petals, live sitar melodies, and refreshing thandai served in silver goblets. The intricate jali stone carvings and mirror-work thikri art reflect centuries of royal Mewari patronage.

### Sunset Shikara Rides
To truly understand Udaipur, you must view it from the water. A private mahogany boat charter gliding across Lake Pichola past the Jag Mandir island palace reveals the fortress walls in majestic perspective. As dusk settles, thousands of warm brass lanterns illuminate the lake's rim, transforming the water into an enchanting wonderland.`,
    tags: ["Udaipur", "Rajasthan", "Heritage", "Palaces", "Romance"],
    likes: 156,
    isLiked: false,
    featured: false,
  },
  {
    id: "blog-4",
    title: "Ayurveda & Slow Living: Rejuvenating Among Kerala's Backwaters",
    slug: "ayurveda-slow-living-kerala-backwaters",
    category: "wellness",
    categoryLabel: "Wellness & Spa",
    author: {
      name: "Dr. Suniti Nair",
      role: "Wellness Consultant & Author",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    },
    date: "Aug 15, 2026",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    excerpt: "How traditional Ayurvedic panchakarma therapies and serene backwater houseboats form the ultimate holistic wellness sanctuary.",
    content: `In a world inundated with constant notifications and urban rush, the slow, rhythmic lap of water against a teak wood hull in Alleppey is an antidote like no other.

### The Philosophy of Panchakarma
Kerala is the cradle of classical Ayurveda. Retreats here focus on personalized diagnostic consultations with Vaidyas (Ayurvedic physicians) who curate bespoke treatment regimens. From Abhyanga warm herbal oil massages to Shirodhara forehead oil flow, therapies are designed to eliminate systemic fatigue and restore inner balance.

### Living on the Water
Luxury houseboats—kettuvallams crafted without a single iron nail—glide through emerald canals flanked by swaying paddy fields and coconut groves. Dine on organic garden-fresh meals prepared over open clay fires, practice sunrise yoga on teak sundecks, and allow the gentle pace of the backwaters to recalibrate your mind.`,
    tags: ["Kerala", "Ayurveda", "Wellness", "Houseboats"],
    likes: 82,
    isLiked: false,
    featured: false,
  },
  {
    id: "blog-5",
    title: "The Ultimate Guide to Packing for Luxury Monsoon Retreats in India",
    slug: "packing-guide-luxury-monsoon-retreats",
    category: "guides",
    categoryLabel: "Curator Guides",
    author: {
      name: "Rivo Editorial Team",
      role: "Reservo Curators",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
    },
    date: "Aug 02, 2026",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Expert recommendations on apparel, waterproof footwear, photography gear, and essentials for traveling through lush mist and monsoon magic.",
    content: `The Indian monsoon transforms hills into vibrant green wonderlands and fills rainforest valleys with misty romance. From the coffee estates of Coorg and Wayanad to the waterfalls of Lonavala, traveling during the rains is an unforgettable sensory experience—provided you are thoughtfully prepared.

### 1. Breathable, Quick-Drying Linens
Humidity during monsoon can make heavy fabrics uncomfortable. Opt for pure linen shirts, moisture-wicking organic cotton, and water-repellent windbreakers with taped seams.

### 2. High-Traction Footwear
Cobblestone paths and rain-kissed forest trails demand footwear with vibram grip outsoles. Bring along waterproof hiking sandals or silicone-sealed boots for nature excursions.

### 3. Gear Protection
Keep your camera and electronics safe with sealed dry bags and silica gel packets. A portable camera rain cover lets you capture dramatic mist clouds and cascading waterfalls without fear of condensation damage.`,
    tags: ["Monsoon", "Packing Guide", "Coorg", "Travel Tips"],
    likes: 67,
    isLiked: false,
    featured: false,
  },
];

export const blogService = {
  getAllBlogs() {
    try {
      const stored = secureStorage.getItem(STORAGE_KEY);
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
      secureStorage.setItem(STORAGE_KEY, INITIAL_BLOGS);
      return INITIAL_BLOGS;
    } catch (e) {
      console.warn("Failed to retrieve blogs from secureStorage, using fallback:", e);
      return INITIAL_BLOGS;
    }
  },

  getBlogById(id) {
    const blogs = this.getAllBlogs();
    return blogs.find((b) => String(b.id) === String(id)) || null;
  },

  addBlog(blogData) {
    const blogs = this.getAllBlogs();
    const wordCount = (blogData.content || "").trim().split(/\s+/).length;
    const computedReadTime = `${Math.max(1, Math.ceil(wordCount / 180))} min read`;

    const newBlog = {
      id: `blog-${Date.now()}`,
      title: blogData.title.trim(),
      slug: (blogData.title || "story")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      category: blogData.category || "coastal",
      categoryLabel:
        BLOG_CATEGORIES.find((c) => c.id === blogData.category)?.label ||
        "Travel Story",
      author: {
        name: blogData.authorName || "Reservo Traveler",
        role: blogData.authorRole || "Guest Contributor",
        avatar:
          blogData.authorAvatar ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
      },
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      readTime: blogData.readTime || computedReadTime,
      coverImage:
        blogData.coverImage ||
        PRESET_COVER_IMAGES[0].url,
      excerpt:
        blogData.excerpt?.trim() ||
        blogData.content?.slice(0, 160) + "...",
      content: blogData.content?.trim() || "",
      tags: Array.isArray(blogData.tags)
        ? blogData.tags
        : (blogData.tags || "Travel, Luxury")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      likes: 1,
      isLiked: true,
      featured: false,
      userId: blogData.userId || null,
    };

    const updated = [newBlog, ...blogs];
    try {
      secureStorage.setItem(STORAGE_KEY, updated);
      window.dispatchEvent(new Event("reservo_blogs_updated"));
    } catch (e) {
      console.error("Failed to save new blog:", e);
    }
    return newBlog;
  },

  toggleLikeBlog(id) {
    const blogs = this.getAllBlogs();
    const updated = blogs.map((b) => {
      if (String(b.id) === String(id)) {
        const isLiked = !b.isLiked;
        return {
          ...b,
          isLiked,
          likes: isLiked ? (b.likes || 0) + 1 : Math.max(0, (b.likes || 1) - 1),
        };
      }
      return b;
    });

    try {
      secureStorage.setItem(STORAGE_KEY, updated);
      window.dispatchEvent(new Event("reservo_blogs_updated"));
    } catch (e) {
      console.error("Failed to update blog like status:", e);
    }
    return updated;
  },

  deleteBlog(id) {
    const blogs = this.getAllBlogs();
    const updated = blogs.filter((b) => String(b.id) !== String(id));
    try {
      secureStorage.setItem(STORAGE_KEY, updated);
      window.dispatchEvent(new Event("reservo_blogs_updated"));
    } catch (e) {
      console.error("Failed to delete blog:", e);
    }
    return updated;
  },
};
