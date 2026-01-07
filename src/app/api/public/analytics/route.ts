import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { postId } = await req.json();

        if (!postId) {
            return new NextResponse("Post ID is required", { status: 400 });
        }

        await prisma.analytics.create({
            data: {
                postId,
                pageViews: 1,
                date: new Date()
            }
        });

        return new NextResponse("View recorded", { status: 200 });
    } catch (error) {
        console.error("[ANALYTICS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
