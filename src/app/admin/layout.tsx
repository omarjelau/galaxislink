
'use client';
import { AdminNav } from "@/app/admin/AdminNav";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GalaxisLinkLogo } from "@/components/GalaxisLinkLogo";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}`) : null, [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile & { role?: string }>(userProfileRef);

  const isLoading = isAuthLoading || isProfileLoading;
  
  useEffect(() => {
    if (!isLoading && (!user || userProfile?.role !== 'admin')) {
        router.push('/login');
    }
  }, [user, userProfile, isLoading, router]);


  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
         <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card/50 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <GalaxisLinkLogo />
              <span className="text-sm font-light bg-primary/10 text-primary px-2 py-1 rounded-md">Admin</span>
            </Link>
          </div>
          <AdminNav onLinkClick={() => {}} />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 bg-card/95 w-full max-w-xs sm:max-w-sm">
              <SheetHeader className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                  <GalaxisLinkLogo />
                  <span className="text-sm font-light bg-primary/10 text-primary px-2 py-1 rounded-md">Admin</span>
                </Link>
                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
              </SheetHeader>
              <AdminNav isMobile={true} onLinkClick={() => setIsSheetOpen(false)}/>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 flex justify-end">
            <ThemeSwitcher />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 bg-secondary/30 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
