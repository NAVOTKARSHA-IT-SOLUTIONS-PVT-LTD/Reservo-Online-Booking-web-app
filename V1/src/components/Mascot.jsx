import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import rivoMascot from "../assets/images/rivo_mascot.jpg";
import "./Mascot.css";

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
    <div className="rivo-floating-wrapper">
      
      {/* Floating Mascot Trigger Badge */}
      <button 
        className={`rivo-float-badge ${isOpen ? "active" : ""}`}
        onClick={toggleChat}
        aria-label="Toggle Rivo AI Companion"
      >
        <img src={rivoMascot} alt="Rivo Mascot" className="float-badge-img" />
        <span className="float-pulse"></span>
      </button>

      {/* Interactive Chat Popup Dialog */}
      {isOpen && (
        <div className="rivo-chat-popup glass-panel">
          
          {/* Header */}
          <div className="chat-header">
            <img src={rivoMascot} alt="Rivo Avatar" className="chat-header-avatar" />
            <div className="chat-header-info">
              <h4>Rivo AI</h4>
              <span>🟢 Online Companion</span>
            </div>
            <button className="chat-close-btn" onClick={toggleChat} aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
                {msg.sender === "rivo" && (
                  <img src={rivoMascot} alt="Rivo" className="chat-bubble-avatar" />
                )}
                <div className="chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-bubble-row rivo">
                <img src={rivoMascot} alt="Rivo" className="chat-bubble-avatar" />
                <div className="chat-bubble typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !isTyping && (
            <div className="chat-quick-replies">
              {QUICK_REPLIES.map((reply, i) => (
                <button 
                  key={i} 
                  className="quick-reply-btn"
                  onClick={() => handleSend(reply.text)}
                >
                  {reply.text}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Form */}
          <form 
            className="chat-input-form"
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
            />
            <button type="submit" className="chat-submit-btn" aria-label="Send message">
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

export default Mascot;
