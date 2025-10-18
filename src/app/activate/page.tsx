import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Diese neue Komponente enthält die Logik, die den Fehler verursacht hat.
// 'use client' ist hier entscheidend.
function ActivateContent() {
  'use client';
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // HIER WAR IHRE BISHERIGE LOGIK
  // Fügen Sie hier Ihre ursprüngliche Logik zur Token-Verarbeitung wieder ein.
  // Zum Beispiel: API-Aufrufe, Zustandsaktualisierungen etc.

  return (
    <div>
      {/* Behalten Sie hier Ihren ursprünglichen JSX-Code bei */}
      <h1>Kontoaktivierung</h1>
      {token ? (
        <p>Aktivierung wird verarbeitet...</p>
      ) : (
        <p>Kein Aktivierungs-Token gefunden.</p>
      )}
    </div>
  );
}

// Dies ist die Haupt-Seitenkomponente. Sie bleibt auf dem Server.
export default function ActivatePage() {
  return (
    // Suspense sorgt dafür, dass der Client-Teil erst im Browser geladen wird.
    <Suspense fallback={<div>Wird geladen...</div>}>
      <ActivateContent />
    </Suspense>
  );
}
