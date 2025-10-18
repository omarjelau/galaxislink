
import {
  Linkedin,
  Twitter,
  Github,
  Youtube,
  Instagram,
  Facebook,
  Globe,
  LucideProps,
  FileText,
  Calendar,
  Star,
  Music,
  Video,
  ShoppingCart,
  Link,
  Mail,
} from 'lucide-react';
import {
  SiTiktok,
  SiSnapchat,
  SiThreads,
  SiPinterest,
  SiSpotify,
  SiTelegram,
  SiWhatsapp,
  SiCalendly,
  SiTrustpilot,
} from '@icons-pack/react-simple-icons';

export const socialPlatforms = {
  'Contact': [
    { name: 'Mail', icon: Mail, color: '#888888' },
    { name: 'Telegram', icon: SiTelegram, color: '#26A5E4' },
    { name: 'Whatsapp', icon: SiWhatsapp, color: '#25D366' },
    { name: 'Website', icon: Globe, color: '#888888' },
  ],
  'Social Media': [
    { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
    { name: 'X', icon: Twitter, color: '#000000' },
    { name: 'Github', icon: Github, color: '#181717' },
    { name: 'TikTok', icon: SiTiktok, color: '#000000' },
    { name: 'YouTube', icon: Youtube, color: '#FF0000' },
    { name: 'Snapchat', icon: SiSnapchat, color: '#FFFC00' },
    { name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { name: 'Threads', icon: SiThreads, color: '#000000' },
    { name: 'Pinterest', icon: SiPinterest, color: '#E60023' },
  ],
  'Music & Video': [
    { name: 'Spotify', icon: SiSpotify, color: '#1DB954' },
    { name: 'Music', icon: Music, color: '#888888' },
    { name: 'Video', icon: Video, color: '#888888' },
  ],
  'Other': [
    { name: 'Calendly', icon: SiCalendly, color: '#006BFF' },
    { name: 'Google Review', icon: Star, color: '#FBBC05' },
    { name: 'Trustpilot', icon: SiTrustpilot, color: '#00B67A' },
    { name: 'PDF', icon: FileText, color: '#FF0000' },
    { name: 'Calendar', icon: Calendar, color: '#34A853' },
    { name: 'Shopping Cart', icon: ShoppingCart, color: '#888888' },
  ]
};

const allPlatforms = Object.values(socialPlatforms).flat();

const socialIconMap: { [key: string]: React.FC<LucideProps | React.SVGProps<SVGSVGElement>> } = allPlatforms.reduce((acc, platform) => {
    acc[platform.name.toLowerCase().replace(/\s/g, '')] = platform.icon;
    return acc;
}, {} as { [key: string]: React.FC<LucideProps | React.SVGProps<SVGSVGElement>> });

// Add aliases and defaults
socialIconMap['twitter'] = Twitter;
socialIconMap['googlereview'] = Star;
socialIconMap['shopping-cart'] = ShoppingCart;


export function getSocialIcon(platform?: string): React.FC<LucideProps | React.SVGProps<SVGSVGElement>> {
  if (!platform) return Link;
  const lowerCasePlatform = platform.toLowerCase().replace(/\s/g, '');
  return socialIconMap[lowerCasePlatform] || Link;
}
