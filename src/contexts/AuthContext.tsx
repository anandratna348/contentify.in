import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Check if URL contains auth callback params (code or tokens in hash)
    const hasAuthParams = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      return params.has("code") || hash.includes("access_token");
    };

    // Listener for auth changes - this handles token exchange from URL
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        console.log("Auth event:", event, "Session:", !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Initial load
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
      } finally {
        // If auth params exist in URL, DON'T set loading false yet
        // Let onAuthStateChange handle it after token exchange
        if (isMounted && !hasAuthParams()) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Safety timeout: if auth params exist but exchange takes too long
    const timeout = hasAuthParams() ? setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000) : undefined;

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const signInWithGoogle = async () => {
    const isCustomDomain =
      !window.location.hostname.includes("lovable.app") &&
      !window.location.hostname.includes("lovableproject.com") &&
      !window.location.hostname.includes("localhost");

    if (isCustomDomain) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
