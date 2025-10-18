'use client'; // ABSOLUT ENTSCHEIDEND: DIES MUSS DIE ERSTE ZEILE SEIN

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Nfc } from 'lucide-react';

// Der Inhalt Ihrer alten designer/page.tsx kommt in diese Funktion.
function DesignerLogic() {
    const searchParams = useSearchParams();
    
    // States für die Design-Anpassungen
    const [cardType, setCardType] = useState('plastic');
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    // Liest den Kartentyp aus den URL-Parametern aus, falls vorhanden
    useEffect(() => {
        const initialCardType = searchParams.get('type');
        if (initialCardType) {
            setCardType(initialCardType);
        }
    }, [searchParams]);

    const handleAddToCart = () => {
        // Logik, um das angepasste Produkt in den Warenkorb zu legen
        console.log("Zum Warenkorb hinzugefügt:", { cardType, name, title, logoUrl });
        alert("Karte wurde dem Warenkorb hinzugefügt! (Simulation)");
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
                {/* Visuelle Vorschau der Karte */}
                <Card className="w-full max-w-sm aspect-[1.586/1] flex flex-col justify-between p-4 bg-gray-800 text-white">
                    <div>
                        <p className="font-bold text-lg">{name || "Dein Name"}</p>
                        <p className="text-sm">{title || "Deine Position"}</p>
                    </div>
                    <div className="flex justify-between items-end">
                        {logoUrl ? <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain rounded-full bg-white p-1"/> : <div className="h-8 w-8 rounded-full bg-gray-600"/>}
                        <Nfc size={24} />
                    </div>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Passe deine Karte an</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Kartentyp</Label>
                            <ToggleGroup type="single" value={cardType} onValueChange={(value) => {if(value) setCardType(value)}} className="mt-2">
                                <ToggleGroupItem value="plastic">Plastik</ToggleGroupItem>
                                <ToggleGroupItem value="metal">Metall</ToggleGroupItem>
                                <ToggleGroupItem value="wood">Holz</ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Max Mustermann" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Titel / Position</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CEO / Gründer" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo URL (optional)</Label>
                            <Input id="logo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://beispiel.com/logo.png" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleAddToCart}>In den Warenkorb</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

// Dieser Wrapper sorgt dafür, dass die Hooks korrekt geladen werden.
export default function DesignerClientContent() {
    return (
        <Suspense>
            <DesignerLogic />
        </Suspense>
    );
}
