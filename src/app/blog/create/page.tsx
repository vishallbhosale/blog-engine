import Link from "next/link";

import BlogForm from "@/components/BlogForm";

export default function CreateBlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Home
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create a Blog Post
          </h1>

          <p className="mt-2 text-gray-600">
            Write and publish a new blog post.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <BlogForm />
        </div>
      </div>
    </main>
  );
}