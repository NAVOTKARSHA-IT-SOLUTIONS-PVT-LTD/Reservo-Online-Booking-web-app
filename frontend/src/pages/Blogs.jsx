import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  PenSquare, 
  Search, 
  X, 
  Heart, 
  Share2, 
  Clock, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Trash2, 
  Check, 
  Image as ImageIcon,
  Tag,
  User,
  SlidersHorizontal,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { blogService, BLOG_CATEGORIES, PRESET_COVER_IMAGES } from "../services/blog.service";
import { authService } from "../services/auth.service";
import { useToast } from "../context/ToastContext";
import CustomDropdown from "../components/CustomDropdown";

export default function Blogs() {
  const navigate = useNavigate();
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // 'latest' | 'popular' | 'quick'
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Authentication state
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // New Blog Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("coastal");
  const [authorName, setAuthorName] = useState(currentUser?.name || currentUser?.displayName || "");
  const [coverImage, setCoverImage] = useState(PRESET_COVER_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("Luxury, Travel");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load blogs
  const loadBlogs = () => {
    const list = blogService.getAllBlogs();
    setBlogs(list);
  };

  useEffect(() => {
    loadBlogs();
    window.addEventListener("reservo_blogs_updated", loadBlogs);
    return () => window.removeEventListener("reservo_blogs_updated", loadBlogs);
  }, []);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        const matchesCategory = activeCategory === "all" || blog.category === activeCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          blog.title.toLowerCase().includes(q) ||
          blog.excerpt.toLowerCase().includes(q) ||
          blog.content.toLowerCase().includes(q) ||
          (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(q))) ||
          blog.author?.name?.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return (b.likes || 0) - (a.likes || 0);
        if (sortBy === "quick") {
          const timeA = parseInt(a.readTime, 10) || 5;
          const timeB = parseInt(b.readTime, 10) || 5;
          return timeA - timeB;
        }
        // latest: by ID or date
        return b.id.localeCompare(a.id);
      });
  }, [blogs, activeCategory, searchQuery, sortBy]);

  // Featured blog (first featured or first blog)
  const featuredBlog = useMemo(() => {
    return blogs.find((b) => b.featured) || blogs[0] || null;
  }, [blogs]);

  // Toggle like
  const handleToggleLike = (id, e) => {
    if (e) e.stopPropagation();
    blogService.toggleLikeBlog(id);
    if (selectedBlog && String(selectedBlog.id) === String(id)) {
      setSelectedBlog(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: !prev.isLiked ? (prev.likes || 0) + 1 : Math.max(0, (prev.likes || 1) - 1)
      }));
    }
  };

  // Delete blog
  const handleDeleteBlog = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this story?")) {
      blogService.deleteBlog(id);
      toast("Blog post removed successfully", "info");
      if (selectedBlog?.id === id) {
        setSelectedBlog(null);
      }
    }
  };

  // Guard write action for signed-in users only
  const handleOpenWriteModal = () => {
    if (!authService.isAuthenticated()) {
      toast("Please sign in to write and share your travel story.", "error");
      navigate("/login", { state: { from: "/blogs" } });
      return;
    }
    const user = authService.getCurrentUser();
    if (user?.name || user?.displayName) {
      setAuthorName(user.name || user.displayName);
    }
    setIsCreateModalOpen(true);
  };

  // Handle create submission
  const handlePublishBlog = (e) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) {
      toast("Please sign in to publish your travel story.", "error");
      setIsCreateModalOpen(false);
      navigate("/login", { state: { from: "/blogs" } });
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast("Please provide both a title and story content.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = authService.getCurrentUser();
      const finalImage = customImageUrl.trim() || coverImage;
      const finalAuthor = authorName.trim() || user?.name || user?.displayName || "Reservo Explorer";
      const newPost = blogService.addBlog({
        title,
        category,
        authorName: finalAuthor,
        authorRole: "Travel Enthusiast",
        authorAvatar: user?.avatar || user?.photoURL || undefined,
        userId: user?.id || user?.uid || user?.email || undefined,
        coverImage: finalImage,
        excerpt: excerpt.trim() || content.slice(0, 150) + "...",
        content,
        tags,
      });

      toast("Your story has been published to Reservo Chronicles!", "success");
      // Reset form
      setTitle("");
      setExcerpt("");
      setContent("");
      setCustomImageUrl("");
      setIsPreview(false);
      setIsCreateModalOpen(false);

      // Auto-open reader for the newly created post
      setSelectedBlog(newPost);
    } catch (err) {
      toast("Failed to publish blog post.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Share blog
  const handleShare = (blog, e) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/blogs#${blog.id}`);
      setIsCopied(true);
      toast("Story link copied to clipboard!", "success");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light text-text-dark font-sans transition-colors duration-300 pb-24">
      {/* ── HEADER BANNER ────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#0F223D] to-[#0D1B2A] text-white pt-24 pb-16 px-6 sm:px-10">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-teal-300">
              <Sparkles size={14} className="text-gold" /> Reservo Chronicles
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight">
              Stories of <span className="italic text-teal-300 font-serif">Sanctuary</span> & Wanderlust
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              Immerse yourself in hand-curated travel diaries, architectural spotlights, and luxury destination guides crafted by passionate explorers and curators.
            </p>
          </div>

          {/* Action: Write a Story Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3.5">
            <button
              onClick={handleOpenWriteModal}
              title={isAuthenticated ? "Write a travel story" : "Sign in to write a story"}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700 text-white font-bold text-sm shadow-[0_10px_25px_rgba(37,99,235,0.4)] flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer border-none"
            >
              {isAuthenticated ? <PenSquare size={17} /> : <Lock size={16} />} Write a Story
            </button>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-10">
        
        {/* ── SPOTLIGHT FEATURED STORY ────────────────── */}
        {featuredBlog && !searchQuery && activeCategory === "all" && (
          <div 
            onClick={() => setSelectedBlog(featuredBlog)}
            className="group relative rounded-3xl overflow-hidden bg-bg-white border border-border-color shadow-[0_20px_50px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-300 hover:shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 h-72 sm:h-96 lg:h-[460px] overflow-hidden relative">
                <img 
                  src={featuredBlog.coverImage} 
                  alt={featuredBlog.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles size={12} className="text-gold" /> Featured Story
                </div>
              </div>
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-bg-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-semibold text-text-gray">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold">
                      {featuredBlog.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {featuredBlog.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {featuredBlog.date}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-text-dark group-hover:text-primary transition-colors leading-snug">
                    {featuredBlog.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-text-gray leading-relaxed line-clamp-4">
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-border-color flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={featuredBlog.author?.avatar} 
                      alt={featuredBlog.author?.name}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover border border-border-color shadow-sm" 
                    />
                    <div>
                      <h4 className="text-xs font-bold text-text-dark leading-none">{featuredBlog.author?.name}</h4>
                      <span className="text-[11px] text-text-gray">{featuredBlog.author?.role}</span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-primary font-bold text-xs group-hover:translate-x-1 transition-transform">
                    Read Story <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SEARCH & FILTER CONTROLS ────────────────── */}
        <div className="bg-bg-white border border-border-color rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search travel stories, destinations, tags..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-bg-light border border-border-color text-xs font-medium text-text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-dark cursor-pointer bg-transparent border-none"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <span className="text-xs font-semibold text-text-gray">
                Showing <strong className="text-text-dark">{filteredBlogs.length}</strong> {filteredBlogs.length === 1 ? "story" : "stories"}
              </span>

              <div className="flex items-center gap-2">
                <CustomDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  icon={<SlidersHorizontal size={14} />}
                  options={[
                    { value: "latest", label: "Latest Stories" },
                    { value: "popular", label: "Most Liked" },
                    { value: "quick", label: "Quick Reads" },
                  ]}
                  align="right"
                  buttonClassName="!py-1.5 !px-3 !bg-bg-light !rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 hide-scrollbar">
            {BLOG_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-bg-light text-text-gray hover:text-text-dark border-border-color hover:border-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BLOGS GRID ──────────────────────────────── */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-bg-white border border-border-color rounded-3xl p-8 max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl">
              📖
            </div>
            <h3 className="text-lg font-bold text-text-dark">No Travel Stories Found</h3>
            <p className="text-xs text-text-gray leading-relaxed max-w-sm mx-auto">
              We couldn't find any articles matching "{searchQuery}". Try a different keyword or be the first to share an experience!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="px-4 py-2 rounded-xl bg-bg-light text-text-dark text-xs font-bold hover:bg-border-color border border-border-color cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                onClick={handleOpenWriteModal}
                title={isAuthenticated ? "Write a travel story" : "Sign in to write a story"}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary-dark cursor-pointer border-none flex items-center gap-1.5"
              >
                {isAuthenticated ? <PenSquare size={13} /> : <Lock size={13} />} + Write a Story
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="group bg-bg-white border border-border-color rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Category Pill */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-white/20">
                        {blog.categoryLabel}
                      </span>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={(e) => handleToggleLike(blog.id, e)}
                      className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 transition hover:scale-110 cursor-pointer ${
                        blog.isLiked ? "text-red-500" : "text-white"
                      }`}
                      aria-label="Like story"
                    >
                      <Heart size={16} className={blog.isLiked ? "fill-red-500" : ""} />
                    </button>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-text-gray">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {blog.readTime}
                      </span>
                      <span>•</span>
                      <span>{blog.date}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-text-dark group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-text-gray leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Tag Pills */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-bg-light text-[10px] font-semibold text-text-gray border border-border-color"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Author Bar */}
                <div className="px-5 sm:px-6 py-4 bg-bg-light/60 border-t border-border-color flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={blog.author?.avatar} 
                      alt={blog.author?.name}
                      loading="lazy"
                      className="w-7 h-7 rounded-full object-cover border border-border-color" 
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-text-dark leading-tight truncate max-w-[130px]">
                        {blog.author?.name}
                      </span>
                      <span className="text-[10px] text-text-gray truncate max-w-[130px]">
                        {blog.author?.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-text-gray">
                    <Heart size={14} className={blog.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
                    <span>{blog.likes || 0}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ── CREATE STORY MODAL ───────────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && isAuthenticated && (
          <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-bg-white border border-border-color rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col text-left"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border-color flex items-center justify-between bg-bg-light/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <PenSquare size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-dark">Write a Travel Story</h3>
                    <p className="text-[11px] text-text-gray">Share your travel diary or resort experience with the Reservo community.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-bg-light text-text-gray hover:text-text-dark flex items-center justify-center cursor-pointer border-none"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handlePublishBlog} className="p-6 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-dark uppercase tracking-wider">
                    Story Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., A Sunset Haven in Solang: Luxury Above the Clouds"
                    className="w-full px-4 py-3 rounded-2xl bg-bg-light border border-border-color text-sm font-semibold text-text-dark focus:outline-none focus:border-primary transition"
                  />
                </div>

                {/* Category & Author Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-dark uppercase tracking-wider">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                      value={category}
                      onChange={setCategory}
                      options={BLOG_CATEGORIES.filter((c) => c.id !== "all").map((cat) => ({
                        value: cat.id,
                        label: cat.label,
                      }))}
                      buttonClassName="!px-4 !py-3 !rounded-2xl !bg-bg-light text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-dark uppercase tracking-wider">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your name or pen name"
                      className="w-full px-4 py-3 rounded-2xl bg-bg-light border border-border-color text-xs font-semibold text-text-dark focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                {/* Cover Image Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-text-dark uppercase tracking-wider flex items-center justify-between">
                    <span>Cover Photo</span>
                    <span className="text-[11px] text-text-gray font-normal">Pick a luxury preset or enter a custom link</span>
                  </label>

                  {/* Preset Photos */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_COVER_IMAGES.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setCoverImage(preset.url);
                          setCustomImageUrl("");
                        }}
                        className={`relative rounded-xl overflow-hidden h-14 cursor-pointer border-2 transition ${
                          coverImage === preset.url && !customImageUrl
                            ? "border-primary scale-105 shadow-md"
                            : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        {coverImage === preset.url && !customImageUrl && (
                          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center text-white">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Custom URL Input */}
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste an image URL (https://...)"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-light border border-border-color text-xs font-medium text-text-dark focus:outline-none focus:border-primary transition"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-dark uppercase tracking-wider">
                    Short Excerpt / Teaser
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A brief 1-2 sentence hook summarizing your story..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-bg-light border border-border-color text-xs font-medium text-text-dark focus:outline-none focus:border-primary transition resize-none"
                  />
                </div>

                {/* Main Content Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text-dark uppercase tracking-wider">
                      Story Content <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPreview(!isPreview)}
                      className="text-[11px] font-bold text-primary hover:underline bg-transparent border-none cursor-pointer"
                    >
                      {isPreview ? "Edit Mode" : "Preview Formatting"}
                    </button>
                  </div>

                  {isPreview ? (
                    <div className="p-4 rounded-2xl bg-bg-light border border-border-color min-h-[160px] text-xs leading-relaxed text-text-dark whitespace-pre-line">
                      {content || "No content entered yet."}
                    </div>
                  ) : (
                    <textarea
                      rows={6}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your travel story here. Tip: Use paragraphs and headings (### Heading) to structure your journey..."
                      className="w-full px-4 py-3 rounded-2xl bg-bg-light border border-border-color text-xs font-normal text-text-dark focus:outline-none focus:border-primary transition"
                    />
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-dark uppercase tracking-wider">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., Goa, Beach, Infinity Pool, Sunset"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-light border border-border-color text-xs font-medium text-text-dark focus:outline-none focus:border-primary transition"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border-color flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-border-color text-text-dark text-xs font-bold hover:bg-bg-light cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-dark transition cursor-pointer border-none flex items-center gap-2"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Story"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ARTICLE READER MODAL ───────────────────────── */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-[10006] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Reader Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-4xl bg-bg-white border border-border-color rounded-3xl shadow-2xl overflow-hidden z-10 my-4 max-h-[92vh] flex flex-col text-left"
            >
              {/* Cover Image Banner */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-900">
                <img
                  src={selectedBlog.coverImage}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

                {/* Top Nav Buttons */}
                <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs font-bold cursor-pointer transition"
                  >
                    <ArrowLeft size={14} /> Back to Stories
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleShare(selectedBlog, e)}
                      className="w-8.5 h-8.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer transition"
                      title="Share story link"
                    >
                      {isCopied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                    </button>
                    <button
                      onClick={(e) => handleToggleLike(selectedBlog.id, e)}
                      className={`w-8.5 h-8.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer transition ${
                        selectedBlog.isLiked ? "text-red-500" : "text-white"
                      }`}
                      title="Like story"
                    >
                      <Heart size={14} className={selectedBlog.isLiked ? "fill-red-500" : ""} />
                    </button>
                    {/* Delete button if user story and signed in */}
                    {isAuthenticated &&
                      selectedBlog.id.startsWith("blog-") &&
                      parseInt(selectedBlog.id.replace("blog-", ""), 10) > 100 &&
                      (currentUser?.role === "ROLE_ADMIN" ||
                        !selectedBlog.userId ||
                        String(selectedBlog.userId) === String(currentUser?.id || currentUser?.uid || currentUser?.email)) && (
                      <button
                        onClick={(e) => handleDeleteBlog(selectedBlog.id, e)}
                        className="w-8.5 h-8.5 rounded-full bg-black/50 hover:bg-red-600/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer transition"
                        title="Delete story"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Meta Overlay */}
                <div className="absolute bottom-6 inset-x-6 z-10 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                      {selectedBlog.categoryLabel}
                    </span>
                    <span className="text-white/80 text-[11px] font-semibold flex items-center gap-1">
                      <Clock size={12} /> {selectedBlog.readTime}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-serif font-extrabold text-white leading-tight drop-shadow-md">
                    {selectedBlog.title}
                  </h1>
                </div>
              </div>

              {/* Reader Body Content */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
                {/* Author Info Bar */}
                <div className="flex items-center justify-between border-b border-border-color pb-5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={selectedBlog.author?.avatar}
                      alt={selectedBlog.author?.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-text-dark">{selectedBlog.author?.name}</h4>
                      <p className="text-xs text-text-gray">{selectedBlog.author?.role} • Published on {selectedBlog.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-text-gray">
                    <Heart size={16} className={selectedBlog.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
                    <span>{selectedBlog.likes || 0} Likes</span>
                  </div>
                </div>

                {/* Excerpt Lead Paragraph */}
                <div className="p-4 sm:p-5 rounded-2xl bg-bg-light border-l-4 border-primary text-xs sm:text-sm font-medium italic text-text-dark leading-relaxed">
                  "{selectedBlog.excerpt}"
                </div>

                {/* Formatted Content */}
                <div className="space-y-4 text-xs sm:text-sm text-text-dark leading-relaxed font-normal">
                  {selectedBlog.content.split("\n\n").map((paragraph, index) => {
                    const clean = paragraph.trim();
                    if (clean.startsWith("### ")) {
                      return (
                        <h3 key={index} className="text-base sm:text-lg font-serif font-bold text-text-dark pt-3">
                          {clean.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (clean.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-lg sm:text-xl font-serif font-bold text-text-dark pt-4">
                          {clean.replace("## ", "")}
                        </h2>
                      );
                    }
                    return (
                      <p key={index} className="leading-relaxed">
                        {clean}
                      </p>
                    );
                  })}
                </div>

                {/* Tags Footer */}
                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="pt-6 border-t border-border-color space-y-3">
                    <span className="text-xs font-bold text-text-gray uppercase tracking-wider flex items-center gap-1.5">
                      <Tag size={13} /> Exploration Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedBlog.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-bg-light border border-border-color text-xs font-semibold text-text-dark"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
