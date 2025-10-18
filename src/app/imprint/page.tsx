import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function ImprintPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 prose prose-invert max-w-4xl">
          <h1>Impressum</h1>
          
          <p>
            <strong>GalaxisLink GmbH</strong><br />
            Irenenstr. 66<br />
            40468 Düsseldorf<br />
            Deutschland
          </p>

          <h2>Geschäftsführer</h2>
          <p>Max Mustermann</p>

          <h2>Kontakt</h2>
          <p>
            E-Mail: info@galaxislink.com<br />
            Telefon: +49 211 123456
          </p>

          <h2>Handelsregister</h2>
          <p>
            Eingetragen im Handelsregister des Amtsgerichts Düsseldorf<br />
            Registernummer: HRB 12345
          </p>

          <h2>Umsatzsteuer-ID</h2>
          <p>DE123456789</p>

          <h2>Verantwortlich für den Inhalt</h2>
          <p>
            (gem. § 55 Abs. 2 RStV):<br />
            Max Mustermann<br />
            Irenenstr. 66<br />
            40468 Düsseldorf
          </p>

          <h2>Haftungsausschluss</h2>
          <p>Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.</p>

          <h2>Streitschlichtung</h2>
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>. Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
