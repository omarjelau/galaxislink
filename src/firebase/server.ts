
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// NOTE: This is a server-side only file.

// This config is used for SERVER-SIDE rendering and API routes.
// It should be populated with your Firebase project credentials.
// For client-side, Firebase is initialized in `client-provider.tsx`
const firebaseConfig = {
  apiKey: "AIzaSyCt1K1nbPP-9cZA6iVsMEf2-TikEOxoU6o",
  authDomain: "studio-7568947177-2be23.firebaseapp.com",
  projectId: "studio-7568947177-2be23",
  storageBucket: "studio-7568947177-2be23.firebasestorage.app",
  messagingSenderId: "530164247751",
  appId: "1:530164247751:web:3a3d089b62a0f49ce8a2e2"
};

let app: FirebaseApp;
let firestore: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

firestore = getFirestore(app);

export function initializeFirebase() {
  return { firebaseApp: app, firestore };
}
