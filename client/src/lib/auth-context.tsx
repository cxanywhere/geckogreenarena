import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  authToken: string | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
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
      try {
        setUser(JSON.parse(storedUser));
        if (storedToken) setAuthToken(storedToken);
      } catch {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
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

  const getAuthHeaders = (): Record<string, string> => {
    const token = authToken || localStorage.getItem("authToken");
    if (token) {
      return { "Authorization": `Bearer ${token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, isLoading, getAuthHeaders }}>
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
