"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { collection, doc } from 'firebase/firestore';
import type { Link, UserProfile } from '@/lib/types';
import { Activity, ArrowDownRight, ArrowUpRight, Calendar as CalendarIcon, Crown, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import NextLink from "next/link";


const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function PremiumFeatureLock() {
    return (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
            <Crown className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-bold text-lg font-headline">Premium Feature</h3>
            <p className="text-muted-foreground text-sm mb-4">Upgrade to access advanced analytics.</p>
            <Button asChild>
                <NextLink href="/pricing">Upgrade</NextLink>
            </Button>
        </div>
    )
}

export function Analytics() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [date, setDate] = useState<DateRange | undefined>()

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const linksQuery = useMemoFirebase(() =>
    user ? collection(firestore, `users/${user.uid}/linkPages/main/links`) : null,
    [firestore, user]
  );
  
  const { data: links, isLoading: areLinksLoading } = useCollection<Link>(linksQuery);
  const isLoading = isProfileLoading || areLinksLoading;
  
  const userPlan = userProfile?.plan || 'free';
  const isPremium = userPlan === 'premium' || userPlan === 'enterprise';

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  const totalClicks = links?.reduce((acc, link) => acc + (link.clicks || 0), 0) ?? 0;
  const totalLinks = links?.length ?? 0;
  const topLink = links?.reduce((max, link) => (link.clicks || 0) > (max.clicks || 0) ? link : max, links[0] ?? { title: 'N/A', clicks: 0 });
  const avgClicksPerLink = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0;
  // Placeholder for profile views
  const totalProfileViews = totalClicks * 3 + 17;


  const chartData = links?.map(link => ({
    link: typeof link.title === 'string' ? (link.title.length > 15 ? `${link.title.substring(0, 15)}...` : link.title) : 'N/A',
    clicks: link.clicks || 0
  })) ?? [];


  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all your links
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
            </svg>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold">{totalLinks}</div>
            <p className="text-xs text-muted-foreground">
              Currently on your page
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
             <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
              <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold truncate">{typeof topLink?.title === 'string' ? topLink.title : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {(topLink?.clicks ?? 0).toLocaleString()} clicks
            </p>
          </CardContent>
        </Card>
      </div>
      
       <Card className="relative">
         {!isPremium && <PremiumFeatureLock />}
         <CardHeader>
            <CardTitle>Advanced Analytics</CardTitle>
            <CardDescription>
                Get deeper insights into your profile's performance. This is a premium feature.
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Total Profile Views
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProfileViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Click-Through Rate</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgClicksPerLink}</div>
                        <p className="text-xs text-muted-foreground">
                         Average clicks per link
                        </p>
                    </CardContent>
                </Card>
            </div>
             <div>
                <div className={cn("grid gap-2")}>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
         </CardContent>
      </Card>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Link Performance</CardTitle>
            <CardDescription>An overview of clicks per link.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 0, bottom: 10, left: 0 }}>
                 <CartesianGrid vertical={false} />
                 <XAxis
                    dataKey="link"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                 />
                 <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="clicks" radius={4} fill="var(--color-clicks)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
           <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing click data for all active links.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
