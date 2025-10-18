
'use client';
import { DashboardNav } from "@/app/dashboard/DashboardNav";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GalaxisLinkLogo } from "@/components/GalaxisLinkLogo";
import Link from "next/link";
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { ThemeSwitcher } from "@/components/ThemeSwitcher";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card/50 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
           <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <GalaxisLinkLogo />
            </Link>
          </div>
          <DashboardNav onLinkClick={() => {}} />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 sm:px-6">
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
            <SheetContent side="left" className="flex flex-col p-0 bg-card/95 w-[80vw] max-w-xs sm:max-w-sm">
               <SheetHeader className="flex h-14 items-center border-b px-4">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <GalaxisLinkLogo />
                </Link>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <DashboardNav isMobile={true} onLinkClick={() => setIsSheetOpen(false)}/>
            </SheetContent>
          </Sheet>
           <div className="w-full flex-1 flex justify-end">
             <ThemeSwitcher />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-secondary/30 overflow-y-auto">
           <div className="w-full max-w-4xl mx-auto">
              {children}
            </div>
        </main>
      </div>
    </div>
  );
}
