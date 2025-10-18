
import { AppearanceEditor } from "@/components/dashboard/AppearanceEditor";
import { AIThemeSuggester } from "@/components/dashboard/AIThemeSuggester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppearancePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Appearance</h1>
        <p className="text-muted-foreground">Customize the look and feel of your GalaxisLink page.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <AppearanceEditor />
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
              <CardHeader>
                  <CardTitle className="font-headline">AI Assistant</CardTitle>
                  <CardDescription>Need some inspiration? Let our AI help you out.</CardDescription>
              </CardHeader>
              <CardContent>
                  <AIThemeSuggester />
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
