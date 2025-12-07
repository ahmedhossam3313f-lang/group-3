import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, UserButton, useUser, useAuth } from '@clerk/clerk-react';
import { ReactNode } from 'react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface ClerkAppProviderProps {
  children: ReactNode;
}

export function ClerkAppProvider({ children }: ClerkAppProviderProps) {
  if (!clerkPubKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {children}
    </ClerkProvider>
  );
}

export function useClerkAuth() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  return {
    isAuthenticated: isSignedIn ?? false,
    isLoading: !isLoaded,
    user,
    userId: user?.id ?? null,
    username: user?.username ?? user?.firstName ?? 'User',
    role: (user?.publicMetadata?.role as string) ?? 'user',
  };
}

export { SignIn, SignUp, SignedIn, SignedOut, UserButton, useUser, useAuth };
