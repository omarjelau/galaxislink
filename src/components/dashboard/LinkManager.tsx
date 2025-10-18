
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  updateDocumentNonBlocking,
  useUser,
  useDoc
} from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowDown, ArrowUp, Plus, Trash2, Loader2, ChevronsUpDown, Lock, CalendarIcon, Globe, GripVertical, Crown } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { socialPlatforms, getSocialIcon } from '@/lib/social-icons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns";


import type { Link as LinkType, UserProfile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import NextLink from 'next/link';
import { Badge } from '../ui/badge';

const linkSchema = z.object({
  title_en: z.string().min(2, "Title must be at least 2 characters.").max(50, "Title must not be longer than 50 characters."),
  title_de: z.string().optional(),
  description_en: z.string().max(160, "Description must not be longer than 160 characters.").optional(),
  description_de: z.string().max(160, "Description must not be longer than 160 characters.").optional(),
  url: z.string().url("Please enter a valid URL."),
  icon: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  password: z.string().optional(),
  schedule_start: z.date().optional(),
  schedule_end: z.date().optional(),
  geoTargeting: z.array(z.object({
    country: z.string().min(2, "Country code required.").max(2, "Use 2-letter country code."),
    url: z.string().url("Please enter a valid URL."),
  })).optional(),
});


interface LinkManagerProps {
  userId: string;
  linkPageId: string;
}

type LinkFormValues = z.infer<typeof linkSchema>

const allSocialPlatforms = Object.values(socialPlatforms).flat();

export function LinkManager({ userId, linkPageId }: LinkManagerProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => doc(firestore, `users/${userId}`), [firestore, userId]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const [orderedLinks, setOrderedLinks] = useState<LinkType[]>([]);

  const linksQuery = useMemoFirebase(
    () => collection(firestore, `users/${userId}/linkPages/${linkPageId}/links`),
    [firestore, userId, linkPageId]
  );
  const { data: links, isLoading } = useCollection<LinkType>(linksQuery);
  
  const userPlan = userProfile?.plan || 'free';
  const maxLinks = {
    free: 2,
    basic: 5,
    premium: Infinity,
    enterprise: Infinity,
  }[userPlan as 'free' | 'basic' | 'premium' | 'enterprise'];

  const canAddMoreLinks = (links?.length || 0) < maxLinks;

  useEffect(() => {
    if (links) {
      const sorted = [...links].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
      setOrderedLinks(sorted);
    }
  }, [links]);


  const createLink = async (newLinkData: Omit<LinkType, 'id' | 'userId' | 'linkPageId' | 'clicks' | 'createdAt' | 'order'>) => {
    if (!canAddMoreLinks) {
        toast({ title: "Link limit reached", description: "Please upgrade your plan to add more links.", variant: "destructive"});
        return;
    }
    const newLink = {
      ...newLinkData,
      userId,
      linkPageId,
      clicks: 0,
      createdAt: new Date(),
      order: orderedLinks.length, // Append to the end
    };
    const linksCollectionRef = collection(firestore, `users/${userId}/linkPages/${linkPageId}/links`);
    await addDocumentNonBlocking(linksCollectionRef, newLink);
    toast({ title: "Link created!" });
  };

  const updateLink = async (linkId: string, updatedLink: Partial<LinkType>) => {
    const linkRef = doc(firestore, `users/${userId}/linkPages/${linkPageId}/links/${linkId}`);
    await updateDocumentNonBlocking(linkRef, updatedLink);
    toast({ title: "Link updated!" });
  };

  const deleteLink = async (linkId: string) => {
    const linkRef = doc(firestore, `users/${userId}/linkPages/${linkPageId}/links/${linkId}`);
    await deleteDocumentNonBlocking(linkRef);
    // Re-order remaining links
    const remainingLinks = orderedLinks.filter(l => l.id !== linkId);
    await reorderLinks(remainingLinks);
    toast({ title: "Link deleted", variant: 'destructive' });
  };

  const reorderLinks = async (newOrder: LinkType[]) => {
    const batch = writeBatch(firestore);
    newOrder.forEach((link, index) => {
      if (link.id) {
        const linkRef = doc(firestore, `users/${userId}/linkPages/${linkPageId}/links`, link.id);
        batch.update(linkRef, { order: index });
      }
    });
    try {
        await batch.commit();
    } catch (error) {
        console.error("Failed to reorder links:", error);
    }
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...orderedLinks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newLinks.length) return;

    // Swap elements
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];

    setOrderedLinks(newLinks); // Optimistic update
    reorderLinks(newLinks).then(() => {
        toast({ title: "Link order updated!" });
    });
  };


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
          <CardDescription>Add, edit, and arrange links for your page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
              <Skeleton className="h-6 w-6" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
              </div>
               <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links</CardTitle>
        <CardDescription>Add, edit, and arrange links for your page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {orderedLinks.map((link, index) => (
            <LinkItem
              key={link.id}
              index={index}
              link={link}
              onUpdate={updateLink}
              onDelete={deleteLink}
              onMove={moveLink}
              isFirst={index === 0}
              isLast={index === orderedLinks.length - 1}
              isPremium={userPlan === 'premium' || userPlan === 'enterprise'}
            />
          ))}
        </ul>
        <NewLinkItem onCreate={createLink} canAddMore={canAddMoreLinks} />
      </CardContent>
    </Card>
  );
}

