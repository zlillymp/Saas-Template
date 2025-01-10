import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session);
      if (session?.user) {
        getProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for changes in auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      if (session?.user) {
        getProfile(session.user.id);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getProfile = async (userId: string) => {
    try {
      // First try to get own profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
        return;
      }

      console.log("Profile data:", profile);
      setIsAdmin(profile?.role === 'admin');
      console.log("Is admin?", profile?.role === 'admin');
    } catch (error) {
      console.error("Error in getProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { session, isAdmin, isLoading };
};