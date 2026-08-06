import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, MessageSquare, ChevronRight, Check, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RESORTS } from '../data/resortsData';
import rivoSearching from '../assets/images/rivo_searching.png';

export default function FloatingAIAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "rivo",
      text: "Hi! I'm Rivo, your personal travel concierge. Tell me what kind of vibe you're looking for, and I'll find the perfect stay."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const MOODS = [
    { label: 'Beach Vibe 🌊', category: 'beach', resortId: 'goa-coastline' },
    { label: 'Mountain Trek 🏔️', category: 'mountain', resortId: 'himalayan-chalet' },
    { label: 'Royal Heritage 👑', category: 'villa', resortId: 'udaipur-palace' },
    { label: 'Lagoon Paradise 🏝️', category: 'island', resortId: 'maldives-overwater' }
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    
    // Append user message
    const userMsg = {
      id: "msg-user-" + Date.now(),
      sender: "user",
      text: `I'm looking for a ${mood.label} getaway.`
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate Rivo thinking delay
    setTimeout(() => {
      setIsTyping(false);
      const matchedResort = RESORTS.find(r => r.id === mood.resortId) || RESORTS[0];
      
      const rivoReply = {
        id: "msg-rivo-" + Date.now(),
        sender: "rivo",
        text: `I've analyzed our listings and matched your mood with this premium property!`,
        recommendation: {
          id: matchedResort.id,
          name: matchedResort.name,
          location: matchedResort.location,
          rating: matchedResort.rating,
          price: matchedResort.price,
          image: matchedResort.heroImage,
          badge: matchedResort.badge
        }
      };
      
      setMessages(prev => [...prev, rivoReply]);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setMessages([
      {
        id: "m1",
        sender: "rivo",
        text: "Hi! I'm Rivo, your personal travel concierge. Tell me what kind of vibe you're looking for, and I'll find the perfect stay."
      }
    ]);
  };

  return (
    <>
      {/* Persistent floating button */}
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Toggle Rivo AI Companion"
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 bg-bg-white border-2 border-gold rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center p-0.5 ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
      >
        <img src={rivoSearching} alt="Rivo AI" className="w-full h-full rounded-full object-cover" />
      </button>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-6 right-6 w-[340px] bg-bg-white border border-border-color rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[101] overflow-hidden flex flex-col origin-bottom-right"
          >
            
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold relative">
                  <img src={rivoSearching} alt="Rivo AI" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></div>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">Rivo AI</div>
                  <div className="text-white/60 text-[11px] flex items-center gap-1"><Sparkles size={10} className="text-gold" /> Online Concierge</div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-bg-light h-[360px] overflow-y-auto flex flex-col gap-4 scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                    {msg.sender === 'rivo' ? (
                      <img src={rivoSearching} alt="Rivo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">You</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 max-w-[75%]">
                    <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none text-right'
                        : 'bg-bg-white text-text-dark rounded-tl-none text-left border border-border-color'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Rich media recommendation card inside bubble */}
                    {msg.recommendation && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-bg-white border border-border-color rounded-2xl overflow-hidden shadow-md cursor-pointer hover:-translate-y-0.5 transition duration-200 text-left flex flex-col"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/resort/${msg.recommendation.id}`);
                        }}
                      >
                        <div className="relative h-24 w-full">
                          <img src={msg.recommendation.image} alt={msg.recommendation.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-primary text-[8px] font-bold uppercase rounded">{msg.recommendation.badge}</span>
                        </div>
                        <div className="p-3 space-y-1">
                          <span className="text-[9px] text-text-gray font-semibold flex items-center gap-0.5"><MapPin size={8} className="text-primary" /> {msg.recommendation.location}</span>
                          <h5 className="text-[11.5px] font-bold text-text-dark truncate">{msg.recommendation.name}</h5>
                          <div className="flex justify-between items-center pt-2 border-t border-border-color">
                            <span className="text-[10px] font-extrabold text-primary">₹{msg.recommendation.price.toLocaleString()} / night</span>
                            <span className="text-[9px] font-extrabold text-[#22C55E]">View Details →</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                    <img src={rivoSearching} alt="Rivo" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-bg-white border border-border-color p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 h-9">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}

              {/* Mood selector button lists */}
              {!selectedMood && (
                <div className="flex flex-col gap-2 pl-10.5 text-left">
                  <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest">Select your holiday vibe:</p>
                  <div className="flex flex-col gap-1.5">
                    {MOODS.map(mood => (
                      <button 
                        key={mood.label}
                        onClick={() => handleMoodSelect(mood)}
                        className="w-full text-left p-2 px-3.5 bg-bg-white border border-border-color rounded-xl text-xs font-semibold text-text-dark hover:border-gold hover:text-gold transition cursor-pointer"
                      >
                        {mood.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedMood && !isTyping && (
                <button 
                  onClick={handleReset}
                  className="mt-2 py-1.5 px-4 self-center bg-bg-white border border-border-color hover:border-primary text-text-dark text-[10px] font-bold rounded-lg cursor-pointer transition"
                >
                  Start Over
                </button>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-bg-white border-t border-border-color">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask Rivo anything..." 
                  className="w-full bg-bg-light border border-border-color rounded-full py-2 pl-4 pr-10 text-xs outline-none focus:border-gold transition-colors font-semibold"
                  disabled={!!selectedMood}
                />
                <button className="absolute right-1 top-1 w-6.5 h-6.5 rounded-full bg-gold text-white flex items-center justify-center border-none cursor-pointer hover:bg-gold-dark transition-colors disabled:opacity-50">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
