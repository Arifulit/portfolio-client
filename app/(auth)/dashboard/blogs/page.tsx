'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  description: string;
  image: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; blogId: string; blogTitle: string }>({
    isOpen: false,
    blogId: '',
    blogTitle: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/dashboard/all`, {
          credentials: 'include' // This will send the HTTP-only token cookie
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch blogs');
        }

        const responseData = await response.json();
        
        // Handle the API response format with data and pagination
        if (!responseData.success || !Array.isArray(responseData.data)) {
          console.error('Invalid response format:', responseData);
          throw new Error('Invalid response format from server');
        }
        
        // Define the API response blog type
        interface ApiBlog {
          id: string;
          title: string;
          description: string;
          image: string;
          published: boolean;
          createdAt: string;
          updatedAt: string;
          content?: string;
        }

        // Map the response data to match our Blog interface
        const formattedBlogs = responseData.data.map((blog: ApiBlog) => ({
          _id: blog.id,  // Map 'id' to '_id' to match our interface
          title: blog.title,
          description: blog.description,
          image: blog.image,
          published: blog.published,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          content: blog.content  // Add content field if needed
        }));
        
        setBlogs(formattedBlogs);
        setError(null);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load blogs');
        toast.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      blogId: id,
      blogTitle: title
    });
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${deleteModal.blogId}`, {
        method: 'DELETE',
        credentials: 'include', // This will send the HTTP-only token cookie
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blog post');
      }

      setBlogs(blogs.filter(blog => blog._id !== deleteModal.blogId));
      toast.success('Blog post deleted successfully');
      
      setDeleteModal({ isOpen: false, blogId: '', blogTitle: '' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog post');
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, blogId: '', blogTitle: '' });
  };

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
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <Link
          href="/dashboard/blogs/create"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      {!Array.isArray(blogs) || blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No blog posts found.</p>
          <Link
            href="/dashboard/blogs/create"
            className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <li key={blog._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-16 w-24 object-cover rounded mr-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1pbWFnZS1vZmYiPjxwYXRoIGQ9Ik00IDJIMjBhMiAyIDAgMCAxIDIgMnYxNmMwIC41MjEtLjIwMyAxLjAxNi0uNTY2IDEuMzgxIi8+PHBhdGggZD0ibTEwIDEwLjVnMS41IDEuNSAwIDEgMCAtMS4xNC0yLjQ3NCIvPjxwYXRoIGQ9Im0yIDJsMjAgMjAiLz48cGF0aCBkPSJNMiAyMmgxNmEyIDIgMCAwIDAgMi0yVjcuNDE0YTIgMiAwIDAgMC0uNTg2LTEuNDE0bC0uNTg2LS41ODRhMiAyIDAgMCAwLTEuNDE0LS41ODZIOWEyIDIgMCAwIDAtMS4zOTMuNTc4Ii8+PC9zdmc+';
                          }}
                        />
                      ) : (
                        <div className="h-16 w-24 bg-gray-200 rounded mr-4 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {blog.description}
                        </p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            blog.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                          <span className="mx-2">•</span>
                          <span>Created: {formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Link
                      href={`/dashboard/blogs/edit/${blog._id}`}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      className="px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Blog Post
            </h3>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete <strong>"{deleteModal.blogTitle}"</strong>? 
              This action cannot be undone and all blog data will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
