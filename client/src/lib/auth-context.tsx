import React, { createContext, useContext, ReactNode } from "react";
import { useUser, useAuth as useClerkAuth, useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  role: string | null;
  userId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  
  if (!clerkConfigured) {
    return (
      <AuthContext.Provider value={{
        isAuthenticated: false,
        username: null,
        role: null,
        userId: null,
        loading: false,
        signOut: async () => {}
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return <ClerkAuthProvider setLocation={setLocation}>{children}</ClerkAuthProvider>;
}

function ClerkAuthProvider({ children, setLocation }: { children: ReactNode; setLocation: (path: string) => void }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useClerkAuth();
  const { signOut } = useClerk();

  const isLoading = !userLoaded || !authLoaded;

  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
  };

  const role = (user?.publicMetadata?.role as string) || "user";
  const isAdmin = role === "admin" || role === "editor";

  return (
    <AuthContext.Provider value={{
      isAuthenticated: isSignedIn ?? false,
      username: user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress || null,
      role: isAdmin ? role : "user",
      userId: user?.id || null,
      loading: isLoading,
      signOut: handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useIsAdmin() {
  const { role } = useAuth();
  return role === "admin" || role === "editor";
}
