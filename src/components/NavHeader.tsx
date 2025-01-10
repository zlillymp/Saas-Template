import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuthSession } from "./auth/useAuthSession";
import { SignOutButton } from "./auth/SignOutButton";
import { NavigationItems } from "./navigation/NavigationItems";

const NavHeader = () => {
  const { session, isAdmin } = useAuthSession();

  // Only render navigation items if user is authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationItems isAdmin={isAdmin} />
          </NavigationMenuList>
        </NavigationMenu>
        <SignOutButton />
      </div>
    </div>
  );
};

export default NavHeader;