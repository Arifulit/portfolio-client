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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`
        );

        if (!res.ok) throw new Error('Failed to fetch projects');

        const json = await res.json();
        const data = Array.isArray(json) ? json : json.data;

        setProjects(data || []);
      } catch (err) {
        setError('Unable to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-20 bg-red-50 border border-red-200 p-6 rounded-lg text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Projects
          </h1>
          <p className="text-lg text-gray-600">
            A curated selection of projects demonstrating my skills,
            problem-solving ability, and modern development practices.
          </p>
        </header>

        {/* Empty */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-600">
            No projects available at the moment.
          </div>
        ) : (
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group"
              >
                <article className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">

                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {project.description}
                    </p>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                      </span>

                      <span className="inline-flex items-center gap-1 font-medium text-blue-600 group-hover:gap-2 transition-all">
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
