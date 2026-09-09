import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Get slug from dynamic route
    const { slug } = await context.params;

    // Find post by slug
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
    });

    // Post doesn't exist
    if (!post) {
      return NextResponse.json(
        {
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // Return post
    return NextResponse.json(
      {
        post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/posts/[slug] error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while fetching the post",
      },
      { status: 500 }
    );
  }
}