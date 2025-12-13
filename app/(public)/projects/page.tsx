// // app/(public)/projects/page.tsx
// import React from 'react';
// import { Project } from '@/types';

// // ISR - Revalidate every 120 seconds
// export const revalidate = 120;

// async function getProjects(): Promise<Project[]> {
//   try {
//     const apiUrl = `http://localhost:5000/api/projects`;
//     console.log('Fetching from:', apiUrl);
    
//     const res = await fetch(apiUrl, {
//       next: { revalidate: 120 },
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     console.log('Response status:', res.status);
    
//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error('Error response:', errorText);
//       throw new Error(`Failed to fetch projects: ${res.statusText}`);
//     }

//     const response = await res.json();
//     console.log('API Response:', response);
    
//     // Handle different response formats
//     if (Array.isArray(response)) {
//       console.log('Returning direct array response with', response.length, 'projects');
//       return response;
//     }
    
//     if (response.data && Array.isArray(response.data)) {
//       console.log('Returning response.data array with', response.data.length, 'projects');
//       return response.data;
//     }
    
//     if (response.data?.projects && Array.isArray(response.data.projects)) {
//       console.log('Returning response.data.projects array with', response.data.projects.length, 'projects');
//       return response.data.projects;
//     }
    
//     console.warn('Unexpected API response format:', response);
//     return [];
//   } catch (error) {
//     console.error('Error in getProjects:', error);
//     return [];
//   }
// }

// // Project Card Component
// function ProjectCard({ project }: { project: Project }) {
//   return (
//     <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
//       {/* Thumbnail */}
//       <div className="relative h-48 bg-gray-200 overflow-hidden">
//         {project.thumbnail ? (
//           <img
//             src={project.thumbnail}
//             alt={project.title}
//             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
//             <svg
//               className="w-16 h-16 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
//               />
//             </svg>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-6 flex-grow flex flex-col">
//         <h2 className="text-xl font-bold text-gray-900 mb-3">
//           {project.title}
//         </h2>

//         <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
//           {project.description}
//         </p>

//         {/* Technologies */}
//         {project.technologies && project.technologies.length > 0 && (
//           <div className="mb-4">
//             <div className="flex flex-wrap gap-2">
//               {project.technologies.slice(0, 4).map((tech, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded"
//                 >
//                   {tech}
//                 </span>
//               ))}
//               {project.technologies.length > 4 && (
//                 <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
//                   +{project.technologies.length - 4} more
//                 </span>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Features */}
//         {project.features && project.features.length > 0 && (
//           <div className="mb-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">
//               Key Features:
//             </h3>
//             <ul className="text-sm text-gray-600 space-y-1">
//               {project.features.slice(0, 3).map((feature, index) => (
//                 <li key={index} className="flex items-start">
//                   <svg
//                     className="w-4 h-4 mr-2 mt-0.5 text-primary-600 flex-shrink-0"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="line-clamp-1">{feature}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Links */}
//         <div className="flex gap-3 mt-auto pt-4 border-t border-gray-200">
//           {project.liveUrl && (
//             <a
//               href={project.liveUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex-1 px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
//             >
//               Live Demo
//             </a>
//           )}
//           {project.githubUrl && (
//             <a
//               href={project.githubUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex-1 px-4 py-2 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
//             >
//               GitHub
//             </a>
//           )}
//           {project.projectUrl && !project.liveUrl && !project.githubUrl && (
//             <a
//               href={project.projectUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex-1 px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
//             >
//               View Project
//             </a>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

// // Main Projects Page
// export default async function ProjectsPage() {
//   const projects = await getProjects();

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             My Projects
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             A collection of my work showcasing various skills and technologies
//           </p>
//         </div>

//         {/* Projects Grid */}
//         {projects.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {projects.map((project) => (
//               <ProjectCard key={project.id} project={project} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//               <svg
//                 className="w-8 h-8 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No projects yet
//             </h3>
//             <p className="text-gray-600">
//               Check back later for exciting projects!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  liveUrl: string;
  githubUrl: string;
  features: string[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const responseData = await response.json();
        
        // Handle the API response format
        if (Array.isArray(responseData)) {
          setProjects(responseData);
        } else if (responseData.data && Array.isArray(responseData.data)) {
          setProjects(responseData.data);
        } else {
          throw new Error('Invalid response format from server');
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Projects</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A collection of my work showcasing various skills and technologies
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No projects available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform transform hover:-translate-y-1">
              {project.thumbnail && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Created: {formatDate(project.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="View on GitHub"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="View Live"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}