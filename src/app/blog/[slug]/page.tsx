
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: any;
};

// Initialize Firebase on the client-side
const { firestore } = initializeFirebase();

async function getPostData(slug: string): Promise<BlogPost | null> {
  const postsRef = collection(firestore, 'blogPosts');
  const postQuery = query(postsRef, where('slug', '==', slug));
  const postSnapshot = await getDocs(postQuery);

  if (postSnapshot.empty) {
    console.log(`Post with slug "${slug}" not found.`);
    return null;
  }

  const postDoc = postSnapshot.docs[0];
  return { id: postDoc.id, ...postDoc.data() } as BlogPost;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      getPostData(slug)
        .then(result => {
          if (result) {
            setPost(result);
          } else {
            setError(true);
          }
        })
        .catch((e) => {
            console.error("Failed to fetch post:", e);
            setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <article>
                <header className="mb-12 text-center">
                    <p className="text-muted-foreground mb-2">
                        Published on {post.createdAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">{post.title}</h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
                        {post.description}
                    </p>
                </header>

                {post.imageUrl && (
                    <Card className="mb-12 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="relative aspect-video w-full">
                                <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
