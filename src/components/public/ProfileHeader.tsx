'use client';

import Image from 'next/image';
import { UserProfile, BusinessCard, LinkPage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getString } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

type ProfileHeaderProps = {
  userProfile: UserProfile;
  businessCard: BusinessCard | null;
  linkPage: LinkPage | null;
};

export function ProfileHeader({ userProfile, businessCard, linkPage }: ProfileHeaderProps) {
    const { language } = useLanguage();
    const pageTitle = getString(linkPage?.title, language) || userProfile.displayName;
    const pageDescription = getString(businessCard?.bio, language);
    const avatarUrl = businessCard?.avatarUrl || userProfile.avatarUrl;
    const coverPhotoUrl = businessCard?.coverPhotoUrl;

    return (
        <div className="flex flex-col items-center text-center">
            {coverPhotoUrl && (
                 <div className="relative w-full h-48 mb-[-4rem] rounded-xl overflow-hidden">
                    <Image
                        src={coverPhotoUrl}
                        alt="Cover Photo"
                        layout="fill"
                        objectFit="cover"
                    />
                 </div>
            )}
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg z-10">
                <AvatarImage src={avatarUrl} alt={userProfile.displayName} />
                <AvatarFallback className="text-3xl bg-muted">
                    {userProfile.displayName?.[0]}
                </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold mt-4">{pageTitle}</h1>
            {pageDescription && <p className="text-muted-foreground mt-1 max-w-md">{pageDescription}</p>}
        </div>
    );
}
