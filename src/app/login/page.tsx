import { Suspense } from 'react';
import LoginClientContent from '@/components/LoginClientContent';
import { Loader2 } from 'lucide-react';

// Reine Server-Komponente, die nur das Lade-Fallback und die Client-Komponente rendert.
export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center py-12">
      <Suspense fallback={
          <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-12 w-12 animate-spin-slow text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Login wird geladen...</p>
          </div>
      }>
        <LoginClientContent />
      </Suspense>
    </div>
  );
}
