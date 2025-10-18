
'use client';

import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Twitter, MessageSquare, Github } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function CommunityPage() {
  const { t } = useLanguage();
  
  const communityLinks = [
    {
        name: "Twitter / X",
        description: t('communityTwitterDescription'),
        icon: <Twitter className="h-8 w-8 text-primary" />,
        href: "https://twitter.com/galaxislink",
        cta: t('communityTwitterCTA')
    },
    {
        name: "Community Forum",
        description: t('communityForumDescription'),
        icon: <MessageSquare className="h-8 w-8 text-primary" />,
        href: "#",
        cta: t('communityForumCTA')
    },
    {
        name: "GitHub Discussions",
        description: t('communityGithubDescription'),
        icon: <Github className="h-8 w-8 text-primary" />,
        href: "#",
        cta: t('communityGithubCTA')
    }
]


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">{t('communityTitle')}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              {t('communitySubtitle')}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {communityLinks.map((link) => (
                <Card key={link.name} className="flex flex-col bg-card/50 border-border/50 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="bg-primary/10 p-4 rounded-full">
                                {link.icon}
                            </div>
                        </div>
                        <CardTitle className="font-headline text-3xl text-center">{link.name}</CardTitle>
                        <CardDescription className="text-center min-h-[60px]">{link.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end justify-center">
                        <Button asChild className="w-full" variant={link.href === '#' ? 'secondary' : 'default'} disabled={link.href === '#'}>
                            <Link href={link.href}>{link.cta}</Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
