import { NavigationMenu } from "@/components/ui/navigation-menu";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useAuthSession } from "@/components/auth/useAuthSession";
import { NavigationItems } from "./navigation/NavigationItems";

const NavHeader = () => {
  const { session, isAdmin, isLoading } = useAuthSession();

  // Only render navigation items if user is authenticated and loading is complete
  if (!session || isLoading) {
    return null;
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <NavigationMenu>
          <NavigationItems isAdmin={isAdmin} />
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default NavHeader;