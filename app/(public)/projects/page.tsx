// app/(public)/projects/page.tsx
import React from 'react';
import { Project } from '@/types';

// ISR - Revalidate every 120 seconds
export const revalidate = 120;

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      next: { revalidate: 120 }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }

    const data = await res.json();
    return data.data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {project.title}
        </h2>

        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                  +{project.technologies.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Key Features:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {project.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-4 h-4 mr-2 mt-0.5 text-primary-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-gray-200">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              GitHub
            </a>
          )}
          {project.projectUrl && !project.liveUrl && !project.githubUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              View Project
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// Main Projects Page
export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Projects
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A collection of my work showcasing various skills and technologies
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600">
              Check back later for exciting projects!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}