
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Dynamic Blog Engine
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Create and publish dynamic blog posts using Next.js,
          Prisma, and PostgreSQL.
        </p>

        {/* Create Blog Button */}
        <div className="mt-8">
          <Link
            href="/blog/create"
            className="inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Create Blog Post
          </Link>
        </div>
      </div>
    </main>
  );
}

