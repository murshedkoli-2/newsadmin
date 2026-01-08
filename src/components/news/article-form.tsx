"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Image as ImageIcon, Tags, Calendar as CalendarIcon, Save, Send, MapPin, X, Pencil } from "lucide-react";
import { districts } from "@/lib/bd-locations";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastUI } from "@/components/ui/toast";

const formSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters.",
    }),
    slug: z.string().optional(),
    content: z.string().min(20, {
        message: "Content must be at least 20 characters.",
    }),
    excerpt: z.string().optional(),
    categoryId: z.string().min(1, "Please select a category."),
    status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
    featuredImage: z.string().optional(),
    tags: z.string().optional(),
    isFeatured: z.boolean(),
    isBreaking: z.boolean(),
    district: z.string().optional(),
    upazila: z.string().optional(),
});

interface ArticleData {
    id?: string;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
    tags?: string[];
    isFeatured?: boolean;
    isBreaking?: boolean;
    categoryId?: string;
    featuredImage?: string;
    district?: string;
    upazila?: string;
}

export function ArticleForm({ initialData, categories }: { initialData?: ArticleData, categories: { id: string, name: string }[] }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            content: initialData?.content || "",
            excerpt: initialData?.excerpt || "",
            status: initialData?.status || "DRAFT",
            tags: initialData?.tags?.join(", ") || "",
            // Handle tags if they come as array or string from initialData.
            // Assuming initialData matches the detailed post structure, tags is string[] in DB but string in form.
            // But let's be careful. The previous code just passed initialData.
            // Let's stick to safe defaults.
            isFeatured: initialData?.isFeatured || false,
            isBreaking: initialData?.isBreaking || false,
            categoryId: initialData?.categoryId || "",
            featuredImage: initialData?.featuredImage || "",
            district: initialData?.district || "",
            upazila: initialData?.upazila || "",
        },
    });

    const [selectedDistrict, setSelectedDistrict] = useState<string>(initialData?.district || "");
    const [upazilas, setUpazilas] = useState<string[]>([]);
    const { toast, notify } = useToast();
    
    // Auto-generate slug from title
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'title' && !value.slug && value.title) {
                const generatedSlug = value.title
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    .trim();
                form.setValue('slug', generatedSlug);
            }
        });
        
        return () => subscription.unsubscribe();
    }, [form]);

    useEffect(() => {
        if (selectedDistrict) {
            const districtData = districts.find(d => d.name === selectedDistrict);
            setUpazilas(districtData?.upazilas || []);
        } else {
            setUpazilas([]);
        }
    }, [selectedDistrict]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // If we have initialData, it means we're updating an article
            if (initialData) {
                const response = await fetch('/api/articles', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: initialData.id,
                        ...values,
                    }),
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Article updated successfully:', result);
                    notify({
                        title: "Article updated successfully!",
                        description: "Your changes have been saved.",
                    });
                    // Redirect to view page after successful update
                    setTimeout(() => {
                        window.location.href = `/news/${initialData.id}`;
                    }, 1000);
                } else {
                    console.error('Failed to update article');
                    notify({
                        title: "Update failed",
                        description: "Could not update the article. Please try again.",
                        variant: "destructive",
                    });
                }
            } else {
                // Creating a new article
                const response = await fetch('/api/articles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Article created successfully:', result);
                    notify({
                        title: "Article created successfully!",
                        description: "Your article has been published.",
                    });
                    // Optionally redirect to the article list page
                    setTimeout(() => {
                        window.location.href = '/news';
                    }, 1000);
                } else {
                    console.error('Failed to create article');
                    notify({
                        title: "Create failed",
                        description: "Could not create the article. Please try again.",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            notify({
                title: "Submit failed",
                description: "An unexpected error occurred while submitting the form.",
                variant: "destructive",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Article Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter article title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug (optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="article-url-slug"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Leave blank to auto-generate from title.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write your article content here..."
                                                    className="min-h-[400px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Excerpt & SEO</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Summary</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief summary for social media and search engines"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Location</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>District</FormLabel>
                                            <Select onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedDistrict(value);
                                            }} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select district" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {districts.map((district) => (
                                                        <SelectItem key={district.name} value={district.name}>
                                                            {district.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="upazila"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Upazila (Sub-district)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select upazila" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {upazilas.map((upazila) => (
                                                        <SelectItem key={upazila} value={upazila}>
                                                            {upazila}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publish Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="AI, Future, Google"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Comma-separated tags.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Visibility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="isFeatured"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Featured Article</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isBreaking"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Breaking News</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="featuredImage"
                                    render={({ field: { onChange, value, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div 
                                                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                                                    onClick={() => document.getElementById('featured-image-upload')?.click()}
                                                >
                                                    {value ? (
                                                        <div className="relative w-full max-w-[200px] h-40 overflow-hidden rounded-md">
                                                            <img 
                                                                src={value} 
                                                                alt="Featured" 
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.onerror = null;
                                                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='160' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23e5e7eb'/%3E%3Ccircle cx='12' cy='10' r='3' fill='%239ca3af'/%3E%3Cpath d='M4 20c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zm14 0c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z' fill='%239ca3af'/%3E%3C/svg%3E";
                                                                }}
                                                            />
                                                            <button 
                                                                type="button" 
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onChange('');
                                                                }}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                                            <p className="text-sm text-muted-foreground group-hover:text-foreground">Click to upload or drag and drop</p>
                                                            <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 10MB</p>
                                                        </>
                                                    )}
                                                    <input
                                                        id="featured-image-upload"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = () => {
                                                                    onChange(reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-3">
                            <Button type="submit" variant="outline" className="flex-1">
                                <Save className="mr-2 h-4 w-4" /> Save Draft
                            </Button>
                            <Button type="submit" className="flex-1">
                                {initialData ? (
                                    <><Pencil className="mr-2 h-4 w-4" /> Update</>
                                ) : (
                                    <><Send className="mr-2 h-4 w-4" /> Publish</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            {toast && <ToastUI toast={toast} />}
        </Form>
    );
}
