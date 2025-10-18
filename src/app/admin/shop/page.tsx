
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, PlusCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import type { NFCCard } from '@/lib/types';
import Image from 'next/image';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { nanoid } from 'nanoid';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export default function AdminShopPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const nfcCardsQuery = useMemoFirebase(() => collection(firestore, 'nfcCards'), [firestore]);
  const { data: products, isLoading } = useCollection<NFCCard>(nfcCardsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Partial<NFCCard> | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);


  const handleEditClick = (product: NFCCard) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedProduct({
        id: nanoid(10), // Generate a temporary ID
        name: 'New Product',
        price: 0,
        description: '',
        features: [],
        imageUrl: '',
        active: true,
        order: (products?.length || 0)
    });
    setIsDialogOpen(true);
  }

  const handleSaveChanges = async () => {
    if (!selectedProduct || !selectedProduct.id) return;
    setIsSaving(true);
    try {
      const productRef = doc(firestore, 'nfcCards', selectedProduct.id);
      await setDoc(productRef, selectedProduct, { merge: true });
      toast({ title: 'Success', description: 'Product updated successfully.' });
      setIsDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast({ title: 'Error', description: 'Failed to update product.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = useCallback((field: keyof NFCCard, value: any) => {
    if (selectedProduct) {
      setSelectedProduct(prev => prev ? { ...prev, [field]: value } : null);
    }
  }, [selectedProduct]);

  const handleProductSelect = (productId: string, checked: boolean) => {
    setSelectedProductIds(prev =>
      checked ? [...prev, productId] : prev.filter(id => id !== productId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && products) {
      setSelectedProductIds(products.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  }

  const handleBulkAction = async (action: 'delete' | 'setVisible' | 'setInvisible') => {
    if (selectedProductIds.length === 0) return;
    setIsProcessing(true);
    const batch = writeBatch(firestore);
    
    selectedProductIds.forEach(id => {
      const docRef = doc(firestore, 'nfcCards', id);
      if (action === 'delete') {
        batch.delete(docRef);
      } else if (action === 'setVisible') {
        batch.update(docRef, { active: true });
      } else if (action === 'setInvisible') {
        batch.update(docRef, { active: false });
      }
    });

    try {
      await batch.commit();
      const message = action === 'delete' 
        ? `${selectedProductIds.length} products have been deleted.`
        : `${selectedProductIds.length} products have been updated.`;
      toast({
        title: 'Success',
        description: message,
        variant: action === 'delete' ? 'destructive' : 'default',
      });
      setSelectedProductIds([]);
    } catch (error) {
      console.error(`Failed to ${action} selected products:`, error);
      toast({ title: 'Error', description: `Failed to ${action} products.`, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const allSelected = products ? selectedProductIds.length === products.length : false;
  const someSelected = selectedProductIds.length > 0 && !allSelected;


  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Shop Management</h1>
          <p className="text-muted-foreground">Manage the NFC card products available in your shop.</p>
        </div>
         <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
        </Button>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
             <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                aria-label="Select all products"
                data-state={someSelected ? 'indeterminate' : (allSelected ? 'checked' : 'unchecked')}
            />
            <div>
              <CardTitle>NFC Card Products</CardTitle>
              <CardDescription>Edit prices, descriptions, and images for your products.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedProductIds.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm font-medium">{selectedProductIds.length} product(s) selected</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction('setVisible')} disabled={isProcessing}><Eye className="mr-2 h-4 w-4" /> Make Visible</Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction('setInvisible')} disabled={isProcessing}><EyeOff className="mr-2 h-4 w-4" /> Make Invisible</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isProcessing}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {selectedProductIds.length} products. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleBulkAction('delete')}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.sort((a,b) => (a.order ?? 99) - (b.order ?? 99)).map(product => (
                 <Card key={product.id} className={cn("flex flex-col relative transition-opacity", !product.active && "opacity-60")}>
                     <div className="absolute top-2 left-2 z-10 bg-background/50 p-1 rounded-sm">
                        <Checkbox
                          checked={selectedProductIds.includes(product.id)}
                          onCheckedChange={(checked) => handleProductSelect(product.id, !!checked)}
                          aria-label={`Select ${product.name}`}
                        />
                      </div>
                    <div className="relative w-full aspect-square">
                        <Image
                            src={product.imageUrl || '/placeholder.png'}
                            alt={product.name || 'Product Image'}
                            fill
                            className="rounded-t-md object-cover"
                        />
                        {!product.active && (
                            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                                <EyeOff className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                        <p className="font-bold font-headline text-lg">{product.name}</p>
                        <p className="text-sm text-primary font-semibold">€{product.price}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex-grow line-clamp-2">{product.description}</p>
                    </div>
                     <div className="p-4 pt-0">
                         <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditClick(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                     </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0 sm:max-w-2xl h-screen sm:h-auto sm:max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>Edit Product: {selectedProduct?.name}</DialogTitle>
            <DialogDescription>Make changes to the product details below.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 overflow-y-auto">
            {selectedProduct && (
              <div className="grid gap-6 px-6 py-4">
                 <ImageUploader
                  label="Product Image"
                  value={selectedProduct.imageUrl || ''}
                  onUploadComplete={(url) => handleInputChange('imageUrl', url)}
                />
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={selectedProduct.name || ''} onChange={e => handleInputChange('name', e.target.value)} />
                </div>
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (in EUR)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        value={selectedProduct.price ?? ''} 
                        onChange={e => handleInputChange('price', e.target.value === '' ? '' : parseFloat(e.target.value))} 
                      />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="order">Display Order</Label>
                        <Input 
                            id="order" 
                            type="number" 
                            value={selectedProduct.order ?? 99} 
                            onChange={e => handleInputChange('order', e.target.value === '' ? 99 : parseInt(e.target.value))} 
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={selectedProduct.description || ''} onChange={e => handleInputChange('description', e.target.value)} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="imageHint">AI Image Hint</Label>
                   <Input id="imageHint" value={selectedProduct.imageHint || ''} onChange={e => handleInputChange('imageHint', e.target.value)} placeholder="e.g. metal card, wood texture" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea id="features" value={selectedProduct.features?.join('\n') || ''} onChange={e => handleInputChange('features', e.target.value.split('\n'))} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="action">Action Text</Label>
                  <Input id="action" value={selectedProduct.action || 'Order Now'} onChange={e => handleInputChange('action', e.target.value)} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="href">Action Link</Label>
                  <Input id="href" value={selectedProduct.href || '/dashboard'} onChange={e => handleInputChange('href', e.target.value)} />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="isPrimary"
                        checked={selectedProduct.isPrimary}
                        onCheckedChange={(checked) => handleInputChange('isPrimary', checked)}
                    />
                    <Label htmlFor="isPrimary">Highlight as Primary Product</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch
                        id="active"
                        checked={selectedProduct.active}
                        onCheckedChange={(checked) => handleInputChange('active', checked)}
                    />
                    <Label htmlFor="active">Product is Active/Visible</Label>
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="border-t p-4 flex-row justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
