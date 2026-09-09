
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Post = {
  id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function BlogPage() {
  const params = useParams<{ slug: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/posts/${params.slug}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Unable to load this blog post."
          );
          return;
        }

        setPost(data.post);
      } catch (error) {
        console.error("Fetch post error:", error);

        setError(
          "Unable to connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Loading blog post...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // 404 / Error state
  if (error || !post) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
            <h1 className="text-3xl font-bold text-gray-900">
              404
            </h1>

            <h2 className="mt-2 text-xl font-semibold text-gray-800">
              Blog post not found
            </h2>

            <p className="mt-3 text-gray-600">
              The blog post you are looking for does not exist
              or may have been removed.
            </p>

            <Link
              href="/blog/create"
              className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Create a Blog Post
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Format dates
  const createdDate = new Date(
    post.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const updatedDate = new Date(
    post.updatedAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Back Link */}
        <Link
          href="/blog/create"
          className="mb-6 inline-block text-sm font-medium text-gray-600 transition hover:text-black"
        >
          ← Create another post
        </Link>

        {/* Blog Card */}
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Blog Image */}
          <div className="w-full">
            <img
              src={post.image}
              alt={post.title}
              className="h-auto max-h-[500px] w-full object-cover"
            />
          </div>

          {/* Blog Content */}
          <div className="p-6 sm:p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              {post.title}
            </h1>

            {/* Dates */}
            <div className="mt-4 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-4">
              <p>
                Created:{" "}
                <span className="font-medium text-gray-700">
                  {createdDate}
                </span>
              </p>

              <p className="hidden sm:block">•</p>

              <p>
                Updated:{" "}
                <span className="font-medium text-gray-700">
                  {updatedDate}
                </span>
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Description */}
            <div className="whitespace-pre-wrap text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
              {post.description}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

