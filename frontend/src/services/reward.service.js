import { mockRequest } from "./api.helper";

const MOCK_REWARD_STATUS = {
  tier: "Elite Diamond Status",
  points: 24500,
  couponsCount: 3,
  membershipLevel: "Gold Member",
  nextTierPoints: 30000,
  history: [
    { id: "tx-1", description: "Azure Bay Resort Stay", points: "+12,000", date: "Aug 12, 2026" },
    { id: "tx-2", description: "Referral Bonus", points: "+500", date: "Jul 28, 2026" },
    { id: "tx-3", description: "Monsoon Booking Promo", points: "+2,000", date: "Jul 05, 2026" }
  ]
};

export const rewardService = {
  async getRewardStatus() {
    return mockRequest(MOCK_REWARD_STATUS, 0.01, "Failed to load loyalty rewards details.");
  },

  async redeemPoints(pointsToRedeem) {
    if (pointsToRedeem > MOCK_REWARD_STATUS.points) {
      throw new Error("Insufficient points balance.");
    }
    MOCK_REWARD_STATUS.points -= pointsToRedeem;
    MOCK_REWARD_STATUS.couponsCount += 1;
    MOCK_REWARD_STATUS.history.unshift({
      id: "tx-" + Math.floor(1000 + Math.random() * 9000),
      description: "Points Redeemed for Coupon",
      points: `-${pointsToRedeem.toLocaleString()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    });
    
    return mockRequest({
      success: true,
      updatedPoints: MOCK_REWARD_STATUS.points,
      couponsCount: MOCK_REWARD_STATUS.couponsCount
    }, 0.05, "Redeem failed. Please try again.");
  }
};
