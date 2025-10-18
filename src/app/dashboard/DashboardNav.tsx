
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, LogOut, ExternalLink, Palette, LayoutDashboard, Loader2, Share2, Users, CreditCard, Link as LinkIcon, Wallet, Handshake, Nfc } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/hub", icon: Share2, label: "Hub" },
  { href: "/dashboard/appearance", icon: Palette, label: "Appearance" },
  { href: "/dashboard/analytics", icon: BarChart, label: "Analytics" },
  { href: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
];

export function DashboardNav({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick: () => void }) {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading } = useDoc<UserProfile>(userProfileRef);

  const ambassadorLink = userProfile?.ambassadorStatus === 'approved' 
    ? "/dashboard/ambassador" 
    : "/affiliate";

  const handleLogout = () => {
    auth.signOut();
  };

  const navClasses = isMobile 
    ? "grid items-start px-2 text-sm font-medium" 
    : "flex-1";

  const linkClasses = isMobile
    ? "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
    : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  
  const activeLinkClasses = isMobile ? "bg-muted text-primary" : "bg-primary/10 text-primary";


  return (
    <div className={cn("flex flex-col justify-between h-full", isMobile ? "gap-4" : "p-4")}>
      <nav className={cn(navClasses, isMobile ? "py-4" : "")}>
        {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                linkClasses,
                 pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)) ? activeLinkClasses : ""
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
        ))}
         <Link
            key={ambassadorLink}
            href={ambassadorLink}
            onClick={onLinkClick}
            className={cn(
                linkClasses,
                pathname.startsWith('/dashboard/ambassador') || pathname.startsWith('/affiliate') ? activeLinkClasses : ""
            )}
        >
            <Handshake className="h-4 w-4" />
            Ambassador
        </Link>
        <Link
            href="/dashboard/activate"
            onClick={onLinkClick}
            className={cn(
                linkClasses,
                pathname === "/dashboard/activate" ? activeLinkClasses : ""
            )}
        >
            <Nfc className="h-4 w-4" />
            Activate Card
        </Link>
      </nav>
      
      <div className={isMobile ? "mt-auto p-4" : ""}>
          <Button variant="outline" className="w-full justify-start gap-3" asChild disabled={isLoading || !userProfile}>
          <Link href={`/${encodeURIComponent(userProfile?.username || '')}`} target="_blank" onClick={onLinkClick}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <ExternalLink className="h-4 w-4" />}
              View Public Page
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 mt-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log Out
        </Button>
      </div>
    </div>
  );
}
