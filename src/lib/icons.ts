import { Instagram, Link, Linkedin, LucideProps, ShoppingCart, Twitter, Youtube } from 'lucide-react';
import { getSocialIcon } from './social-icons';

// This function is now a proxy to getSocialIcon for backward compatibility or specific use cases.
// It's recommended to use getSocialIcon directly for new features.
export function getIcon(name?: string): React.FC<LucideProps> {
  return getSocialIcon(name);
}
