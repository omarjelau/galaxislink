'use client'; // ABSOLUT ENTSCHEIDEND: DIES MUSS DIE ERSTE ZEILE SEIN

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

// Der Inhalt Ihrer alten signup/page.tsx kommt in diese Funktion.
function SignupLogic() {
    const router = useRouter();
    const [error, setError] = useState('');
    
    // Fügen Sie hier alle Ihre 'useState'-Variablen aus der alten Datei ein
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    // Fügen Sie hier Ihre handleSignUp-Funktion ein
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // HIER KOMMT IHR URSPRÜNGLICHER SIGNUP-CODE HIN
        // z.B. der Aufruf an Firebase Auth
        console.log('Registrierung versucht mit:', username, email);
        // Bei Erfolg:
        // router.push('/dashboard');
        // Bei Fehler:
        // setError('Fehler bei der Registrierung.');
    };

    // HIER KOMMT IHR GESAMTER URSPRÜNGLICHER JSX-CODE (das return-Statement) HIN.
    return (
        <div className="mx-auto max-w-sm">
            <h2 className="text-center text-2xl font-bold">Konto erstellen</h2>
            <p className="text-center text-muted-foreground mb-4">Starte deine digitale Reise mit uns.</p>
            
            <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="username">Benutzername</Label>
                    <Input type="text" id="username" placeholder="dein-name" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="email@beispiel.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Passwort</Label>
                    <Input type="password" id="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Fehler</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full">Konto erstellen</Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
                Bereits ein Konto? <Link href="/login" className="underline">Jetzt anmelden</Link>
            </p>
        </div>
    );
}

// Dieser Wrapper sorgt dafür, dass die Hooks korrekt geladen werden.
// An dieser Datei müssen Sie nichts ändern.
export default function SignupClientContent() {
    return (
        <Suspense>
            <SignupLogic />
        </Suspense>
    );
}
