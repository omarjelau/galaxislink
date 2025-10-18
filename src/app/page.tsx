
'use client';

import { Button } from '@/components/ui/button';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { motion } from 'framer-motion';
import { UserPlus, Palette, Share2, BarChart, Gem, Sliders, Sparkles, HeartHandshake, Link as LinkIcon, Wallet, CreditCard, Phone, Mail, Instagram, Linkedin, Twitter, Github, Facebook, Youtube, Twitch, MessageCircle, GitBranch, Dribbble, Figma, FileText, Calendar, Music, Video, ShoppingCart, Globe, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { GalaxisLinkLogo } from '@/components/GalaxisLinkLogo';
import { GeneralAIChatAssistant } from '@/components/public/GeneralAIChatAssistant';


export default function Home() {
  const { t } = useLanguage();
  const [activePreview, setActivePreview] = useState<'card' | 'links'>('card');


  const steps = [
    {
      icon: <UserPlus className="h-10 w-10 text-primary" />,
      title: t('step1Title'),
      description: t('step1Description'),
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: t('step2Title'),
      description: t('step2Description'),
    },
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: t('step3Title'),
      description: t('step3Description'),
    },
  ];
  
  const features = [
    {
      icon: <LinkIcon className="h-8 w-8 text-primary" />,
      title: t('featureLinkCollectionTitle'),
      description: t('featureLinkCollectionDescription'),
    },
    {
      icon: <Wallet className="h-8 w-8 text-primary" />,
      title: t('featureBusinessCardTitle'),
      description: t('featureBusinessCardDescription'),
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: t('featureAnalyticsTitle'),
      description: t('featureAnalyticsDescription'),
    },
    {
      icon: <Sliders className="h-8 w-8 text-primary" />,
      title: t('featureCustomizationTitle'),
      description: t('featureCustomizationDescription'),
    },
     {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: t('featureAiTitle'),
      description: t('featureAiDescription'),
    },
     {
      icon: <HeartHandshake className="h-8 w-8 text-primary" />,
      title: t('featureSustainabilityTitle'),
      description: t('featureSustainabilityDescription'),
    },
  ];
  
  const testimonials = [
    {
      text: t('testimonial1_text'),
      author: t('testimonial1_author'),
      role: t('testimonial1_role'),
    },
    {
      text: t('testimonial2_text'),
      author: t('testimonial2_author'),
      role: t('testimonial2_role'),
    },
    {
      text: t('testimonial3_text'),
      author: t('testimonial3_author'),
      role: t('testimonial3_role'),
    }
  ];

  const faqs = [
    {
      question: t('faq1_question'),
      answer: t('faq1_answer'),
    },
    {
      question: t('faq2_question'),
      answer: t('faq2_answer'),
    },
    {
      question: t('faq3_question'),
      answer: t('faq3_answer'),
    },
    {
      question: t('faq4_question'),
      answer: t('faq4_answer'),
    },
  ];

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
  
  const previewIcons = [
    Linkedin, Twitter, Instagram, Github, Facebook,
    Youtube, Twitch, MessageCircle, GitBranch, Dribbble,
    Figma, Mail, FileText, Calendar, Music,
    Video, ShoppingCart, Globe, Phone, LinkIcon
  ];


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="flex items-center justify-center text-center min-h-[calc(100vh-80px)] pt-48 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h1
              className="text-5xl md:text-7xl font-headline font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {t('heroTitle')}
            </motion.h1>
            <motion.p
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
            >
              {t('heroSubtitle')}
            </motion.p>
            <motion.div
              className="mt-10 flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
            >
              <Button asChild size="lg">
                <Link href="/signup">{t('createProfile')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">{t('howItWorksTitle')}</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        {t('howItWorksDescription')}
                    </p>
                </div>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    {steps.map((step, index) => (
                        <motion.div key={index} variants={itemVariants} className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="bg-primary/10 p-4 rounded-full border-2 border-primary/20">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="text-2xl font-headline font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* New Dual Preview Section */}
        <section className="py-20 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">{t('dualPreviewTitle')}</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t('dualPreviewSubtitle')}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="space-y-8">
                  <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                  >
                      <Card className={cn("cursor-pointer border-2 transition-all", activePreview === 'card' ? 'border-primary' : '')} onClick={() => setActivePreview('card')}>
                          <CardHeader>
                              <CardTitle className="flex items-center gap-3 font-headline"><CreditCard/> {t('Digitale Visitenkarte')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-muted-foreground">{t('dualPreviewCardDescription')}</p>
                          </CardContent>
                      </Card>
                  </motion.div>
                   <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5, delay: 0.2 }}
                  >
                      <Card className={cn("cursor-pointer border-2 transition-all", activePreview === 'links' ? 'border-primary' : '')} onClick={() => setActivePreview('links')}>
                          <CardHeader>
                              <CardTitle className="flex items-center gap-3 font-headline"><LinkIcon/> {t('Link-in-Bio Seite')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-muted-foreground">{t('dualPreviewLinksDescription')}</p>
                          </CardContent>
                      </Card>
                  </motion.div>
              </div>

              <motion.div 
                  className="relative h-[600px] w-full max-w-sm mx-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gray-800 rounded-[40px] border-8 border-black overflow-hidden shadow-2xl">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-10"></div>
                     <div className={cn("absolute inset-0 transition-opacity duration-300", activePreview === 'card' ? 'opacity-100' : 'opacity-0')}>
                        <div className="bg-background text-foreground h-full flex flex-col p-4 pt-10">
                           <div className="flex-shrink-0 text-center">
                                <Image data-ai-hint="black man" src="https://picsum.photos/seed/blm/150/150" alt="Avatar" width={96} height={96} className="w-24 h-24 rounded-full mx-auto border-4 border-muted-foreground/20" />
                                <h2 className="text-2xl font-bold font-headline mt-3">Omar Awel</h2>
                            </div>
                             <div className="w-full mt-6 justify-center">
                                <div className="grid grid-cols-5 gap-4 px-4">
                                  {previewIcons.map((Icon, index) => (
                                    <a key={index} href="#" aria-label={`Icon ${index + 1}`} className="flex justify-center items-center">
                                        <Icon className="w-7 h-7 text-muted-foreground hover:text-primary transition-colors" />
                                    </a>
                                  ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-auto px-4">
                                <Button variant="outline" className="w-full"><Share2 className="mr-2 h-4 w-4"/> {t('Teilen')}</Button>
                                <Button className="w-full">{t('speichern')}</Button>
                            </div>
                            <div className="flex-shrink-0 flex flex-col justify-end items-center pt-4">
                               <div className="mt-2">
                                  <GalaxisLinkLogo size="sm" logoText="galaxislink" />
                               </div>
                            </div>
                        </div>
                    </div>
                     <div className={cn("absolute inset-0 transition-opacity duration-300", activePreview === 'links' ? 'opacity-100' : 'opacity-0')}>
                        <div className="bg-background text-foreground h-full flex flex-col p-4 pt-10">
                           <div className="flex-shrink-0 text-center">
                                <Image data-ai-hint="black man" src="https://picsum.photos/seed/blm/150/150" alt="Avatar" width={80} height={80} className="w-20 h-20 rounded-full mx-auto" />
                                <h2 className="text-xl font-bold font-headline mt-2">Omar Awel</h2>
                            </div>
                            <div className="flex-grow mt-6 space-y-3 overflow-y-auto">
                                <Button className="w-full justify-center" size="lg">Portfolio</Button>
                                <Button className="w-full justify-center" size="lg" variant="secondary">My Blog</Button>
                                <Button className="w-full justify-center" size="lg" variant="secondary">Shop Merch</Button>
                                <Button className="w-full justify-center" size="lg" variant="secondary">Book a Call</Button>
                                <Button className="w-full justify-center" size="lg" variant="secondary">My Music</Button>
                                <Button className="w-full justify-center" size="lg" variant="secondary">Latest Video</Button>
                            </div>
                             <div className="flex-shrink-0 flex flex-col justify-end items-center pt-4">
                               <div className="mt-2">
                                  <GalaxisLinkLogo size="sm" logoText="galaxislink" />
                               </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <GeneralAIChatAssistant />
                    </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">{t('featuresTitle')}</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t('featuresDescription')}</p>
            </div>
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                    <Card className="text-center h-full bg-card/50">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    {feature.icon}
                                </div>
                            </div>
                            <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
         {/* Testimonials Section */}
        <section className="py-20 lg:py-32 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">{t('socialProofTitle')}</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t('socialProofDescription')}</p>
                </div>
                 <Carousel
                  plugins={[
                    Autoplay({
                      delay: 4000,
                    }),
                  ]}
                  className="w-full max-w-4xl mx-auto"
                >
                  <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card className="h-full flex flex-col justify-center bg-card/50 py-10">
                            <CardContent className="text-center">
                              <p className="text-xl italic text-foreground">"{testimonial.text}"</p>
                              <div className="mt-6">
                                <p className="font-semibold">{testimonial.author}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">{t('faqTitle')}</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t('faqDescription')}</p>
            </div>
            <motion.div
              className="max-w-3xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <AccordionItem value={`item-${index + 1}`}>
                      <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
        
      </main>
      <MarketingFooter />
    </div>
  );
}
