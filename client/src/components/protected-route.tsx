import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const clerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (clerkConfigured) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-white/60 mb-4">Please sign in to access the admin panel.</p>
            <a href="/admin/login" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-full text-white font-semibold transition">
              Sign In
            </a>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-white/60">Please configure Clerk authentication to access the admin panel.</p>
          <p className="text-white/40 text-sm mt-2">Set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
