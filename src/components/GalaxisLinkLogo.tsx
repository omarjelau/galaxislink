import { Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GalaxisLinkLogo({ size = 'default', logoText = "galaxislink" }: { size?: 'sm' | 'default', logoText?: string }) {
  
  const sizeClasses = {
      default: 'text-2xl',
      sm: 'text-lg'
  }
  
  const iconSizeClasses = {
      default: 'h-5 w-5',
      sm: 'h-4 w-4'
  }
  
  const [firstWord, secondWord] = logoText.split(" ");

  return (
    <div className={cn("flex items-center gap-1 font-logo font-bold tracking-tighter text-primary", sizeClasses[size])}>
      <span>{firstWord || 'galaxislink'}</span>
      {secondWord && <LinkIcon className={cn("-rotate-45", iconSizeClasses[size])} />}
      {secondWord && <span>{secondWord}</span>}
    </div>
  );
}
