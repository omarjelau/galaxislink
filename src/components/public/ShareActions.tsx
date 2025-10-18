
'use client';

import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QRCode } from 'react-qrcode-logo';
import { useLanguage } from '@/context/language-context';
import type { BusinessCard, UserProfile } from '@/lib/types';
import { Download } from 'lucide-react';

interface ShareActionsProps {
  userProfile: UserProfile;
  businessCard: BusinessCard | null;
  children: React.ReactNode;
  asChild?: boolean;
}

export function ShareActions({
  userProfile,
  businessCard,
  children,
  asChild = false,
}: ShareActionsProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${userProfile.username}`
      : '';
      
  const downloadQRCode = () => {
    const canvas = document.getElementById('public-profile-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${userProfile.username}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('shareProfile', { name: userProfile.displayName })}
          </DialogTitle>
          <DialogDescription>
            {t('shareDescription', { name: userProfile.displayName })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-6 py-6">
          <div className="bg-white p-4 rounded-lg border">
            <QRCode
              id="public-profile-qr-code"
              value={profileUrl}
              size={200}
              logoImage={userProfile.avatarUrl}
              logoWidth={60}
              logoHeight={60}
              qrStyle="squares"
              eyeRadius={8}
            />
          </div>
          <div className="w-full grid grid-cols-1 gap-2">
            <a
              href={`/api/vcard?userId=${userProfile.id}&cardId=main`}
              className={buttonVariants({ variant: 'default' })}
            >
              {t('saveContact')}
            </a>
            {businessCard?.allowQrCodeDownload && (
              <Button variant="outline" onClick={downloadQRCode}>
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

  