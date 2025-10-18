
'use client';

import { useState } from 'react';
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Award, BarChart, DollarSign, Gift, Handshake, Users, Loader2, UserPlus } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';


export default function AffiliatePage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const perks = [
        {
            icon: <DollarSign className="w-8 h-8 text-primary" />,
            title: t('affiliatePerk1Title'),
            description: t('affiliatePerk1Description')
        },
        {
            icon: <Gift className="w-8 h-8 text-primary" />,
            title: t('affiliatePerk2Title'),
            description: t('affiliatePerk2Description')
        },
        {
            icon: <BarChart className="w-8 h-8 text-primary" />,
            title: t('affiliatePerk3Title'),
            description: t('affiliatePerk3Description')
        }
    ];

     const howItWorksSteps = [
        {
          icon: <UserPlus className="w-10 h-10 text-primary" />,
          title: t('affiliateStep1Title'),
          description: t('affiliateStep1Description'),
        },
        {
          icon: <Award className="w-10 h-10 text-primary" />,
          title: t('affiliateStep2Title'),
          description: t('affiliateStep2Description'),
        },
        {
          icon: <Users className="w-10 h-10 text-primary" />,
          title: t('affiliateStep3Title'),
          description: t('affiliateStep3Description'),
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !website || !message) {
            toast({
                title: "All fields are required.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const applicationsRef = collection(firestore, 'ambassadorApplications');
            await addDoc(applicationsRef, {
                name,
                email,
                website,
                message,
                status: 'pending',
                submittedAt: serverTimestamp()
            });

            toast({
                title: "Application Submitted!",
                description: "Thank you! We'll review your application and get back to you soon."
            });

            // Reset form
            setName('');
            setEmail('');
            setWebsite('');
            setMessage('');
        } catch (error) {
            console.error("Error submitting application:", error);
            toast({
                title: "Submission Failed",
                description: "An error occurred. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        if (isUserLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            );
        }

        if (!user) {
            return (
                 <Card className="text-center bg-card/50 py-12">
                    <CardHeader>
                        <CardTitle className="text-4xl font-headline font-bold">Join the Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                           The Ambassador Program is for registered users. Please sign up or log in to apply.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/signup">Register Now</Link>
                        </Button>
                    </CardContent>
                </Card>
            )
        }

        return (
             <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-headline font-bold">{t('affiliateJoinTitle')}</CardTitle>
                    <CardDescription>{t('affiliateJoinSubtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('affiliateFormName')}</Label>
                            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t('affiliateFormEmail')}</Label>
                            <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">{t('affiliateFormWebsite')}</Label>
                            <Input id="website" placeholder="https://your-website.com" value={website} onChange={(e) => setWebsite(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">{t('affiliateFormMessage')}</Label>
                            <Textarea id="message" placeholder={t('affiliateFormMessagePlaceholder')} value={message} onChange={(e) => setMessage(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('affiliateFormSubmit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        );
    }


    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MarketingHeader />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4">
                    <header className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">{t('affiliateTitle')}</h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
                            {t('affiliateSubtitle')}
                        </p>
                    </header>

                    <section className="py-16">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">{t('howItWorksTitle')}</h2>
                            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                               {t('howItWorksDescription')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
                            {howItWorksSteps.map((step, index) => (
                                <div key={index} className="text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-primary/10 p-4 rounded-full border-2 border-primary/20">
                                    {step.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-headline font-semibold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="py-16 bg-secondary/20 rounded-lg">
                        <div className="text-center mb-16 px-4">
                            <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">{t('affiliatePerksTitle')}</h2>
                             <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                                {t('affiliatePerksSubtitle')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
                            {perks.map((perk, index) => (
                                <Card key={index} className="text-center bg-card/50 border border-border/50">
                                    <CardHeader>
                                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-min mb-4">
                                            {perk.icon}
                                        </div>
                                        <CardTitle className="font-headline text-2xl">{perk.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{perk.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="py-24">
                        <div className="max-w-2xl mx-auto">
                           {renderContent()}
                        </div>
                    </section>
                </div>
            </main>
            <MarketingFooter />
        </div>
    );
}

    