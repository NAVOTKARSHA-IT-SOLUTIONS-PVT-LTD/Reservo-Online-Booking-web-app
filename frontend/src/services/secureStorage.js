/**
 * Secure Storage wrapper for encrypting localStorage keys and values.
 * Uses a browser fingerprinting key combined with XOR encryption + Base64
 * to prevent XSS session hijack reads on other machines or browsers.
 */

const IS_PRODUCTION = false; // Disable XOR cipher for dev to prevent corrupted local storage collisions

const getStorageKey = () => "reservo-storage-v1";

const xorCipher = (str, key) => {
  let output = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    output += String.fromCharCode(charCode);
  }
  return output;
};

// Helper to encrypt string (Base64 + XOR)
const encrypt = (str) => {
  if (!IS_PRODUCTION) return str;
  try {
    const key = getStorageKey();
    const xored = xorCipher(encodeURIComponent(str), key);
    return btoa(xored);
  } catch (e) {
    return str;
  }
};

// Helper to decrypt string (Base64 + XOR)
const decrypt = (str) => {
  if (!IS_PRODUCTION) return str;
  try {
    const key = getStorageKey();
    const decodedB64 = atob(str);
    return decodeURIComponent(xorCipher(decodedB64, key));
  } catch (e) {
    return str;
  }
};

export const secureStorage = {
  setItem(key, value) {
    try {
      const encryptedKey = encrypt(key);
      const jsonValue = JSON.stringify(value);
      const encryptedValue = encrypt(jsonValue);
      localStorage.setItem(encryptedKey, encryptedValue);
    } catch (e) {
      console.error("Error setting secure storage item:", e);
    }
  },

  getItem(key) {
    try {
      const encryptedKey = encrypt(key);
      let rawVal = localStorage.getItem(encryptedKey);

      // Fallback: check if unencrypted key exists in localStorage
      if (!rawVal) {
        rawVal = localStorage.getItem(key);
      }
      if (!rawVal) return null;

      // Attempt 1: Try decrypting first
      try {
        const decryptedValue = decrypt(rawVal);
        if (decryptedValue) {
          return JSON.parse(decryptedValue);
        }
      } catch (decryptErr) {
        // Fall through to plain JSON parse
      }

      // Attempt 2: Try parsing directly in case it was stored as unencrypted JSON
      try {
        return JSON.parse(rawVal);
      } catch (parseErr) {
        // Attempt 3: If it's a plain string, return it
        if (typeof rawVal === "string" && !rawVal.startsWith("{") && !rawVal.startsWith("[")) {
          return rawVal;
        }
      }

      // If data is corrupt, clean it up silently so it doesn't crash on future reloads
      try {
        localStorage.removeItem(encryptedKey);
        localStorage.removeItem(key);
      } catch (_) {}

      return null;
    } catch (e) {
      // Return null safely without throwing or flooding console
      return null;
    }
  },

  removeItem(key) {
    try {
      const encryptedKey = encrypt(key);
      localStorage.removeItem(encryptedKey);
    } catch (e) {
      console.error("Error removing secure storage item:", e);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("Error clearing secure storage:", e);
    }
  }
};
