import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

/* ================= TYPES ================= */

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

/* ================= FETCH ================= */

async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

/* ================= PAGE ================= */

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  if (!project) notFound();

  const fallbackImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop&auto=format';

  // Helper function to check if URL is from problematic domain
  const isProblematicDomain = (url: string) => {
    return url.includes('cdn.pixabay.com') || url.includes('images.pexels.com');
  };

  // Helper function to get safe image URL
  const getSafeImageUrl = (thumbnail: string) => {
    if (isProblematicDomain(thumbnail)) {
      return fallbackImage;
    }
    return thumbnail || fallbackImage;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-14 px-4">
      <article className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden">

        {/* Hero Image */}
        <div className="relative h-[420px] w-full">
          <Image
            src={getSafeImageUrl(project.thumbnail)}
            alt={project.title}
            fill
            priority
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImage;
            }}
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                  {project.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Last updated:{' '}
                  {format(new Date(project.updatedAt), 'MMMM dd, yyyy')}
                </p>
              </div>

              <div className="flex gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    Live Demo
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </header>

          {/* Description */}
          <section className="mb-12">
            <p className="text-lg leading-relaxed text-gray-700">
              {project.description}
            </p>
          </section>

          {/* Features */}
          {project.features?.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="pt-6 border-t flex justify-between items-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              ← Back to Projects
            </Link>

            <span className="text-sm text-gray-500">
              Created on {format(new Date(project.createdAt), 'MMMM dd, yyyy')}
            </span>
          </footer>
        </div>
      </article>
    </main>
  );
}
