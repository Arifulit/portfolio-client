// app/dashboard/blogs/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { blogAPI, handleApiError } from '@/lib/api';
import { Blog } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await blogAPI.getAll();
      setBlogs(response.data.blogs);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await blogAPI.delete(id);
      toast.success('Blog deleted successfully!');
      fetchBlogs(); // Refresh list
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Blogs</h1>
        <Link href="/dashboard/blogs/create">
          <Button>+ Create New Blog</Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No blogs yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first blog post to get started
          </p>
          <Link href="/dashboard/blogs/create">
            <Button>Create Blog</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {blog.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        blog.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {blog.excerpt || blog.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Created: {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </span>
                    {blog.views && <span>Views: {blog.views}</span>}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link href={`/dashboard/blogs/edit/${blog.id}`}>
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(blog.id, blog.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// app/dashboard/blogs/create/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogAPI, handleApiError } from '@/lib/api';
import { BlogFormData } from '@/types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface FormErrors {
  title?: string;
  content?: string;
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    tags: [],
    published: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      await blogAPI.create(formData);
      toast.success('Blog created successfully!');
      router.push('/dashboard/blogs');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Blog</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter blog title"
            required
          />

          <Input
            label="Excerpt (Optional)"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short description"
          />

          <Textarea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            error={errors.content}
            placeholder="Write your blog content here..."
            rows={12}
            required
          />

          <Input
            label="Featured Image URL (Optional)"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag"
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Published Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, published: e.target.checked }))
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="published" className="ml-2 text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="submit" isLoading={isSubmitting}>
              Create Blog
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}