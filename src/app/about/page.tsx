
'use client';

import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { Users, Rocket, Target } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  const { t, language } = useLanguage();

  const content = {
    de: {
      title: "Über GalaxisLink",
      subtitle: "Wir vereinfachen die digitale Identität für Kreative, Profis und Marken.",
      missionTitle: "Unsere Mission",
      missionText: "GalaxisLink ist ein innovatives Unternehmen, das digitale Lösungen für Creator und Marken entwickelt. Mit unserer Plattform „GalaxisLink“ bieten wir ein Link-in-Bio-Tool und digitale Visitenkarten, die Nachhaltigkeit und Professionalität verbinden. Unser Ziel ist es, Nutzern zu helfen, ihre Online-Präsenz zu maximieren und Verbindungen zu stärken – ganz ohne Papier.",
      visionTitle: "Unsere Vision",
      visionText: "Wir stellen uns eine Welt vor, in der das Teilen Ihrer digitalen Identität mühelos, nachhaltig und immer stilvoll ist. GalaxisLink ist Ihr Partner für die Zukunft des Networkings.",
      teamTitle: "Unser Team",
      teamText: "Wir sind ein leidenschaftliches Team aus Designern, Entwicklern und Strategen, das sich dem Ziel verschrieben hat, ein Produkt zu entwickeln, das die Menschen gerne nutzen.",
      joinTitle: "Werde Teil unserer Reise",
      joinText: "GalaxisLink ist mehr als nur ein Werkzeug; es ist eine Gemeinschaft. Wir entwickeln uns ständig weiter und würden uns freuen, wenn Sie ein Teil davon werden."
    },
    en: {
      title: "About GalaxisLink",
      subtitle: "We're simplifying digital identity for creators, professionals, and brands.",
      missionTitle: "Our Mission",
      missionText: "GalaxisLink is an innovative company developing digital solutions for creators and brands. With our 'GalaxisLink' platform, we offer a Link-in-Bio tool and digital business cards that combine sustainability and professionalism. Our goal is to help users maximize their online presence and build connections—all without paper.",
      visionTitle: "Our Vision",
      visionText: "We envision a world where sharing your digital identity is effortless, sustainable, and always stylish. GalaxisLink is your partner in the future of networking.",
      teamTitle: "Our Team",
      teamText: "We are a passionate team of designers, developers, and strategists dedicated to building a product that people love to use.",
      joinTitle: "Join Our Journey",
      joinText: "GalaxisLink is more than just a tool; it's a community. We're constantly evolving and would love for you to be a part of it."
    }
  };

  const currentContent = content[language];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">{currentContent.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              {currentContent.subtitle}
            </p>
          </header>

          
           <Card className="text-center mb-24 max-w-4xl mx-auto bg-card/50">
                <CardHeader>
                    <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-3xl font-headline font-semibold">{currentContent.missionTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-lg">{currentContent.missionText}</p>
                </CardContent>
            </Card>

          <div className="grid md:grid-cols-2 gap-8 text-center mb-24">
            <Card className="bg-card/50">
                 <CardHeader>
                    <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-2xl font-headline font-semibold">{currentContent.visionTitle}</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">{currentContent.visionText}</p>
                </CardContent>
            </Card>
            <Card className="bg-card/50">
                <CardHeader>
                    <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-2xl font-headline font-semibold">{currentContent.teamTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">{currentContent.teamText}</p>
                </CardContent>
            </Card>
          </div>

          <Card className="text-center bg-card/50 py-12">
            <CardHeader>
                <CardTitle className="text-4xl font-headline font-bold">{currentContent.joinTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                {currentContent.joinText}
                </p>
                <Button asChild size="lg">
                    <Link href="/signup">{t('createProfile')}</Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
