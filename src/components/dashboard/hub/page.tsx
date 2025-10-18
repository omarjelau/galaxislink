
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollection, useFirestore, useUser, useMemoFirebase, useDoc } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Share2, Link as LinkLucide, CreditCard as CreditCardLucide, Crown } from 'lucide-react';
import type { LinkPage, BusinessCard, UserProfile } from '@/lib/types';
import Link from 'next/link';
import { getString } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

function PageCard({ title, type, pageId }: { title: string, type: 'Link Page' | 'Business Card', pageId: string }) {
  const href = type === 'Link Page' ? `/dashboard/links?page=${pageId}` : `/dashboard/card?page=${pageId}`;
  const Icon = type === 'Link Page' ? LinkLucide : CreditCardLucide;
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{type}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" size="sm">
          <Link href={href}>Edit</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function HubPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { language } = useLanguage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageType, setNewPageType] = useState<'linkPage' | 'businessCard'>('linkPage');
  const [isCreating, setIsCreating] = useState(false);

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}`) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const linkPagesQuery = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/linkPages`) : null, [firestore, user]);
  const { data: linkPages, isLoading: linkPagesLoading } = useCollection<LinkPage>(linkPagesQuery);
  
  const businessCardsQuery = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/businessCards`) : null, [firestore, user]);
  const { data: businessCards, isLoading: cardsLoading } = useCollection<BusinessCard>(businessCardsQuery);
  
  const userPlan = userProfile?.plan || 'free';

  const maxLinks = { free: 2, basic: 5, premium: Infinity, enterprise: Infinity }[userPlan] || 2;
  const maxCards = { free: 1, basic: 1, premium: 4, enterprise: Infinity }[userPlan] || 1;

  const canAddMoreLinks = (linkPages?.length || 0) < maxLinks;
  const canAddMoreCards = (businessCards?.length || 0) < maxCards;


  const handleCreateNew = async () => {
    if (!user || !newPageName) {
      toast({ title: "Name is required.", variant: 'destructive' });
      return;
    }
     if (newPageType === 'linkPage' && !canAddMoreLinks) {
        toast({ title: "Link Page limit reached", description: "Please upgrade your plan to add more pages.", variant: "destructive"});
        return;
    }
    if (newPageType === 'businessCard' && !canAddMoreCards) {
        toast({ title: "Business Card limit reached", description: "Please upgrade your plan to add more cards.", variant: "destructive"});
        return;
    }

    setIsCreating(true);
    const collectionName = newPageType === 'linkPage' ? 'linkPages' : 'businessCards';
    const collectionRef = collection(firestore, `users/${user.uid}/${collectionName}`);
    
    try {
      const data: Partial<LinkPage | BusinessCard> = {
        createdAt: serverTimestamp(),
      };
      if (newPageType === 'linkPage') {
        (data as LinkPage).title = { en: newPageName, de: newPageName };
        (data as LinkPage).theme = 'default';
      } else {
        (data as BusinessCard).name = newPageName;
      }

      await addDoc(collectionRef, data);

      toast({ title: `${newPageType === 'linkPage' ? 'Link Page' : 'Business Card'} created!` });
      setNewPageName('');
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create new page.', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const isLoading = linkPagesLoading || cardsLoading || isProfileLoading;

  if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2"><Share2 /> Hub</h1>
          <p className="text-muted-foreground">Manage all your link pages and digital business cards from one place.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Page</DialogTitle>
              <DialogDescription>
                Give your new page a name. You can choose whether it's a Link Page or a Business Card.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={newPageName} onChange={(e) => setNewPageName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                  <Label>Type</Label>
                  <div className="flex gap-4">
                      <Button variant={newPageType === 'linkPage' ? 'secondary' : 'outline'} onClick={() => setNewPageType('linkPage')}>Link Page</Button>
                      <Button variant={newPageType === 'businessCard' ? 'secondary' : 'outline'} onClick={() => setNewPageType('businessCard')}>Business Card</Button>
                  </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateNew} disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="space-y-8">
          <section>
              <h2 className="text-2xl font-headline font-semibold mb-4">Link Pages</h2>
               {linkPages && linkPages.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {linkPages.map(page => <PageCard key={page.id} pageId={page.id} title={getString(page.title, language)} type="Link Page" />)}
                  </div>
              ) : (
                  <p className="text-muted-foreground">You haven't created any link pages yet.</p>
              )}
               {!canAddMoreLinks && (
                   <Card className="mt-4 p-4 text-center">
                      <CardContent className="p-2">
                          <h3 className="font-semibold">Link Page Limit Reached</h3>
                          <p className="text-sm text-muted-foreground">Please upgrade your plan to add more pages.</p>
                          <Button asChild size="sm" className="mt-4">
                              <Link href="/pricing">
                                  <Crown className="mr-2 h-4 w-4" />
                                  Upgrade Plan
                              </Link>
                          </Button>
                      </CardContent>
                  </Card>
              )}
          </section>
          
          <section>
               <h2 className="text-2xl font-headline font-semibold mb-4">Business Cards</h2>
               {businessCards && businessCards.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {businessCards.map(card => <PageCard key={card.id} pageId={card.id} title={getString(card.name, language)} type="Business Card" />)}
                  </div>
              ) : (
                  <p className="text-muted-foreground">You haven't created any business cards yet.</p>
              )}
              {!canAddMoreCards && (
                   <Card className="mt-4 p-4 text-center">
                      <CardContent className="p-2">
                          <h3 className="font-semibold">Business Card Limit Reached</h3>
                          <p className="text-sm text-muted-foreground">Please upgrade your plan to add more cards.</p>
                          <Button asChild size="sm" className="mt-4">
                              <Link href="/pricing">
                                  <Crown className="mr-2 h-4 w-4" />
                                  Upgrade Plan
                              </Link>
                          </Button>
                      </CardContent>
                  </Card>
              )}
          </section>
      </div>
    </div>
  );
}
