'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { UserProfile } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function AdminAnalyticsPage() {
  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const userGrowthData = useMemo(() => {
    if (!users) return [];
    const monthlySignups: { [key: string]: number } = {};
    users.forEach(user => {
      if (user.createdAt && 'toDate' in user.createdAt) {
        const date = user.createdAt.toDate();
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlySignups[month]) {
          monthlySignups[month] = 0;
        }
        monthlySignups[month]++;
      }
    });

    return Object.keys(monthlySignups).sort().map(month => ({
      month,
      users: monthlySignups[month],
    }));
  }, [users]);
  
  const planDistributionData = useMemo(() => {
    if (!users) return [];
    const distribution = {
        free: 0,
        basic: 0,
        premium: 0,
        enterprise: 0
    };
    users.forEach(user => {
        const plan = user.plan || 'free';
        if (plan in distribution) {
            distribution[plan]++;
        }
    });

    return Object.keys(distribution).map(name => ({
        name,
        value: distribution[name as keyof typeof distribution]
    })).filter(item => item.value > 0);
  }, [users]);


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Platform Analytics</h1>
        <p className="text-muted-foreground">An overview of platform-wide trends and statistics.</p>
      </header>
       {isLoading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
       ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>
                        Monthly new user registrations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userGrowthData}>
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <Tooltip />
                            <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Plan Distribution</CardTitle>
                    <CardDescription>
                        Distribution of users across subscription plans.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                       <PieChart>
                          <Pie
                            data={planDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {planDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
       )}
    </div>
  );
}
