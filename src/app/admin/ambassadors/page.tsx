
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type AmbassadorApplication = {
  id: string;
  name: string;
  email: string;
  website: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: any;
};

const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500'
};

export default function AdminAmbassadorsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const applicationsQuery = useMemoFirebase(() => collection(firestore, 'ambassadorApplications'), [firestore]);
  const { data: applications, isLoading } = useCollection<AmbassadorApplication>(applicationsQuery);

  const handleStatusChange = async (application: AmbassadorApplication, newStatus: 'approved' | 'rejected') => {
    const appDocRef = doc(firestore, 'ambassadorApplications', application.id);
    
    const batch = writeBatch(firestore);
    batch.update(appDocRef, { status: newStatus });

    // If approved, find the user by email and update their profile
    if (newStatus === 'approved') {
        const usersRef = collection(firestore, 'users');
        const userQuery = query(usersRef, where('email', '==', application.email));
        
        try {
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                batch.update(userDoc.ref, { ambassadorStatus: 'approved' });
            } else {
                 toast({
                    title: "User Not Found",
                    description: `Could not find a user with email ${application.email} to grant ambassador status.`,
                    variant: "destructive"
                });
                return; // Stop if user is not found
            }

            await batch.commit();

            toast({
                title: "Status Updated!",
                description: `Application has been ${newStatus} and user status updated.`
            });

        } catch (error) {
             console.error("Failed to update status and user profile:", error);
            toast({
                title: "Error",
                description: "Could not update the application and user status.",
                variant: "destructive"
            });
        }
    } else {
        // If rejected, just update the application
        try {
             await batch.commit();
             toast({
                title: "Status Updated!",
                description: `Application has been ${newStatus}.`
            });
        } catch (error) {
            console.error("Failed to update status:", error);
            toast({
                title: "Error",
                description: "Could not update the application's status.",
                variant: "destructive"
            });
        }
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Ambassador Applications</h1>
        <p className="text-muted-foreground">Review and manage applications for the ambassador program.</p>
      </header>
       <Card>
        <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
                Here you can see all submitted applications and approve or reject them.
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
                            <TableHead>Applicant</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications?.map(app => (
                            <TableRow key={app.id}>
                                <TableCell>
                                    <div className="font-medium">{app.name}</div>
                                    <div className="text-sm text-muted-foreground">{app.email}</div>
                                </TableCell>
                                <TableCell>
                                    <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {app.website}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <Badge style={{ backgroundColor: statusColors[app.status] }} className="text-white">
                                        {app.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{app.submittedAt?.toDate().toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">Actions</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleStatusChange(app, 'approved')} disabled={app.status === 'approved'}>
                                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                                Approve
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(app, 'rejected')} disabled={app.status === 'rejected'}>
                                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                                Reject
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
