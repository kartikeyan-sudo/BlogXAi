"use client";

import { useEffect, useState } from 'react';
import { getAuthToken } from '@/lib/auth';

type UserStatus = {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  lastActive: string;
};

export default function UserStatusComponent() {
  const [users, setUsers] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user status from the API
    const fetchUserStatus = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        
        // Call the API to get user status
        const response = await fetch('/api/admin/users/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch user status');
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchUserStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">User Status</h2>
      </div>
      
      {loading ? (
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <div key={user.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className={`h-3 w-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user.isOnline ? 'Online' : `Last seen: ${new Date(user.lastActive).toLocaleTimeString()}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
