import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Super Admin
    const email = "admin@admin.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
        },
        create: {
            email,
            name: "Super Admin",
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
        },
    });

    console.log("Super user updated:", user.email);

    // Categories
    const categoriesList = [
        { name: "Technology", slug: "technology" },
        { name: "Science", slug: "science" },
        { name: "Environment", slug: "environment" },
        { name: "Finance", slug: "finance" },
        { name: "World", slug: "world" },
    ];

    for (const cat of categoriesList) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log("Categories seeded");

    // Sample Post
    const techCategory = await prisma.category.findUnique({ where: { slug: "technology" } });

    if (techCategory) {
        await prisma.post.upsert({
            where: { slug: "google-ai-advancements-2026" },
            update: {},
            create: {
                title: "Google AI Advancements in 2026",
                slug: "google-ai-advancements-2026",
                content: "Detailed content about Google's latest AI breakthroughs in the year 2026.",
                excerpt: "A look into the future of AI with Google.",
                status: "PUBLISHED",
                publishedAt: new Date(),
                authorId: user.id,
                categoryId: techCategory.id,
            },
        });
        console.log("Sample post seeded");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
