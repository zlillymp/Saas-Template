import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const NavHeader = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsAdmin(profile?.role === "admin");
    };

    getProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/account" className={navigationMenuTriggerStyle()}>
                Dashboard
              </Link>
            </NavigationMenuItem>
            {isAdmin && (
              <NavigationMenuItem>
                <Link to="/admin" className={navigationMenuTriggerStyle()}>
                  Admin
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default NavHeader;