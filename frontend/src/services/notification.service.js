import { mockRequest } from "./api.helper";

let mockNotifications = [
  {
    id: 1,
    title: "Rivo Itinerary Generated ✨",
    desc: "Your customized Goa vacation draft is saved. Navigate to Dashboard to view your active QR codes.",
    time: "2 hours ago",
    type: "planner",
    unread: true
  },
  {
    id: 2,
    title: "Points Loaded! 💎",
    desc: "Earned +12,000 loyalty rewards points for completing checkouts at Azure Bay Resort Bali.",
    time: "1 day ago",
    type: "points",
    unread: false
  },
  {
    id: 3,
    title: "Exclusive Monsoon Offer 🌴",
    desc: "Get 20% off on all Beach Resorts stays in Maldives and Goa using checkout code MONSOON20.",
    time: "3 days ago",
    type: "offer",
    unread: false
  }
];

export const notificationService = {
  async getNotifications() {
    return mockRequest(mockNotifications, 0.01, "Failed to load notifications.");
  },

  async markAllAsRead() {
    mockNotifications = mockNotifications.map(n => ({ ...n, unread: false }));
    return mockRequest({ success: true }, 0.02, "Failed to update notifications.");
  },

  async deleteNotification(id) {
    mockNotifications = mockNotifications.filter(n => n.id !== id);
    return mockRequest({ success: true }, 0.02, "Failed to delete notification.");
  }
};
