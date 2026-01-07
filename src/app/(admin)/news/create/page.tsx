import { ArticleForm } from "@/components/news/article-form";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";

export default async function CreateArticlePage() {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Admin</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/news">News</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create New</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
            </div>

            <ArticleForm categories={categories} />
        </div>
    );
}
