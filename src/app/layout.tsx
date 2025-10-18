
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/context/theme-context';

import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/audiowide';


// Metadata can be defined but not exported from a client component.
// We can manage the title and other head elements dynamically if needed.
const metadata: Metadata = {
  title: 'GalaxisLink – Dein Link-in-Bio-Tool für Creator',
  description: 'Maximieren Sie Ihre Online-Präsenz mit GalaxisLink – Links, Visitenkarten und Analytics',
  keywords: 'link-in-bio, digitale visitenkarte, creator tool, seo, galaxislink, düsseldorf',
};

const ThemeScript = () => {
    const script = `
        (function() {
            try {
                const theme = localStorage.getItem('vibelink-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const root = window.document.documentElement;
                
                let effectiveTheme = 'light';
                if (theme) {
                    effectiveTheme = theme;
                } else if (prefersDark) {
                    effectiveTheme = 'dark';
                }

                root.setAttribute('data-theme', effectiveTheme);
                if (effectiveTheme === 'dark') {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            } catch (e) {
                console.error('Failed to set initial theme', e);
            }
        })();
    `;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <title>GalaxisLink – Dein Link-in-Bio-Tool für Creator</title>
        <meta name="description" content="Maximieren Sie Ihre Online-Präsenz mit GalaxisLink – Links, Visitenkarten und Analytics" />
        <meta name="keywords" content="link-in-bio, digitale visitenkarte, creator tool, seo, galaxislink, düsseldorf" />
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            <FirebaseClientProvider>
              {children}
            </FirebaseClientProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
