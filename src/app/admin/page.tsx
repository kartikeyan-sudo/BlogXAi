"use client";

import { useEffect, useState } from 'react';
import { getAuthToken } from '@/lib/auth';
import UserStatusComponent from '@/components/admin/user-status';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = getAuthToken();
        
        // Fetch user stats
        const usersResponse = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          
          setStats({
            totalUsers: users.length,
            activeUsers: users.filter((user: any) => user.status === 'ACTIVE').length,
            blockedUsers: users.filter((user: any) => user.status === 'BLOCKED').length,
            totalPosts: users.reduce((total: number, user: any) => total + user._count.posts, 0),
            publishedPosts: 0, // Would need an API endpoint to get this data
            draftPosts: 0 // Would need an API endpoint to get this data
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">User Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Users</span>
              <span className="text-lg font-medium text-gray-800 dark:text-white">{stats.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="text-lg font-medium text-green-600 dark:text-green-400">{stats.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Blocked Users</span>
              <span className="text-lg font-medium text-red-600 dark:text-red-400">{stats.blockedUsers}</span>
            </div>
          </div>
        </div>
        
        {/* Post Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Post Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Posts</span>
              <span className="text-lg font-medium text-gray-800 dark:text-white">{stats.totalPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Published Posts</span>
              <span className="text-lg font-medium text-green-600 dark:text-green-400">{stats.publishedPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Draft Posts</span>
              <span className="text-lg font-medium text-yellow-600 dark:text-yellow-400">{stats.draftPosts}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Quick Actions</h2>
          <div className="space-y-3">
            <a 
              href="/admin/users" 
              className="block w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded text-center transition"
            >
              Manage Users
            </a>
            <a 
              href="/" 
              className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded text-center transition"
            >
              View Blog
            </a>
          </div>
        </div>
      </div>
      
      {/* Online/Offline User Status */}
      <div className="mt-6">
        <UserStatusComponent />
      </div>
    </div>
  );
}
