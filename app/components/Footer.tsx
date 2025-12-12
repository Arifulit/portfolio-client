'use client';

import { Github, Linkedin, Mail, Twitter } from 'lucide-react'; // npm install lucide-react (recommended for icons)

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand / About */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white">Portfolio</h3>
            <p className="mt-4 text-gray-400 text-sm">
              Full-Stack Developer passionate about building modern web applications with Next.js, Prisma, and Tailwind CSS.
            </p>
            <p className="mt-4 text-gray-500 text-xs">
              © {currentYear} Portfolio. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#projects" className="hover:text-white transition">Projects</a></li>
              <li><a href="#blogs" className="hover:text-white transition">Blogs</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-6">
              <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com/yourhandle" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://linkedin.com/in/yourhandle" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="mailto:your@email.com" className="text-gray-400 hover:text-white transition">
                <Mail size={24} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Newsletter / CTA (Optional) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get updates on new projects and blog posts.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          <p>
            Built with <span className="text-red-500">❤️</span> using Next.js, Tailwind CSS & Prisma.
          </p>
          <p className="mt-2">
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a> • 
            <a href="/terms" className="ml-2 hover:text-gray-300">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}