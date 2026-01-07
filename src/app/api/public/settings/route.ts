import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.setting.findMany({
            select: {
                key: true,
                value: true
            }
        });

        const formattedSettings = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(formattedSettings);
    } catch (error) {
        console.error("[SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
