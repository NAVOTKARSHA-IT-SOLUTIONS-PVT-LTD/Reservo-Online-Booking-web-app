import { secureStorage } from "./secureStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const TOKEN_KEY = "reservo_auth_token";

async function request(endpoint, options = {}) {
  const token = secureStorage.getItem(TOKEN_KEY);
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  } else if (options.body instanceof FormData) {
    // When uploading files, do not explicitly set Content-Type header
    // browser needs to automatically calculate boundary parameter
    delete headers["Content-Type"];
    config.body = options.body;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    secureStorage.removeItem(TOKEN_KEY);
    secureStorage.removeItem("reservo_user");
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login?expired=true";
    }
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || "An error occurred during request execution.";
    throw new Error(errorMessage);
  }

  return data;
}

export const apiClient = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "GET" });
  },
  post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "POST", body });
  },
  put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PUT", body });
  },
  patch(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PATCH", body });
  },
  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "DELETE" });
  },
};
