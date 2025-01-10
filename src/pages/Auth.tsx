import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          // Check if user is admin
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session?.user?.id)
            .single();

          if (profile?.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/account");
          }
        }
        // Handle auth errors
        if (event === "USER_UPDATED") {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        }
        if (event === "SIGNED_OUT") {
          setErrorMessage(""); // Clear errors on sign out
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("already registered")) {
            return "This email is already registered. Please try signing in instead.";
          }
          if (error.message.includes("password")) {
            return "Password must be at least 10 characters long and include uppercase, lowercase, and special characters.";
          }
          return error.message;
        case 422:
          if (error.message.includes("already registered") || error.message.includes("already exists")) {
            return "This email is already registered. Please try signing in instead.";
          }
          return error.message;
        default:
          return "An error occurred during authentication. Please try again.";
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to your account or create a new one
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg border space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            localization={{
              variables: {
                sign_up: {
                  password_label: "Password (min. 10 characters, including uppercase, lowercase, and special characters)",
                  password_input_placeholder: "••••••••••",
                  email_input_placeholder: "you@example.com",
                  button_label: "Sign up",
                  loading_button_label: "Signing up ...",
                  social_provider_text: "Sign in with {{provider}}",
                  link_text: "Don't have an account? Sign up",
                },
                sign_in: {
                  password_label: "Your password",
                  email_input_placeholder: "you@example.com",
                  button_label: "Sign in",
                  loading_button_label: "Signing in ...",
                  social_provider_text: "Sign in with {{provider}}",
                  link_text: "Already have an account? Sign in",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;