
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const planColors: { [key: string]: string } = {
    free: 'bg-gray-500',
    basic: 'bg-blue-500',
    premium: 'bg-purple-600',
    enterprise: 'bg-black'
};

export default function AdminUsersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const handlePlanChange = async (userId: string, newPlan: string) => {
    const userDocRef = doc(firestore, 'users', userId);
    try {
      await updateDoc(userDocRef, { plan: newPlan });
      toast({
        title: "Plan updated!",
        description: `User's plan has been changed to ${newPlan}.`
      });
    } catch (error) {
      console.error("Failed to update user plan:", error);
      toast({
        title: "Error",
        description: "Could not update the user's plan.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">User Management</h1>
        <p className="text-muted-foreground">View, manage, and monitor all users on the platform.</p>
      </header>
       <Card>
        <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
                Here you can view and manage all registered users and their subscription plans.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Current Plan</TableHead>
                            <TableHead>Change Plan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                                        <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.displayName}</span>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge style={{ backgroundColor: planColors[user.plan || 'free'] }} className="text-white hover:text-black">
                                        {user.plan || 'free'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={user.plan || 'free'}
                                        onValueChange={(value) => handlePlanChange(user.id, value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="basic">Basic</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                            <SelectItem value="enterprise">Enterprise</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
