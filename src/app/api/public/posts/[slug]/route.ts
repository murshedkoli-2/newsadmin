import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const post = await prisma.post.findUnique({
            where: {
                slug,
                status: "PUBLISHED"
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                category: {
                    select: {
                        name: true,
                        slug: true
                    }
                }
            }
        });

        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("[POST_GET_SINGLE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
