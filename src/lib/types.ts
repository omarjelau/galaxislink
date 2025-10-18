

/**
 * @fileOverview Type definitions for the VibeLink platform, encompassing user profiles, link pages, links,
 * business cards, and related entities.
 */

/**
 * Represents a string that can be localized into multiple languages.
 * @property {string} [de] - The string in German.
 * @property {string} [en] - The string in English.
 */
export type LocalizedString = {
    de?: string;
    en?: string;
};

/**
 * Represents a user profile in the system.
 * @property {string} id - The unique identifier for the user (Firebase UID).
 * @property {string} username - The user's chosen username.
 * @property {string} displayName - The user's display name.
 * @property {string} email - The user's email address.
 * @property {LocalizedString} bio - A short biography of the user.
 * @property {string} avatarUrl - URL of the user's avatar image.
 * @property {Date} createdAt - Timestamp indicating when the user profile was created.
 * @property {string} [role] - The user's role, e.g., 'admin'.
 * @property {string} [plan] - The user's subscription plan.
 */
export type UserProfile = {
    id: string;
    username: string;
    displayName: string;
    email: string;
    bio: LocalizedString;
    avatarUrl: string;
    createdAt: Date;
    role?: 'admin' | 'user';
    plan?: 'free' | 'basic' | 'premium' | 'enterprise';
    ambassadorStatus?: 'pending' | 'approved' | 'rejected';
    referredBy?: string;
};

/**
 * Represents a link page, similar to a Linktree page, containing a collection of links.
 * @property {string} id - The unique identifier for the link page.
 * @property {string} userId - The ID of the user who owns the link page.
 * @property {LocalizedString | string} title - The title of the link page.
 * @property {string} theme - The theme applied to the link page.
 * @property {Date | object} createdAt - Timestamp indicating when the link page was created.
 */
export type LinkPage = {
    id: string;
    userId: string;
    title: LocalizedString | string;
    theme: string;
    fontStyle?: 'modern' | 'elegant' | 'playful';
    buttonStyle?: 'rounded' | 'full' | 'sharp';
    buttonShadow?: boolean;
    iconsPerRow?: number;
    iconSize?: number;
    showBranding?: boolean;
    createdAt: Date | object;
};

/**
 * Represents a rule for geo-targeting a link.
 * @property {string} country - ISO 3166-1 alpha-2 country code.
 * @property {string} url - The URL to redirect to for the specified country.
 */
export type GeoTargetingRule = {
    country: string;
    url: string;
};

/**
 * Represents a single link within a link page.
 * @property {string} id - The unique identifier for the link.
 * @property {string} linkPageId - The ID of the link page this link belongs to.
 * @property {string} userId - The ID of the user who owns the link.
 * @property {string} url - The URL the link points to.
 * @property {LocalizedString} title - The title of the link.
 * @property {LocalizedString} [description] - An optional description of the link.
 * @property {string} [imageUrl] - Optional URL for an image to display with the link.
 * @property {string} [icon] - Optional identifier for an icon to display (e.g., 'instagram').
 * @property {number} clicks - The number of clicks the link has received.
 * @property {Date} createdAt - Timestamp indicating when the link was created.
 * @property {string} [password] - An optional password to protect the link.
 * @property {{ start?: string | Date; end?: string | Date }} [schedule] - An optional schedule for when the link is active.
 * @property {GeoTargetingRule[]} [geoTargeting] - An optional list of country-specific URL redirects.
 */
export type Link = {
    id: string;
    linkPageId: string;
    userId: string;
    url: string;
    title: LocalizedString;
    description?: LocalizedString;
    imageUrl?: string;
    icon?: string;
    clicks: number;
    createdAt: Date;
    order?: number;
    password?: string;
    schedule?: {
        start?: string | Date;
        end?: string | Date;
    };
    geoTargeting?: GeoTargetingRule[];
};


export type CardDesign = {
  frontLogoUrl?: string;
  frontLogoSize?: number;
  backQrColor?: string;
  backQrBackgroundColor?: string;
  cardBackgroundColor?: string;
};

export type PhysicalCard = {
    id: string;
    activationCode: string;
    linkedAt: any;
}


/**
 * Represents a digital business card.
 * @property {string} id - The unique identifier for the business card.
 * @property {string} userId - The ID of the user who owns the business card.
 * @property {string} name - The name displayed on the business card.
 * @property {LocalizedString} jobTitle - The job title displayed on the business card.
 * @property {string} company - The company name displayed on the business card.
 * @property {string} email - The email address displayed on the business card.
 * @property {string} phone - The phone number displayed on the business card.
 * @property {string} avatarUrl - URL of the avatar image for the business card.
 * @property {SocialLink[]} socials - Array of social media links associated with the business card.
 */
export type BusinessCard = {
    id: string;
    userId: string;
    name: string;
    jobTitle?: LocalizedString;
    company?: string;
    email?: string;
    phone?: string;
    socials?: SocialLink[];
    createdAt: Date | object;
    avatarUrl?: string;
    coverPhotoUrl?: string;
    companyLogoUrl?: string;
    location?: string;
    pronouns?: string;
    bio?: LocalizedString;
    iconsPerRow?: number;
    iconSize?: number;
    cardDesign?: CardDesign;
    physicalCard?: PhysicalCard;
    allowQrCodeDownload?: boolean;
};

/**
 * Represents a social media link associated with a business card.
 * @property {string} id - A unique identifier for the social link instance.
 * @property {string} platform - The name of the social media platform (e.g., Facebook, Twitter, LinkedIn).
 * @property {string} url - URL to the user's profile on the social media platform.
 * @property {string} [color] - A custom color for the icon.
 */
export type SocialLink = {
    id: string;
    platform: string;
    url: string;
    businessCardId?: string; // Optional as it's part of the BusinessCard's array
    color?: string;
};

export type NFCCard = {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    features?: string[];
    imageUrl?: string;
    imageHint?: string;
    isPrimary?: boolean;
    action?: string;
    href?: string;
    order?: number;
    active?: boolean;
};

/**
 * Represents a single blog post.
 * @property {string} id - Unique identifier for the blog post.
 * @property {string} slug - URL-friendly slug for the blog post.
 * @property {string} title - Title of the blog post.
 * @property {string} description - A short description or excerpt of the blog post.
 * @property {string} content - The full content of the blog post in Markdown format.
 * @property {string} imageUrl - URL of the feature image for the post.
 * @property {any} createdAt - Timestamp when the post was created.
 * @property {any} [updatedAt] - Timestamp when the post was last updated.
 */
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: any;
  updatedAt?: any;
};

export type UnclaimedNFCCard = {
    id: string;
    activationCode: string;
    cardType: string;
    status: 'unclaimed' | 'claimed';
    createdAt: any;
    claimedBy?: string;
    claimedAt?: any;
};

  