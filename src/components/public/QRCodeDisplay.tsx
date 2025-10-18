
'use client';
import { QRCodeSVG } from 'qrcode.react';

// This component is necessary to avoid SSR issues with the qrcode.react library
export function QRCodeDisplay(props: React.ComponentProps<typeof QRCodeSVG>) {
  return <QRCodeSVG {...props} />;
}
