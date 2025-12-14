'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  published: boolean;
}

interface FormErrors {
  title?: string;
  content?: string;
  excerpt?: string;
  [key: string]: string | undefined;
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
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.excerpt,
          content: formData.content,
          image: formData.featuredImage,
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

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-lg font-semibold text-gray-700">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={handleInputChange}
            className={`mt-2 block w-full rounded-xl border px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.excerpt ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Write a short summary of the blog"
          />
          {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
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
          <label htmlFor="featuredImage" className="block text-lg font-semibold text-gray-700">
            Featured Image URL
          </label>
          <input
            type="url"
            id="featuredImage"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleInputChange}
            className="mt-2 block w-full rounded-xl border px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
            placeholder="https://example.com/image.jpg"
          />
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
