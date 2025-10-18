
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, LogOut, Users, Settings, LayoutDashboard, ShoppingCart, FileText, Handshake, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/shop", icon: ShoppingCart, label: "Shop" },
  { href: "/admin/unclaimed-cards", icon: QrCode, label: "Unclaimed Cards" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/ambassadors", icon: Handshake, label: "Ambassadors" },
  { href: "/admin/analytics", icon: BarChart, label: "Platform Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminNav({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick: () => void; }) {
  const pathname = usePathname();
  const auth = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  const navClasses = isMobile 
    ? "grid items-start p-4 text-sm font-medium" 
    : "flex-1 px-4";

  const linkClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  
  const activeLinkClasses = "bg-primary/10 text-primary";

  return (
    <div className={cn("flex flex-col justify-between h-full", isMobile ? "gap-4" : "py-4")}>
      <nav className={navClasses}>
        {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                linkClasses,
                 pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)) ? activeLinkClasses : ""
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
        ))}
      </nav>
      
      <div className="mt-auto p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log Out
        </Button>
      </div>
    </div>
  );
}

    