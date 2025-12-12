// app/dashboard/blogs/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { blogAPI, handleApiError } from '@/lib/api';
import { Blog, BlogFormData } from '@/types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface FormErrors {
  title?: string;
  content?: string;
}

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBlog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const response = await blogAPI.getById(params.id);
      const blogData = response.data.blog;
      setBlog(blogData);
      
      // Populate form
      setFormData({
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt || '',
        featuredImage: blogData.featuredImage || '',
        tags: blogData.tags || [],
        published: blogData.published,
      });
    } catch (error) {
      toast.error(handleApiError(error));
      router.push('/dashboard/blogs');
    } finally {
      setIsLoading(false);
    }
  };

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
      await blogAPI.update(params.id, formData);
      toast.success('Blog updated successfully!');
      router.push('/dashboard/blogs');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <Card>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <Card className="max-w-4xl">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Blog not found
          </h3>
          <Button onClick={() => router.push('/dashboard/blogs')}>
            Back to Blogs
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Blog</h1>

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                onKeyPress={(e: { key: string; preventDefault: () => void; }) => {
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
              Publish this blog
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="submit" isLoading={isSubmitting}>
              Update Blog
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