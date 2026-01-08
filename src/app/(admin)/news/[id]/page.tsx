import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function ArticleViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) notFound();

  const [author, category] = await Promise.all([
    prisma.user.findUnique({
      where: { id: post.authorId },
      select: { name: true },
    }),
    prisma.category.findUnique({
      where: { id: post.categoryId },
      select: { name: true },
    }),
  ]);

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
              <BreadcrumbPage>View</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            <div className="text-sm text-muted-foreground">
              <span>{author?.name || "Unknown"}</span>
              <span className="mx-2">•</span>
              <span>{format(post.createdAt, "yyyy-MM-dd")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-secondary text-secondary-foreground font-normal border-border">
              {category?.name || "Uncategorized"}
            </Badge>
            <Badge variant="secondary">{post.status}</Badge>
            <Button asChild>
              <Link href={`/news/${post.id}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>
      </div>

      {post.featuredImage && (
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full max-h-[420px] object-cover rounded-md border"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap leading-7">{post.content}</div>
        </CardContent>
      </Card>
    </div>
  );
}
