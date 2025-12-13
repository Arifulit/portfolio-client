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
    excerpt: '',
    featuredImage: '',
    tags: [],
    published: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [tagInput, setTagInput] = useState('');

  /* ================= Fetch Blog ================= */
  const fetchBlog = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await blogAPI.getById(params.id);

      if (!res?.data) throw new Error('Blog not found');

      const data = res.data;
      // The blog data is nested under the 'blog' property in the response
      const blogData = data.blog || data;
      setBlog(blogData);

      setFormData({
        title: blogData.title || '',
        content: blogData.content || '',
        excerpt: blogData.excerpt || '',
        featuredImage: blogData.featuredImage || '',
        tags: blogData.tags || [],
        published: blogData.published || false,
      });
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Minimum 5 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Minimum 50 characters';
    }

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
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || [],
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
        description: formData.excerpt,
        image: formData.featuredImage,
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
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!blog) {
    return <div className="p-6 text-center">Blog not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <FormInput
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
          />

          <div>
            <label className="text-sm font-medium">Content *</label>
            <Textarea
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content}</p>
            )}
          </div>

          <FormInput
            label="Featured Image URL"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleChange}
          />

          {/* Tags */}
          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2 mt-2">
              <FormInput
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Press Enter"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  published: e.target.checked,
                }))
              }
            />
            <span>Publish this blog</span>
          </div>

          {/* ✅ Cancel + Update Button */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={`
    min-w-[160px] 
    bg-green-600 
    hover:bg-primary-300 
    text-black 
    font-medium 
    py-2 
    px-4 
    rounded-md 
    shadow-sm 
    transition-colors 
    duration-200 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    focus:ring-primary-500
    disabled:opacity-60 
    disabled:cursor-not-allowed
    flex items-center justify-center
    border border-gray-300
  `}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
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
