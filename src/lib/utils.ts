
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LocalizedString } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Safely retrieves a string from a potentially localized string object.
 *
 * @param val The value to process, which can be a string, a LocalizedString object, or undefined.
 * @param lang The preferred language ('de' or 'en'). Defaults to 'en'.
 * @returns The string in the preferred language, a fallback language, or an empty string.
 */
export const getString = (val: string | LocalizedString | undefined | null, lang: 'de' | 'en' = 'en'): string => {
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
        // Return preferred language, or English fallback, or German fallback, or empty string
        return val[lang] || val.en || val.de || '';
    }
    return '';
}
