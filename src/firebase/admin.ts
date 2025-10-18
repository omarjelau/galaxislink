
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

let firebaseAdmin: App | undefined = undefined;

export function initializeFirebaseAdmin() {
  if (!process.env.FIREBASE_ADMIN_SDK_JSON) {
    console.warn('Skipping Firebase Admin initialization: process.env.FIREBASE_ADMIN_SDK_JSON is not defined');
    return firebaseAdmin;
  }

  if (!getApps().length) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
      firebaseAdmin = initializeApp({
        credential: credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized');
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
    }
  } else {
    firebaseAdmin = getApps()[0];
  }

  return firebaseAdmin;
}

export { firebaseAdmin };
