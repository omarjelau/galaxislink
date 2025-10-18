'use client';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { LinkList } from './LinkList';
import { ProfileHeader } from './ProfileHeader';
import { ShareActions } from './ShareActions';
import type { UserProfile, Link as LinkType, BusinessCard, LinkPage } from '@/lib/types';
import { Mail, Share2 } from 'lucide-react';
import { SocialIcons } from './SocialIcons';

export type PreviewView = 'card' | 'links';

export interface ProfilePageProps {
  userProfile: UserProfile | null;
  links: LinkType[];
  businessCard: BusinessCard | null;
  linkPage: LinkPage | null;
  onLinkClick?: (link: LinkType) => void;
  isPreview?: boolean;
}

export function LinksView({ userProfile, links, linkPage, businessCard, onLinkClick }: ProfilePageProps) {
  if (!userProfile) return null;

  return (
    <>
      <ProfileHeader userProfile={userProfile} businessCard={businessCard} linkPage={linkPage} />
      {links && linkPage && links.length > 0 && (
        <div className="mt-8">
          <LinkList links={links} onLinkClick={onLinkClick} linkPage={linkPage} />
        </div>
      )}
    </>
  );
}

export function DigitalBusinessCardView({ userProfile, businessCard, isPreview }: Omit<ProfilePageProps, 'links' | 'linkPage' | 'onLinkClick'>) {
  if (!userProfile || !businessCard) return null;

  const handleSaveContact = () => {
    if (!isPreview) {
      window.open(`/api/vcard?userId=${userProfile.id}&cardId=main`, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
        <Avatar className="w-28 h-28 border-4 border-muted-foreground/20">
            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.displayName} />
            <AvatarFallback className="text-4xl bg-muted-foreground/10">
                {userProfile.displayName?.[0]}
            </AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-headline mt-4">{userProfile.displayName}</h1>
        
        <div className="flex flex-row gap-4 w-full max-w-sm mt-6">
            <ShareActions userProfile={userProfile} businessCard={businessCard} asChild>
                <Button variant="outline" className="shrink-0">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </Button>
            </ShareActions>
            <Button className="w-full" onClick={handleSaveContact}>Save Contact</Button>
        </div>
        
        {businessCard?.socials && businessCard.socials.length > 0 && (
            <div className="mt-8 w-full">
                <SocialIcons businessCard={businessCard} iconOnly={true} />
            </div>
        )}

        <div className="mt-8 text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4"/>
            <span>{userProfile.email}</span>
        </div>
    </div>
  );
}

export function ProfilePage(props: ProfilePageProps) {
  if (!props.userProfile) {
    return <p>User not found.</p>;
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-8">
      <LinksView {...props} />
    </div>
  );
}
