"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import Link from 'next/link';

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  role: string;
  status: string;
  createdAt: string;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  category: {
    name: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  async function fetchUserProfile() {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        if (response.status === 401) {
          router.push('/login');
        } else {
          setError('Failed to fetch user profile');
        }
      }
    } catch (error) {
      setError('Error fetching user profile');
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserPosts() {
    try {
      const token = getAuthToken();
      
      if (!token) {
        return;
      }
      
      const response = await fetch('/api/user/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        
        // Calculate stats
        let totalComments = 0;
        let totalLikes = 0;
        
        data.forEach((post: Post) => {
          totalComments += post._count.comments;
          totalLikes += post._count.likes;
        });
        
        setStats({
          totalPosts: data.length,
          totalComments,
          totalLikes
        });
      } else {
        console.error('Failed to fetch user posts');
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-700 dark:text-gray-300 mb-4">You need to be logged in to view your dashboard.</p>
        <Link 
          href="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Posts</h2>
          <p className="text-4xl font-bold text-blue-500">{stats.totalPosts}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Comments</h2>
          <p className="text-4xl font-bold text-green-500">{stats.totalComments}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Likes</h2>
          <p className="text-4xl font-bold text-red-500">{stats.totalLikes}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mb-4">
                  <span className="text-4xl text-gray-600 dark:text-gray-300">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              
              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 mt-4 text-center">
                  {user.bio}
                </p>
              )}
              
              <div className="mt-6 w-full">
                <Link 
                  href="/dashboard/profile"
                  className="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Posts</h2>
              <Link 
                href="/create-post"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Create New Post
              </Link>
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">You haven't created any posts yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <div key={post.id} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                          <Link href={`/posts/${post.slug}`} className="hover:text-blue-500 dark:hover:text-blue-400">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()} • {post.category.name}
                        </p>
                        <div className="flex space-x-4 mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post._count.comments} comments
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post._count.likes} likes
                          </span>
                          <span className={`text-sm ${post.published ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/dashboard/edit-post/${post.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Edit
                        </Link>
                        <Link 
                          href={`/dashboard/share/${post.slug}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Share
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
