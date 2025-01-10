import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold">SaaS Template</h1>
          <div className="space-x-4">
            {user ? (
              <Button onClick={() => navigate("/account")}>My Account</Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </nav>

        <main className="py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Welcome to Our SaaS Platform
            </h2>
            <p className="text-xl text-muted-foreground">
              A secure, scalable solution for your business needs
            </p>
            {!user && (
              <div className="space-x-4">
                <Button size="lg" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;