'use client';

import { useState, useRef, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import type { PreviewView, ProfilePageProps } from './ProfilePage';

interface InteractivePreviewProps {
  activeView: PreviewView;
}

export function InteractivePreview({ activeView }: InteractivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'VIBELINK_PREVIEW_UPDATE',
          activeTab: activeView
        },
        '*'
      );
    }
  }, [activeView]);

  return (
    <div className="relative w-[300px] h-[600px] mx-auto">
      <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
      <iframe
        ref={iframeRef}
        src="/preview-frame"
        className="relative w-full h-full border-[10px] border-gray-800 rounded-[40px] bg-white transition-opacity duration-500 opacity-0"
        title="Interactive Preview"
        onLoad={(e) => (e.currentTarget.style.opacity = '1')}
      />
    </div>
  );
}
