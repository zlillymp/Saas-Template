import { Link } from "react-router-dom";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavigationItemsProps {
  isAdmin: boolean;
}

export const NavigationItems = ({ isAdmin }: NavigationItemsProps) => {
  console.log("NavigationItems isAdmin:", isAdmin);
  
  return (
    <>
      <NavigationMenuItem>
        <Link to="/account" className={navigationMenuTriggerStyle()}>
          Dashboard
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link to="/deals" className={navigationMenuTriggerStyle()}>
          Deals
        </Link>
      </NavigationMenuItem>
      {isAdmin && (
        <NavigationMenuItem>
          <Link to="/admin" className={navigationMenuTriggerStyle()}>
            Admin
          </Link>
        </NavigationMenuItem>
      )}
    </>
  );
};