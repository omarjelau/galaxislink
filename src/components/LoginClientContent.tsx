'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState(searchParams.get('error') || '');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Hier würde Ihre Anmelde-Logik (z.B. mit Firebase Auth) stehen.
        // Beispiel:
        // try {
        //   await signInWithEmailAndPassword(auth, email, password);
        //   router.push('/dashboard');
        // } catch (err) {
        //   setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
        // }
        console.log('Anmeldung versucht mit:', email, password);
    };

    return (
        <div className="mx-auto max-w-sm">
            <h2 className="text-center text-2xl font-bold">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        type="email" 
                        id="email" 
                        placeholder="email@beispiel.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Passwort</Label>
                    <Input 
                        type="password" 
                        id="password" 
                        placeholder="********" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Fehler</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full">Anmelden</Button>
            </form>
        </div>
    );
}


// Dieser Wrapper ist notwendig, damit useSearchParams korrekt funktioniert.
export default function LoginClientContent() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}

