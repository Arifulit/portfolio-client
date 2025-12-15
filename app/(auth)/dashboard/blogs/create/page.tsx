'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface BlogFormData {
  title: string;
  content: string;
  description: string;
  image: string;
  tags: string[];
  published: boolean;
}

interface FormErrors {
  title?: string;
  content?: string;
  description?: string;
  [key: string]: string | undefined;
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    description: '',
    image: '',
    tags: [],
    published: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update image preview when image changes
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This will send the HTTP-only token cookie
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          image: formData.image,
          published: formData.published,
          tags: formData.tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog post');
      }

      toast.success('Blog post created successfully!');
      router.push('/dashboard/blogs');
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Create New Blog Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`mt-2 block w-full rounded-xl border px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter the blog title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className={`mt-2 block w-full rounded-xl border px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Write a short summary of the blog"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            value={formData.content}
            onChange={handleInputChange}
            className={`mt-2 block w-full rounded-xl border px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Write your blog content here..."
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        {/* Featured Image */}
        <div>
          <label htmlFor="image" className="block text-lg font-semibold text-gray-700">
            Featured Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="mt-2 block w-full rounded-xl border px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-2">
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
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1pbWFnZS1vZmYiPjxwYXRoIGQ9Ik00IDJIMjBhMiAyIDAgMCAxIDIgMnYxNmMwIC41MjEtLjIwMyAxLjAxNi0uNTY2IDEuMzgxIi8+PHBhdGggZD0ibTEwIDEwLjVnMS41IDEuNSAwIDEgMCAtMS4xNC0yLjQ3NCIvPjxwYXRoIGQ9Im0yIDJsMjAgMjAiLz48cGF0aCBkPSJNMiAyMmgxNmEyIDIgMCAwIDAgMi0yVjcuNDE0YTIgMiAwIDAgMC0uNTg2LTEuNDE0bC0uNTg2LS41ODRhMiAyIDAgMCAwLTEuNDE0LS41ODZIOWEyIDIgMCAwIDAtMS4zOTMuNTc4Ii8+PC9zdmc+';
                    target.alt = 'Failed to load image';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-lg font-semibold text-gray-700">
            Tags
          </label>
          <div className="mt-2 flex">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="block w-full rounded-l-xl border px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-r-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="flex items-center justify-center h-5 w-5 rounded-full text-indigo-500 hover:bg-indigo-200 hover:text-indigo-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Publish Checkbox */}
        <div className="flex items-center">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={formData.published}
            onChange={handleCheckboxChange}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="published" className="ml-3 text-gray-900 font-medium">
            Publish this post
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
