import { mockRequest } from "./api.helper";
import { secureStorage } from "./secureStorage";

const USER_KEY = "reservo_user";

const DEFAULT_PROFILE = {
  name: "Tausif Shaikh",
  email: "tausif.shaikh@example.com",
  phone: "+91 98765 43210",
  tier: "Elite Diamond Status",
  joined: "Member since July 2026",
  points: "24,500 pts"
};

export const profileService = {
  async getProfile() {
    let profile = secureStorage.getItem(USER_KEY);
    if (!profile) {
      profile = DEFAULT_PROFILE;
      secureStorage.setItem(USER_KEY, profile);
    }
    return mockRequest(profile, 0.01, "Failed to load user profile.");
  },

  async updateProfile(updatedDetails) {
    let profile = secureStorage.getItem(USER_KEY) || DEFAULT_PROFILE;
    profile = { ...profile, ...updatedDetails };
    secureStorage.setItem(USER_KEY, profile);
    return mockRequest(profile, 0.02, "Failed to update profile settings.");
  }
};