interface LinkItemProps {
  link: LinkType;
  index: number;
  onUpdate: (linkId: string, updatedLink: Partial<LinkType>) => Promise<void>;
  onDelete: (linkId: string) => Promise<void>;
  onMove: (index: number, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  isPremium: boolean;
}

function LinkItem({ link, index, onUpdate, onDelete, onMove, isFirst, isLast, isPremium }: LinkItemProps) {
  const { language } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
      <li
        className="bg-card rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 border"
      >
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={link.id} className="border-b-0">
                 <div className="flex items-center w-full px-4">
                    <AccordionTrigger className="flex-1 py-3 pr-4 text-left">
                        <div className="flex items-center gap-3 flex-1">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                            <LinkItemAvatar link={link} />
                            <span>{typeof link.title === 'string' ? link.title : (link.title?.[language] || link.title?.en || 'No Title')}</span>
                        </div>
                    </AccordionTrigger>
                    <div className="flex flex-col gap-1 py-2 ml-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMove(index, 'up')} disabled={isFirst} >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMove(index, 'down')} disabled={isLast}>
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                 <AccordionContent className="px-6 pb-4">
                  <LinkForm
                      existingLink={link}
                      onSubmit={(data) => onUpdate(link.id, data)}
                      isPremium={isPremium}
                  />
                  <div className="flex justify-end mt-4">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Link
                          </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                          <DialogTitle>Delete Confirmation</DialogTitle>
                          <DialogDescription>
                              Are you sure you want to delete this link?
                              <br />
                              This action cannot be undone.
                          </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2">
                          <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                              Cancel
                          </Button>
                          <Button
                              type="submit"
                              variant="destructive"
                              onClick={() => {
                              onDelete(link.id);
                              setIsDialogOpen(false);
                              }}
                          >
                              Delete
                          </Button>
                          </div>
                      </DialogContent>
                      </Dialog>
                  </div>
                  </AccordionContent>
            </AccordionItem>
        </Accordion>
      </li>
  );
}

const LinkItemAvatar = ({ link }: { link: LinkType }) => {
    const Icon = getSocialIcon(link.icon);
    
    if (link.imageUrl) {
        return (
            <Avatar className="h-8 w-8">
              <AvatarImage src={link.imageUrl} alt={typeof link.title === 'string' ? link.title : link.title?.en || link.title?.de} />
              <AvatarFallback>{(typeof link.title === 'string' ? link.title : (link.title?.en || link.title?.de))?.charAt(0) || 'L'}</AvatarFallback>
            </Avatar>
        )
    }

    if (Icon && link.icon) {
         return <Icon className="h-8 w-8 text-muted-foreground" />
    }
    
    return (
        <Avatar className="h-8 w-8">
            <AvatarFallback>{(typeof link.title === 'string' ? link.title : (link.title?.en || link.title?.de))?.charAt(0) || 'L'}</AvatarFallback>
        </Avatar>
    );
}

