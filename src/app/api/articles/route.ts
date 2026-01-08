import { NextResponse } from "next/server";
import { createArticle, updateArticle } from "@/actions/articles";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, or categoryId" },
        { status: 400 }
      );
    }

    // Ensure slug is properly formatted
    let slug = body.slug;
    if (!slug) {
      slug = body.title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    } else {
      slug = slug.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    }
    
    // Ensure the slug is unique by appending a number if needed
    let uniqueSlug = slug;
    let counter = 1;
    while(await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    slug = uniqueSlug;

    // Process the featured image - if it's a data URL, save it to storage
    let processedFeaturedImage = body.featuredImage;
    if (body.featuredImage && body.featuredImage.startsWith('data:image')) {
      // In a real application, you would save the image to cloud storage (AWS S3, etc.)
      // For now, we'll just store the data URL as is, but in production you should upload to a proper image service
      processedFeaturedImage = body.featuredImage;
    }

    // Create the article with all the required data
    const result = await createArticle({
      ...body,
      slug,
      featuredImage: processedFeaturedImage,
      tags: body.tags ? body.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : []
    });

    if (result.success) {
      return NextResponse.json(result.post, { status: 201 });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[ARTICLES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Ensure slug is properly formatted
    let slug = body.slug;
    if (!slug) {
      slug = body.title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    } else {
      slug = slug.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    }
    
    // Ensure the slug is unique by appending a number if needed (skip check for same record)
    let uniqueSlug = slug;
    let counter = 1;
    let existingPost = await prisma.post.findUnique({ where: { slug: uniqueSlug } });
    while(existingPost && existingPost.id !== body.id) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
      existingPost = await prisma.post.findUnique({ where: { slug: uniqueSlug } });
    }
    slug = uniqueSlug;

    // Process the featured image - if it's a data URL, save it to storage
    let processedFeaturedImage = body.featuredImage;
    if (body.featuredImage && body.featuredImage.startsWith('data:image')) {
      // In a real application, you would save the image to cloud storage (AWS S3, etc.)
      // For now, we'll just store the data URL as is, but in production you should upload to a proper image service
      processedFeaturedImage = body.featuredImage;
    }

    const { id, ...payload } = body;
    const result = await updateArticle(id, {
      ...payload,
      slug,
      featuredImage: processedFeaturedImage,
      tags: body.tags ? body.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : []
    });

    if (result.success) {
      return NextResponse.json(result.post);
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[ARTICLES_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ARTICLES_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}