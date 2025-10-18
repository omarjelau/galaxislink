
'use client';

import Image from 'next/image';
import { VibeLinkLogo } from '../VibeLinkLogo';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link as LinkType } from '@/lib/types';

const dummyLinks: Partial<LinkType>[] = [
    { title: { en: 'My Portfolio', de: 'Mein Portfolio' }, url: '#' },
    { title: { en: 'Latest Blog Post', de: 'Neuester Blogbeitrag' }, url: '#' },
    { title: { en: 'Follow me on X', de: 'Folge mir auf X' }, url: '#' },
];

export function LinkListPreview() {
    return (
        <div className="h-full w-full bg-background text-foreground p-4 flex flex-col items-center theme-light">
             <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4 border-4 border-primary/50">
                    <AvatarImage src="https://picsum.photos/seed/preview-avatar/200" alt="Your Name" />
                    <AvatarFallback>YN</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold font-headline">Your Name</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome to my page! Find all my important links here.
                </p>
            </div>

            <div className="w-full space-y-3 mt-8 flex-grow">
                {dummyLinks.map((link, index) => (
                    <Button key={index} className="w-full justify-center h-14" variant="outline">
                       {typeof link.title === 'string' ? link.title : (link.title?.en || '')}
                    </Button>
                ))}
            </div>

            <div className="mt-8">
                <VibeLinkLogo />
            </div>
        </div>
    );
}
