
'use client';
import Link from 'next/link';
import { GalaxisLinkLogo } from '@/components/GalaxisLinkLogo';
import { useLanguage } from '@/context/language-context';
import { Button } from './ui/button';

// Placeholder icons - consider using a library like lucide-react
const TwitterIcon = () => <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>;
const InstagramIcon = () => <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zM12 0C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.267.058 1.64.072 4.947.072s3.68-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.267.072-1.64.072-4.947s-.014-3.68-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.68.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg>;
const LinkedInIcon = () => <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;


export function MarketingFooter() {
  const { t } = useLanguage();
  return (
    <footer className="bg-background/80 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Copyright */}
            <div className="md:col-span-1 space-y-4">
                <a href="https://www.majesty-developers.com/en" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                    Powered by Majesty
                </a>
                 <div className="flex space-x-4">
                    <a href="#" className="text-muted-foreground hover:text-primary"><TwitterIcon /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary"><InstagramIcon /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary"><LinkedInIcon /></a>
                </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                    <h4 className="font-semibold font-headline text-foreground mb-4">{t('footerPlatform')}</h4>
                    <ul className="space-y-2">
                        <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-primary">{t('featuresTitle')}</Link></li>
                        <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">{t('navPricing')}</Link></li>
                         <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary">Shop</Link></li>
                        <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary">{t('navLogin')}</Link></li>
                        <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-primary">{t('navSignup')}</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold font-headline text-foreground mb-4">{t('footerCompany')}</h4>
                    <ul className="space-y-2">
                        <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">{t('footerAbout')}</Link></li>
                        <li><Link href="/affiliate" className="text-sm text-muted-foreground hover:text-primary">{t('navAffiliate')}</Link></li>
                        <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">{t('footerContact')}</Link></li>
                         <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">{t('footerBlog')}</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold font-headline text-foreground mb-4">{t('footerLegal')}</h4>
                    <ul className="space-y-2">
                         <li><Link href="/how-to-order" className="text-sm text-muted-foreground hover:text-primary">How to Order</Link></li>
                        <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">{t('footerPrivacy')}</Link></li>
                        <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">{t('footerTerms')}</Link></li>
                        <li><Link href="/imprint" className="text-sm text-muted-foreground hover:text-primary">Imprint</Link></li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
