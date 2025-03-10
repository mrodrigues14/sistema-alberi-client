"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface AuthContextType {
  userId: string | null;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  userRole: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUserId(session.user.id);
      setUserRole(session.user.role);
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{ userId, userRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
