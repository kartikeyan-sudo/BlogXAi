"use client";

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PostCard from '@/components/post-card';

// Fallback posts in case API fails
const fallbackPosts = [
  {
    id: '1',
    title: "Sample Post Title",
    author: {
      name: "John Doe",
      image: "https://picsum.photos/seed/author1/200/200"
    },
    date: "January 1, 2025",
    readTime: "5 min read",
    excerpt: "This is a sample post excerpt.",
    category: {
      name: "Uncategorized",
      slug: "uncategorized"
    },
    featuredImage: "https://picsum.photos/seed/post1/800/600",
    slug: "sample-post",
    tags: ["Sample", "Test"]
  }
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // First, try to find the category by slug
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
        }
        
        const categoriesData = await categoriesResponse.json();
        const categoryData = categoriesData.categories.find(
          (cat: any) => cat.name.toLowerCase() === slug.toLowerCase()
        );
        
        if (!categoryData) {
          throw new Error(`Category "${slug}" not found`);
        }
        
        setCategory({
          name: categoryData.name,
          slug: categoryData.name.toLowerCase(),
          count: categoryData._count.posts
        });
        
        // Then fetch posts for this category
        const postsResponse = await fetch(`/api/posts?category=${categoryData.name}`);
        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }
        
        const postsData = await postsResponse.json();
        
        // Format posts data
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
        
        setPosts(formattedPosts);
      } catch (err: any) {
        console.error('Error fetching category posts:', err);
        setError(err.message);
        setPosts(fallbackPosts);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryPosts();
  }, [slug]);

  const categoryName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {categoryName} Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {category ? `Showing ${category.count} posts in this category` : 'Loading category information...'}
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <p className="mb-6">Sorry, we couldn't find the requested category or posts.</p>
              <Link href="/categories" className="btn-primary btn">
                View All Categories
              </Link>
            </div>
          ) : (
            <>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    No posts found in this category.
                  </p>
                  <Link href="/create-post" className="btn-primary btn mr-4">
                    Create First Post
                  </Link>
                  <Link href="/categories" className="btn-outline btn">
                    View All Categories
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
