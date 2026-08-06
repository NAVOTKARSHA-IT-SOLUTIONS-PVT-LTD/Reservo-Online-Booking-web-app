/**
 * Secure Storage wrapper for obfuscating localStorage keys and values.
 */

const IS_PRODUCTION = true;

// Helper to obfuscate string (Base64)
const encrypt = (str) => {
  if (!IS_PRODUCTION) return str;
  try {
    return btoa(encodeURIComponent(str));
  } catch (e) {
    return str;
  }
};

// Helper to de-obfuscate string (Base64)
const decrypt = (str) => {
  if (!IS_PRODUCTION) return str;
  try {
    return decodeURIComponent(atob(str));
  } catch (e) {
    return str;
  }
};

export const secureStorage = {
  /**
   * Set item in secure storage
   * @param {string} key 
   * @param {any} value 
   */
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

  /**
   * Get item from secure storage
   * @param {string} key 
   * @returns {any}
   */
  getItem(key) {
    try {
      const encryptedKey = encrypt(key);
      const encryptedValue = localStorage.getItem(encryptedKey);
      if (!encryptedValue) return null;
      const decryptedValue = decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (e) {
      console.error("Error getting secure storage item:", e);
      return null;
    }
  },

  /**
   * Remove item from secure storage
   * @param {string} key 
   */
  removeItem(key) {
    try {
      const encryptedKey = encrypt(key);
      localStorage.removeItem(encryptedKey);
    } catch (e) {
      console.error("Error removing secure storage item:", e);
    }
  },

  /**
   * Clear all items in secure storage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("Error clearing secure storage:", e);
    }
  }
};
