import Link from "next/link";
import { GalaxisLinkLogo } from "@/components/GalaxisLinkLogo";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function HowToOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-lg z-10">
        <div className="container mx-auto flex justify-between items-center">
             <Link href="/" aria-label="Back to Home">
                <GalaxisLinkLogo />
            </Link>
        </div>
       </header>
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
