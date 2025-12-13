

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  slug?: string;
  content?: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const responseData = await response.json();
        console.log('API Response:', responseData); // Debug log
        
        // Handle different response formats
        let blogsData = [];
        if (Array.isArray(responseData)) {
          blogsData = responseData;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          blogsData = responseData.data;
        } else if (responseData.success && Array.isArray(responseData.data)) {
          blogsData = responseData.data;
        } else {
          throw new Error('Invalid response format from server');
        }

        console.log('Processed blogs:', blogsData); // Debug log
        setBlogs(blogsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Posts</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Latest articles and tutorials on web development and more
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No blog posts available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs
            .filter(blog => blog.published) // Only show published blogs
            .map((blog) => (
              <Link 
                key={blog.id} 
                href={`/blogs/${blog.id}`}
                className="block h-full"
                onClick={(e) => {
                  console.log('=== Blog Navigation Debug ===');
                  console.log('Blog ID:', blog.id);
                  console.log('Blog Title:', blog.title);
                  console.log('Published:', blog.published);
                  console.log('Slug:', blog.slug);
                  console.log('Full Blog Object:', blog);
                }}
              >
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col hover:ring-2 hover:ring-primary-100">
                  {blog.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(blog.createdAt)}</span>
                        <span className="text-primary-600 font-medium">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}