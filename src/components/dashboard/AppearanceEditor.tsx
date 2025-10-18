
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Check, Crown, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { LinkPage, UserProfile, Link as LinkType, BusinessCard } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { ProfilePage, ProfilePageProps } from '../public/ProfilePage';
import { Badge } from '../ui/badge';
import Link from 'next/link';

type Plan = 'free' | 'basic' | 'premium' | 'enterprise';

const themes = [
  { name: 'Default', id: 'light', bg: 'bg-background', text: 'text-primary', class: '', plan: 'free' },
  { name: 'Emerald', id: 'emerald', bg: 'bg-[#152525]', text: 'text-[#2E8B57]', class: 'theme-emerald', plan: 'basic' },
  { name: 'Amethyst', id: 'amethyst', bg: 'bg-[#1e192f]', text: 'text-[#9b59b6]', class: 'theme-amethyst', plan: 'basic' },
  { name: 'Bronze', id: 'bronze', bg: 'bg-[#2a2a2a]', text: 'text-[#cd7f32]', class: 'theme-bronze', plan: 'basic' },
  { name: 'Sapphire', id: 'sapphire', bg: 'bg-[#0f172a]', text: 'text-[#3b82f6]', class: 'theme-sapphire', plan: 'premium' },
  { name: 'Ruby', id: 'ruby', bg: 'bg-[#2f191e]', text: 'text-[#ef4444]', class: 'theme-ruby', plan: 'premium' },
  { name: 'Gold', id: 'gold', bg: 'bg-[#2a2a2a]', text: 'text-[#f59e0b]', class: 'theme-gold', plan: 'premium' },
  { name: 'Obsidian', id: 'obsidian', bg: 'bg-[#101010]', text: 'text-[#a78bfa]', class: 'theme-obsidian', plan: 'premium' },
  { name: 'Sakura', id: 'sakura', bg: 'bg-[#2f192b]', text: 'text-[#f472b6]', class: 'theme-sakura', plan: 'premium' },
  { name: 'Lavender', id: 'lavender', bg: 'bg-[#f5f3ff]', text: 'text-[#8b5cf6]', class: 'theme-lavender', plan: 'premium' },
  { name: 'Mint', id: 'mint', bg: 'bg-[#f0fff8]', text: 'text-[#20c997]', class: 'theme-mint', plan: 'premium' },
  { name: 'Crimson', id: 'crimson', bg: 'bg-[#1a0f14]', text: 'text-[#dc143c]', class: 'theme-crimson', plan: 'premium' },
];

const fontStyles = [
  { name: 'Modern', id: 'modern', family: 'font-body' },
  { name: 'Elegant', id: 'elegant', family: 'font-headline' },
  { name: 'Serif', id: 'serif', family: 'font-serif' },
  { name: 'Classic', id: 'classic', family: 'font-classic' },
  { name: 'Display', id: 'display', family: 'font-display' },
  { name: 'Handwriting', id: 'handwriting', family: 'font-handwriting' },
  { name: 'Playful', id: 'playful', family: 'font-code' },
];

const buttonStyles = [
  { name: 'Soft', id: 'soft', class: 'rounded-sm' },
  { name: 'Rounded', id: 'rounded', class: 'rounded-lg' },
  { name: 'Pill', id: 'pill', class: 'rounded-xl' },
  { name: 'Full', id: 'full', class: 'rounded-full' },
  { name: 'Sharp', id: 'sharp', class: 'rounded-none' },
];


// Dummy data for preview purposes
const dummyLinks: LinkType[] = [
    { id: '1', title: { en: 'My Portfolio', de: 'Mein Portfolio' }, url: '#', clicks: 0, createdAt: new Date(), linkPageId: 'main', userId: 'preview' },
    { id: '2', title: { en: 'Latest Video', de: 'Neuestes Video' }, url: '#', clicks: 0, createdAt: new Date(), linkPageId: 'main', userId: 'preview' },
    { id: '3', title: { en: 'Book a Call', de: 'Termin buchen' }, url: '#', clicks: 0, createdAt: new Date(), linkPageId: 'main', userId: 'preview' },
];

