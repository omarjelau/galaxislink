
'use client';

import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { NFCCard } from "@/lib/types";

export default function ShopPage() {
  const firestore = useFirestore();

  const nfcCardsQuery = useMemoFirebase(
    () => collection(firestore, 'nfcCards'),
    [firestore]
  );
  const { data: nfcProducts, isLoading } = useCollection<NFCCard>(nfcCardsQuery);
  
  const activeProducts = nfcProducts?.filter(p => p.active);

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">GalaxisLink NFC Cards</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              The last business card you'll ever need. Connect your GalaxisLink profile to a premium NFC card and make a lasting impression.
            </p>
          </header>
          {isLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeProducts?.sort((a,b) => (a.order ?? 99) - (b.order ?? 99)).map((card) => (
                  <Card key={card.id} className={cn("flex flex-col bg-card/50 border-border/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-primary/10", card.isPrimary && "border-primary/50 ring-2 ring-primary/50")}>
                      <CardHeader className="p-4">
                          <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden">
                            <Image 
                                  src={card.imageUrl || "https://picsum.photos/seed/placeholder/600/600"}
                                  alt={card.name || 'NFC Card'}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  data-ai-hint={card.imageHint}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                          </div>
                          <CardTitle className="font-headline text-2xl">{card.name}</CardTitle>
                          <CardDescription className="text-base line-clamp-1">{card.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow p-4 pt-0">
                          <div className="mb-6">
                              <span className="text-4xl font-headline font-bold">€{card.price}</span>
                          </div>
                          <ul className="space-y-3">
                              {card.features?.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                      <span className="text-muted-foreground">{feature}</span>
                                  </li>
                              ))}
                          </ul>
                      </CardContent>
                      <CardFooter className="p-4">
                          <Button asChild className="w-full text-lg py-6 transition-transform duration-200 group-hover:scale-105" variant={card.isPrimary ? 'default' : 'outline'}>
                              <Link href={card.href || '/signup'}>{card.action}</Link>
                          </Button>
                      </CardFooter>
                  </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
