
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Loader2, Download, QrCode } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { nanoid } from 'nanoid';
import { QRCode } from 'react-qrcode-logo';
import { UnclaimedNFCCard } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function AdminUnclaimedCardsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardType, setCardType] = useState('GalaxisLink-Standard');

  const unclaimedCardsQuery = useMemoFirebase(() => collection(firestore, 'unclaimedNFCCards'), [firestore]);
  const { data: cards, isLoading } = useCollection<UnclaimedNFCCard>(unclaimedCardsQuery);

  const handleCreateNew = async () => {
    if (!cardType) {
        toast({ title: 'Card Type is required', variant: 'destructive'});
        return;
    }
    setIsSubmitting(true);
    const newActivationCode = nanoid(10);
    const cardRef = doc(firestore, 'unclaimedNFCCards', newActivationCode);

    try {
      await setDoc(cardRef, {
        id: newActivationCode,
        activationCode: newActivationCode,
        cardType: cardType,
        status: 'unclaimed',
        createdAt: new Date().toISOString(),
      });
      toast({ title: 'Success', description: `New unclaimed card created with code: ${newActivationCode}` });
      setIsDialogOpen(false);
      setCardType('GalaxisLink-Standard'); // Reset for next time
    } catch (error) {
      console.error('Failed to create new unclaimed card:', error);
      toast({ title: 'Error', description: 'Failed to create new card.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cardId: string) => {
    const cardRef = doc(firestore, 'unclaimedNFCCards', cardId);
    try {
      await deleteDoc(cardRef);
      toast({ title: 'Success', description: 'Unclaimed card deleted.', variant: 'destructive' });
    } catch (error) {
      console.error('Failed to delete card:', error);
      toast({ title: 'Error', description: 'Failed to delete card.', variant: 'destructive' });
    }
  };

  const downloadQRCode = (activationCode: string) => {
    const canvas = document.getElementById(`qr-${activationCode}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `galaxislink-qr-${activationCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Unclaimed NFC Cards</h1>
          <p className="text-muted-foreground">Create and manage cards that are ready to be activated by users.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate New Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Generate New Unclaimed Card</DialogTitle>
            </DialogHeader>
             <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="card-type">Card Type</Label>
                    <Select value={cardType} onValueChange={setCardType}>
                        <SelectTrigger id="card-type">
                            <SelectValue placeholder="Select a card type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="GalaxisLink-Standard">GalaxisLink-Standard</SelectItem>
                            <SelectItem value="GalaxisLink Card">GalaxisLink Card</SelectItem>
                            <SelectItem value="PVC">PVC</SelectItem>
                            <SelectItem value="Wood">Wood</SelectItem>
                            <SelectItem value="Metal">Metal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateNew} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Card
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
       <Card>
        <CardHeader>
            <CardTitle>Available Cards</CardTitle>
            <CardDescription>
                These cards have been created and are awaiting activation by a user.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Activation Code</TableHead>
                    <TableHead>Card Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cards?.map(card => (
                    <TableRow key={card.id}>
                        <TableCell className="font-mono">{card.activationCode}</TableCell>
                         <TableCell>{card.cardType}</TableCell>
                        <TableCell>
                          <Badge variant={card.status === 'claimed' ? 'secondary' : 'default'}>{card.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm"><QrCode className="h-4 w-4 mr-2" /> View QR</Button>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>QR Code for {card.activationCode}</DialogTitle>
                                </DialogHeader>
                                <div className="flex justify-center p-4">
                                   <QRCode 
                                    id={`qr-${card.activationCode}`}
                                    value={`${window.location.origin}/activate?code=${card.activationCode}`}
                                    size={200}
                                   />
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => downloadQRCode(card.activationCode)}><Download className="h-4 w-4 mr-2"/> Download</Button>
                                </DialogFooter>
                             </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(card.id)}>
                            <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
