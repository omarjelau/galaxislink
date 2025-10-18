import { Suspense } from 'react';
import ActivateClientContent from '@/components/ActivateClientContent';
import { Loader2 } from 'lucide-react';

// Dies ist jetzt eine reine Server-Komponente.
// Sie zeigt nur ein Lade-Fallback an, während sie auf die Client-Komponente wartet.
export default function ActivatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <Loader2 className="h-12 w-12 animate-spin-slow text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Seite wird vorbereitet...</p>
          </div>
      }>
        <ActivateClientContent />
      </Suspense>
    </div>
  );
}
