import { mockRequest } from "./api.helper";
import { secureStorage } from "./secureStorage";

const TOKEN_KEY = "reservo_auth_token";
const USER_KEY = "reservo_user";

export const authService = {
  async login(email, password) {
    // 5% chance of network/unauthorized failure for realistic errors
    const isError = email === "fail@mail.in";
    const failRate = isError ? 1 : 0.02;

    const credentialsMatch = 
      email === "reservo@mail.in" || 
      email === "resort@mail.in" || 
      email.includes("@");

    if (!credentialsMatch) {
      return mockRequest(null, 1, "Invalid email or password.");
    }

    const mockUser = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      name: email === "reservo@mail.in" ? "Reservo Admin" : email === "resort@mail.in" ? "Resort Manager" : "Tausif Shaikh",
      email: email,
      role: email === "reservo@mail.in" ? "admin" : email === "resort@mail.in" ? "resort_admin" : "user",
      tier: "Elite Diamond Status",
      joined: "Member since July 2026",
      points: 24500
    };

    const result = await mockRequest({
      token: "mock-jwt-token-xyz-123456789",
      user: mockUser
    }, failRate, "Authentication failed. Please verify your credentials.");

    secureStorage.setItem(TOKEN_KEY, result.token);
    secureStorage.setItem(USER_KEY, result.user);
    return result;
  },

  async register(name, email, password) {
    const mockUser = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: "user",
      tier: "Silver Status",
      joined: `Member since ${new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}`,
      points: 0
    };

    const result = await mockRequest({
      success: true,
      user: mockUser
    }, 0.02, "Failed to register user. Email might already exist.");

    return result;
  },

  async logout() {
    await mockRequest({ success: true });
    secureStorage.removeItem(TOKEN_KEY);
    secureStorage.removeItem(USER_KEY);
    return true;
  },

  getCurrentUser() {
    return secureStorage.getItem(USER_KEY);
  },

  isAuthenticated() {
    return !!secureStorage.getItem(TOKEN_KEY);
  },

  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
};
