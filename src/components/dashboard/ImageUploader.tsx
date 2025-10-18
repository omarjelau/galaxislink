
'use client';

import { useState, useRef } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { Card, CardContent } from '../ui/card';
import { Image as ImageIcon, Upload, Link2, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  label: string;
  value: string;
  onUploadComplete: (url: string) => void;
  className?: string;
}

// Function to convert a file to a Base64 string
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


export function ImageUploader({ label, value, onUploadComplete, className }: ImageUploaderProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    const file = event.target.files[0];
    setUploading(true);
    setProgress(20); // Initial progress

    try {
        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        });
        setProgress(60);

        const base64String = await toBase64(compressedFile);
        setProgress(100);
        
        onUploadComplete(base64String);
        toast({
            title: 'Upload Complete!',
            description: `${label} has been updated.`,
        });

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Error',
        description: 'There was a problem processing your image.',
        variant: 'destructive',
      });
    } finally {
        setUploading(false);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };


  const handleUrlSubmit = () => {
    if(!urlInput) {
        toast({ title: "URL is empty", variant: "destructive"});
        return;
    }
    // Basic URL validation
    try {
        new URL(urlInput);
        onUploadComplete(urlInput);
        toast({ title: 'Image URL updated!' });
        setUrlInput('');
    } catch (_) {
        toast({ title: "Invalid URL", description: "Please enter a valid image URL.", variant: "destructive"});
    }
  }
  
  const currentImage = preview || value;

  return (
    <Card className={cn("overflow-hidden", className)}>
       <div className="p-6 pb-0">
         <h3 className="text-base font-medium">{label}</h3>
       </div>
      <CardContent className="space-y-4 p-6">
        <div className="relative w-full aspect-video rounded-md bg-muted overflow-hidden group">
          {currentImage ? (
             <Image src={currentImage} alt={label} layout="fill" className="object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
             </div>
          )}
        </div>

        {uploading && (
          <div className="space-y-1">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}%</p>
          </div>
        )}

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={uploading}><Upload className="mr-2 h-4 w-4"/> Upload</TabsTrigger>
            <TabsTrigger value="url" disabled={uploading}><Link2 className="mr-2 h-4 w-4"/> URL</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="pt-4">
            <Button className="w-full" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                    </>
                )}
            </Button>
             <Input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </TabsContent>
          <TabsContent value="url" className="pt-4 space-y-2">
             <div className="flex gap-2">
                <Input 
                    placeholder="https://example.com/image.png" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={uploading}
                />
                <Button onClick={handleUrlSubmit} disabled={uploading}>Import</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