interface NewLinkItemProps {
  onCreate: (newLink: Omit<LinkType, 'id' | 'userId' | 'linkPageId' | 'clicks' | 'createdAt' | 'order'>) => Promise<void>;
  canAddMore: boolean;
}

function NewLinkItem({ onCreate, canAddMore }: NewLinkItemProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (data: any) => {
    await onCreate(data);
    setIsCreating(false);
  }

  if (isCreating) {
    return (
      <Card className="mt-4">
        <CardHeader>
            <CardTitle>Create new link</CardTitle>
        </CardHeader>
        <CardContent>
            <LinkForm
                onSubmit={handleCreate}
                onCancel={() => setIsCreating(false)}
                isPremium={true} // Assume they can use premium features when creating
            />
        </CardContent>
      </Card>
    );
  }

  if (!canAddMore) {
      return (
          <Card className="mt-4 p-4 text-center">
              <CardContent className="p-2">
                 <h3 className="font-semibold">Link Limit Reached</h3>
                 <p className="text-sm text-muted-foreground">Please upgrade your plan to add more links.</p>
                 <Button asChild size="sm" className="mt-4">
                     <NextLink href="/pricing">
                         <Crown className="mr-2 h-4 w-4" />
                         Upgrade Plan
                     </NextLink>
                 </Button>
              </CardContent>
          </Card>
      )
  }

  return (
    <Button variant="outline" className="w-full justify-center mt-4" onClick={() => setIsCreating(true)}>
      <Plus className="h-4 w-4 mr-2" />
      Add New Link
    </Button>
  );
}

interface LinkFormProps {
  existingLink?: LinkType;
  onSubmit: (values: Partial<LinkType>) => Promise<void>;
  onCancel?: () => void;
  isPremium: boolean;
}

