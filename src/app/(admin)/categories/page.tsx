import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function CategoriesPage() {
    const categoriesList = await prisma.category.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage your news categories and topics.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Category
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoriesList.map((cat) => (
                    <Card key={cat.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold">{cat.name}</CardTitle>
                            <div className="h-3 w-3 rounded-full bg-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Newspaper className="h-4 w-4" />
                                    <span className="text-sm">{cat._count.posts} Articles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {categoriesList.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No categories found. Create one to get started.</p>
                </div>
            )}
        </div>
    );
}
