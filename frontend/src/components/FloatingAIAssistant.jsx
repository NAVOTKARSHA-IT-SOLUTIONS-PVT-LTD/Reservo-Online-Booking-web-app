import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, ChevronRight, Check } from 'lucide-react';
import rivoSearching from '../assets/images/rivo_searching.png';

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  const MOODS = ['Romantic', 'Family', 'Adventure', 'Luxury', 'Workation'];

  return (
    <>
      {/* Persistent floating button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 bg-bg-white border-2 border-gold rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center p-0.5 ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
      >
        <img src={rivoSearching} alt="Rivo AI" className="w-full h-full rounded-full object-cover" />
      </button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[340px] bg-bg-white border border-border-color rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[101] overflow-hidden flex flex-col scale-in-center origin-bottom-right">
          
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold relative">
                <img src={rivoSearching} alt="Rivo AI" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></div>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Rivo AI</div>
                <div className="text-white/60 text-[11px] flex items-center gap-1"><Sparkles size={10} /> Online & Ready</div>
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
          <div className="p-5 bg-bg-light h-[320px] overflow-y-auto flex flex-col gap-4">
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                <img src={rivoSearching} alt="Rivo" className="w-full h-full object-cover" />
              </div>
              <div className="bg-bg-white border border-border-color p-3.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-text-dark leading-relaxed">
                Hi! I'm Rivo, your personal travel concierge. Tell me what kind of vibe you're looking for, and I'll find the perfect stay.
              </div>
            </div>

            <div className="flex flex-col gap-2 pl-11">
              <p className="text-[11px] font-bold text-text-gray uppercase tracking-widest mb-1">Select your mood</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(mood => (
                  <button 
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                      selectedMood === mood 
                        ? 'bg-gold text-white border-gold' 
                        : 'bg-bg-white text-text-gray border-border-color hover:border-gold hover:text-gold'
                    }`}
                  >
                    {selectedMood === mood && <Check size={12} />} {mood}
                  </button>
                ))}
              </div>
            </div>

            {selectedMood && (
              <div className="flex gap-3 flex-row-reverse mt-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">You</span>
                </div>
                <div className="bg-primary text-white p-3.5 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed">
                  I'm feeling {selectedMood}
                </div>
              </div>
            )}

            {selectedMood && (
              <div className="flex gap-3 mt-2 fade-in">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                  <img src={rivoSearching} alt="Rivo" className="w-full h-full object-cover" />
                </div>
                <div className="bg-bg-white border border-border-color p-3.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-text-dark leading-relaxed">
                  Excellent choice! I am scanning all available {selectedMood.toLowerCase()} properties to curate a personalized list for you. Give me just a second...
                  <div className="flex gap-1 mt-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
            
          </div>

          {/* Input Area */}
          <div className="p-4 bg-bg-white border-t border-border-color">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full bg-bg-light border border-border-color rounded-full py-2.5 pl-4 pr-10 text-sm outline-none focus:border-gold transition-colors"
                disabled={!!selectedMood}
              />
              <button className="absolute right-1 top-1 w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center border-none cursor-pointer hover:bg-gold-dark transition-colors disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