function LinkForm({ existingLink, onSubmit, onCancel, isPremium }: LinkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title_en: typeof existingLink?.title === 'string' ? existingLink.title : existingLink?.title?.en || "",
      title_de: typeof existingLink?.title === 'string' ? '' : existingLink?.title?.de || "",
      description_en: typeof existingLink?.description === 'string' ? existingLink.description : existingLink?.description?.en || "",
      description_de: typeof existingLink?.description === 'string' ? '' : existingLink?.description?.de || "",
      url: existingLink?.url || "",
      icon: existingLink?.icon || undefined,
      imageUrl: existingLink?.imageUrl || undefined,
      password: existingLink?.password || '',
      schedule_start: existingLink?.schedule?.start ? new Date(existingLink.schedule.start as string) : undefined,
      schedule_end: existingLink?.schedule?.end ? new Date(existingLink.schedule.end as string) : undefined,
      geoTargeting: existingLink?.geoTargeting || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "geoTargeting",
  });

  async function onSubmitForm(values: LinkFormValues) {
    setIsSubmitting(true);
    
    const newLinkData: Partial<LinkType> = {
      title: { en: values.title_en, de: values.title_de || values.title_en },
      description: { en: values.description_en, de: values.description_de },
      url: values.url,
      icon: values.icon,
      imageUrl: values.imageUrl,
    };
    
    // Only include premium fields if the user has the right plan
    if (isPremium) {
      newLinkData.password = values.password;
      newLinkData.schedule = (values.schedule_start || values.schedule_end) 
        ? { start: values.schedule_start, end: values.schedule_end } 
        : undefined;
      newLinkData.geoTargeting = values.geoTargeting;
    }
    
    Object.keys(newLinkData).forEach(keyStr => {
        const key = keyStr as keyof typeof newLinkData;
        const value = newLinkData[key];

        if (value === undefined || value === '' || value === null) {
            delete newLinkData[key];
        } else if (key === 'schedule' && value) {
            if(!value.start && !value.end) {
                 delete newLinkData[key];
            }
        } else if (key === 'geoTargeting' && Array.isArray(value) && value.length === 0) {
            delete newLinkData[key];
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
            if ('en' in value && 'de' in value) {
                if (!value.en && !value.de) {
                    delete newLinkData[key];
                }
            }
        }
    });

    await onSubmit(newLinkData);

    if (!existingLink) {
        form.reset();
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="title_en"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title (English)*</FormLabel>
                <FormControl>
                    <Input placeholder="My Portfolio" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="title_de"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title (German)</FormLabel>
                <FormControl>
                    <Input placeholder="Mein Portfolio" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
       
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL*</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description (English)</FormLabel>
                <FormControl>
                    <Textarea placeholder="A short description in English" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description_de"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description (German)</FormLabel>
                <FormControl>
                    <Textarea placeholder="Eine kurze Beschreibung auf Deutsch" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://your-image.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Icon</FormLabel>
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                             <div className="flex items-center gap-2">
                                {field.value ? (
                                    <>
                                        {React.createElement(getSocialIcon(field.value), { className: "h-5 w-5" })}
                                        <span>{field.value}</span>
                                    </>
                                ) : (
                                    "Select an Icon"
                                )}
                            </div>
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 border rounded-md p-2 bg-background">
                         <div className="space-y-4">
                            {Object.entries(socialPlatforms).map(([category, platforms]) => (
                                <div key={category}>
                                    <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">{category}</p>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1">
                                        {platforms.map(platform => {
                                            const Icon = getSocialIcon(platform.name);
                                            return (
                                                <Button
                                                    key={platform.name}
                                                    variant="ghost"
                                                    className={cn("flex flex-col h-auto p-2 aspect-square justify-center", field.value === platform.name && "bg-accent text-accent-foreground")}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const newValue = platform.name === field.value ? "" : platform.name;
                                                        form.setValue("icon", newValue, { shouldValidate: true });
                                                    }}
                                                >
                                                    <Icon className="h-6 w-6 mb-1" style={{ color: field.value !== platform.name ? platform.color : undefined }}/>
                                                    <span className="text-xs text-center truncate w-full">{platform.name}</span>
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <FormMessage />
            </FormItem>
          )}
        />
        
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button variant="link" className="p-0 h-auto">
                    Advanced Options { !isPremium && <Crown className="h-4 w-4 ml-2 text-primary" /> }
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 pt-4">
                { !isPremium ? (
                    <div className="relative p-6 text-center border rounded-lg">
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10"></div>
                         <div className="relative z-20">
                            <Crown className="mx-auto h-8 w-8 text-primary mb-2" />
                            <h3 className="font-bold">Unlock Advanced Features</h3>
                            <p className="text-sm text-muted-foreground mb-4">Password protection, link scheduling, and geo-targeting are available on the Premium plan.</p>
                            <Button asChild size="sm">
                                <NextLink href="/pricing">Upgrade to Premium</NextLink>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center gap-2"><Lock /> Password Protection</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Leave empty to disable" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><CalendarIcon /> Link Scheduling</Label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="schedule_start"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Start Date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0,0,0,0))
                                                    }
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="schedule_end"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>End Date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < (form.getValues("schedule_start") || new Date(new Date().setHours(0,0,0,0)))
                                                    }
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Globe /> Geo Targeting</Label>
                            <FormDescription>Redirect users from specific countries to different URLs. Use 2-letter country codes (e.g., DE, US).</FormDescription>
                            <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-end">
                                    <FormField
                                        control={form.control}
                                        name={`geoTargeting.${index}.country`}
                                        render={({ field }) => (
                                            <FormItem className="w-24">
                                            <FormControl>
                                                <Input placeholder="DE" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`geoTargeting.${index}.url`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="https://example.de/page" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append({ country: '', url: '' })}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Country
                            </Button>
                        </div>
                    </>
                )}
            </CollapsibleContent>
        </Collapsible>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
