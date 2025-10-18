'use client';

import { Github, Twitter, Linkedin, Instagram, Link } from 'lucide-react';

interface SocialIconProps {
    platform: string;
    url: string;
    className?: string;
}

export function SocialIcon({ platform, url, className }: SocialIconProps) {
    const lowerCasePlatform = platform.toLowerCase();
    
    const getIcon = () => {
        switch (lowerCasePlatform) {
            case 'github':
                return <Github className={className} />;
            case 'twitter':
                return <Twitter className={className} />;
            case 'linkedin':
                return <Linkedin className={className} />;
            case 'instagram':
                return <Instagram className={className} />;
            default:
                return <Link className={className} />;
        }
    };

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={platform}>
            {getIcon()}
        </a>
    );
}
