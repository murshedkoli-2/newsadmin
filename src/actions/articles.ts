"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/notifications/expo-service";

interface ArticleData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  isFeatured: boolean;
  isBreaking: boolean;
  categoryId: string;
  tags: string[];
  district?: string;
  upazila?: string;
}

export async function createArticle(values: ArticleData) {
    try {
        const post = await prisma.post.create({
            data: {
                ...values,
                // Replace with actual author logic in real implementation
                authorId: "65997b6a1e5057b56a123bc4",
                tags: Array.isArray(values.tags) ? values.tags : []
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

export async function updateArticle(id: string, values: ArticleData) {
    try {
        const post = await prisma.post.update({
            where: { id },
            data: values,
            include: {
                category: true
            }
        });

        revalidatePath("/news");
        return { success: true, post };
    } catch (error) {
        console.error("[UPDATE_ARTICLE]", error);
        return { success: false, error: "Failed to update article" };
    }
}
