/* eslint-disable @next/next/no-img-element */
// app/(public)/blogs/[id]/page.tsx
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const blogs = Array.isArray(data) ? data : (data.data || []);

    return blogs.map((blog: any) => ({
      id: blog.id || blog._id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Fetch single blog by ID
async function getBlog(id: string): Promise<Blog | null> {
  try {
    console.log('Fetching blog with ID:', id);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`,
      {
        next: { revalidate: 60 } // ISR
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch blog:', res.status, res.statusText);
      return null;
    }

    const response = await res.json();
    console.log('Blog API Response:', response);

    // Map the API response to match the expected Blog type
    if (response.success && response.data) {
      const blogData = response.data;
      return {
        ...blogData,
        _id: blogData.id || blogData._id,
        featuredImage: blogData.image || blogData.featuredImage,
        content: (blogData.content || '').replace(/\n/g, '<br />'),
        tags: blogData.tags || [],
        author: blogData.author || { name: 'Admin' }
      };
    }

    console.error('Invalid blog response format:', response);
    return null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt || blog.content?.substring(0, 160) || '',
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160) || '',
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

// Main Blog Page
export default async function BlogPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Back Button */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 mb-10 transition"
        >
          <span className="text-lg">←</span>
          Back to Blogs
        </Link>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          {(blog.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(blog.tags ?? []).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <time dateTime={blog.createdAt}>
              {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
            </time>

            <span className="hidden sm:inline">•</span>

            <span className="font-medium text-gray-700">
              By {blog.author?.name || 'Admin'}
            </span>

            {blog.views && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>{blog.views} views</span>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="mb-12 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-auto object-cover hover:scale-105 transition duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 sm:px-10 py-10">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Footer */}
        <footer className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Last updated on{' '}
            <span className="font-medium text-gray-700">
              {format(new Date(blog.updatedAt), 'MMMM dd, yyyy')}
            </span>
          </p>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
          >
            View all posts
            <span>→</span>
          </Link>
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