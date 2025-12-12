// app/(public)/about/page.tsx
import React from 'react';
import { AboutMe, WorkExperience, Skill } from '@/types';

// Static Site Generation - No revalidation
async function getAboutData(): Promise<AboutMe | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about`, {
      cache: 'force-cache' // SSG
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data.about;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

// Metadata for SEO
export const metadata = {
  title: 'About Me - MyPortfolio',
  description: 'Learn more about me, my experience, and skills.',
};

// Skill Category Component
function SkillCategory({ 
  title, 
  skills 
}: { 
  title: string; 
  skills: Skill[] 
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
          >
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// Work Experience Component
function WorkExperienceCard({ experience }: { experience: WorkExperience }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {experience.position}
          </h3>
          <p className="text-primary-600 font-medium">{experience.company}</p>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {experience.duration}
        </span>
      </div>
      
      {experience.location && (
        <p className="text-sm text-gray-600 mb-3">📍 {experience.location}</p>
      )}
      
      <p className="text-gray-700">{experience.description}</p>
    </div>
  );
}

// Main About Page
export default async function AboutPage() {
  const about = await getAboutData();

  if (!about) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load profile
          </h2>
          <p className="text-gray-600">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Group skills by category
  const skillsByCategory = about.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="md:flex">
            {/* Profile Image */}
            <div className="md:w-1/3 bg-gradient-to-br from-primary-500 to-primary-700 p-8 flex items-center justify-center">
              {about.profileImage ? (
                <img
                  src={about.profileImage}
                  alt={about.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary-600">
                    {about.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {about.name}
              </h1>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {about.bio}
              </p>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${about.email}`} className="hover:text-primary-600">
                    {about.email}
                  </a>
                </div>
                
                {about.phone && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{about.phone}</span>
                  </div>
                )}
                
                {about.location && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{about.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {about.socialLinks.github && (
                  <a
                    href={about.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {about.socialLinks.linkedin && (
                  <a
                    href={about.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {about.resume && (
                  <a
                    href={about.resume}
                    download
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Work Experience Section */}
        {about.workExperience && about.workExperience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Work Experience
            </h2>
            <div className="space-y-6">
              {about.workExperience.map((exp) => (
                <WorkExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {about.skills && about.skills.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Skills & Technologies
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <SkillCategory
                    key={category}
                    title={category.charAt(0).toUpperCase() + category.slice(1)}
                    skills={skills}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}