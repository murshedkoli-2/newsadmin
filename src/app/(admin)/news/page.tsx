import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    Eye,
    Search
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export default async function ArticlesPage() {
    const articles = await prisma.post.findMany({
        include: {
            author: { select: { name: true } },
            category: { select: { name: true } },
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

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
                                <TableCell className="text-muted-foreground">{article.author.name || "Unknown"}</TableCell>
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-medium">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
