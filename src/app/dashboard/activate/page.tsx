
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Nfc } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ActivateCardPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  // Initialize state with code from URL search params if it exists
  const [activationCode, setActivationCode] = useState(searchParams.get('code') || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      const code = searchParams.get('code');
      if (code) {
          setActivationCode(code);
      }
  }, [searchParams]);

  const handleActivation = async () => {
    if (!activationCode) {
      toast({
        title: 'Error',
        description: 'Please enter your activation code.',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to activate a card.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/activate-card', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.uid, // NOTE: Using a header for demo. Use a secure session in production.
        },
        body: JSON.stringify({ activationCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to activate card.');
      }

      toast({
        title: 'Success!',
        description: result.message,
      });
      setActivationCode('');
    } catch (error: any) {
      console.error('Activation failed:', error);
      toast({
        title: 'Activation Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Activate Your NFC Card</h1>
        <p className="text-muted-foreground">
          Enter the activation code found on your new card to link it to your profile.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Nfc className="text-primary" />
            Card Activation
          </CardTitle>
          <CardDescription>
            Once activated, tapping your card on a compatible device will open your GalaxisLink profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="activation-code">Activation Code</Label>
            <Input
              id="activation-code"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value.trim())}
              placeholder="Enter the code from your card"
              className="max-w-sm"
            />
          </div>
          <Button onClick={handleActivation} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Activate Card
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
