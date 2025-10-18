import { Suspense } from 'react';
import DesignerClientContent from '@/components/DesignerClientContent'; // Diese Datei erstellen wir als Nächstes
import { Loader2 } from 'lucide-react';

// Dies ist die NEUE, BEREINIGTE Server-Komponente für den Designer.
export default function DesignerPage() {
  return (
    <div className="container mx-auto flex items-center justify-center py-12">
      <Suspense fallback={
          <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
              <Loader2 className="h-12 w-12 animate-spin-slow text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Designer wird geladen...</p>
          </div>
      }>
        <DesignerClientContent />
      </Suspense>
    </div>
  );
}
