
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { nanoid } from 'nanoid';

// This is a new type definition for the blog post
type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: any;
  updatedAt?: any;
};

function PostForm({ post, onSave, onCancel }: { post: Partial<BlogPost>, onSave: (post: Partial<BlogPost>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(post);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = useCallback((field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      handleInputChange('slug', value);
  }

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  }

  return (
    <>
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="grid gap-6 px-6 py-4">
          <ImageUploader
            label="Featured Image"
            value={formData.imageUrl || ''}
            onUploadComplete={(url) => handleInputChange('imageUrl', url)}
          />
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title || ''} onChange={e => handleInputChange('title', e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input id="slug" value={formData.slug || ''} onChange={handleSlugChange} placeholder="e.g., my-awesome-post" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" value={formData.description || ''} onChange={e => handleInputChange('description', e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content (Markdown supported)</Label>
            <Textarea id="content" value={formData.content || ''} onChange={e => handleInputChange('content', e.target.value)} className="min-h-[250px]" />
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="border-t p-4 flex-row justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Post
        </Button>
      </DialogFooter>
    </>
  );
}


export default function AdminBlogPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const blogPostsQuery = useMemoFirebase(() => collection(firestore, 'blogPosts'), [firestore]);
  const { data: posts, isLoading } = useCollection<BlogPost>(blogPostsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Partial<BlogPost> | null>(null);

  const handleEditClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedPost({
        id: nanoid(12),
        title: 'New Blog Post',
        slug: 'new-blog-post',
        description: '',
        content: '# Your content starts here',
        imageUrl: '',
    });
    setIsDialogOpen(true);
  }

  const handleSaveChanges = async (postData: Partial<BlogPost>) => {
    if (!postData.id || !postData.slug || !postData.title) {
        toast({ title: 'Error', description: 'ID, Slug and Title are required.', variant: 'destructive'});
        return;
    };
    
    const postRef = doc(firestore, 'blogPosts', postData.id);
    const isNewPost = !posts?.some(p => p.id === postData.id);

    const dataToSave = {
        ...postData,
        updatedAt: serverTimestamp(),
        ...(isNewPost && { createdAt: serverTimestamp() })
    }

    try {
      await setDoc(postRef, dataToSave, { merge: true });
      toast({ title: 'Success', description: 'Blog post saved successfully.' });
      setIsDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Failed to save post:', error);
      toast({ title: 'Error', description: 'Failed to save post.', variant: 'destructive' });
    }
  };

  const handleDelete = async (postId: string) => {
      const postRef = doc(firestore, 'blogPosts', postId);
      try {
          await deleteDoc(postRef);
          toast({ title: 'Success', description: 'Post deleted successfully.', variant: 'destructive'});
      } catch (error) {
           console.error('Failed to delete post:', error);
           toast({ title: 'Error', description: 'Failed to delete post.', variant: 'destructive' });
      }
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Blog Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage your blog posts.</p>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
        </Button>
      </header>
       <Card>
        <CardHeader>
            <CardTitle>All Blog Posts</CardTitle>
            <CardDescription>
                Here you can see and manage all posts on your blog.
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
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts?.map(post => (
                    <TableRow key={post.id}>
                        <TableCell className="font-medium max-w-md truncate">{post.title}</TableCell>
                        <TableCell>{post.createdAt?.toDate().toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(post)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                         <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="p-0 sm:max-w-3xl h-screen sm:h-auto sm:max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>{selectedPost?.createdAt ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          </DialogHeader>
           {selectedPost && <PostForm post={selectedPost} onSave={handleSaveChanges} onCancel={() => setIsDialogOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
