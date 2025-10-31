"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | null;
  // 🔹 Tambahan agar profil lengkap
  phone_number?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  full_name?: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null, persist?: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  // 🔹 Ambil user dari localStorage hanya sekali saat load
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch (err) {
        console.warn("Invalid user data in localStorage");
      }
    }
  }, []);

  // 🔹 Setter global
  const setUser = (userData: User | null, persist = false) => {
    setUserState(userData);
    if (persist && userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside <UserProvider>");
  return context;
};
