
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ProfilePage, ProfilePageProps } from '@/components/public/ProfilePage';
import type { UserProfile, Link as LinkType, BusinessCard, LinkPage } from '@/lib/types';

// Dummy data for initial display
const dummyUser: UserProfile = {
  id: 'preview-user',
  username: 'yourname',
  displayName: 'Your Name',
  email: 'your.email@example.com',
  bio: { en: 'Your amazing bio goes here! Tell the world about yourself.', de: 'Deine tolle Biografie kommt hier hin! Erzähl der Welt von dir.' },
  avatarUrl: `https://i.pravatar.cc/300?u=preview`,
  createdAt: new Date(),
  plan: 'premium',
  role: 'user',
};

const dummyLinks: LinkType[] = [
    { id: '1', title: { en: 'My Portfolio', de: 'Mein Portfolio' }, url: '#', clicks: 0, createdAt: new Date(), linkPageId: 'main', userId: 'preview' },
    { id: '2', title: { en: 'Latest Video', de: 'Neuestes Video' }, url: '#', clicks: 0, createdAt: new Date(), linkPageId: 'main', userId: 'preview' },
    { id: '3', title: { en: 'Book a Call', de: 'Termin buchen' }, url: '#', clicks: 0, createdAt: new Date(), linkPageId: 'main', userId: 'preview' },
];

const dummyCard: BusinessCard = {
    id: 'main',
    userId: 'preview-user',
    name: 'Your Name',
    jobTitle: { en: 'Job Title', de: 'Jobtitel' },
    company: 'Your Company',
    email: 'your.email@example.com',
    createdAt: new Date(),
    avatarUrl: `https://i.pravatar.cc/300?u=preview`,
    socials: [
        { id: 'tw', platform: 'X', url: '#' },
        { id: 'ig', platform: 'Instagram', url: '#' },
        { id: 'li', platform: 'LinkedIn', url: '#' },
    ]
}

const initialLinkPage: LinkPage = {
    id: 'main',
    userId: 'preview-user',
    title: 'Your Page',
    theme: 'emerald', // Start with a default
    createdAt: new Date()
}


// This component is not used anymore but kept to avoid breaking imports if any exist.
// The preview is now rendered directly in `src/app/page.tsx`.
export default function PreviewFrame() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', padding: '1rem', textAlign: 'center' }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p style={{ marginTop: '1rem', color: '#888' }}>Loading Preview...</p>
    </div>
  );
}
