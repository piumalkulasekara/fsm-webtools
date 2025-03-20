"use client";

import { useState } from "react";
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

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
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
  ];

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
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
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