import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  profilePhoto?: string | null;
  warriorAvatar?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  authToken: string | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser) {
      if (storedToken && isTokenExpired(storedToken)) {
        clearStoredAuth();
        setIsLoading(false);
        return;
      }
      try {
        setUser(JSON.parse(storedUser));
        if (storedToken) setAuthToken(storedToken);
      } catch {
        clearStoredAuth();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token?: string) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("authToken", token);
      setAuthToken(token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setAuthToken(null);
  };

  const updateUser = (userData: User) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const getAuthHeaders = (): Record<string, string> => {
    const token = authToken || localStorage.getItem("authToken");
    if (token) {
      return { "Authorization": `Bearer ${token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, updateUser, isLoading, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function to get auth headers without the hook (for use in components without auth context)
export function getStoredAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("authToken");
  if (token) {
    return { "Authorization": `Bearer ${token}` };
  }
  return {};
}

// Clears all stored auth data (used on logout and on expired/invalid tokens).
export function clearStoredAuth() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
}

// Decodes a JWT and returns true if it is expired or unreadable.
export function isTokenExpired(token: string): boolean {
  try {
    const part = token.split(".")[1];
    if (!part) return true;
    // JWT payloads are base64url-encoded: normalize to base64 before decoding.
    let base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) base64 += "=";
    const payload = JSON.parse(atob(base64));
    if (!payload || typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

// Guards against multiple redirects firing at once.
let isHandlingAuthFailure = false;

// Called when an authenticated request is rejected because the login is
// expired/invalid. Clears the stored login and sends the user to sign in again
// with a clear message. No-op if already on the login screen.
export function handleAuthFailure(
  message = "Your session expired — please sign in again."
) {
  clearStoredAuth();
  const path = window.location.pathname;
  const onLoginScreen = path === "/" || path === "/login";
  if (onLoginScreen || isHandlingAuthFailure) return;
  isHandlingAuthFailure = true;
  try {
    sessionStorage.setItem("authErrorMessage", message);
  } catch {
    // ignore storage failures
  }
  window.location.href = "/login";
}