const planPermissions: Record<Plan, { themes: string[] }> = {
    free: { themes: ['light'] },
    basic: { themes: ['light', 'emerald', 'amethyst', 'bronze'] },
    premium: { themes: themes.map(t => t.id) },
    enterprise: { themes: themes.map(t => t.id) },
};

export function AppearanceEditor() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pageId = searchParams.get('page') || 'main';
  
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}`) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const linkPageRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/linkPages/${pageId}`) : null, [firestore, user, pageId]);
  const { data: linkPageData, isLoading: isLinkPageLoading } = useDoc<LinkPage>(linkPageRef);
  
  const businessCardRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/businessCards/main`) : null, [firestore, user]);
  const { data: businessCardData, isLoading: isCardLoading } = useDoc<BusinessCard>(businessCardRef);
  
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedFontStyle, setSelectedFontStyle] = useState('modern');
  const [selectedButtonStyle, setSelectedButtonStyle] = useState('rounded');
  const [buttonShadow, setButtonShadow] = useState(true);
  const [showBranding, setShowBranding] = useState(true);
  const [iconsPerRow, setIconsPerRow] = useState(5);
  const [iconSize, setIconSize] = useState(40);

  const [isSaving, setIsSaving] = useState(false);

  const maxIconSize = useMemo(() => {
    if (iconsPerRow >= 5) return 32;
    if (iconsPerRow === 4) return 48;
    return 64;
  }, [iconsPerRow]);

  useEffect(() => {
    if (linkPageData) {
      setSelectedTheme(linkPageData.theme || 'light');
      setSelectedFontStyle(linkPageData.fontStyle || 'modern');
      setSelectedButtonStyle(linkPageData.buttonStyle || 'rounded');
      setButtonShadow(linkPageData.buttonShadow ?? true);
      setShowBranding(linkPageData.showBranding ?? true);
      setIconsPerRow(linkPageData.iconsPerRow || 5);
      setIconSize(linkPageData.iconSize || 40);
    }
  }, [linkPageData]);

  
  const handleIconsPerRowChange = (value: number) => {
    setIconsPerRow(value);
    
    let newMaxIconSize = 64;
    if (value >= 5) newMaxIconSize = 32;
    else if (value === 4) newMaxIconSize = 48;

    if (iconSize > newMaxIconSize) {
      setIconSize(newMaxIconSize);
    }
  };
  
  const handleSave = async () => {
    if (!user || !linkPageRef || !businessCardRef) return;
    setIsSaving(true);

    const finalIconSize = Math.min(iconSize, maxIconSize);

    const linkPageUpdates: Partial<LinkPage> = {
        theme: selectedTheme,
        fontStyle: selectedFontStyle,
        buttonStyle: selectedButtonStyle,
        buttonShadow: buttonShadow,
        showBranding: showBranding,
        iconsPerRow: iconsPerRow,
        iconSize: finalIconSize,
    };
    
    const cardUpdates: Partial<BusinessCard> = {
        iconsPerRow: iconsPerRow,
        iconSize: finalIconSize,
    }

    try {
      await Promise.all([
        setDoc(linkPageRef, linkPageUpdates, { merge: true }),
        setDoc(businessCardRef, cardUpdates, { merge: true }),
      ]);
      toast({
        title: "Appearance saved!",
        description: "Your page and card have been updated with the new styles.",
      });
    } catch (error) {
      console.error("Error saving appearance:", error);
      toast({
        title: "Error",
        description: "Could not save your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const isLoading = isLinkPageLoading || isProfileLoading || isCardLoading;
  const userPlan = userProfile?.plan || 'free';
  const allowedThemes = planPermissions[userPlan as Plan].themes;
  const canRemoveBranding = userPlan === 'premium' || userPlan === 'enterprise';

  const handleThemeSelect = (themeId: string) => {
    if (allowedThemes.includes(themeId)) {
        setSelectedTheme(themeId);
    } else {
        toast({
            title: "Upgrade Required",
            description: "This theme is only available on a higher plan.",
            variant: "destructive"
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Page Customization</CardTitle>
        <CardDescription>Fine-tune the look and feel of your VibeLink page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
          <div>
            <Label className="font-semibold">Theme</Label>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
                {themes.map((theme) => {
                  const isAllowed = allowedThemes.includes(theme.id);
                  return (
                      <div key={theme.id} className="relative">
                          <button className="w-full disabled:cursor-not-allowed" onClick={() => handleThemeSelect(theme.id)} disabled={!isAllowed}>
                              <div className={cn("relative aspect-[4/3] rounded-lg flex items-center justify-center border-2", theme.bg, selectedTheme === theme.id ? 'border-primary' : 'border-border', !isAllowed ? 'opacity-50' : 'hover:border-primary/70')}>
                              <span className={`font-bold ${theme.text}`}>Aa</span>
                              {selectedTheme === theme.id && (
                                  <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5 text-primary-foreground">
                                  <Check className="h-3 w-3" />
                                  </div>
                              )}
                              </div>
                          </button>
                          <p className="text-center text-xs mt-2 font-medium truncate">{theme.name}</p>
                          {!isAllowed && (
                              <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-lg">
                                  <Link href="/pricing">
                                      <Badge variant="default" className="cursor-pointer hover:scale-105 transition-transform"><Crown className="h-3 w-3 mr-1" /> Pro</Badge>
                                  </Link>
                              </div>
                          )}
                      </div>
                  )
                })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="font-style" className="font-semibold">Font Style</Label>
                <Select value={selectedFontStyle} onValueChange={setSelectedFontStyle}>
                    <SelectTrigger id="font-style" className="mt-2">
                      <SelectValue placeholder="Select a font style" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontStyles.map(font => (
                         <SelectItem key={font.id} value={font.id} className={font.family}>{font.name}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="button-style" className="font-semibold">Button Style</Label>
                <Select value={selectedButtonStyle} onValueChange={setSelectedButtonStyle}>
                    <SelectTrigger id="button-style" className="mt-2">
                      <SelectValue placeholder="Select a button style" />
                    </SelectTrigger>
                    <SelectContent>
                      {buttonStyles.map(style => (
                         <SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="font-semibold">Icons per Row: {iconsPerRow}</Label>
              <Slider
                value={[iconsPerRow]}
                onValueChange={(value) => handleIconsPerRowChange(value[0])}
                min={2}
                max={6}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="font-semibold">Icon Size: {iconSize}px</Label>
              <Slider
                value={[iconSize]}
                onValueChange={(value) => setIconSize(value[0])}
                min={24}
                max={maxIconSize}
                step={4}
                className="mt-2"
              />
            </div>
          </div>

          <div>
              <Label className="font-semibold">Effects & Branding</Label>
              <div className="space-y-3 mt-2">
                 <div className="flex items-center space-x-2 border p-3 rounded-lg">
                    <Switch 
                        id="button-shadow" 
                        checked={buttonShadow} 
                        onCheckedChange={setButtonShadow}
                    />
                    <Label htmlFor="button-shadow">Enable button shadow</Label>
                 </div>
                 <div className="flex items-center space-x-2 border p-3 rounded-lg">
                    <Switch 
                        id="show-branding" 
                        checked={!showBranding} 
                        onCheckedChange={(checked) => setShowBranding(!checked)}
                        disabled={!canRemoveBranding}
                    />
                    <Label htmlFor="show-branding" className={cn(!canRemoveBranding && "text-muted-foreground")}>
                        Hide GalaxisLink branding
                    </Label>
                     {!canRemoveBranding && <Link href="/pricing"><Badge variant="default" className="ml-auto"><Crown className="h-3 w-3 mr-1"/>Pro</Badge></Link>}
                 </div>
              </div>
          </div>

      </CardContent>
       <CardFooter>
         <Button onClick={handleSave} disabled={isSaving || isLoading}>
          {(isSaving || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
