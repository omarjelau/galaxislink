'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/server';
import { headers } from 'next/headers';

// This is a mock admin-only function to check the authorization header.
// In a real app, this would use a proper auth library (like next-auth or firebase-admin auth).
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  // In a real app, you would verify the JWT. Here we just check for a mock secret.
  return authToken === process.env.ADMIN_SECRET;
}


// Mock function to add an unclaimed card (for admins to use)
export async function POST(request: NextRequest) {
    if (!(await verifyAdmin(request))) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { firestore } = initializeFirebase();
    const { activationCode, cardType } = await request.json();

    if (!activationCode || !cardType) {
        return NextResponse.json({ success: false, message: 'Activation code and card type are required.' }, { status: 400 });
    }

    const cardRef = doc(firestore, 'unclaimedNFCCards', activationCode);

    try {
        await setDoc(cardRef, {
            activationCode,
            cardType,
            status: 'unclaimed',
            createdAt: new Date().toISOString(),
        });
        return NextResponse.json({ success: true, message: `Card ${activationCode} created.` });
    } catch (error) {
        console.error("Error creating unclaimed card:", error);
        return NextResponse.json({ success: false, message: 'Failed to create card.' }, { status: 500 });
    }
}


export async function PUT(request: NextRequest) {
  // NOTE: In a real app, you would get the userId from a secure session, not a header.
  const headersList = headers();
  const userId = headersList.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized: User not logged in.' }, { status: 401 });
  }

  const { activationCode } = await request.json();

  if (!activationCode) {
    return NextResponse.json({ success: false, message: 'Activation code is required.' }, { status: 400 });
  }

  const { firestore } = initializeFirebase();
  const unclaimedCardsRef = collection(firestore, 'unclaimedNFCCards');
  const q = query(unclaimedCardsRef, 
    where('activationCode', '==', activationCode), 
    where('status', '==', 'unclaimed')
  );

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ success: false, message: 'Invalid or already claimed activation code.' }, { status: 404 });
    }

    const cardDoc = querySnapshot.docs[0];
    const cardId = cardDoc.id;

    // Use a batch to perform atomic writes
    const batch = writeBatch(firestore);

    // 1. Update the unclaimed card's status
    const unclaimedCardRef = doc(firestore, 'unclaimedNFCCards', cardId);
    batch.update(unclaimedCardRef, {
      status: 'claimed',
      claimedBy: userId,
      claimedAt: new Date().toISOString(),
    });

    // 2. Update the user's main business card to link it
    const businessCardRef = doc(firestore, `users/${userId}/businessCards/main`);
    batch.set(businessCardRef, {
      physicalCard: {
        id: cardId,
        activationCode: activationCode,
        linkedAt: new Date().toISOString(),
      }
    }, { merge: true });

    await batch.commit();

    return NextResponse.json({ success: true, message: 'Your NFC card has been successfully activated and linked to your profile!' });

  } catch (error) {
    console.error('Error activating card:', error);
    return NextResponse.json({ success: false, message: 'An internal error occurred. Please try again.' }, { status: 500 });
  }
}
