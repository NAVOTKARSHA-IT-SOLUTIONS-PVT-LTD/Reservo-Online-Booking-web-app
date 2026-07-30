import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, MapPin, CheckCircle2, Waves, Sparkles, Utensils, Bot, Wifi, Wine, Navigation, Compass, ShieldCheck } from 'lucide-react';
import ResortNavigationMap from './ResortNavigationMap';
import BookingModal from './BookingModal';

export default function ResortDetails({ resort, isDarkMode, onBack, onAskRivo }) {
  const [selectedImage, setSelectedImage] = useState(resort.heroImage);
  const [selectedRoom, setSelectedRoom] = useState(resort.roomTypes[0] || null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const getAmenityIcon = (iconName) => {
    switch (iconName) {
      case 'Waves': return <Waves className="w-4 h-4 text-[#2563EB]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#2563EB]" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-[#2563EB]" />;
      case 'Bot': return <Bot className="w-4 h-4 text-[#2563EB]" />;
      case 'Wifi': return <Wifi className="w-4 h-4 text-[#2563EB]" />;
      case 'Wine': return <Wine className="w-4 h-4 text-[#2563EB]" />;
      case 'Navigation': return <Navigation className="w-4 h-4 text-[#2563EB]" />;
      default: return <Compass className="w-4 h-4 text-[#2563EB]" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-12">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold shadow border transition ${
            isDarkMode
              ? 'bg-[#1E293B] text-[#93C5FD] border-[#334155] hover:bg-[#334155]'
              : 'bg-white text-[#2563EB] border-[#E2E8F0] hover:bg-[#DBEAFE]'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-[#2563EB]" /> Back to All Resorts
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow border transition ${
              isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            } ${isFavorited ? 'text-rose-500' : 'text-stone-400'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={onAskRivo}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-full shadow transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ask Rivo About Stay
          </button>
        </div>
      </div>

      {/* Header Specs */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            {resort.categoryLabel}
          </span>
          <span className="px-3 py-1 bg-emerald-500/10 text-[#22C55E] border border-[#22C55E]/30 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 100% Hand-Verified Luxury
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
              {resort.name}
            </h1>
            <div className={`flex items-center gap-4 text-xs mt-2 ${isDarkMode ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-4 h-4 text-[#2563EB]" /> {resort.location}
              </span>
              <span>•</span>
              <span className={`flex items-center gap-1 font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {resort.rating} ({resort.reviewsCount} verified reviews)
              </span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <div className="text-xs text-stone-400 font-semibold uppercase">Starting Rate</div>
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-[#93C5FD]' : 'text-[#2563EB]'}`}>
              {resort.currency}{resort.price.toLocaleString()} <span className={`text-xs font-normal ${isDarkMode ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>/ night</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Cover */}
        <div className="lg:col-span-2 relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl group border border-stone-200">
          <img
            src={selectedImage}
            alt={resort.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-[#0F172A] shadow">
            📸 High-Res Photo Gallery Preview
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {resort.gallery.slice(1, 4).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative h-28 lg:h-36 rounded-2xl overflow-hidden shadow cursor-pointer border-2 transition ${
                selectedImage === img ? 'border-[#2563EB] scale-[0.98]' : 'border-transparent hover:opacity-90'
              }`}
            >
              <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Specs */}
      <div className={`rounded-2xl p-6 shadow-md border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center ${
        isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
      }`}>
        <div>
          <div className="text-[10px] font-bold text-stone-400 uppercase">CAPACITY</div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>{resort.specs.guests}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-stone-400 uppercase">BEDROOMS</div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>{resort.specs.bedrooms}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-stone-400 uppercase">BATHROOMS</div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>{resort.specs.bathrooms}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-stone-400 uppercase">SUITE SIZE</div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>{resort.specs.area}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-stone-400 uppercase">CHECK IN</div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>{resort.specs.checkIn}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-stone-400 uppercase">CHECK OUT</div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>{resort.specs.checkOut}</div>
        </div>
      </div>

      {/* Overview & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className={`rounded-3xl p-8 shadow-md border space-y-4 ${
            isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>Resort Overview</h2>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
              {resort.description}
            </p>

            <div className={`pt-4 border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-[#93C5FD]' : 'text-[#2563EB]'}`}>
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {resort.highlights.map((h, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs font-medium ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className={`rounded-3xl p-8 shadow-md border space-y-4 ${
            isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>Luxury Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {resort.amenities.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border text-center space-y-2 hover:border-[#2563EB] transition ${
                  isDarkMode ? 'bg-[#111827] border-[#334155] text-[#F8FAFC]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                }`}>
                  <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center mx-auto shadow-sm">
                    {getAmenityIcon(item.icon)}
                  </div>
                  <div className="text-xs font-bold">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`rounded-3xl p-6 shadow-xl border flex flex-col justify-between space-y-6 h-fit sticky top-6 ${
          isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <div>
                <span className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-[#93C5FD]' : 'text-[#2563EB]'}`}>
                  DIRECT BOOKING
                </span>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
                  {resort.currency}{selectedRoom ? selectedRoom.price.toLocaleString() : resort.price.toLocaleString()}
                  <span className={`text-xs font-normal ${isDarkMode ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}> / night</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                ⭐ {resort.rating}
              </span>
            </div>

            {/* Room selection */}
            <div className="mt-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Select Suite Category</label>
              <div className="space-y-2">
                {resort.roomTypes.map(room => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedRoom?.id === room.id
                        ? 'bg-[#2563EB] text-white border-[#60A5FA] shadow-md'
                        : isDarkMode
                          ? 'bg-[#111827] text-[#CBD5E1] border-[#334155] hover:bg-[#334155]'
                          : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:bg-[#DBEAFE]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{room.title}</span>
                      <span className={selectedRoom?.id === room.id ? 'text-white' : 'text-[#2563EB]'}>
                        {resort.currency}{room.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="w-full py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xl transition transform hover:scale-[1.02]"
          >
            Reserve {selectedRoom ? selectedRoom.title : 'Suite'} Now
          </button>
        </div>
      </div>

      {/* Interactive Resort Navigation Map */}
      <section className="pt-4">
        <ResortNavigationMap
          mapPoints={resort.mapPoints}
          resortName={resort.name}
          isDarkMode={isDarkMode}
          onSelectSpot={() => {
            if (onAskRivo) onAskRivo();
          }}
        />
      </section>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          resort={resort}
          room={selectedRoom}
          isDarkMode={isDarkMode}
          onClose={() => setIsBookingOpen(false)}
          onAskRivo={onAskRivo}
        />
      )}
    </div>
  );
}
