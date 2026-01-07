import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export default async function ScheduledPage() {
    const scheduledArticles = await prisma.post.findMany({
        where: {
            status: 'SCHEDULED'
        },
        include: {
            author: { select: { name: true } },
            category: { select: { name: true } },
        },
        orderBy: {
            scheduledAt: 'asc'
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Scheduled Articles</h1>
                <p className="text-muted-foreground">Manage articles that are set to be published later.</p>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Scheduled For</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheduledArticles.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell className="font-medium">{article.title}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{article.category.name}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{article.scheduledAt ? format(article.scheduledAt, "yyyy-MM-dd HH:mm") : "Not set"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{article.author.name || "Unknown"}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" /> Reschedule
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {scheduledArticles.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground italic">
                        No articles are currently scheduled for publication.
                    </div>
                )}
            </div>
        </div>
    );
}
