import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // In a real app, this would use the Analytics table or view counts.
        // For now, we'll fetch the latest 5 featured posts as "Trending".
        // If no featured posts, just generic latest posts.
        const posts = await prisma.post.findMany({
            where: {
                status: "PUBLISHED",
                isFeatured: true
            },
            take: 5,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                author: {
                    select: { name: true, image: true }
                },
                category: {
                    select: { name: true, slug: true }
                }
            }
        });

        if (posts.length === 0) {
            const fallbackPosts = await prisma.post.findMany({
                where: { status: "PUBLISHED" },
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    author: { select: { name: true, image: true } },
                    category: { select: { name: true, slug: true } }
                }
            });
            return NextResponse.json(fallbackPosts);
        }

        return NextResponse.json(posts);
    } catch (error) {
        console.error("[TRENDING_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
