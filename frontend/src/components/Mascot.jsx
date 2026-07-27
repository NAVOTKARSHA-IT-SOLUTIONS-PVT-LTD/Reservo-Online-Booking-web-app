import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import rivoSupport from "../assets/images/rivo_support.png";

const QUICK_REPLIES = [
  { text: "🌴 Suggest beach resorts", key: "beach" },
  { text: "🏔️ Tell me about Manali", key: "manali" },
  { text: "📅 How do I book?", key: "book" }
];

function Mascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "rivo",
      text: "Hi! I'm Rivo, your AI travel buddy. I can recommend premium stays, check availability, or help with concierge. Where would you like to travel?"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate Rivo reply after 1.5s
    setTimeout(() => {
      let replyText = "I'm checking that with our systems now. Rivo is looking for the best matches!";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("beach") || lowerText.includes("goa") || lowerText.includes("andaman")) {
        replyText = "I highly recommend Ocean Breeze Resort in Goa or Sunrise Beach Resort in Andaman. Both feature 4.9+ ratings and premium beachfront pools. Shall I check rates?";
      } else if (lowerText.includes("manali") || lowerText.includes("mountain") || lowerText.includes("shimla")) {
        replyText = "Manali and Shimla are beautiful right now! The Mountain Paradise Resort in Manali is currently our best-seller and features private spa access and cozy fireplaces.";
      } else if (lowerText.includes("book") || lowerText.includes("how") || lowerText.includes("process")) {
        replyText = "Booking is super easy! Simply select your destination in the search bar above, pick dates, and click search. You can also click 'Quick Book' on any resort card!";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "rivo",
          text: replyText
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-7.5 right-7.5 z-[2000]">
      
      {/* Floating Mascot Trigger Badge */}
      <button 
        className={`w-14 h-14 rounded-full bg-bg-white border-1.5 border-border-color shadow-[0_10px_30px_rgba(0,0,0,0.15)] cursor-pointer flex items-center justify-center overflow-hidden relative transition-all duration-300 ease-out p-0 hover:scale-[1.08] hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)] ${
          isOpen ? "scale-[1.08]" : ""
        }`}
        onClick={toggleChat}
        aria-label="Toggle Rivo AI Companion"
      >
        <img src={rivoSupport} alt="Rivo Mascot" className="w-full h-full object-cover" />
        <span className="absolute -inset-1 border-2 border-gold rounded-full animate-pulse-rivo pointer-events-none"></span>
      </button>

      {/* Interactive Chat Popup Dialog */}
      {isOpen && (
        <div className="absolute bottom-[75px] right-0 w-[350px] h-[480px] bg-bg-white border border-border-color rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-[#121e1b] px-5 py-3.75 flex items-center gap-3 text-white border-b border-white/5">
            <img src={rivoSupport} alt="Rivo Avatar" className="w-8.5 h-8.5 rounded-full border-1.5 border-white/20 object-cover" />
            <div className="flex-1">
              <h4 className="text-[14.5px] m-0 font-bold text-white">Rivo AI</h4>
              <span className="text-[11px] text-white/60 block mt-px">🟢 Online Companion</span>
            </div>
            <button className="bg-transparent text-white border-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center" onClick={toggleChat} aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3.75 bg-bg-light">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2.5 max-w-[85%] ${
                msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
              }`}>
                {msg.sender === "rivo" && (
                  <img src={rivoSupport} alt="Rivo" className="w-7 h-7 rounded-full object-cover border border-border-color shrink-0" />
                )}
                <div className={`px-4 py-3 rounded-[18px] text-[13.5px] leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                  msg.sender === "user" 
                    ? "bg-[#121e1b] text-white rounded-tr-[4px]" 
                    : "bg-bg-white text-text-dark rounded-tl-[4px] border border-border-color"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                <img src={rivoSupport} alt="Rivo" className="w-7 h-7 rounded-full object-cover border border-border-color shrink-0" />
                <div className="px-4 py-3 rounded-[18px] text-[13.5px] leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.02)] bg-bg-white text-text-dark rounded-tl-[4px] border border-border-color flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-text-gray rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-text-gray rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-text-gray rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !isTyping && (
            <div className="flex flex-col gap-2 px-5 py-3 bg-bg-light border-t border-border-color">
              {QUICK_REPLIES.map((reply, i) => (
                <button 
                  key={i} 
                  className="bg-bg-white text-text-dark border border-border-color px-3.5 py-2 rounded-xl text-[12.5px] text-left cursor-pointer transition-colors duration-200 hover:bg-bg-light hover:border-gold hover:text-gold"
                  onClick={() => handleSend(reply.text)}
                >
                  {reply.text}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Form */}
          <form 
            className="flex px-3.75 py-3 border-t border-border-color bg-bg-white items-center gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
          >
            <input 
              type="text" 
              placeholder="Ask Rivo about stays..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 border-none outline-none px-3 py-2 text-[13.5px] bg-bg-light rounded-lg text-text-dark"
            />
            <button type="submit" className="bg-[#121e1b] text-white border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-gold shrink-0" aria-label="Send message">
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

export default Mascot;
