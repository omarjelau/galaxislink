import { Suspense } from 'react';
import SignupClientContent from '@/components/SignupClientContent'; // Wir erstellen diese Datei gleich
import { Loader2 } from 'lucide-react';

// Dies ist die NEUE, BEREINIGTE Server-Komponente.
// Ihre einzige Aufgabe ist es, die Client-Komponente sicher zu laden.
export default function SignupPage() {
  return (
    <div className="container mx-auto flex items-center justify-center py-12">
      <Suspense fallback={
          <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-12 w-12 animate-spin-slow text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Anmeldung wird geladen...</p>
          </div>
      }>
        <SignupClientContent />
      </Suspense>
    </div>
  );
}



             
