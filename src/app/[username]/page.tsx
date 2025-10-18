

'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, increment, setDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { initializeFirebase, useMemoFirebase } from '@/firebase';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';
import type { UserProfile, Link as LinkType, BusinessCard, LinkPage } from '@/lib/types';
import { Loader2, Mail } from 'lucide-react';
import { AIChatAssistant } from '@/components/public/AIChatAssistant';
import { cn, getString } from '@/lib/utils';
import { LinkList } from '@/components/public/LinkList';
import { ShareActions } from '@/components/public/ShareActions';
import Link from 'next/link';
import { GalaxisLinkLogo } from '@/components/GalaxisLinkLogo';
import { InvitationPopup } from '@/components/public/InvitationPopup';
import { ProfileHeader } from '@/components/public/ProfileHeader';
import { SocialIcons } from '@/components/public/SocialIcons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';


const { firestore } = initializeFirebase();

async function getUserData(username: string): Promise<{ userProfile: UserProfile; links: LinkType[]; businessCard: BusinessCard; linkPage: LinkPage } | null> {
  const usersRef = collection(firestore, 'users');
  const userQuery = query(usersRef, where('username', '==', username));
  const userSnapshot = await getDocs(userQuery);

  if (userSnapshot.empty) {
    console.log(`User with username "${username}" not found.`);
    return null;
  }

  const userDoc = userSnapshot.docs[0];
  const userProfile = { id: userDoc.id, ...userDoc.data() } as UserProfile;

  const [linkPageSnapshot, linksSnapshot, cardSnapshot] = await Promise.all([
    getDoc(doc(firestore, `users/${userDoc.id}/linkPages/main`)),
    getDocs(query(collection(firestore, `users/${userDoc.id}/linkPages/main/links`), orderBy('order'))),
    getDoc(doc(firestore, `users/${userDoc.id}/businessCards/main`))
  ]);
  
  const linkPage: LinkPage = linkPageSnapshot.exists()
    ? { id: linkPageSnapshot.id, ...linkPageSnapshot.data() } as LinkPage
    : {
        id: 'main',
        userId: userDoc.id,
        title: `${userProfile.displayName}'s Page`,
        theme: 'default',
        createdAt: new Date(),
      };

  const links = linksSnapshot.docs.map(d => ({ id: d.id, ...d.data() }) as LinkType);
  
  const businessCard: BusinessCard = cardSnapshot.exists()
    ? { id: cardSnapshot.id, ...cardSnapshot.data() } as BusinessCard
    : {
        id: 'main',
        userId: userDoc.id,
        name: userProfile.displayName || '',
        email: userProfile.email || '',
        createdAt: new Date(),
        avatarUrl: userProfile.avatarUrl || ''
    };
  
  return { userProfile, links, businessCard, linkPage };
}

type UserData = {
  userProfile: UserProfile;
  links: LinkType[];
  businessCard: BusinessCard | null;
  linkPage: LinkPage | null;
}

const DigitalBusinessCard = ({ userProfile, businessCard } : { userProfile: UserProfile, businessCard: BusinessCard | null }) => {
    const enrichedBusinessCard = businessCard ? {
        ...businessCard,
        socials: [
            ...(businessCard.socials || []),
            { id: 'email', platform: 'Mail', url: `mailto:${userProfile.email}`, color: '#888888' }
        ]
    } : null;
    
    return (
        <div className="flex flex-col items-center text-center px-4 pt-8">
            <Avatar className="w-28 h-28 border-4 border-muted-foreground/20">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.displayName} />
                <AvatarFallback className="text-4xl bg-muted-foreground/10">
                    {userProfile.displayName?.[0]}
                </AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-headline mt-4">{userProfile.displayName}</h1>
            
            {enrichedBusinessCard?.socials && enrichedBusinessCard.socials.length > 0 && (
                <div className="mt-8 w-full">
                    <SocialIcons businessCard={enrichedBusinessCard} iconOnly={true} />
                </div>
            )}
            
            <div className="flex flex-row gap-4 w-full max-w-sm mt-6">
                <ShareActions userProfile={userProfile} businessCard={businessCard} asChild>
                    <Button variant="outline" className="shrink-0">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                </ShareActions>

                <Button className="w-full" onClick={() => window.open(`/api/vcard?userId=${userProfile.id}&cardId=main`, '_blank')}>Save Contact</Button>
            </div>
        </div>
    )
}

