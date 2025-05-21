"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PostCard from '@/components/post-card';

// Fallback mock data in case API fails
const fallbackPosts = [
  {
    id: '1',
    title: "The Future of Artificial Intelligence in Daily Life",
    author: {
      name: "John Doe",
      image: "https://picsum.photos/seed/author1/200/200"
    },
    date: "June 15, 2025",
    readTime: "5 min read",
    excerpt: "Explore how AI is transforming our daily routines and what to expect in the coming decade.",
    category: {
      name: "Tech",
      slug: "tech"
    },
    featuredImage: "https://picsum.photos/seed/post1/800/600",
    slug: "future-of-ai-in-daily-life",
    tags: ["AI", "Technology", "Machine Learning"]
  },
  {
    id: '2',
    title: "Sustainable Living: Small Changes with Big Impact",
    author: {
      name: "Jane Smith",
      image: "https://picsum.photos/seed/author2/200/200"
    },
    date: "June 14, 2025",
    readTime: "4 min read",
    excerpt: "Discover practical ways to reduce your environmental footprint without major lifestyle changes.",
    category: {
      name: "Lifestyle",
      slug: "lifestyle"
    },
    featuredImage: "https://picsum.photos/seed/post2/800/600",
    slug: "sustainable-living-small-changes",
    tags: ["Sustainability", "Environment", "Green Living"]
  },
  {
    id: '3',
    title: "The Healing Power of Nature: Forest Bathing and Mental Health",
    author: {
      name: "Michael Chen",
      image: "https://picsum.photos/seed/author3/200/200"
    },
    date: "June 13, 2025",
    readTime: "6 min read",
    excerpt: "Scientific evidence shows how immersing ourselves in nature can significantly improve our well-being.",
    category: {
      name: "Science",
      slug: "science"
    },
    featuredImage: "https://picsum.photos/seed/post3/800/600",
    slug: "healing-power-of-nature",
    tags: ["Mental Health", "Nature", "Wellbeing"]
  },
  {
    id: '4',
    title: "Exploring Hidden Gems of Central Asia",
    author: {
      name: "Sarah Johnson",
      image: "https://picsum.photos/seed/author4/200/200"
    },
    date: "June 12, 2025",
    readTime: "7 min read",
    excerpt: "From the Silk Road monuments to modern-day nomadic traditions, discover what makes this region unique.",
    category: {
      name: "Travel",
      slug: "travel"
    },
    featuredImage: "https://picsum.photos/seed/post4/800/600",
    slug: "hidden-gems-central-asia",
    tags: ["Travel", "Central Asia", "Culture"]
  }
];

// Fallback categories in case API fails
const fallbackCategories = [
  { name: "Technology", slug: "tech", count: 24 },
  { name: "Lifestyle", slug: "lifestyle", count: 18 },
  { name: "Travel", slug: "travel", count: 12 },
  { name: "Science", slug: "science", count: 10 },
  { name: "Health", slug: "health", count: 8 }
];

export default function Home() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch posts and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch posts
        const postsResponse = await fetch('/api/posts?limit=4');
        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }
        const postsData = await postsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        
        // Format posts data to match component expectations
        const formattedPosts = postsData.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          author: {
            name: post.author.name,
            image: post.author.image || 'https://picsum.photos/seed/author1/200/200'
          },
          date: new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: `${Math.ceil(post.content.length / 1000)} min read`,
          excerpt: post.content.substring(0, 120) + '...',
          category: {
            name: post.category?.name || 'Uncategorized',
            slug: post.category?.name.toLowerCase() || 'uncategorized'
          },
          featuredImage: post.featuredImage || `https://picsum.photos/seed/post${post.id}/800/600`,
          slug: post.slug,
          tags: post.tags?.map((tag: any) => tag.name) || []
        }));
        
        // Format categories data
        const formattedCategories = categoriesData.categories.map((category: any) => ({
          name: category.name,
          slug: category.name.toLowerCase(),
          count: category._count.posts
        }));
        
        setPosts(formattedPosts.length > 0 ? formattedPosts : fallbackPosts);
        setCategories(formattedCategories.length > 0 ? formattedCategories : fallbackCategories);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message);
        // Use fallback data if fetch fails
        setPosts(fallbackPosts);
        setCategories(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to BlogX</h1>
            <p className="text-xl mb-8">Share your thoughts, discover new ideas, and connect with a community of writers and readers.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-post" className="btn-primary btn">
                Create Your First Post
              </Link>
              <Link href="/login" className="btn-outline btn">
                Login to Post
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest Posts Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Posts</h2>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>All Categories</option>
                <option>Tech</option>
                <option>Lifestyle</option>
                <option>Travel</option>
                <option>Science</option>
              </select>
              <div className="hidden md:flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg bg-primary-500 text-white">Latest</button>
                <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">Popular</button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <p>Showing fallback content instead.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/posts" className="btn-primary btn">
              View All Posts
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Explore Categories
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <p>Showing fallback content instead.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link 
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl text-center hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {category.count} posts
                    </p>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No categories found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Get the latest posts and updates delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button 
                type="submit" 
                className="btn-primary btn px-6"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
