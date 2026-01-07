import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return new NextResponse("Token is required", { status: 400 });
        }

        const pushToken = await prisma.pushToken.upsert({
            where: { token },
            update: {},
            create: { token }
        });

        return NextResponse.json(pushToken);
    } catch (error) {
        console.error("[PUSH_TOKENS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return new NextResponse("Token is required", { status: 400 });
        }

        await prisma.pushToken.deleteMany({
            where: { token }
        });

        return new NextResponse("Token deleted", { status: 200 });
    } catch (error) {
        console.error("[PUSH_TOKENS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
