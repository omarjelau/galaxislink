
'use client';

import { LinkManager } from "@/components/dashboard/LinkManager";
import { useUser } from "@/firebase";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";


export default function LinksPage() {
  const { user, isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const pageId = searchParams.get('page') || 'main';

  if (isUserLoading) {
    return (
       <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <p>Please log in to manage your links.</p>;
  }
  
  return (
    <div className="space-y-6">
       <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Links</h1>
        <p className="text-muted-foreground">Add, edit, and organize the links for your central landing page.</p>
      </header>
      <LinkManager userId={user.uid} linkPageId={pageId} />
    </div>
  )
}
