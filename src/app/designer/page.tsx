
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { QRCode } from 'react-qrcode-logo';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { BusinessCard, CardDesign, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

function CardFacePreview({
  design,
  face,
  qrUrl,
}: {
  design: CardDesign;
  face: 'front' | 'back';
  qrUrl: string;
}) {
  const isFullBleed = design.frontLogoSize === 100;

  return (
    <div
      className={cn(
        "aspect-[85.6/53.98] w-full rounded-xl flex items-center justify-center shadow-lg border-4 border-gray-600 overflow-hidden relative",
        !isFullBleed && "p-4"
        )}
      style={{ backgroundColor: design.cardBackgroundColor || '#1f2937' }}
    >
      {face === 'front' && design.frontLogoUrl && (
         <div
          className="relative transition-all duration-200 ease-in-out w-full h-full"
          style={!isFullBleed ? { width: `${design.frontLogoSize || 50}%`, height: `${design.frontLogoSize || 50}%` } : {}}
        >
          <Image
            src={design.frontLogoUrl}
            alt="Card Logo"
            layout="fill"
            className={cn(isFullBleed ? "object-cover" : "object-contain")}
          />
        </div>
      )}
      {face === 'back' && (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="bg-white p-1 rounded-md">
             <QRCode
                value={qrUrl}
                size={80}
                qrStyle="squares"
                fgColor={design.backQrColor || '#000000'}
                bgColor={design.backQrBackgroundColor || '#FFFFFF'}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PhysicalCardDesignerPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessCardId = searchParams.get('card') || 'main';

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const businessCardRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/businessCards`, businessCardId) : null, [firestore, user, businessCardId]);
  const { data: businessCard, isLoading: isCardLoading } = useDoc<BusinessCard>(businessCardRef);

  const [design, setDesign] = useState<CardDesign>({
    frontLogoUrl: businessCard?.cardDesign?.frontLogoUrl || 'https://cdn.worldvectorlogo.com/logos/bmw.svg',
    frontLogoSize: businessCard?.cardDesign?.frontLogoSize || 40,
    backQrColor: businessCard?.cardDesign?.backQrColor || '#000000',
    backQrBackgroundColor: businessCard?.cardDesign?.backQrBackgroundColor || '#FFFFFF',
    cardBackgroundColor: businessCard?.cardDesign?.cardBackgroundColor || '#1f2937'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  
  useEffect(() => {
    if (businessCard?.cardDesign) {
      setDesign(prev => ({...prev, ...businessCard.cardDesign}));
    }
  }, [businessCard]);


  const handleDesignChange = (field: keyof CardDesign, value: any) => {
    setDesign(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageUpload = (url: string) => {
    handleDesignChange('frontLogoUrl', url);
  }

  const handleSave = async () => {
    if (!businessCardRef) {
        toast({ title: 'Error', description: 'Cannot save, user not logged in.', variant: 'destructive' });
        return;
    }
    setIsSaving(true);
    try {
        await setDoc(businessCardRef, { cardDesign: design }, { merge: true });
        toast({ title: 'Success', description: 'Your card design has been saved.' });
        // Optionally redirect or give further instructions
        router.push('/dashboard/card?page=' + businessCardId);
    } catch (error) {
        console.error('Saving card design failed:', error);
        toast({ title: 'Error', description: 'Failed to save card design.', variant: 'destructive' });
    } finally {
        setIsSaving(false);
    }
  };
  
  const userProfileUrl = `https://galaxislink.com/${userProfile?.username || ''}`;

   if (isCardLoading) {
      return (
          <div className="flex justify-center items-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      )
  }

  return (
     <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        
        <div className="space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-tight font-headline">Physical Card Designer</h1>
            <p className="text-muted-foreground mt-2">Design the front and back of your premium NFC card.</p>
          </header>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'front' | 'back')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="front">Front Side</TabsTrigger>
              <TabsTrigger value="back">Back Side</TabsTrigger>
            </TabsList>
            <TabsContent value="front" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Front Design</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUploader label="Upload Your Logo" value={design.frontLogoUrl || ''} onUploadComplete={handleImageUpload} />
                  <div>
                    <Label className="font-semibold">Logo Size: {design.frontLogoSize}%</Label>
                    <Slider
                      value={[design.frontLogoSize || 40]}
                      onValueChange={(value) => handleDesignChange('frontLogoSize', value[0])}
                      min={10}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="back" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Back Design</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="qrColor">QR Code Color</Label>
                        <Input id="qrColor" type="color" value={design.backQrColor} onChange={(e) => handleDesignChange('backQrColor', e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="qrBgColor">QR Background</Label>
                        <Input id="qrBgColor" type="color" value={design.backQrBackgroundColor} onChange={(e) => handleDesignChange('backQrBackgroundColor', e.target.value)} />
                      </div>
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="cardBgColor">Card Background</Label>
                    <Input id="cardBgColor" type="color" value={design.cardBackgroundColor} onChange={(e) => handleDesignChange('cardBackgroundColor', e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>

         <div className="flex flex-col gap-8">
           <Card>
             <CardHeader>
                <CardTitle className="font-headline text-center">Live Preview</CardTitle>
             </CardHeader>
             <CardContent>
               <CardFacePreview design={design} face={activeTab} qrUrl={userProfileUrl} />
            </CardContent>
          </Card>
           <p className="text-center text-sm text-muted-foreground">This is a digital preview. Colors and materials may vary on the final product.</p>
        </div>

        <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border flex justify-end items-center gap-4 mt-8">
            <Button onClick={handleSave} disabled={isSaving} size="lg">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Design
            </Button>
          </div>
      </div>
    </div>
  );
}
