'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ProjectFormData {
  title: string;
  description: string;
  thumbnail: string;
  liveUrl: string;
  githubUrl: string;
  features: string[];
  technologies: string[];
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    thumbnail: '',
    liveUrl: '',
    githubUrl: '',
    features: [],
    technologies: []
  });
  const [featureInput, setFeatureInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== featureToRemove) }));
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== techToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      toast.success('Project created successfully!');
      router.push('/dashboard/projects');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Create New Project
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write a brief description"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Thumbnail URL</label>
          <input
            type="url"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Live URL */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Live URL</label>
          <input
            type="url"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleInputChange}
            placeholder="https://liveproject.com"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">GitHub URL</label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleInputChange}
            placeholder="https://github.com/username/project"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Features</label>
          <div className="mt-2 flex rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              placeholder="Add a feature"
              className="flex-1 px-4 py-3 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.features.map(f => (
              <span key={f} className="flex items-center bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm">
                {f}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(f)}
                  className="ml-2 text-indigo-500 hover:text-indigo-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Technologies</label>
          <div className="mt-2 flex rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              placeholder="Add a technology"
              className="flex-1 px-4 py-3 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 bg-green-600 text-white font-medium hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.technologies.map(t => (
              <span key={t} className="flex items-center bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm">
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(t)}
                  className="ml-2 text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-300 px-6 py-3 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl px-6 py-3 bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
