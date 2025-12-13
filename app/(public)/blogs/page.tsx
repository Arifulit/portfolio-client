// // app/(public)/blogs/page.tsx
// import React from 'react';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import { Blog } from '@/types';

// // This will be ISR - revalidate every 60 seconds
// export const revalidate = 60;

// async function getBlogs(): Promise<Blog[]> {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
//       next: { revalidate: 60 } // ISR: Revalidate every 60 seconds
//     });

//     if (!res.ok) {
//       throw new Error('Failed to fetch blogs');
//     }

//     const data = await res.json();
//     return data.data.blogs || [];
//   } catch (error) {
//     console.error('Error fetching blogs:', error);
//     return [];
//   }
// }

// // Blog Card Component
// function BlogCard({ blog }: { blog: Blog }) {
//   return (
//     <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
//       {blog.featuredImage && (
//         <div className="relative h-48 bg-gray-200">
//           <img
//             src={blog.featuredImage}
//             alt={blog.title}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       )}
      
//       <div className="p-6">
//         <div className="flex items-center gap-2 mb-3">
//           {blog.tags && blog.tags.slice(0, 2).map((tag, index) => (
//             <span
//               key={index}
//               className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
//             >
//               {tag}
//             </span>
//           ))}
//         </div>

//         <Link href={`/blogs/${blog.slug}`}>
//           <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors line-clamp-2">
//             {blog.title}
//           </h2>
//         </Link>

//         <p className="text-gray-600 mb-4 line-clamp-3">
//           {blog.excerpt || blog.content.substring(0, 150) + '...'}
//         </p>

//         <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//           <span className="text-sm text-gray-500">
//             {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
//           </span>
          
//           <Link
//             href={`/blogs/${blog.slug}`}
//             className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
//           >
//             Read More →
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }

// // Main Page Component
// export default async function BlogsPage() {
//   const blogs = await getBlogs();

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Blog Posts
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Thoughts, stories, and ideas on web development, technology, and more.
//           </p>
//         </div>

//         {/* Blogs Grid */}
//         {blogs.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {blogs.map((blog) => (
//               <BlogCard key={blog.id} blog={blog} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//               <svg
//                 className="w-8 h-8 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No blog posts yet
//             </h3>
//             <p className="text-gray-600">
//               Check back later for new content!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Loading State
// export function LoadingBlogsPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mx-auto mb-4" />
//           <div className="h-6 w-96 bg-gray-200 animate-pulse rounded mx-auto" />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="h-48 bg-gray-200 animate-pulse" />
//               <div className="p-6 space-y-3">
//                 <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
//                 <div className="h-4 bg-gray-200 animate-pulse rounded" />
//                 <div className="h-4 bg-gray-200 animate-pulse rounded" />
//                 <div className="flex justify-between pt-4">
//                   <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
//                   <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Blog {
  _id: string;
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
        const response = await fetch('http://localhost:5000/api/blogs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const responseData = await response.json();
        
        // Handle different response formats
        if (Array.isArray(responseData)) {
          setBlogs(responseData);
        } else if (responseData.data && Array.isArray(responseData.data)) {
          setBlogs(responseData.data);
        } else {
          throw new Error('Invalid response format from server');
        }
        
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
              <article key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
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
                      <Link 
                        href={`/blogs/${blog.slug || blog._id}`} 
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      )}
    </div>
  );
}