export default function UserPublicPage() {
  const params = useParams();
  const usernameParam = decodeURIComponent(params.username as string);
  const { t } = useLanguage();

  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { theme: appTheme } = useTheme();

  useEffect(() => {
    if (usernameParam) {
      getUserData(usernameParam)
        .then(result => {
          if (result) {
            setData(result);
          } else {
            setError(true);
          }
        })
        .catch((e) => {
            console.error("Failed to fetch user data:", e);
            setError(true)
        })
        .finally(() => setLoading(false));
    }
  }, [usernameParam]);

  const activeTheme = data?.linkPage?.theme || 'default';
  const themeClass = `theme-${activeTheme}`;
  const isDarkTheme = ['emerald', 'amethyst', 'bronze', 'sapphire', 'ruby', 'gold', 'obsidian', 'sakura', 'crimson'].includes(activeTheme);


   useEffect(() => {
    document.documentElement.className = ''; 
    if (isDarkTheme) {
        document.documentElement.classList.add('dark');
    }
    if (activeTheme !== 'light') {
        document.documentElement.classList.add(themeClass);
    }
    return () => {
        document.documentElement.className = '';
        if(appTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    };
  }, [activeTheme, appTheme, isDarkTheme, themeClass]);


  const handleLinkClick = async (link: LinkType) => {
    if (!data?.userProfile) return;
    const linkRef = doc(firestore, `users/${data.userProfile.id}/linkPages/main/links`, link.id);
    try {
      await updateDoc(linkRef, {
        clicks: increment(1)
      });
      
      const analyticsDocRef = doc(firestore, `analytics/${data.userProfile.id}/linkPages/main`);
      await setDoc(analyticsDocRef, {
        totalClicks: increment(1),
        clicksByLink: {
          [link.id]: {
            clicks: increment(1),
            lastClicked: serverTimestamp(),
          }
        },
        lastUpdated: serverTimestamp()
      }, { merge: true });

    } catch (e) {
      console.error("Error updating link clicks", e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !data) {
    notFound();
  }

  const { userProfile, businessCard, linkPage, links } = data;
  const userPlan = userProfile.plan || 'free';
  
  // Branding is shown for free/basic plans, OR if the premium user hasn't explicitly turned it off.
  const showBranding = ['free', 'basic'].includes(userPlan) || (linkPage?.showBranding !== false);

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="flex-grow pb-32">
        <div className="max-w-2xl mx-auto px-4 pt-8 md:pt-12">
            <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">Digital Business Card</TabsTrigger>
                    <TabsTrigger value="links">Link-in-Bio</TabsTrigger>
                </TabsList>
                <TabsContent value="card">
                   {businessCard && <DigitalBusinessCard userProfile={userProfile} businessCard={businessCard} />}
                </TabsContent>
                <TabsContent value="links">
                    <ProfileHeader 
                        userProfile={userProfile} 
                        businessCard={businessCard} 
                        linkPage={linkPage} 
                    />
                     {links && linkPage && links.length > 0 && (
                        <div className="mt-8">
                            <LinkList 
                                links={links} 
                                onLinkClick={handleLinkClick} 
                                linkPage={linkPage} 
                            />
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            

            {showBranding && (
              <div className="w-full flex justify-center items-center pt-12">
                  <Link href="/" passHref>
                      <GalaxisLinkLogo size="sm"/>
                  </Link>
              </div>
            )}
        </div>
      </main>
      
       {userProfile && businessCard && (
        <div className="fixed bottom-6 left-6 z-30">
            <AIChatAssistant
                userProfile={userProfile}
                businessCard={businessCard}
                links={links || []}
            />
        </div>
      )}
      
      <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-30">
        <InvitationPopup />
      </div>
    </div>
  );
}
