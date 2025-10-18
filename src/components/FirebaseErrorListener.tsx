
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: Error) => {
      // Check if it's our custom Firestore permission error
      if (error instanceof FirestorePermissionError || error.message.includes('Firestore Security Rules')) {
         toast({
          variant: "destructive",
          title: "Permission Denied",
          description: error.message,
          duration: 20000, // Keep it on screen longer for debugging
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    // Cleanup on component unmount
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  // This component does not render anything
  return null;
}
