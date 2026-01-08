import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // First find the current post to get its categoryId and ID
        const currentPost = await prisma.post.findUnique({
            where: { slug },
            select: { id: true, categoryId: true }
        });

        if (!currentPost) {
            return new NextResponse("Post not found", { status: 404 });
        }

        // Fetch related posts from same category, excluding current one
        const related = await prisma.post.findMany({
            where: {
                status: "PUBLISHED",
                categoryId: currentPost.categoryId,
                NOT: {
                    id: currentPost.id
                }
            },
            take: 4,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                author: {
                    select: { name: true }
                },
                category: {
                    select: { name: true, slug: true }
                }
            }
        });

        return NextResponse.json(related);
    } catch (error) {
        console.error("[RELATED_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
