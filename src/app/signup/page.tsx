'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { Eye, EyeOff } from 'lucide-react';


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.17,44,30.025,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );
}


export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const activationCode = searchParams.get('activationCode');
  const referralCode = searchParams.get('ref');

  const handleRedirect = (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    if (activationCode) {
        router.push(`/dashboard/activate?code=${activationCode}`);
    } else {
        router.push('/dashboard');
        // Check for admin role in background
        getDoc(userDocRef).then(userDoc => {
            if (userDoc.exists() && userDoc.data()?.role === 'admin') {
                router.push('/admin');
            }
        })
    }
  };

  const createInitialDocuments = async (user: User, displayName: string, avatarUrl: string | null) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const isAdmin = user.email === 'omerawel7@gmail.com';
    const newUsername = displayName.replace(/\s+/g, '_').toLowerCase() || user.email?.split('@')[0] || `user${Date.now()}`;
    
    await setDoc(userDocRef, {
        username: newUsername,
        email: user.email,
        displayName: displayName,
        createdAt: serverTimestamp(),
        bio: '',
        avatarUrl: avatarUrl || '',
        ...(isAdmin && { role: 'admin' }),
        ...(referralCode && { referredBy: referralCode }),
    }, { merge: true });

    const linkPageDocRef = doc(firestore, `users/${user.uid}/linkPages`, "main");
    await setDoc(linkPageDocRef, {
        title: `${displayName}'s Page`,
        theme: 'default',
        createdAt: serverTimestamp(),
    });
    
    const businessCardRef = doc(firestore, `users/${user.uid}/businessCards`, "main");
    await setDoc(businessCardRef, {
        name: displayName,
        jobTitle: '',
        company: '',
        email: user.email,
        phone: '',
        socials: [],
        createdAt: serverTimestamp(),
    });
  }


   const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await createInitialDocuments(user, user.displayName || 'New User', user.photoURL);
        }
        handleRedirect(user);
    } catch (error) {
        console.error(error);
        toast({
            title: 'Google Sign-In Failed',
            description: 'Could not sign in with Google. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  };


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast({
        title: 'Username is required',
        variant: 'destructive',
      });
      return;
    }
     if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await createInitialDocuments(user, username, null);
      
      handleRedirect(user);
    } catch (error) {
      console.error(error);
      let message = "An unknown error occurred.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = "This email is already in use.";
            break;
          case 'auth/weak-password':
            message = "The password is too weak. Please use at least 6 characters.";
            break;
          case 'auth/invalid-email':
            message = "Please enter a valid email address.";
            break;
          default:
            message = error.message;
            break;
        }
      }
      toast({
        title: 'Signup Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>
                { referralCode 
                    ? `You've been invited by ${referralCode}! Join galaxislink.`
                    : 'Join galaxislink to start building your page.'
                }
            </CardDescription>
          </CardHeader>
           <CardContent className="grid gap-4">
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
              <GoogleIcon className="mr-2 h-4 w-4" />
               Sign up with Google
            </Button>
             <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </CardContent>
          <form onSubmit={handleSignup}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="yourname" required value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? 'text' : 'password'}
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                  <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline text-primary">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      <MarketingFooter />
    </div>
  );
}
