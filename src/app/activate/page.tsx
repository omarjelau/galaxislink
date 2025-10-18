
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase, useUser } from '@/firebase';
import { Loader2, Nfc, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UnclaimedNFCCard } from '@/lib/types';

const { firestore } = initializeFirebase();

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activationCode = searchParams.get('code');
  const { user, isUserLoading } = useUser();

  const [card, setCard] = useState<UnclaimedNFCCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activationCode) {
      setError("No activation code provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchCard = async () => {
      const cardRef = doc(firestore, 'unclaimedNFCCards', activationCode);
      const cardSnap = await getDoc(cardRef);

      if (!cardSnap.exists()) {
        setError("This activation code is invalid.");
      } else {
        const cardData = cardSnap.data() as UnclaimedNFCCard;
        if (cardData.status === 'claimed') {
          setError("This card has already been claimed.");
        } else {
          setCard(cardData);
        }
      }
      setLoading(false);
    };

    fetchCard();
  }, [activationCode]);

  const handleActivation = () => {
    // If user is logged in, redirect to the dashboard activation page
    if (user) {
      router.push(`/dashboard/activate?code=${activationCode}`);
    } else {
      // If not logged in, redirect to signup, preserving the code
      router.push(`/signup?activationCode=${activationCode}`);
    }
  };

  const handleCancel = () => {
      router.push('/');
  }

  if (loading || isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
     return (
        <div className="flex h-screen w-full items-center justify-center p-4">
             <Alert variant="destructive" className="max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <CardTitle>Activation Error</CardTitle>
                <AlertDescription>
                    {error} Please check the code or contact support.
                </AlertDescription>
             </Alert>
        </div>
     )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-secondary/50">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <Nfc className="w-12 h-12 mx-auto text-primary"/>
                <CardTitle className="text-2xl font-headline mt-4">Activate Your New Card</CardTitle>
                <CardDescription>
                    This card is not yet linked to a profile. Click below to activate and connect it to your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Button onClick={handleActivation} className="w-full">
                    Activate Now
                </Button>
                 <Button variant="ghost" onClick={handleCancel} className="w-full">
                    Cancel
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
