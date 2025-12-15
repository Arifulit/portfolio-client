/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogImage from '../../../../components/BlogImage';

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
    
    // Handle different response formats
    let blogs = [];
    if (json.success && json.data) {
      blogs = json.data.blogs || json.data;
    } else if (json.data) {
      blogs = json.data.blogs || json.data;
    } else if (Array.isArray(json)) {
      blogs = json;
    } else {
      return [];
    }

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

    // Handle different response formats
    let blog = null;
    if (json.success && json.data) {
      blog = json.data.blog || json.data;
    } else if (json.data) {
      blog = json.data.blog || json.data;
    } else {
      return null;
    }

    if (!blog) return null;

    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      description: blog.description,
      image: blog.image,
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      author: blog.author || { name: 'Admin' },
      tags: Array.isArray(blog.tags) ? blog.tags : [],
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <article className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

        {/* Back Navigation */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors mb-12 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Articles
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          {/* Tags */}
          {blog.tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-600 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {blog.author?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <span className="font-medium text-slate-900">
                {blog.author?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time>
                {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
              </time>
            </div>
          </div>
        </header>

        {/* Description */}
        {blog.description && (
          <div className="mb-12">
            <p className="text-2xl font-light text-slate-600 leading-relaxed">
              {blog.description}
            </p>
          </div>
        )}

        {/* Featured Image */}
        {blog.image ? (
          <div className="mb-12 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-200">
              <BlogImage
                src={blog.image}
                alt={blog.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        ) : (
          <div className="mb-12 h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center border border-slate-300">
            <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Article Content */}
        <section className="prose prose-xl prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500 prose-blockquote:text-slate-600 prose-code:text-blue-600 prose-pre:bg-slate-100">
          <div
            dangerouslySetInnerHTML={{ 
              __html: blog.content.includes('<') ? blog.content : blog.content.replace(/\n/g, '<br />')
            }}
          />
        </section>

        {/* Article Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="text-sm text-slate-600">
              <p className="mb-1">
                Last updated on{' '}
                <span className="font-medium text-slate-900">
                  {format(new Date(blog.updatedAt), 'MMMM dd, yyyy')}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>5 min read</span>
              </div>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
