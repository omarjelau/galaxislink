
'use client';

import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  createdAt: any;
};

export default function BlogPage() {
  const firestore = useFirestore();
  const blogPostsQuery = useMemoFirebase(
    () => query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc')),
    [firestore]
  );
  const { data: blogPosts, isLoading } = useCollection<BlogPost>(blogPostsQuery);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">The GalaxisLink Blog</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Insights, tips, and stories on digital identity and modern networking.
            </p>
          </header>
          {isLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts?.map((post) => (
                   <Card key={post.id} className="bg-card/50 border-border/50 hover:border-primary/50 transition-all group">
                      <CardHeader>
                          <p className="text-sm text-muted-foreground">
                            {post.createdAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-muted-foreground mb-4">{post.description}</p>
                          <Link href={`/blog/${post.slug}`} className="font-semibold text-primary flex items-center gap-2">
                              Read More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                      </CardContent>
                   </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
