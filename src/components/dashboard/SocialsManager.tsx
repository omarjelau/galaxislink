
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { BusinessCard, SocialLink } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { socialPlatforms, getSocialIcon } from '@/lib/social-icons';
import { nanoid } from 'nanoid';


type PlatformName = string;

export function SocialsManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<PlatformName | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null); // To track which link is being edited
  const [isSaving, setIsSaving] = useState(false);

  const businessCardRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/businessCards/main`) : null),
    [firestore, user]
  );
  const { data: businessCard, isLoading: isCardLoading } = useDoc<BusinessCard>(businessCardRef);

  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    if (businessCard?.socials) {
      // Ensure all socials have a unique ID
      const socialsWithIds = businessCard.socials.map(s => ({ ...s, id: s.id || nanoid(10) }));
      setSocials(socialsWithIds);
    }
  }, [businessCard]);

  const openAddDialog = (platformName: PlatformName) => {
    setCurrentPlatform(platformName);
    setCurrentUrl('');
    setCurrentColor('');
    setCurrentId(null);
    setDialogOpen(true);
  };
  
  const openEditDialog = (social: SocialLink) => {
    if (!social.id || !social.platform) return;
    setCurrentPlatform(social.platform);
    setCurrentUrl(social.url);
    setCurrentColor(social.color || '');
    setCurrentId(social.id);
    setDialogOpen(true);
  }

  const handleSaveSocial = async () => {
    if (!currentPlatform || !currentUrl) {
      toast({ title: 'URL is required.', variant: 'destructive' });
      return;
    }
    if (!businessCardRef) return;

    setIsSaving(true);
    
    let newSocials = [...socials];
    
    if (currentId) { // Editing an existing link
        const existingIndex = newSocials.findIndex(s => s.id === currentId);
        if (existingIndex > -1) {
            newSocials[existingIndex] = { ...newSocials[existingIndex], platform: currentPlatform, url: currentUrl, color: currentColor || undefined };
        }
    } else { // Adding a new link
        newSocials.push({ platform: currentPlatform, url: currentUrl, id: nanoid(10), color: currentColor || undefined });
    }

    try {
      await setDoc(businessCardRef, { socials: newSocials }, { merge: true });
      toast({ title: 'Social link saved!' });
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving social link:', error);
      toast({ title: 'Failed to save link.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleRemoveSocial = async (idToRemove: string) => {
      if (!businessCardRef) return;
      const newSocials = socials.filter(s => s.id !== idToRemove);
      try {
        await setDoc(businessCardRef, { socials: newSocials }, { merge: true });
        toast({ title: `Link removed.`, variant: 'destructive' });
      } catch (error) {
         console.error('Error removing social link:', error);
         toast({ title: 'Failed to remove link.', variant: 'destructive' });
      }
  }

  if (isCardLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const allPlatforms = Object.values(socialPlatforms).flat();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Contact & Social Media</CardTitle>
          <CardDescription>
            Add links to your contact methods and social profiles. These will be displayed on your business card.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {Object.entries(socialPlatforms).map(([category, platforms]) => (
                <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 font-headline">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {platforms.map(platform => {
                            const IconComp = getSocialIcon(platform.name);
                            return (
                                <div
                                    key={platform.name}
                                    className="flex items-center justify-between p-3 rounded-lg text-white"
                                    style={{ backgroundColor: platform.color }}
                                >
                                    <div className="flex items-center gap-3">
                                    <IconComp className="h-6 w-6" />
                                    <span className="font-medium">{platform.name}</span>
                                    </div>
                                    <button
                                        onClick={() => openAddDialog(platform.name)}
                                        className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center"
                                    >
                                    <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Added Links</CardTitle>
          <CardDescription>
            Manage your connected profiles and contact methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {socials.length > 0 ? socials.map(social => {
             if (!social.id || !social.platform) return null;
             const platformInfo = allPlatforms.find(p => p.name.toLowerCase() === social.platform!.toLowerCase());
             if (!platformInfo) return null;

             const IconComp = getSocialIcon(platformInfo.name);

             return (
                <div key={social.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                     <div className="flex items-center gap-3">
                         <IconComp className="h-6 w-6" style={{color: social.color || platformInfo.color}}/>
                         <div className="flex-1">
                            <p className="font-semibold">{social.platform}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">{social.url}</p>
                         </div>
                     </div>
                     <div className="flex items-center gap-2">
                         <Button variant="ghost" size="icon" onClick={() => openEditDialog(social as SocialLink)}>
                             <span className="sr-only">Edit</span>
                             <Edit className="h-4 w-4"/>
                         </Button>
                         <Button variant="ghost" size="icon" onClick={() => handleRemoveSocial(social.id!)}>
                             <span className="sr-only">Remove</span>
                             <Trash2 className="h-4 w-4 text-destructive"/>
                         </Button>
                     </div>
                </div>
             )
          }) : (
              <p className="text-muted-foreground text-center py-8">You haven't added any social links yet.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentId ? `Edit ${currentPlatform}` : `Add ${currentPlatform}`}</DialogTitle>
            <DialogDescription>
              Enter the full URL for your {currentPlatform} profile and optionally set a custom color.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="social-url">URL</Label>
              <Input
                id="social-url"
                value={currentUrl}
                onChange={e => setCurrentUrl(e.target.value)}
                placeholder={`https://www.${currentPlatform?.toLowerCase()}.com/your-username`}
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="social-color">Custom Color (optional)</Label>
              <div className="flex items-center gap-2">
                 <Input
                    id="social-color"
                    type="color"
                    value={currentColor}
                    onChange={e => setCurrentColor(e.target.value)}
                    className="w-16 p-1"
                />
                <Input
                    type="text"
                    value={currentColor}
                    onChange={e => setCurrentColor(e.target.value)}
                    placeholder="#FFFFFF"
                    className="flex-1"
                />
                <Button variant="outline" onClick={() => setCurrentColor('')}>Reset</Button>
               </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveSocial} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
