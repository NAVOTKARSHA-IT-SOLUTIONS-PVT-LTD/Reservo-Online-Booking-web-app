import { secureStorage } from "./secureStorage";
import { apiClient } from "./apiClient";

const TOKEN_KEY = "reservo_auth_token";
const USER_KEY = "reservo_user";

export const authService = {
  async login(email, password) {
    try {
      const result = await apiClient.post("/api/v1/auth/login", { email, password });
      if (result.success && result.data) {
        secureStorage.setItem(TOKEN_KEY, result.data.token);
        secureStorage.setItem(USER_KEY, result.data);
        return result.data;
      } else {
        throw new Error(result.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(name, email, password, otpCode, phone = null, role = "ROLE_CUSTOMER") {
    try {
      const result = await apiClient.post("/api/v1/auth/signup", {
        name,
        email,
        password,
        otpCode,
        phone,
        role
      });
      if (result.success && result.data) {
        secureStorage.setItem(TOKEN_KEY, result.data.token);
        secureStorage.setItem(USER_KEY, result.data);
        return result.data;
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  async sendOtp(email) {
    try {
      const result = await apiClient.post(`/api/v1/auth/otp/send?email=${encodeURIComponent(email)}`);
      return result.message || "OTP sent successfully";
    } catch (error) {
      console.error("OTP send error:", error);
      throw error;
    }
  },

  async verifyOtp(email, otpCode) {
    try {
      const result = await apiClient.post("/api/v1/auth/otp/verify", { email, otpCode });
      return result.message || "OTP verified successfully";
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  },

  async logout() {
    try {
      const token = secureStorage.getItem(TOKEN_KEY);
      if (token) {
        await apiClient.post("/api/v1/auth/logout");
      }
      secureStorage.removeItem(TOKEN_KEY);
      secureStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      secureStorage.removeItem(TOKEN_KEY);
      secureStorage.removeItem(USER_KEY);
      return true;
    }
  },

  getCurrentUser() {
    return secureStorage.getItem(USER_KEY);
  },

  async requestPasswordReset(email) {
    const result = await apiClient.post(`/api/v1/auth/password-reset/request?email=${encodeURIComponent(email)}`);
    if (!result.success) {
      throw new Error(result.message || "Could not request a password reset.");
    }
    return result.message;
  },

  async resetPassword(email, otpCode, newPassword) {
    const result = await apiClient.post("/api/v1/auth/password-reset/confirm", { email, otpCode, newPassword });
    if (!result.success) {
      throw new Error(result.message || "Could not reset the password.");
    }
    return result.message;
  },

  async refreshCurrentUser() {
    try {
      const token = secureStorage.getItem(TOKEN_KEY);
      if (!token) {
        return null;
      }
      const result = await apiClient.get("/api/v1/auth/me");
      if (result.success && result.data) {
        secureStorage.setItem(USER_KEY, result.data);
        return result.data;
      }
      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  isAuthenticated() {
    return !!secureStorage.getItem(TOKEN_KEY);
  },

  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  getAuthToken() {
    return secureStorage.getItem(TOKEN_KEY);
  },

  // Phone Authentication Methods
  async loginWithPhone(phoneNumber, firebaseIdToken, role = "ROLE_CUSTOMER") {
    try {
      const result = await apiClient.post("/api/v1/auth/login/phone", {
        phoneNumber,
        firebaseIdToken,
        role
      });
      if (result.success && result.data) {
        secureStorage.setItem(TOKEN_KEY, result.data.token);
        secureStorage.setItem(USER_KEY, result.data);
        return result.data;
      } else {
        throw new Error(result.message || "Phone authentication failed");
      }
    } catch (error) {
      console.error("Phone login error:", error);
      throw error;
    }
  },

  async registerWithPhone(name, phoneNumber, firebaseIdToken, role = "ROLE_CUSTOMER") {
    try {
      const result = await apiClient.post("/api/v1/auth/signup/phone", {
        name,
        phoneNumber,
        firebaseIdToken,
        role
      });
      if (result.success && result.data) {
        secureStorage.setItem(TOKEN_KEY, result.data.token);
        secureStorage.setItem(USER_KEY, result.data);
        return result.data;
      } else {
        throw new Error(result.message || "Phone registration failed");
      }
    } catch (error) {
      console.error("Phone registration error:", error);
      throw error;
    }
  }
};
