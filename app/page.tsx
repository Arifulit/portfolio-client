import Link from 'next/link';
import { Button } from '@/components/ui/Button'; // shadcn/ui button
import { Code2, Smartphone, Zap, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section - Modern Dark Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-32">
        <div className="absolute inset-0 bg-grid-white/5"></div> {/* Optional subtle grid background */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Hi, I'm <span className="text-blue-400">Your Name</span>
              <br />
              <span className="text-4xl md:text-6xl">Full-Stack Developer</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              I build exceptional web experiences with Next.js, Prisma, Tailwind CSS, and modern technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/projects">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  View My Projects <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg">
                  Get In Touch
                </Button>
              </Link>
            </div>
            {/* Social Icons */}
            <div className="mt-12 flex justify-center space-x-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Github size={28} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Linkedin size={28} />
              </a>
              <a href="mailto:your@email.com" className="text-gray-400 hover:text-white transition">
                <Mail size={28} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Skills Section - Dark Cards */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What I Do</h2>
            <p className="text-xl text-gray-400">Crafting high-performance applications with cutting-edge tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Code2 size={32} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Full-Stack Development</h3>
              <p className="text-gray-400">
                Building scalable web apps with Next.js, Express, Prisma, and PostgreSQL/MongoDB.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Smartphone size={32} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Responsive Design</h3>
              <p className="text-gray-400">
                Mobile-first, pixel-perfect UIs with Tailwind CSS for seamless experience across devices.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Zap size={32} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Performance & SEO</h3>
              <p className="text-gray-400">
                Optimized code with SSR, ISR, and best practices for lightning-fast loading and great rankings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Build Something Amazing Together</h2>
          <p className="text-xl text-gray-300 mb-10">
            Have a project in mind? I'm ready to help bring your vision to life.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200 px-10 py-7 text-xl font-semibold">
              Start a Project <ArrowRight className="ml-3" size={24} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}