"use client";

import { useState, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  UserIcon, 
  MapPinIcon, 
  UsersIcon 
} from "lucide-react";
import { 
  ArrowLeftIcon, 
  ArrowRightIcon 
} from "@radix-ui/react-icons";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

// Memoized navigation item component for better performance
const NavItem = memo(({ 
  item, 
  isActive, 
  collapsed 
}: { 
  item: NavItem; 
  isActive: boolean; 
  collapsed: boolean;
}) => {
  const Icon = item.icon;
  
  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  );
});
NavItem.displayName = "NavItem";

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo<NavItem[]>(() => [
    {
      title: "User Account Creations",
      href: "/dashboard/user-accounts",
      icon: UserIcon,
    },
    {
      title: "Place Details Editor",
      href: "/dashboard/place-details",
      icon: MapPinIcon,
    },
    {
      title: "Team Editor",
      href: "/dashboard/team-editor",
      icon: UsersIcon,
    },
  ], []);

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ArrowRightIcon className="h-4 w-4" />
          ) : (
            <ArrowLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="flex flex-col gap-2 px-2">
        {navigationItems.map((item) => (
          <NavItem 
            key={item.href}
            item={item} 
            isActive={pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </nav>
      {!collapsed && (
        <div className="mt-auto p-4">
          <p className="text-xs text-muted-foreground">
            Toggle switch to hide the sidebar
          </p>
        </div>
      )}
    </div>
  );
} 