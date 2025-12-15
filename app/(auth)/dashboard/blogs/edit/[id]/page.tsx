'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { blogAPI, handleApiError } from '@/lib/api';
import { Blog, BlogFormData } from '@/types';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';

interface FormErrors {
  title?: string;
  content?: string;
}

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    description: '',
    image: '',
    tags: [],
    published: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  /* ================= Fetch Blog ================= */
  const fetchBlog = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await blogAPI.getById(params.id);

      if (!res?.data) throw new Error('Blog not found');

      const blogData = res.data.blog || res.data;
      setBlog(blogData);

      setFormData({
        title: blogData.title || '',
        content: blogData.content || '',
        description: blogData.description || '',
        image: blogData.image || '',
        tags: Array.isArray(blogData.tags) ? blogData.tags : [],
        published: blogData.published || false,
      });
      setImagePreview(blogData.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop');
    } catch (err) {
      toast.error(handleApiError(err));
      router.push('/dashboard/blogs');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  /* ================= Validation ================= */
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length < 5) newErrors.title = 'Minimum 5 characters';

    if (!formData.content.trim()) newErrors.content = 'Content is required';
    else if (formData.content.length < 50) newErrors.content = 'Minimum 50 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= Handlers ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    
    // Update image preview when image changes
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), tag] 
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: (prev.tags || []).filter(t => t !== tag) 
    }));
  };

  /* ================= Submit ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix form errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        description: formData.description,
        image: formData.image,
        tags: formData.tags,
        published: formData.published,
      };

      const res = await blogAPI.update(params.id, payload);

      if (res.success) {
        toast.success('Blog updated successfully');
        router.push('/dashboard/blogs');
        router.refresh();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */
  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (!blog) {
    return <div className="p-6 text-center text-red-500">Blog not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {/* Form Card */}
      <Card className="p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
              placeholder="Enter a brief description for your blog post"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <Textarea
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content}</p>
            )}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <Textarea
              name="image"
              rows={2}
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm mb-2"
              placeholder="Enter image URL (e.g., https://images.unsplash.com/photo-...)"
            />
            <p className="text-xs text-gray-500 mb-2">
              Add a compelling image to make your blog post more engaging. Use high-quality images with at least 800x400 resolution.
            </p>
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                <div className="border rounded-lg p-2 bg-gray-50 max-w-xs">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-40 mx-auto"
                    onError={(e) => {
                      // If image fails to load, show a placeholder
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1pbWFnZS1vZmYiPjxwYXRoIGQ9Ik00IDJIMjBhMiAyIDAgMCAxIDIgMnYxNmMwIC41MjEtLjIwMyAxLjAxNi0uNTY2IDEuMzgxIi8+PHBhdGggZD0ibTEwIDEwLjVgMS41IDEuNSAwIDEgMCAtMS4xNC0yLjQ3NCIvPjxwYXRoIGQ9Im0yIDJsMjAgMjAiLz48cGF0aCBkPSJNMiAyMmgxNmEyIDIgMCAwIDAgMi0yVjcuNDE0YTIgMiAwIDAgMC0uNTg2LTEuNDE0bC0uNTg2LS41ODRhMiAyIDAgMCAwLTEuNDE0LS41ODZIOGEyIDIgMCAwIDAtMS4zOTMuNTc4Ii8+PC9zdmc+';
                      target.alt = 'Failed to load image';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex gap-2">
              <FormInput
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Press Enter to add"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags?.map(tag => (
                <span
                  key={tag}
                  className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={e =>
                setFormData(prev => ({ ...prev, published: e.target.checked }))
              }
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-gray-700 font-medium">Publish this blog</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Blog Post'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
