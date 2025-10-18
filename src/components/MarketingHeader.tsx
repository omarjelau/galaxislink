
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GalaxisLinkLogo } from '@/components/GalaxisLinkLogo';
import { Menu, LogOut, Languages, LayoutDashboard, User, HelpCircle, Briefcase, FileText, Handshake, Info, DollarSign, Sparkles, Download, ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from '@/context/language-context';
import { useUser, useAuth } from '@/firebase';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { ThemeSwitcher } from './ThemeSwitcher';


export function MarketingHeader() {
  const { t, setLanguage, language } = useLanguage();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

   useEffect(() => {
    // This ensures the component has mounted on the client, avoiding hydration mismatches.
    setIsClient(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };

  const navLinks = [
    { href: "/pricing", label: t('navPricing') },
    { href: "/shop", label: "Shop" },
    { href: "/affiliate", label: t('navAffiliate') },
    { href: "/contact", label: t('footerContact') },
  ];
  
  const AuthButtons = () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/login">{t('navLogin')}</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">{t('navSignup')}</Link>
      </Button>
    </div>
  );

  const UserActions = () => (
     <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/dashboard">{t('navDashboard')}</Link>
        </Button>
      </div>
  );

  const AuthStateContent = () => {
    if (!isClient || isUserLoading) {
      // Render a placeholder or nothing during server render and initial loading
      return (
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 rounded-md bg-muted animate-pulse" />
          <div className="h-10 w-24 rounded-md bg-muted animate-pulse" />
        </div>
      );
    }
    return user ? <UserActions /> : <AuthButtons />;
  }

  return (
    <header className={cn(
      "py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" aria-label="GalaxisLink Home">
          <GalaxisLinkLogo />
        </Link>
        
        {/* Mobile Menu - Visible on small screens */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Menü öffnen</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background/90 backdrop-blur-lg w-[80vw] sm:w-[300px]">
              <SheetHeader className="p-6 border-b">
                <Link href="/" aria-label="GalaxisLink Home">
                  <GalaxisLinkLogo />
                </Link>
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                 <p className="text-muted-foreground mt-2 text-left">{user ? `${t('welcome')}, ${user.displayName}` : t('welcomeGuest')}</p>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {user ? (
                  <>
                    <SheetClose asChild><Link href="/dashboard" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group"><LayoutDashboard/>{t('navDashboard')}</Link></SheetClose>
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group"><LogOut/>{t('navLogout')}</button>
                  </>
                ) : (
                   <>
                    <SheetClose asChild><Link href="/login" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group">{t('navLogin')}</Link></SheetClose>
                    <SheetClose asChild><Link href="/signup" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group">{t('navSignup')}</Link></SheetClose>
                  </>
                )}
                 <Separator className="my-4"/>
                 <SheetClose asChild><Link href="/shop" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group"><ShoppingCart />Shop</Link></SheetClose>
                 <SheetClose asChild><Link href="/pricing" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group"><DollarSign />{t('navPricing')}</Link></SheetClose>
                 <SheetClose asChild><Link href="/affiliate" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group"><Handshake />{t('navAffiliate')}</Link></SheetClose>
                 <SheetClose asChild><Link href="/blog" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group"><FileText/>{t('footerBlog')}</Link></SheetClose>
                 <SheetClose asChild><Link href="/contact" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group"><HelpCircle/>{t('footerSupport')}</Link></SheetClose>
                 <SheetClose asChild><Link href="/community" className="flex items-center gap-4 text-lg font-headline text-foreground/80 hover:text-primary transition-colors p-3 rounded-md group"><Handshake/>{t('footerCommunity')}</Link></SheetClose>
              </nav>
              <div className="absolute bottom-4 left-4 right-4 p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Languages className="mr-2 h-4 w-4" />
                        {language === 'de' ? 'Sprache' : 'Language'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onSelect={() => setLanguage('de')}>Deutsch</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setLanguage('en')}>English</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Menu - Hidden on small screens */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4">
              {navLinks.map(link => (
                  <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
              ))}
              <ThemeSwitcher />
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Languages className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                    <DropdownMenuItem onSelect={() => setLanguage('de')}>Deutsch</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('en')}>English</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
           <AuthStateContent />
        </nav>
      </div>
    </header>
  );
}
