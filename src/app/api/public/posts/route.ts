import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const limit = parseInt(searchParams.get("limit") || "10");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        const search = searchParams.get("search");
        const featured = searchParams.get("featured") === "true";
        const breaking = searchParams.get("breaking") === "true";
        const district = searchParams.get("district");
        const upazila = searchParams.get("upazila");

        const where: any = {
            status: "PUBLISHED",
            ...(categoryId && { categoryId }),
            ...(featured && { isFeatured: true }),
            ...(breaking && { isBreaking: true }),
            ...(district && { district }),
            ...(upazila && { upazila }),
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: (where as any),
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                skip: skip,
                include: {
                    author: {
                        select: { name: true }
                    },
                    category: {
                        select: { name: true }
                    }
                }
            }),
            prisma.post.count({ where: (where as any) })
        ]);

        return NextResponse.json({
            posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("[POSTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
