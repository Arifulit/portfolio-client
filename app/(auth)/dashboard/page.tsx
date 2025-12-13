'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiLogOut, FiFileText, FiCode, FiUsers, FiActivity } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Mock data - replace with real data from your API
  const stats = [
    { name: 'Total Projects', value: '12', icon: FiCode, change: '+2.5%', changeType: 'increase' },
    { name: 'Blog Posts', value: '8', icon: FiFileText, change: '+5.2%', changeType: 'increase' },
    { name: 'Active Users', value: '1.2k', icon: FiUsers, change: '+10.3%', changeType: 'increase' },
    { name: 'Engagement', value: '89%', icon: FiActivity, change: '+3.1%', changeType: 'increase' },
  ];

  const recentActivities = [
    { id: 1, action: 'Created new project', project: 'E-commerce Platform', time: '2 hours ago' },
    { id: 2, action: 'Updated blog post', project: 'Getting Started with Next.js', time: '5 hours ago' },
    { id: 3, action: 'Received new comment', project: 'Portfolio Design', time: '1 day ago' },
    { id: 4, action: 'Project approved', project: 'Dashboard UI Kit', time: '2 days ago' },
  ];

  const quickActions = [
    { 
      title: 'New Project', 
      description: 'Start a new project', 
      icon: '🚀',
      action: () => router.push('/dashboard/projects/create')
    },
    { 
      title: 'Write Blog', 
      description: 'Create a new blog post', 
      icon: '✍️',
      action: () => router.push('/dashboard/blogs/create')
    },
    { 
      title: 'View Analytics', 
      description: 'Check your stats', 
      icon: '📊',
      action: () => router.push('/dashboard/analytics')
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white p-6 mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="opacity-90">Here's what's happening with your portfolio today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className={`font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>{' '}
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
                  >
                    <span className="text-2xl mr-4">{action.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Your recent actions and updates</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">{activity.project}</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage;