
'use client';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import type { UserProfile, Link as LinkType } from "@/lib/types";
import { Loader2, Link as LinkIcon, CreditCard, Palette, BarChart, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

function StatCard({ title, value, icon, description }: { title: string, value: string | number, icon: React.ReactNode, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ActionCard({ href, title, description, icon }: { href: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <Link href={href} className="block hover:scale-[1.02] transition-transform duration-200">
        <Card className="h-full bg-card/50 hover:bg-card/80 hover:border-primary/50 transition-all">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                {icon}
            </div>
            <div>
            <CardTitle className="font-headline text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            </div>
        </CardHeader>
        </Card>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  
  const linksQuery = useMemoFirebase(() =>
    user ? collection(firestore, `users/${user.uid}/linkPages/main/links`) : null,
    [firestore, user]
  );
  const { data: links, isLoading: areLinksLoading } = useCollection<LinkType>(linksQuery);

  const totalClicks = links?.reduce((acc, link) => acc + (link.clicks || 0), 0) ?? 0;
  const totalLinks = links?.length ?? 0;

  if (isProfileLoading || areLinksLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Welcome, {userProfile?.displayName || 'User'}!</h1>
        <p className="text-muted-foreground max-w-xs">Here's a quick overview of your GalaxisLink page.</p>
      </header>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
         <StatCard
          title="Total Link Clicks"
          value={totalClicks}
          icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
          description="Across all your links"
        />
        <StatCard
          title="Total Active Links"
          value={totalLinks}
          icon={<LinkIcon className="h-4 w-4 text-muted-foreground" />}
          description="Currently on your page"
        />
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
            href="/dashboard/hub"
            title="Manage Your Hub"
            description="Add, edit, and organize all your Link Pages and Business Cards."
            icon={<Share2 className="h-6 w-6" />}
        />
        <ActionCard
            href="/dashboard/appearance"
            title="Customize Appearance"
            description="Choose themes and style your page."
            icon={<Palette className="h-6 w-6" />}
        />
        <ActionCard
            href="/dashboard/analytics"
            title="View Full Analytics"
            description="Get detailed insights on your traffic."
            icon={<BarChart className="h-6 w-6" />}
        />
      </div>

    </div>
  );
}
