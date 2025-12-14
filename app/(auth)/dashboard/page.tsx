'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
// import OverviewChart from '@/components/dashboard/OverviewChart';

import {
  FiBox,
  FiFileText,
  FiLink,
  FiGithub,
} from 'react-icons/fi';
import OverviewChart from '@/app/components/OverviewChart';

/* ---------------- Types ---------------- */

interface Project {
  id: string;
  title: string;
  createdAt: string;
  liveUrl?: string;
}

interface BlogPost {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
}

interface DashboardStats {
  projects: {
    total: number;
    withLiveUrl: number;
    withGithubUrl: number;
    recent: Project[];
  };
  blogs: {
    total: number;
    published: number;
    drafts: number;
    recent: BlogPost[];
  };
}

/* ---------------- Page ---------------- */

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        // No need to manually add token header since we're using credentials: 'include'
        const headers = {};

        const [projectsRes, blogsRes] = await Promise.all([
          fetch(`${baseUrl}/projects/dashboard/stats`, { 
            headers,
            credentials: 'include'
          }),
          fetch(`${baseUrl}/blogs/dashboard/stats`, { 
            headers,
            credentials: 'include'
          }),
        ]);

        const projectsData = await projectsRes.json();
        const blogsData = await blogsRes.json();

        setStats({
          projects: projectsData.data || {
            total: 0,
            withLiveUrl: 0,
            withGithubUrl: 0,
            recent: []
          },
          blogs: blogsData.data || {
            total: 0,
            published: 0,
            drafts: 0,
            recent: []
          },
        });
      } catch (error) {
        console.error('Dashboard fetch error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, router]);

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (!stats) return null;

  /* ---------------- Chart Data ---------------- */

  const projectChartData = [
    { name: 'Total', value: stats.projects.total },
    { name: 'Live', value: stats.projects.withLiveUrl },
    { name: 'GitHub', value: stats.projects.withGithubUrl },
  ];

  const blogChartData = [
    { name: 'Total', value: stats.blogs.total },
    { name: 'Published', value: stats.blogs.published },
    { name: 'Drafts', value: stats.blogs.drafts },
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Welcome back, {user?.name || 'Admin'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={stats.projects.total}
            icon={<FiBox />}
            color="blue"
          />
          <StatCard
            title="Live Projects"
            value={stats.projects.withLiveUrl}
            icon={<FiLink />}
            color="green"
          />
          <StatCard
            title="GitHub Linked"
            value={stats.projects.withGithubUrl}
            icon={<FiGithub />}
            color="purple"
          />
          <StatCard
            title="Blog Posts"
            value={stats.blogs.total}
            icon={<FiFileText />}
            color="yellow"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OverviewChart
            title="Projects Overview"
            data={projectChartData}
          />
          <OverviewChart
            title="Blogs Overview"
            data={blogChartData}
          />
        </div>

      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

const colorMap: any = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
