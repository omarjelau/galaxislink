'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Link as LinkIcon, BarChart, Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, collectionGroup } from 'firebase/firestore';
import type { UserProfile, Link as LinkType } from "@/lib/types";

function StatCard({ title, value, icon, description, isLoading }: { title: string, value: string | number, icon: React.ReactNode, description: string, isLoading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const linksQuery = useMemoFirebase(() => collectionGroup(firestore, 'links'), [firestore]);
  const { data: allLinks, isLoading: linksLoading } = useCollection<LinkType>(linksQuery);

  const totalUsers = users?.length ?? 0;
  const totalLinks = allLinks?.length ?? 0;
  const totalClicks = allLinks?.reduce((sum, link) => sum + (link.clicks || 0), 0) ?? 0;
  
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Admin Overview</h1>
        <p className="text-muted-foreground">A high-level view of the GalaxisLink platform.</p>
      </header>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
         <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Total number of registered users."
          isLoading={usersLoading}
        />
        <StatCard
          title="Total Links Created"
          value={totalLinks}
          icon={<LinkIcon className="h-4 w-4 text-muted-foreground" />}
          description="Total links across all pages."
          isLoading={linksLoading}
        />
        <StatCard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
          icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
          description="Platform-wide link clicks."
          isLoading={linksLoading}
        />
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Welcome, Admin!</CardTitle>
                <CardDescription>
                    This is your central hub for managing the GalaxisLink platform. Use the navigation on the left to manage users, view analytics, and configure settings. This area is under construction and more features will be added soon.
                </CardDescription>
            </CardHeader>
       </Card>
    </div>
  );
}
