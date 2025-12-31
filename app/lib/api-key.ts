/**
 * API Key management utilities
 * Stores API key in localStorage for client-side access
 */

const API_KEY_STORAGE_KEY = "forgeflow_api_key";

/**
 * Get API key from localStorage (client-side only)
 */
export function getApiKey(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

/**
 * Set API key in localStorage (client-side only)
 */
export function setApiKey(key: string): void {
  if (typeof window === "undefined") {
    return;
  }
  if (key.trim() === "") {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } else {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  }
}

/**
 * Remove API key from localStorage (client-side only)
 */
export function removeApiKey(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

