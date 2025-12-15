'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

interface ApiResponse {
  data?: Project[];
  message?: string;
  success?: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Helper function to check if URL is from problematic domain
  const isProblematicDomain = (url: string) => {
    return url.includes('cdn.pixabay.com') || url.includes('images.pexels.com');
  };

  // Helper function to get safe image URL
  const getSafeImageUrl = (thumbnail: string, projectId: string) => {
    if (failedImages.has(projectId) || isProblematicDomain(thumbnail)) {
      return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&auto=format';
    }
    return thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&auto=format';
  };

  const fetchProjects = async (attempt = 0): Promise<void> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`);
      }

      const json: ApiResponse = await res.json();
      const data = Array.isArray(json) ? json : json.data;

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array of projects');
      }

      setProjects(data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching projects:', err);
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timeout. Please check your connection and try again.');
        } else if (attempt < 2 && !err.message.includes('404')) {
          // Auto-retry for network errors (max 2 retries)
          setIsRetrying(true);
          setTimeout(() => {
            fetchProjects(attempt + 1);
          }, 1000 * (attempt + 1)); // Exponential backoff
          return;
        } else {
          setError(err.message || 'Failed to load projects. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred while loading projects.');
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" role="status" aria-label="Loading projects">
        <div className="text-center">
          <div className="h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600 text-sm sm:text-base">
            {isRetrying ? `Retrying... (${retryCount + 1}/3)` : 'Loading projects...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Retry loading projects"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <main className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
            Projects
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
            A curated selection of projects demonstrating my skills,
            problem-solving ability, and modern development practices.
          </p>
        </header>

        {/* Empty */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 lg:p-16 text-center text-gray-600">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-base sm:text-lg font-medium mb-2">No projects available</p>
              <p className="text-sm text-gray-500">Check back later for exciting new projects</p>
            </div>
          </div>
        ) : (
          <section className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group focus:outline-none"
                aria-label={`View details for ${project.title} project`}
              >
                <article className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">

                  {/* Image */}
                  <div className="relative h-36 xs:h-40 sm:h-44 lg:h-48 xl:h-52 w-full overflow-hidden bg-gray-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <Image
                      src={getSafeImageUrl(project.thumbnail, project.id)}
                      alt={`${project.title} project thumbnail`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={false}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!failedImages.has(project.id)) {
                          setFailedImages(prev => new Set([...prev, project.id]));
                          // Fallback to a reliable image source
                          target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&auto=format';
                        }
                      }}
                      onLoad={() => {
                        // Remove from failed images if it loads successfully
                        setFailedImages(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(project.id);
                          return newSet;
                        });
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">

                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2 leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">
                      {project.description}
                    </p>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 lg:gap-2 mb-3 sm:mb-4 lg:mb-6">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 2 && (
                        <span className="px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          +{project.technologies.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-2 sm:pt-3 lg:pt-4 border-t flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0 text-xs sm:text-sm">
                      <span className="text-gray-500 order-2 xs:order-1">
                        {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                      </span>

                      <span className="inline-flex items-center gap-1 font-medium text-blue-600 group-hover:gap-2 transition-all order-1 xs:order-2 text-xs sm:text-sm">
                        View Details →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
