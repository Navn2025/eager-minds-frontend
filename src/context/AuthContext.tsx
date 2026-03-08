import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import type { User } from "../types";
import api from "../services/api";

const TOKEN_KEY = "em_token";
const USER_KEY = "em_user";
const COOKIE_OPTIONS = {
  expires: 7,
  secure: window.location.protocol === "https:",
  sameSite: "lax" as const,
};

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from cookies/localStorage
  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    const stored = localStorage.getItem(USER_KEY);
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // Invalid stored data, clear it
        Cookies.remove(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    Cookies.set(TOKEN_KEY, data.token, COOKIE_OPTIONS);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user as User;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      setUser(data.user);
      Cookies.set(TOKEN_KEY, data.token, COOKIE_OPTIONS);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user as User;
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // Show nothing while loading to prevent flash
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin",
        isPremium:
          user?.role === "premium" || user?.membershipStatus === "upgraded",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
