import { secureStorage } from "./secureStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const TOKEN_KEY = "reservo_auth_token";
const USER_KEY = "reservo_user";

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Authentication failed");
      }

      const result = await response.json();
      
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
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          otpCode,
          phone,
          role
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const result = await response.json();
      
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
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/otp/send?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send OTP");
      }

      const result = await response.json();
      return result.message || "OTP sent successfully";
    } catch (error) {
      console.error("OTP send error:", error);
      throw error;
    }
  },

  async verifyOtp(email, otpCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otpCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "OTP verification failed");
      }

      const result = await response.json();
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
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      secureStorage.removeItem(TOKEN_KEY);
      secureStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage even if API call fails
      secureStorage.removeItem(TOKEN_KEY);
      secureStorage.removeItem(USER_KEY);
      return true;
    }
  },

  getCurrentUser() {
    return secureStorage.getItem(USER_KEY);
  },

  async requestPasswordReset(email) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/password-reset/request?email=${encodeURIComponent(email)}`, {
      method: 'POST',
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not request a password reset.");
    }
    return result.message;
  },

  async resetPassword(email, otpCode, newPassword) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/password-reset/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otpCode, newPassword }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
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

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear storage
          secureStorage.removeItem(TOKEN_KEY);
          secureStorage.removeItem(USER_KEY);
          return null;
        }
        throw new Error("Failed to fetch user details");
      }

      const result = await response.json();
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
  }
};
