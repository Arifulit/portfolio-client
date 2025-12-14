

// app/(public)/about/page.tsx
'use client';

import React from 'react';
import { AboutMe, WorkExperience, Skill } from '@/types';
import { Github, Linkedin, Mail, MapPin, Phone, Download, Code2, Briefcase } from 'lucide-react';

// Static data
const staticAboutData: AboutMe = {
  id: '1',
  name: 'Ariful Islam',
  email: 'ariful.iit@gmail.com',
  phone: '01763584915',
  location: 'Dhaka,Bangladesh',
  bio: 'Full-stack developer with 5+ years of experience building modern web applications. Passionate about creating clean, efficient, and user-friendly solutions.',
  profileImage: '/images/profile.jpg',
  socialLinks: {
    github: 'https://github.com/Arifulit',
    linkedin: 'https://www.linkedin.com/in/ariful-islam15/',
  
  },
  resume: '/resume.pdf',
  workExperience: [
    {
      id: '1',
      position: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      duration: '2020 - Present',
      description: 'Leading a team of developers to build responsive web applications using React, TypeScript, and Next.js. Implementing modern UI/UX patterns and optimizing performance.',
    },
    {
      id: '2',
      position: 'Frontend Developer',
      company: 'WebSolutions LLC',
      location: 'New York, NY',
      duration: '2018 - 2020',
      description: 'Developed and maintained client websites using React and Redux. Collaborated with designers to implement pixel-perfect UIs.',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript', category: 'languages' },
    { id: '2', name: 'TypeScript', category: 'languages' },
    { id: '3', name: 'React', category: 'frontend' },
    { id: '4', name: 'Next.js', category: 'frontend' },
    { id: '5', name: 'Node.js', category: 'backend' },
    { id: '6', name: 'Express', category: 'backend' },
    { id: '7', name: 'MongoDB', category: 'database' },
    { id: '8', name: 'PostgreSQL', category: 'database' },
    { id: '9', name: 'Tailwind CSS', category: 'frontend' },
    { id: '10', name: 'Git', category: 'tools' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <div className="group relative px-5 py-3 bg-gray-800 border border-gray-700 rounded-full text-gray-300 text-sm font-medium hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300">
      {skill.name}
      <span className="absolute inset-0 rounded-full bg-blue-600/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
    </div>
  );
}

function ExperienceCard({ experience, index }: { experience: WorkExperience; index: number }) {
  return (
    <div className="relative pl-8 md:pl-12 border-l-2 border-gray-700 hover:border-blue-500 transition-colors">
      <div className="absolute -left-3 md:-left-4 top-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
        <Briefcase size={14} className="text-white" />
      </div>
      <div className={`bg-gray-800/50 backdrop-blur rounded-2xl p-6 md:p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ${index % 2 === 0 ? 'md:ml-8' : 'md:-ml-8'}`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{experience.position}</h3>
            <p className="text-blue-400 font-semibold mt-1">{experience.company}</p>
          </div>
          <span className="text-gray-400 text-sm mt-2 md:mt-0">{experience.duration}</span>
        </div>
        {experience.location && (
          <p className="text-gray-400 flex items-center gap-2 mb-4">
            <MapPin size={16} /> {experience.location}
          </p>
        )}
        <p className="text-gray-300 leading-relaxed">{experience.description}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const about = staticAboutData;

  const skillsByCategory = about.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-20 md:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
                {about.profileImage ? (
                  <img
                    src={about.profileImage}
                    alt={about.name}
                    className="relative w-80 h-80 md:w-96 md:h-96 rounded-full object-cover border-8 border-gray-800 shadow-2xl group-hover:border-blue-500 transition-all duration-500"
                  />
                ) : (
                  <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-blue-600 to-gray-800 flex items-center justify-center text-8xl font-bold shadow-2xl">
                    {about.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Bio & Info */}
            <div className="order-1 lg:order-2">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Hi, I'm <span className="text-blue-400">{about.name}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                {about.bio}
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-gray-400">
                  <Mail size={20} />
                  <a href={`mailto:${about.email}`} className="hover:text-blue-400 transition">{about.email}</a>
                </div>
                {about.phone && (
                  <div className="flex items-center gap-4 text-gray-400">
                    <Phone size={20} />
                    <span>{about.phone}</span>
                  </div>
                )}
                {about.location && (
                  <div className="flex items-center gap-4 text-gray-400">
                    <MapPin size={20} />
                    <span>{about.location}</span>
                  </div>
                )}
              </div>

              {/* Social & Resume */}
              <div className="flex flex-wrap gap-4">
                {about.socialLinks?.github && (
                  <a 
                    href={about.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                  >
                    <Github size={20} /> GitHub
                  </a>
                )}
                {about.socialLinks?.linkedin && (
                  <a 
                    href={about.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Linkedin size={20} /> LinkedIn
                  </a>
                )}
                {about.resume && (
                  <a 
                    href={about.resume} 
                    download
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download size={20} /> Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience Timeline */}
        {about.workExperience && about.workExperience.length > 0 && (
          <section className="mb-20 md:mb-32">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Work Experience</h2>
            <div className="space-y-12">
              {about.workExperience.map((exp, index) => (
                <ExperienceCard key={exp.id} experience={exp} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {about.skills && about.skills.length > 0 && (
          <section>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Skills & Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <Code2 size={28} className="text-blue-400" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                      <SkillBadge key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
