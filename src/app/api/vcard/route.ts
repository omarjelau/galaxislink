
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/server'; // Server-side init
import type { BusinessCard, UserProfile } from '@/lib/types';
import { getString } from '@/lib/utils';

// VCard generation function
function createVCard(card: BusinessCard, user: UserProfile): string {
  // Safely handle localized strings that might be objects or plain strings
  const jobTitle = getString(card.jobTitle, 'en');
  const bio = getString(user.bio, 'en');

  let vCard = 'BEGIN:VCARD\n';
  vCard += 'VERSION:3.0\n';
  vCard += `FN:${card.name}\n`;
  vCard += `N:${card.name};;;\n`;
  if (jobTitle) vCard += `TITLE:${jobTitle}\n`;
  if (card.company) vCard += `ORG:${card.company}\n`;
  if (card.email) vCard += `EMAIL;TYPE=INTERNET,PREF:${card.email}\n`;
  if (card.phone) vCard += `TEL;TYPE=CELL,PREF:${card.phone}\n`;
  if (user.avatarUrl) vCard += `PHOTO;VALUE=URL:${user.avatarUrl}\n`;
  if (bio) vCard += `NOTE:${bio.replace(/\n/g, '\\n')}\n`;

  card.socials?.forEach(social => {
    if (social && social.platform && social.url) {
      // Use X-SOCIALPROFILE for custom social links, a common convention
      vCard += `X-SOCIALPROFILE;TYPE=${social.platform}:${social.url}\n`;
    }
  });

  vCard += 'END:VCARD\n';
  return vCard;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const cardId = searchParams.get('cardId');

  if (!userId || !cardId) {
    return new NextResponse('User ID and Card ID are required', { status: 400 });
  }

  try {
    const { firestore } = initializeFirebase();

    const userRef = doc(firestore, 'users', userId);
    const cardRef = doc(firestore, `users/${userId}/businessCards`, cardId);

    const [userDoc, cardDoc] = await Promise.all([getDoc(userRef), getDoc(cardRef)]);

    if (!userDoc.exists() || !cardDoc.exists()) {
      return new NextResponse('User or Card not found', { status: 404 });
    }

    const userProfile = userDoc.data() as UserProfile;
    const businessCard = cardDoc.data() as BusinessCard;
    
    // Generate vCard string
    const vCardData = createVCard(businessCard, userProfile);

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'text/vcard; charset=utf-8');
    headers.set('Content-Disposition', `attachment; filename="${userProfile.username || 'contact'}.vcf"`);

    return new NextResponse(vCardData, { status: 200, headers });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
