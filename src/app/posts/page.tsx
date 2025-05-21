"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PostCard from '@/components/post-card';

// Fallback data for posts in case API fails
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
  },
  {
    id: '5',
    title: "The Science of Sleep: How to Optimize Your Rest",
    author: {
      name: "David Wilson",
      image: "https://picsum.photos/seed/author5/200/200"
    },
    date: "June 11, 2025",
    readTime: "5 min read",
    excerpt: "Learn about the latest research on sleep cycles and how to improve your sleep quality for better health.",
    category: {
      name: "Health",
      slug: "health"
    },
    featuredImage: "https://picsum.photos/seed/post5/800/600",
    slug: "science-of-sleep",
    tags: ["Health", "Sleep", "Wellness"]
  },
  {
    id: '6',
    title: "Modern Web Development: Trends to Watch in 2025",
    author: {
      name: "Emily Zhang",
      image: "https://picsum.photos/seed/author6/200/200"
    },
    date: "June 10, 2025",
    readTime: "8 min read",
    excerpt: "Stay ahead of the curve with these emerging web development technologies and methodologies.",
    category: {
      name: "Tech",
      slug: "tech"
    },
    featuredImage: "https://picsum.photos/seed/post6/800/600",
    slug: "web-development-trends-2025",
    tags: ["Web Development", "JavaScript", "Programming"]
  },
  {
    id: '7',
    title: "Mindful Cooking: The Art of Preparing Food with Intention",
    author: {
      name: "Robert Brown",
      image: "https://picsum.photos/seed/author7/200/200"
    },
    date: "June 9, 2025",
    readTime: "6 min read",
    excerpt: "Transform your relationship with food by bringing mindfulness into your kitchen practices.",
    category: {
      name: "Lifestyle",
      slug: "lifestyle"
    },
    featuredImage: "https://picsum.photos/seed/post7/800/600",
    slug: "mindful-cooking",
    tags: ["Cooking", "Mindfulness", "Wellness"]
  },
  {
    id: '8',
    title: "The Rise of Quantum Computing: What You Need to Know",
    author: {
      name: "Lisa Chen",
      image: "https://picsum.photos/seed/author8/200/200"
    },
    date: "June 8, 2025",
    readTime: "9 min read",
    excerpt: "Demystifying quantum computing and exploring its potential impact on various industries.",
    category: {
      name: "Science",
      slug: "science"
    },
    featuredImage: "https://picsum.photos/seed/post8/800/600",
    slug: "quantum-computing-explained",
    tags: ["Quantum Computing", "Technology", "Science"]
  }
];

// Fallback categories in case API fails
const fallbackCategories = [
  { name: "All", slug: "all", count: fallbackPosts.length },
  { name: "Technology", slug: "tech", count: 24 },
  { name: "Lifestyle", slug: "lifestyle", count: 18 },
  { name: "Travel", slug: "travel", count: 12 },
  { name: "Science", slug: "science", count: 10 },
  { name: "Health", slug: "health", count: 8 }
];

export default function PostsPage() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch posts and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch posts with category filter if needed
        let url = `/api/posts?page=${currentPage}&limit=12`;
        if (activeCategory !== 'all') {
          url += `&category=${activeCategory}`;
        }
        
        const postsResponse = await fetch(url);
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
        
        // Format categories data and add 'All' category
        const formattedCategories = [
          { name: "All", slug: "all", count: postsData.pagination.total }
        ];
        
        categoriesData.categories.forEach((category: any) => {
          formattedCategories.push({
            name: category.name,
            slug: category.name.toLowerCase(),
            count: category._count.posts
          });
        });
        
        setPosts(formattedPosts.length > 0 ? formattedPosts : fallbackPosts);
        setCategories(formattedCategories.length > 0 ? formattedCategories : fallbackCategories);
        setTotalPages(postsData.pagination.pages);
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
  }, [activeCategory, currentPage]);
  
  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    setCurrentPage(1); // Reset to first page when changing category
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
    // For now, we'll just filter the current posts client-side
    // In a real app, you'd make a new API request with the search query
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              All Posts
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Search posts..." 
                  className="py-2 pl-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <i className="ri-search-line"></i>
                </button>
              </form>
              
              <select className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>Latest</option>
                <option>Popular</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <button 
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`flex justify-between items-center w-full text-left ${activeCategory === category.slug ? 'text-primary-500 font-medium' : 'text-gray-700 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-400`}
                      >
                        <span>{category.name}</span>
                        <span className={`${activeCategory === category.slug ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'} text-xs py-1 px-2 rounded-full`}>
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Link href="/tags/technology" className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    Technology
                  </Link>
                  <Link href="/tags/ai" className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    AI
                  </Link>
                  <Link href="/tags/health" className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    Health
                  </Link>
                  <Link href="/tags/travel" className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    Travel
                  </Link>
                  <Link href="/tags/programming" className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    Programming
                  </Link>
                  <Link href="/tags/wellness" className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    Wellness
                  </Link>
                  <Link href="/tags/science" className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    Science
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        No posts found for the selected category.
                      </p>
                      <Link href="/create-post" className="btn-primary btn">
                        Create First Post
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {!isLoading && posts.length > 0 && totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button 
                      className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        // If 5 or fewer pages, show all
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // If near start, show first 5 pages
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // If near end, show last 5 pages
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Otherwise show 2 before and 2 after current
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`px-4 py-2 rounded-md ${currentPage === pageNum ? 'bg-primary-500 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-4 py-2 text-gray-600 dark:text-gray-400">...</span>
                        <button
                          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    <button 
                      className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
