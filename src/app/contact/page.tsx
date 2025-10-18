
'use client';

import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">{t('contactTitle')}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              {t('contactSubtitle')}
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">{t('contactFormTitle')}</CardTitle>
                <CardDescription>
                  {t('contactFormDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">{t('contactFormFirstName')}</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">{t('contactFormLastName')}</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('contactFormEmail')}</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contactFormMessage')}</Label>
                  <Textarea id="message" placeholder={t('contactFormMessagePlaceholder')} className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full" size="lg">{t('contactFormSubmit')}</Button>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-headline font-semibold">{t('contactEmailTitle')}</h3>
                  <p className="text-muted-foreground">{t('contactEmailDescription')}</p>
                  <a href="mailto:info@galaxislink.com" className="text-primary hover:underline">info@galaxislink.com</a>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-headline font-semibold">{t('contactPhoneTitle')}</h3>
                  <p className="text-muted-foreground">{t('contactPhoneDescription')}</p>
                  <a href="tel:+49211123456" className="text-primary hover:underline">+49 211 123456</a>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-primary/10 p-4 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-headline font-semibold">{t('contactOfficeTitle')}</h3>
                  <p className="text-muted-foreground">Irenenstr. 66, 40468 Düsseldorf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
