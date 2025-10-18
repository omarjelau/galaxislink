'use client';
import { motion } from 'framer-motion';
import { Link as LinkType, LinkPage, UserProfile } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { cn, getString } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getSocialIcon } from '@/lib/social-icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


interface LinkListProps {
  links: LinkType[];
  linkPage: LinkPage;
  onLinkClick: (link: LinkType) => void;
}

export function LinkList({ links, onLinkClick, linkPage }: LinkListProps) {
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const buttonStyleClasses = {
      rounded: "rounded-lg",
      full: "rounded-full",
      sharp: "rounded-none",
  };
  
  const buttonClass = buttonStyleClasses[linkPage.buttonStyle || 'rounded'];

  return (
    <motion.div
      className="flex flex-col space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {links.map((link) => {
        const Icon = getSocialIcon(link.icon);
        const title = getString(link.title, language);

        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLinkClick(link)}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full",
              linkPage.buttonShadow && "shadow-lg hover:shadow-primary/30"
            )}
          >
             <Button variant="secondary" className={cn("w-full h-14 text-base", buttonClass)}>
              {link.imageUrl && (
                 <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={link.imageUrl} alt={title} />
                  <AvatarFallback>{title.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
               {!link.imageUrl && Icon && <Icon className="mr-3 h-6 w-6" />}
               <span className="truncate">{title}</span>
            </Button>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
