
'use client';

import { BusinessCard, SocialLink } from "@/lib/types";
import { getSocialIcon } from "@/lib/social-icons";
import { cn, getString } from "@/lib/utils";

interface SocialIconsProps {
  businessCard: BusinessCard | null;
  iconOnly?: boolean;
}

export function SocialIcons({ businessCard, iconOnly = false }: SocialIconsProps) {
  if (!businessCard?.socials || businessCard.socials.length === 0) {
    return null;
  }

  const iconsPerRow = businessCard.iconsPerRow || 5;
  const iconSize = businessCard.iconSize || 40;

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[iconsPerRow] || 'grid-cols-5';

  return (
    <div className={cn("flex w-full justify-center", !iconOnly && "flex-col gap-4")}>
      {iconOnly ? (
         <div className={cn("grid gap-4 items-center justify-center w-full", gridClass)}>
            {businessCard.socials.map((social, index) => {
              if (!social || !social.platform) return null;
              const Icon = getSocialIcon(social.platform);
              return (
                 <a 
                  key={social.id || index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="flex items-center justify-center"
                >
                  <Icon
                    className="transition-transform duration-200 hover:scale-110"
                    style={{ 
                        width: `${iconSize}px`, 
                        height: `${iconSize}px`,
                        color: social.color
                    }}
                  />
                </a>
              );
            })}
        </div>
      ) : (
        businessCard.socials.map((social, index) => {
           if (!social || !social.platform) return null;
           const Icon = getSocialIcon(social.platform);
           return (
            <a 
              key={social.id || index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <Icon className="h-6 w-6" style={{ color: social.color }} />
              <span className="font-semibold">{social.platform}</span>
            </a>
           )
        })
      )}
    </div>
  );
}
