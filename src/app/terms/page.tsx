'use client';
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { useEffect, useState } from "react";

export default function TermsPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date('2025-10-17T09:16:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 prose prose-invert max-w-4xl">
          <h1>Terms and Conditions (T&amp;C)</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

          <h2>1. Scope of Application</h2>
          <p>These T&amp;C apply to all users of the "GalaxisLink" platform. The operator is GalaxisLink GmbH, Irenenstr. 66, 40468 Düsseldorf, Germany (info@galaxislink.com).</p>
          
          <h2>2. Service Description and Pricing</h2>
          <ul>
              <li><strong>Free Plan (€0/month):</strong> Limited to 2 links and 1 digital business card. Includes basic features and GalaxisLink branding.</li>
              <li><strong>Basic Plan (€4.99/month):</strong> Includes up to 5 links, 1 business card, selected premium themes, and QR code generation.</li>
              <li><strong>Premium Plan (€9.99/month):</strong> Includes unlimited links and cards, advanced analytics, NFC integration, and priority support.</li>
              <li><strong>Enterprise Plan (€19.99/month):</strong> Includes all Premium features plus team management, white-labeling, a dedicated account manager, and 2FA.</li>
          </ul>

          <h2>3. Conclusion of Contract and Payment</h2>
          <p>A contract is concluded upon registration. Paid plans (Basic, Premium, Enterprise) are subject to a monthly fee, payable via Stripe. Subscriptions automatically renew unless cancelled. A 14-day right of withdrawal applies to all paid plans from the date of purchase. After this period, no refunds will be issued.</p>
          
          <h2>4. User Obligations</h2>
          <p>Users are prohibited from posting illegal, offensive, or copyright-infringing content. We reserve the right to suspend or delete accounts that violate these terms.</p>
          
          <h2>5. Liability and Availability</h2>
          <p>GalaxisLink GmbH is not liable for damages resulting from the use of the platform or the content of linked third-party sites. We do not guarantee 100% platform availability; maintenance work is possible.</p>

          <h2>6. Data Protection</h2>
          <p>Data protection is governed by our separate Privacy Policy. All data is processed in accordance with the GDPR and stored within the EU.</p>

          <h2>7. Termination</h2>
          <p>Users can terminate their account at any time via the dashboard. We reserve the right to terminate accounts for violations of these T&amp;C. Data will be deleted 30 days after termination.</p>

          <h2>8. Final Provisions</h2>
          <p>The jurisdiction for any disputes is Düsseldorf, Germany. German law applies. Changes to these T&amp;C will be communicated via email.</p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
