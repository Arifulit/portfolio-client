import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  liveUrl?: string;
  githubUrl?: string;
  features: string[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
      next: { revalidate: 60 } // Revalidate every minute
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function ProjectDetails({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Project Header */}
          <div className="relative h-96 w-full">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8">
            {/* Title and Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="mt-2 text-gray-500">
                  Last updated: {format(new Date(project.updatedAt), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Code
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-12">
              <p className="text-lg text-gray-700">{project.description}</p>
            </div>

            {/* Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <Link
                href="/projects"
                className="inline-flex items-center text-primary-600 hover:text-primary-800"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}