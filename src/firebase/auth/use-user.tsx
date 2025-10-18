'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

interface UseUserResult {
    user: User | null;
    isUserLoading: boolean;
    error: Error | null;
}

export function useUser(): UseUserResult {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUserLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If there's no auth instance, we're not loading and there's no user.
    if (!auth) {
        setUser(null);
        setIsLoading(false);
        setError(new Error("Firebase Auth instance not available."));
        return;
    }
    
    // Set initial state based on synchronous currentUser
    setUser(auth.currentUser);
    setIsLoading(true); 

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setIsLoading(false);
      },
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setError(error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading, error };
}
