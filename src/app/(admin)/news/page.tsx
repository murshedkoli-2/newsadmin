import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Search
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ArticleActions } from "@/components/news/article-actions";

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    featuredImage: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
    isFeatured: boolean;
    isBreaking: boolean;
    publishedAt: Date | null;
    scheduledAt: Date | null;
    author: {
        name: string | null;
    } | null;
    category: {
        name: string;
    };
    tags: string[];
    district: string | null;
    upazila: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default async function ArticlesPage() {
    let articles: Article[] = [];
    try {
        // Get all posts
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        if (posts.length > 0) {
            // Extract unique author and category IDs to fetch in batches
            const authorIds = [...new Set(posts.map(p => p.authorId))];
            const categoryIds = [...new Set(posts.map(p => p.categoryId))];
            
            // Fetch all related data in batch
            const [authors, categories] = await Promise.all([
                prisma.user.findMany({
                    where: { id: { in: authorIds } },
                    select: { id: true, name: true }
                }),
                prisma.category.findMany({
                    where: { id: { in: categoryIds } },
                    select: { id: true, name: true }
                })
            ]);
            
            // Create lookup maps for efficient access
            const authorMap = new Map(authors.map(a => [a.id, a]));
            const categoryMap = new Map(categories.map(c => [c.id, c]));
            
            // Combine posts with their relations
            articles = posts.map(post => ({
                ...post,
                author: authorMap.get(post.authorId) ? { name: authorMap.get(post.authorId)?.name || 'Unknown Author' } : { name: 'Unknown Author' },
                category: categoryMap.get(post.categoryId) ? { name: categoryMap.get(post.categoryId)?.name || 'Uncategorized' } : { name: 'Uncategorized' }
            }));
        }
    } catch (error) {
        console.error('Database query error:', error);
        articles = [] as Article[];
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Articles</h2>
                    <p className="text-muted-foreground">Manage and create news articles for your portal</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/news/create">
                        <Plus className="mr-2 h-4 w-4" />
                        New Article
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search articles..."
                        className="pl-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {/* Add more filters here later */}
                </div>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-muted-foreground">Title</TableHead>
                            <TableHead className="text-muted-foreground">Author</TableHead>
                            <TableHead className="text-muted-foreground">Category</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-muted-foreground">Date</TableHead>
                            <TableHead className="text-right text-muted-foreground">Views</TableHead>
                            <TableHead className="w-[80px] text-muted-foreground"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell className="font-medium">{article.title}</TableCell>
                                <TableCell className="text-muted-foreground">{article.author?.name || "Unknown"}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground font-normal border-border">
                                        {article.category.name}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            article.status === "PUBLISHED"
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                                                : article.status === "DRAFT"
                                                    ? "bg-muted text-muted-foreground hover:bg-muted/80"
                                                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
                                        }
                                    >
                                        {article.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                                    {format(article.createdAt, "yyyy-MM-dd")}
                                </TableCell>
                                <TableCell className="text-right font-semibold">0</TableCell>
                                <TableCell>
                                    <ArticleActions articleId={article.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {articles.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground italic">No articles found. Start creating your first story!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
