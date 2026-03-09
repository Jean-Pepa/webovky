"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check the non-httpOnly indicator cookie on mount
    const hasIndicator = document.cookie
      .split("; ")
      .some((c) => c.startsWith("admin_logged_in=true"));
    if (hasIndicator) {
      setIsAdmin(true);
    }
  }, []);

  const login = useCallback(async (password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAdmin(true);
      return { success: true };
    }

    const data = await res.json();
    return { success: false, error: data.error || "Chyba přihlášení" };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
