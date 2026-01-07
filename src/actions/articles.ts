"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/notifications/expo-service";

export async function createArticle(values: any) {
    try {
        const post = await prisma.post.create({
            data: {
                ...values,
                // Replace with actual author logic in real implementation
                authorId: "65997b6a1e5057b56a123bc4"
            },
            include: {
                category: true
            }
        });

        if (post.status === "PUBLISHED") {
            await sendPushNotification(
                "New Article Published!",
                `${post.title} in ${post.category.name}`,
                { slug: post.slug }
            );
        }

        revalidatePath("/news");
        return { success: true, post };
    } catch (error) {
        console.error("[CREATE_ARTICLE]", error);
        return { success: false, error: "Failed to create article" };
    }
}
