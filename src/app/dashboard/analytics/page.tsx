'use client'
import { Analytics } from "@/components/dashboard/Analytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Analytics</h1>
        <p className="text-muted-foreground">Here's a detailed breakdown of your GalaxisLink performance.</p>
      </header>
      <Analytics />
    </div>
  );
}
