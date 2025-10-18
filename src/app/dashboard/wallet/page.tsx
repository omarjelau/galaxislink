
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Crown, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { BusinessCard, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';


export default function WalletPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();


    const userProfileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}`) : null, [firestore, user]);
    const { data: userProfile } = useDoc<UserProfile>(userProfileRef);


    const handleVCardDownload = () => {
        if (user) {
            window.open(`/api/vcard?userId=${user.uid}&cardId=main`, '_blank');
        }
    };
    
    const handleCreateWalletPass = async () => {
        toast({
            title: "Demnächst verfügbar",
            description: "Die Wallet-Pass-Funktion wird in Kürze verfügbar sein!",
        });
        return;
    }


    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-4">
                     <h1 className="text-3xl font-bold tracking-tight font-headline">Wallet Management</h1>
                     <Badge variant="outline">Upcoming Feature</Badge>
                </div>
                <p className="text-muted-foreground">Generate and manage your digital wallet passes and vCards.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Your Digital Pass</CardTitle>
                    <CardDescription>
                        Generate a pass for your digital business card to easily share it and add it to Google Wallet or Apple Wallet.
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                        <Wallet className="w-10 h-10 text-primary mb-4" />
                        <h3 className="font-bold text-lg font-headline">Coming Soon</h3>
                        <p className="text-muted-foreground text-sm mb-4 text-center px-4">This feature is currently under development and will be available soon.</p>
                    </div>
                    <Button disabled>
                        <Wallet className="mr-2 h-4 w-4" />
                        Generate Wallet Pass
                    </Button>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>vCard Download</CardTitle>
                    <CardDescription>
                        Generate a standard `.vcf` file that can be imported into any contact application on any device.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={handleVCardDownload} variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        Download vCard (.vcf)
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
