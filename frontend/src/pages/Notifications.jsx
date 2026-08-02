import React, { useState } from "react";
import { Bell, Sparkles, Star, Tag, ShieldCheck, MailOpen, Trash2 } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Rivo Itinerary Generated ✨",
      desc: "Your customized Goa vacation draft is saved. Navigate to Dashboard to view your active QR codes.",
      time: "2 hours ago",
      type: "planner",
      unread: true,
      icon: <Sparkles className="w-4 h-4 text-primary" />
    },
    {
      id: 2,
      title: "Points Loaded! 💎",
      desc: "Earned +12,000 loyalty rewards points for completing checkouts at Azure Bay Resort Bali.",
      time: "1 day ago",
      type: "points",
      unread: false,
      icon: <Star className="w-4 h-4 text-amber-500 fill-current" />
    },
    {
      id: 3,
      title: "Exclusive Monsoon Offer 🌴",
      desc: "Get 20% off on all Beach Resorts stays in Maldives and Goa using checkout code MONSOON20.",
      time: "3 days ago",
      type: "offer",
      unread: false,
      icon: <Tag className="w-4 h-4 text-emerald-500" />
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-bg-light pt-28 pb-20 px-6 font-sans transition-colors duration-300">
      <div className="max-w-[700px] mx-auto space-y-6 animate-fade-in">
        
        {/* Header Title */}
        <div className="flex justify-between items-end border-b border-border-color pb-4">
          <div>
            <h1 className="text-3xl font-serif font-extrabold text-text-dark">Notifications</h1>
            <p className="text-sm text-text-gray mt-1 font-medium">Keep track of reward points balances and promotions.</p>
          </div>
          {notifications.some(n => n.unread) && (
            <button 
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
            >
              <MailOpen className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((n) => (
            <div 
              key={n.id}
              className={`bg-bg-white border rounded-2xl p-4.5 shadow-sm transition-all duration-300 flex gap-4 relative overflow-hidden ${
                n.unread ? "border-primary" : "border-border-color"
              }`}
            >
              {n.unread && (
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              )}

              {/* Icon container */}
              <div className="w-9 h-9 rounded-full bg-bg-light flex items-center justify-center shrink-0">
                {n.icon}
              </div>

              {/* Content body */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-text-dark">{n.title}</h4>
                  <span className="text-[9px] text-text-gray font-semibold">{n.time}</span>
                </div>
                <p className="text-xs text-text-gray leading-relaxed font-semibold">{n.desc}</p>
              </div>

              {/* Action delete */}
              <button 
                onClick={() => handleDelete(n.id)}
                className="w-8 h-8 rounded-full hover:bg-red-500/5 text-text-gray hover:text-red-500 flex items-center justify-center border-none bg-transparent cursor-pointer shrink-0 align-self-center"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-20 border border-dashed border-border-color rounded-3xl bg-bg-white shadow-sm space-y-3">
              <Bell className="w-12 h-12 text-text-gray mx-auto" />
              <div>
                <h3 className="text-base font-bold text-text-dark">Inbox is empty</h3>
                <p className="text-xs text-text-gray mt-1">You are all caught up for today.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
