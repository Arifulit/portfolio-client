/* eslint-disable @next/next/no-img-element */
// app/(public)/blogs/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Blog } from '@/types';

// ISR configuration
export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params for pre-rendering
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/slugs`);
    
    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const slugs = data.data.slugs || [];

    return slugs.map((slug: string) => ({
      slug: slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Fetch single blog by slug
async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`,
      {
        next: { revalidate: 60 } // ISR
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data.blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt || blog.content.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content.substring(0, 160),
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

// Main Blog Page
export default async function BlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blogs"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blogs
        </Link>

        {/* Blog Header */}
        <header className="mb-8">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-gray-600">
            <time dateTime={blog.createdAt}>
              {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
            </time>
            {blog.author && (
              <>
                <span>•</span>
                <span>By {blog.author.name}</span>
              </>
            )}
            {blog.views && (
              <>
                <span>•</span>
                <span>{blog.views} views</span>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Last updated: {format(new Date(blog.updatedAt), 'MMMM dd, yyyy')}
            </p>
            
            <Link
              href="/blogs"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Posts →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

// Not Found Component
export function NotFoundBlog() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Blog Post Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The blog post you&rsquo;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blogs
        </Link>
      </div>
    </div>
  );
}