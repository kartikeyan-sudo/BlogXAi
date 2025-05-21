"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Fallback categories in case API fails
const fallbackCategories = [
  { name: "Technology", slug: "technology", count: 24 },
  { name: "Lifestyle", slug: "lifestyle", count: 18 },
  { name: "Travel", slug: "travel", count: 12 },
  { name: "Science", slug: "science", count: 10 },
  { name: "Health", slug: "health", count: 8 }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format categories data
        const formattedCategories = data.categories.map((category: any) => ({
          name: category.name,
          slug: category.name.toLowerCase(),
          count: category._count.posts
        }));
        
        setCategories(formattedCategories.length > 0 ? formattedCategories : fallbackCategories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        // Use fallback data if fetch fails
        setCategories(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              All Categories
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse posts by category
            </p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link 
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl text-center hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                      {category.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {category.count} posts
                    </p>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    No categories found.
                  </p>
                  <Link href="/create-post" className="btn-primary btn">
                    Create First Post
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
