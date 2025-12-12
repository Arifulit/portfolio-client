'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
// import { Card } from '@/components/ui/card';
import { User } from '@/types';

interface DashboardStats {
  projects: number;
  blogs: number;
  views: number;
  recentActivity?: Array<{
    id: string;
    type: 'blog' | 'project' | 'update';
    title: string;
    date: string;
    action: string;
  }>;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    blogs: 0,
    views: 0,
    recentActivity: []
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API call
        // const response = await fetch('/api/dashboard/stats');
        // const data = await response.json();
        // setStats(data);
        
        // Mock data for now
        setTimeout(() => {
          setStats({
            projects: 12,
            blogs: 5,
            views: 1243,
            recentActivity: [
              {
                id: '1',
                type: 'blog',
                title: 'Getting Started with Next.js 14',
                date: '2023-12-10',
                action: 'published'
              },
              {
                id: '2',
                type: 'project',
                title: 'Portfolio Website',
                date: '2023-12-08',
                action: 'updated'
              }
            ]
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
      </div>
      
      {/* Rest of your component remains the same */}
    </div>
  );
}