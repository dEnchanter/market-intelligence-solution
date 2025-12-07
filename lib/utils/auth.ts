// Auth utility functions

export interface StoredUser {
  name: string;
  profile_type: string;
  district_id: string;
  expires_at: number;
  must_change_password: boolean;
}

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Get user data from localStorage
export const getUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) return false;

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (user.expires_at && user.expires_at < now) {
    // Token expired, clear storage
    clearAuth();
    return false;
  }

  return true;
};

// Clear authentication data
export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Store authentication data
export const setAuth = (token: string, user: StoredUser): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};
