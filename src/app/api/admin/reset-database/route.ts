
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/firebase/admin';

// Initialize Firebase Admin SDK
const firebaseAdmin = initializeFirebaseAdmin();

async function deleteCollection(db: any, collectionPath: string, batchSize: number = 500) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

async function deleteQueryBatch(db: any, query: any, batchSize: number, resolve: any, reject: any) {
  const snapshot = await query.get();

  // When there are no documents left, we are done
  if (snapshot.size === 0) {
    return 0;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`Deleted ${snapshot.size} documents`);

  // Recurse on the next process tick, to avoid exploding the stack.
  if (snapshot.size >= batchSize) {
    return process.nextTick(() => {
      deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
  }

  resolve();
}

export async function POST(req: NextRequest) {
  try {
    // Initialize Firebase Admin
    if (!firebaseAdmin) {
      return NextResponse.json({ success: false, message: 'Firebase Admin initialization failed.' }, { status: 500 });
    }

    const db = getFirestore();
    const auth = getAuth();

    // 1. Delete all collections
    const collections = await db.listCollections();
    const collectionDeletionPromises = collections.map(collection => {
      console.log(`Deleting collection: ${collection.id}`);
      return deleteCollection(db, collection.id);
    });

    await Promise.all(collectionDeletionPromises);
    console.log('All collections deleted.');

    // 2. Delete all users
    const userDeletionPromises: Promise<any>[] = [];
    let nextPageToken: string | undefined = undefined;

    while (true) {
      const result = await auth.listUsers(1000, nextPageToken);

      result.users.forEach(user => {
        console.log(`Deleting user: ${user.uid}`);
        userDeletionPromises.push(auth.deleteUser(user.uid));
      });

      nextPageToken = result.pageToken;

      if (!nextPageToken) {
        break;
      }
    }

    await Promise.all(userDeletionPromises);
    console.log('All users deleted.');

    return NextResponse.json({ success: true, message: 'Database reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json({ success: false, message: 'Failed to reset database.', error: error }, { status: 500 });
  }
}
