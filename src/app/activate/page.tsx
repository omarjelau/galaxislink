'use client'; // <-- KORREKTE PLATZIERUNG: ALLERERSTE ZEILE

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

// Wir verwenden wieder nur EINE Komponente, da die gesamte Seite client-seitig ist.
export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activationCode = searchParams.get('code');
  const { user, isLoading: isUserLoading } = useUser();
  
  const [card, setCard] = useState<UnclaimedNFCCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firestore = getFirestore(initializeFirebase());
    
    const fetchCard = async () => {
      if (!activationCode) {
        setError("Kein Aktivierungscode gefunden. Bitte verwenden Sie den Link aus Ihrer E-Mail.");
        setLoading(false);
        return;
      }

      try {
        const cardDocRef = doc(firestore, 'unclaimedNFCCards', activationCode);
        const cardDoc = await getDoc(cardDocRef);

        if (cardDoc.exists()) {
          const cardData = cardDoc.data() as UnclaimedNFCCard;
          setCard(cardData);
          if (cardData.status !== 'unclaimed') {
            setError("Diese Karte wurde bereits beansprucht oder die Aktivierung ist abgelaufen.");
          }
        } else {
          setError("Ungültiger Aktivierungscode. Die Karte konnte nicht gefunden werden.");
        }
      } catch (err) {
        console.error(err);
        setError("Ein Fehler ist beim Abrufen der Kartendetails aufgetreten.");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [activationCode]);

  // Der Rest Ihres Codes bleibt unverändert
  if (loading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="h-12 w-12 animate-spin-slow text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Lade Kartendetails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (card) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Karte beanspruchen</CardTitle>
          <CardDescription>Sie sind dabei, die NFC-Karte zu beanspruchen.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Kartentyp: {card.cardType}</p>
          <p>Status: {card.status}</p>
          <Button className="w-full mt-4" disabled={!user}>
            {user ? "Karte jetzt mit meinem Konto verknüpfen" : "Bitte einloggen, um fortzufahren"}
          </Button>
          {!user && (
            <p className="text-center text-sm mt-2">
              <Link href="/login" className="underline">Zum Login</Link>
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return null; 
}
