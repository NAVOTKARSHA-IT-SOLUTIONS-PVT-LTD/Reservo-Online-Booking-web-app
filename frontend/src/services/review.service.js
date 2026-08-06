import { mockRequest } from "./api.helper";

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    author: "Amit Patel",
    rating: 5,
    date: "July 24, 2026",
    content: "An absolute dream. The Rivo AI planner made organizing our day trips completely effortless. The room was pristine, and the views were breathtaking."
  },
  {
    id: "rev-2",
    author: "Jessica M.",
    rating: 4.8,
    date: "June 12, 2026",
    content: "Outstanding hospitality. The staff was incredibly welcoming, and the beachfront access was wonderful. Highly recommend the sunset villas."
  }
];

export const reviewService = {
  async getReviewsForResort(resortId) {
    return mockRequest(INITIAL_REVIEWS, 0.01, "Failed to load reviews.");
  },

  async addReview(resortId, review) {
    const newReview = {
      id: "rev-" + Math.floor(1000 + Math.random() * 9000),
      author: review.author || "Guest User",
      rating: review.rating || 5,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      content: review.content
    };
    return mockRequest(newReview, 0.05, "Unable to post your review at this moment.");
  }
};
