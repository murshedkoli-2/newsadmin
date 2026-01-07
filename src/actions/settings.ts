"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    try {
        const settings = await prisma.setting.findMany();
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return {};
    }
}

export async function updateSettings(data: Record<string, string>) {
    try {
        const updates = Object.entries(data).map(([key, value]) =>
            prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            })
        );

        await Promise.all(updates);
        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}
