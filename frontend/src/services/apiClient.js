import { secureStorage } from "./secureStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const TOKEN_KEY = "reservo_auth_token";

async function request(endpoint, options = {}) {
  const token = secureStorage.getItem(TOKEN_KEY);
  
  const headers = {
    "Content-Type": "application/json",
    "bypass-tunnel-reminder": "true",
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

  const controller = new AbortController();
  const timeoutMs = options.timeout || 12000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  config.signal = controller.signal;

  const isAuthEndpoint = endpoint.includes("/api/v1/auth/");
  const maxRetries = (options.method === "GET" || !options.method) ? (options.retries ?? 1) : 0;
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      clearTimeout(timeoutId);

      if (response.status === 401 && !isAuthEndpoint && !options.suppressAuthRedirect) {
        secureStorage.removeItem(TOKEN_KEY);
        secureStorage.removeItem("reservo_user");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?expired=true";
        }
        throw new Error("Session expired. Please log in again.");
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `Server responded with error status (${response.status})`;
        const err = new Error(errorMessage);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      lastError = error;
      if (error?.name === "AbortError") {
        lastError = new Error("Connection timed out. Please check your network or server connection.");
      }
      attempt++;
      if (attempt <= maxRetries) {
        await new Promise(res => setTimeout(res, attempt * 600));
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error(`Unable to connect to backend service at ${API_BASE_URL}`);
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
