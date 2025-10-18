import Link from "next/link";
import { GalaxisLinkLogo } from "@/components/GalaxisLinkLogo";

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="p-4 border-b">
         <Link href="/" aria-label="Back to Home">
           <GalaxisLinkLogo />
        </Link>
       </header>
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
