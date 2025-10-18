
'use client';
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";


export default function PricingPage() {
    const { t, language } = useLanguage();
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const tiers = {
        de: [
            {
                name: "Starter",
                price: "2,99 €",
                priceSuffix: "/ Monat",
                description: "Für den perfekten Start.",
                features: [
                    "2 Links pro Seite",
                    "1 digitale Visitenkarte",
                    "Standard-Themes",
                    "GalaxisLink-Branding",
                ],
                cta: "Starter wählen",
                href: "/signup",
                paymentLink: process.env.NEXT_PUBLIC_STRIPE_STARTER_PAYMENT_LINK
            },
            {
                name: "Basic",
                price: "4,99 €",
                priceSuffix: "/ Monat",
                description: "Für Einzelpersonen und Freelancer.",
                features: [
                    "Alles im Starter-Plan",
                    "5 Links pro Seite",
                    "Basis-Anpassungen (Themes: Emerald, Amethyst, Bronze)",
                    "QR-Code-Generierung",
                    "Grundlegende Analytics",
                ],
                cta: "Basic wählen",
                isPrimary: true,
                href: "/signup",
                paymentLink: process.env.NEXT_PUBLIC_STRIPE_BASIC_PAYMENT_LINK,
            },
            {
                name: "Premium",
                price: "9,99 €",
                priceSuffix: "/ Monat",
                description: "Für Profis und Marken.",
                features: [
                    "Alles im Basic-Plan",
                    "Unbegrenzte Links",
                    "4 Visitenkarten",
                    "Erweiterte Analytics & Zeitfilter",
                    "NFC-Integration für Karten",
                    "Alle Premium-Themes",
                    "Kein GalaxisLink-Branding",
                    "Priorisierter Support",
                ],
                cta: "Premium wählen",
                href: "/signup",
                paymentLink: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PAYMENT_LINK,
            },
            {
                name: "Enterprise",
                price: null,
                priceSuffix: "Demnächst",
                description: "Für große Teams, die maximale Kontrolle benötigen.",
                features: [
                    "Alles im Premium-Plan",
                    "Unbegrenzte Visitenkarten",
                    "Team-Funktionen & Benutzerrollen",
                    "White-Labeling & Eigene Domain",
                    "Dedizierter Account-Manager",
                    "Zwei-Faktor-Authentifizierung (2FA)",
                ],
                cta: "Demnächst",
                href: "#",
                isUpcoming: true,
                paymentLink: null
            }
        ],
        en: [
            {
                name: "Starter",
                price: "€2.99",
                priceSuffix: "/ month",
                description: "For the perfect start.",
                features: [
                    "2 links per page",
                    "1 digital business card",
                    "Standard themes",
                    "GalaxisLink branding",
                ],
                cta: "Choose Starter",
                href: "/signup",
                paymentLink: process.env.NEXT_PUBLIC_STRIPE_STARTER_PAYMENT_LINK
            },
            {
                name: "Basic",
                price: "€4.99",
                priceSuffix: "/ month",
                description: "For individuals and freelancers.",
                features: [
                    "Everything in Starter plan",
                    "5 links per page",
                    "Basic customizations (Themes: Emerald, Amethyst, Bronze)",
                    "QR Code generation",
                    "Basic Analytics",
                ],
                cta: "Choose Basic",
                isPrimary: true,
                href: "/signup",
                paymentLink: process.env.NEXT_PUBLIC_STRIPE_BASIC_PAYMENT_LINK,
            },
            {
                name: "Premium",
                price: "€9.99",
                priceSuffix: "/ month",
                description: "For professionals and brands.",
                features: [
                    "Everything in Basic plan",
                    "Unlimited links",
                    "4 business cards",
                    "Advanced Analytics & Date Filters",
                    "NFC Integration for cards",
                    "All premium themes",
                    "No GalaxisLink branding",
                    "Priority Support",
                ],
                cta: "Choose Premium",
                href: "/signup",
                paymentLink: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PAYMENT_LINK,
            },
            {
                name: "Enterprise",
                price: null,
                priceSuffix: "Coming Soon",
                description: "For large teams needing maximum control.",
                features: [
                    "Everything in Premium plan",
                    "Unlimited business cards",
                    "Team features & user roles",
                    "White-labeling & Custom Domain",
                    "Dedicated Account Manager",
                    "Two-Factor Authentication (2FA)",
                ],
                cta: "Coming Soon",
                href: "#",
                isUpcoming: true,
                paymentLink: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PAYMENT_LINK,
            }
        ]
    };
    
    const pricingTiers = tiers[language] || tiers.en;
    
    const handleCtaClick = (tier: typeof pricingTiers[0]) => {
        if (tier.isUpcoming) {
             router.push(tier.href);
             return;
        }
        
        if (isUserLoading) return; // Wait until user state is resolved

        if (!user) {
            router.push('/login'); // Redirect to login if not authenticated
            return;
        }
        
        if (tier.paymentLink) {
            const stripeUrl = `${tier.paymentLink}?client_reference_id=${user.uid}`;
            window.location.href = stripeUrl;
        } else {
             router.push(tier.href);
        }
    };


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <motion.h1 
                className="text-5xl md:text-7xl font-headline font-bold tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Find the right plan for you
            </motion.h1>
            <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              Simple, transparent pricing. No hidden fees.
            </motion.p>
          </header>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {pricingTiers.map((tier) => (
                <motion.div key={tier.name} variants={itemVariants}>
                    <Card className={cn(
                        "flex flex-col bg-card/50 border text-card-foreground h-full transition-all duration-300", 
                        tier.isPrimary && "border-primary ring-2 ring-primary/50",
                        tier.isUpcoming && "opacity-80"
                    )}>
                        <CardHeader className="border-b">
                            <CardTitle className="font-headline text-3xl text-primary">{tier.name}</CardTitle>
                            <CardDescription className="text-muted-foreground">{tier.description}</CardDescription>
                            <div>
                               {tier.price ? (
                                    <>
                                        <span className="text-4xl font-bold">{tier.price}</span>
                                        {tier.priceSuffix && <span className="text-muted-foreground">{tier.priceSuffix}</span>}
                                    </>
                                ) : (
                                    <Badge variant="secondary" className="text-base">{tier.priceSuffix}</Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow pt-6">
                            <ul className="space-y-3">
                                {tier.features.map(feature => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className={cn(
                                    "w-full transition-all duration-300", 
                                    tier.isPrimary && !tier.isUpcoming && "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                                )}
                                variant={tier.isPrimary ? 'default' : 'outline'}
                                disabled={tier.isUpcoming || isUserLoading}
                                onClick={() => handleCtaClick(tier)}
                            >
                                {isUserLoading ? <Loader2 className="animate-spin" /> : tier.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
