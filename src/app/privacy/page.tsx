'use client';
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date('2025-10-16T17:32:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 prose prose-invert max-w-4xl">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

          <h2>1. Data Collection and Processing</h2>
          <p>GalaxisLink GmbH, located at Irenenstr. 66, 40468 Düsseldorf, Germany (info@galaxislink.com), collects and processes personal data in accordance with GDPR only with user consent or for the fulfillment of contractual obligations.</p>
          
          <h2>2. Processed Data</h2>
          <ul>
            <li><strong>Registration:</strong> Email, password (encrypted).</li>
            <li><strong>Usage:</strong> IP address, click data (for analytics), language settings.</li>
            <li><strong>Data Source:</strong> Direct user input, Firebase (europe-west1).</li>
          </ul>

          <h2>3. Purpose of Processing</h2>
          <ul>
            <li>Provision of the platform (Link-in-Bio, digital business cards).</li>
            <li>Analysis and improvement of services (anonymized where possible).</li>
            <li>Communication (support, newsletters with consent).</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>Data is not shared with third parties, except for service providers (e.g., Stripe for payments, Firebase for hosting) who operate under confidentiality agreements.</p>
          
          <h2>5. Storage Duration</h2>
          <p>Data is deleted 30 days after account cancellation, unless legal retention obligations apply (e.g., 10 years for accounting records).</p>
          
          <h2>6. User Rights</h2>
          <p>Under GDPR Art. 15-21, users have the right to access, rectify, erase, restrict processing of, and port their data. For requests, contact info@galaxislink.com.</p>
          
          <h2>7. Cookies and Tracking</h2>
          <p>The platform uses cookies for functionality and analytics. Users can reject cookies through their browser settings; however, tracking requires explicit consent.</p>

          <h2>8. Security</h2>
          <p>Data is transmitted encrypted (TLS) and stored within the EU (Firebase, europe-west1).</p>
          
          <h2>9. Contact Information</h2>
          <p>For any inquiries regarding your data, please contact us at: GalaxisLink GmbH, Irenenstr. 66, 40468 Düsseldorf, Germany, or email info@galaxislink.com.</p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
