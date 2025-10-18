
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { BusinessCard, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { SocialsManager } from './SocialsManager';
import { ImageUploader } from './ImageUploader';
import { getString } from '@/lib/utils';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';

interface CardEditorProps {
  userId: string;
  businessCardId: string;
}

export function CardEditor({ userId, businessCardId }: CardEditorProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const businessCardRef = useMemoFirebase(() => doc(firestore, `users/${userId}/businessCards/${businessCardId}`), [firestore, userId, businessCardId]);
  const { data: businessCard, isLoading: isCardLoading } = useDoc<BusinessCard>(businessCardRef);
  
  const [formData, setFormData] = useState<Partial<BusinessCard>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Use a ref to hold the latest image URLs to prevent state closure issues
  const imageUrlsRef = useRef({
      avatarUrl: businessCard?.avatarUrl,
      coverPhotoUrl: businessCard?.coverPhotoUrl,
      companyLogoUrl: businessCard?.companyLogoUrl,
  });

  useEffect(() => {
    if (businessCard) {
      setFormData(businessCard);
      // Sync ref with fetched data
      imageUrlsRef.current.avatarUrl = businessCard.avatarUrl;
      imageUrlsRef.current.coverPhotoUrl = businessCard.coverPhotoUrl;
      imageUrlsRef.current.companyLogoUrl = businessCard.companyLogoUrl;
    }
  }, [businessCard]);

  const handleInputChange = useCallback((field: keyof BusinessCard, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleImageUpload = useCallback((field: keyof BusinessCard, url: string) => {
    // Update both the form state for visual feedback and the ref for reliable saving
    setFormData(prevData => ({ ...prevData, [field]: url }));
    if (field === 'avatarUrl' || field === 'coverPhotoUrl' || field === 'companyLogoUrl') {
        imageUrlsRef.current[field] = url;
    }
  }, []);

  const handleSaveChanges = useCallback(async (showToast = true) => {
    if (!userId || !businessCardRef) return;
    setIsSaving(true);
    
    // Construct the data to save using the latest values from the form and the reliable image URL ref
    const dataToSave: Partial<BusinessCard> = {
      ...formData,
      avatarUrl: imageUrlsRef.current.avatarUrl,
      coverPhotoUrl: imageUrlsRef.current.coverPhotoUrl,
      companyLogoUrl: imageUrlsRef.current.companyLogoUrl,
    };

    try {
      await setDoc(businessCardRef, dataToSave, { merge: true });
      if (showToast) {
        toast({
            title: "Success!",
            description: "Your business card has been updated.",
        });
      }
    } catch (error) {
      console.error(error);
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to save changes.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, [userId, businessCardRef, formData, toast]);


  if (isCardLoading) {
      return (
          <div className="flex justify-center items-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="space-y-8">
      <Card>
          <CardHeader>
              <CardTitle className="font-headline">Create Business Card</CardTitle>
              <CardDescription>Fill in the details for your digital business card. This information will be shareable via QR code and vCard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
               <ImageUploader 
                    label="Cover Picture" 
                    value={formData.coverPhotoUrl || ''} 
                    onUploadComplete={(url) => handleImageUpload('coverPhotoUrl', url)} 
                />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUploader 
                    label="Profile Picture" 
                    value={formData.avatarUrl || ''} 
                    onUploadComplete={(url) => handleImageUpload('avatarUrl', url)} 
                    />
                  <ImageUploader 
                    label="Company Logo" 
                    value={formData.companyLogoUrl || ''} 
                    onUploadComplete={(url) => handleImageUpload('companyLogoUrl', url)} 
                  />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="name">Name*</Label>
                      <Input id="name" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="pronoun">Pronoun</Label>
                      <Input id="pronoun" value={formData.pronouns || ''} onChange={(e) => handleInputChange('pronouns', e.target.value)} />
                  </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="job-title-en">Job Title (English)*</Label>
                      <Input id="job-title-en" value={getString(formData.jobTitle, 'en')} onChange={(e) => handleInputChange('jobTitle', { ... (typeof formData.jobTitle === 'object' ? formData.jobTitle : { de: '', en: ''}), en: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="job-title-de">Job Title (German)</Label>
                      <Input id="job-title-de" value={getString(formData.jobTitle, 'de')} onChange={(e) => handleInputChange('jobTitle', { ... (typeof formData.jobTitle === 'object' ? formData.jobTitle : { de: '', en: ''}), de: e.target.value })} />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="grid gap-2">
                      <Label htmlFor="company">Company*</Label>
                      <Input id="company" value={formData.company || ''} onChange={(e) => handleInputChange('company', e.target.value)} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="location">Location*</Label>
                      <Input id="location" value={formData.location || ''} onChange={(e) => handleInputChange('location', e.target.value)} />
                  </div>
              </div>

               <div className="grid gap-2">
                  <Label htmlFor="bio">Bio*</Label>
                  <Textarea value={getString(formData.bio, 'en')} onChange={(e) => handleInputChange('bio', { ... (typeof formData.bio === 'object' ? formData.bio : { de: '', en: ''}), en: e.target.value })} placeholder="Tell us a little about yourself (English)" />
                  <Textarea value={getString(formData.bio, 'de')} onChange={(e) => handleInputChange('bio', { ... (typeof formData.bio === 'object' ? formData.bio : { de: '', en: ''}), de: e.target.value })} placeholder="Tell us a little about yourself (German)" />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input id="email" type="email" value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="phone">Phone*</Label>
                  <Input id="phone" type="tel" value={formData.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
                  </div>
              </div>
               <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label className="font-semibold">Icons per Row: {formData.iconsPerRow || 5}</Label>
                  <Slider
                    value={[formData.iconsPerRow || 5]}
                    onValueChange={(value) => handleInputChange('iconsPerRow', value[0])}
                    min={2}
                    max={6}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="font-semibold">Icon Size: {formData.iconSize || 40}px</Label>
                  <Slider
                    value={[formData.iconSize || 40]}
                    onValueChange={(value) => handleInputChange('iconSize', value[0])}
                    min={24}
                    max={64}
                    step={4}
                    className="mt-2"
                  />
                </div>
              </div>
               <div className="space-y-4 pt-4 border-t">
                 <Label className="font-semibold">Sharing Permissions</Label>
                 <div className="flex items-center space-x-2 border p-3 rounded-lg">
                    <Switch 
                        id="allow-qr-download" 
                        checked={formData.allowQrCodeDownload} 
                        onCheckedChange={(checked) => handleInputChange('allowQrCodeDownload', checked)}
                    />
                    <Label htmlFor="allow-qr-download">Allow QR Code Download</Label>
                 </div>
              </div>

          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSaveChanges(true)} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
      </Card>

      <SocialsManager />
    
    </div>
  );
}
