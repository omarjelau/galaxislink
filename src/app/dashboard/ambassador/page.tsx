
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Loader2, Copy, BarChart, Gift, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function AmbassadorDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}`) : null, [user, firestore]);
  const { data: userProfile, isLoading } = useDoc<UserProfile>(userProfileRef);

  const referralLink = userProfile ? `${window.location.origin}/signup?ref=${userProfile.username}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!userProfile || userProfile.ambassadorStatus !== 'approved') {
    // Redirect non-approved users to the application page
    router.push('/affiliate');
    // Render a loader while redirecting
    return (
        <div className="flex justify-center items-center h-64">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Ambassador Dashboard</h1>
        <p className="text-muted-foreground">Welcome! Here's everything you need to succeed as a GalaxisLink Ambassador.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link to earn commissions on new sign-ups.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
            <div className="flex-grow p-2 border rounded-md bg-muted text-sm font-mono">{referralLink}</div>
            <Button onClick={copyToClipboard} size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
        </CardContent>
      </Card>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard title="Total Sign-ups" value="0" icon={<BarChart />} />
            <StatCard title="Total Earnings" value="€0.00" icon={<BarChart />} />
       </div>

        <Card>
            <CardHeader>
                <CardTitle>Marketing Assets</CardTitle>
                <CardDescription>Download logos and banners to help you promote GalaxisLink.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-x-2">
                    <Button variant="outline" disabled>Download Logos</Button>
                    <Button variant="outline" disabled>Download Banners</Button>
                </div>
                 <p className="text-xs text-muted-foreground mt-2">Assets coming soon.</p>
            </CardContent>
        </Card>
    </div>
  );
}
