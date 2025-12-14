/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

/* ================= TYPES ================= */

interface Blog {
  id: string;
  title: string;
  content: string;
  description?: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
  };
  tags?: string[];
}

/* ================= ISR ================= */

export const revalidate = 60;

/* ================= STATIC PARAMS ================= */

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const blogs = json?.data || [];

    return blogs.map((blog: any) => ({
      id: blog.id,
    }));
  } catch {
    return [];
  }
}

/* ================= FETCH BLOG ================= */

async function getBlog(id: string): Promise<Blog | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return null;

    const json = await res.json();

    if (!json.success || !json.data) return null;

    const blog = json.data;

    return {
      id: blog.id,
      title: blog.title,
      content: blog.content.replace(/\n/g, '<br />'),
      description: blog.description,
      image: blog.image,
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      author: blog.author || { name: 'Admin' },
      tags: blog.tags || [],
    };
  } catch {
    return null;
  }
}

/* ================= METADATA ================= */

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const blog = await getBlog(params.id);

  if (!blog) {
    notFound();
  }

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: blog.image ? [blog.image] : [],
    },
  };
}

/* ================= PAGE ================= */

export default async function BlogDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await getBlog(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-5xl mx-auto px-4 py-14">

        {/* Back */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-10"
        >
          ← Back to Blogs
        </Link>

        {/* Header */}
        <header className="mb-12">
          {blog.tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <time>
              {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
            </time>
            <span>•</span>
            <span className="font-medium text-gray-700">
              By {blog.author?.name}
            </span>
          </div>
        </header>

        {/* Image */}
        {blog.image && (
          <div className="mb-12 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full object-cover hover:scale-105 transition duration-500"
            />
          </div>
        )}

        {/* Content */}
        <section className="bg-white rounded-2xl shadow-sm border px-6 md:px-10 py-10">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t pt-6 flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-500">
          <p>
            Last updated on{' '}
            <span className="font-medium text-gray-700">
              {format(new Date(blog.updatedAt), 'MMMM dd, yyyy')}
            </span>
          </p>

          <Link
            href="/blogs"
            className="text-blue-600 font-medium hover:underline"
          >
            View all blogs →
          </Link>
        </footer>
      </article>
    </main>
  );
}
