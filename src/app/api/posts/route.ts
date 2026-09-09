
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";
import { postSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // 1. Read JSON body
    const body = await request.json();

    // 2. Validate request body
    const validationResult = postSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, image, description } = validationResult.data;

    // 3. Generate the base slug
    const baseSlug = generateSlug(title);

    // 4. Find a unique slug
    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existingPost = await prisma.post.findUnique({
        where: {
          slug,
        },
      });

      // Slug is available
      if (!existingPost) {
        break;
      }

      // Slug already exists, try -2, -3, -4...
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 5. Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        image,
        description,
      },
    });

    // 6. Return successful response
    return NextResponse.json(
      {
        message: "Post created successfully",
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/posts error:", error);

    // Handle Prisma unique constraint error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message:
            "A post with this URL already exists. Please try again.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Something went wrong while creating the post.",
      },
      { status: 500 }
    );
  }
}

