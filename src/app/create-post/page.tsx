"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Fallback categories in case API fails
const fallbackCategories = [
  { id: '1', name: 'Technology', slug: 'tech' },
  { id: '2', name: 'Lifestyle', slug: 'lifestyle' },
  { id: '3', name: 'Travel', slug: 'travel' },
  { id: '4', name: 'Science', slug: 'science' },
  { id: '5', name: 'Health', slug: 'health' }
];

export default function CreatePostPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState(fallbackCategories);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    tags: '',
    featuredImage: '',
    content: '',
  });
  
  // Check if user is logged in and fetch categories
  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsLoggedIn(true);
        setUserId(user.id);
        
        // Fetch categories
        fetchCategories();
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    } else {
      // Redirect to login if not logged in
      router.push('/login');
    }
  }, [router]);
  
  // Function to fetch categories
  const fetchCategories = async () => {
    setIsFetchingCategories(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Format categories data
      const formattedCategories = data.categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.name.toLowerCase()
      }));
      
      setCategories(formattedCategories.length > 0 ? formattedCategories : fallbackCategories);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      // Use fallback categories if fetch fails
      setCategories(fallbackCategories);
    } finally {
      setIsFetchingCategories(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleEditorChange = (content: string) => {
    setFormData({
      ...formData,
      content
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setIsLoading(false);
      return;
    }
    
    if (!formData.categoryId) {
      setError('Category is required');
      setIsLoading(false);
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Process tags
      const tagList = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Create post data
      const postData = {
        title: formData.title,
        content: formData.content,
        slug,
        categoryId: formData.categoryId,
        authorId: userId,
        featuredImage: formData.featuredImage || null,
        published: false, // Default to draft
        tags: tagList
      };
      
      // Send API request
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
      
      const data = await response.json();
      console.log('Post created successfully:', data);
      
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];
  
  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Create New Post
            </h1>
            
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title"
                  className="input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="input"
                    required
                    disabled={isFetchingCategories}
                  >
                    <option value="">Select a category</option>
                    {isFetchingCategories ? (
                      <option value="" disabled>Loading categories...</option>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No categories found</option>
                    )}
                  </select>
                  {isFetchingCategories && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Loading categories...
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., AI, machine learning, data science"
                    className="input"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  id="featuredImage"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter a URL for your post's featured image. For testing, you can use: https://picsum.photos/seed/blog/800/600
                </p>
              </div>
              
              <div className="mb-12"> {/* Increased bottom margin */}
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                <div className="bg-white rounded-lg border border-gray-300 dark:border-gray-700">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Start writing your post..."
                    className="h-64"
                    style={{ minHeight: '300px' }}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8 pt-4"> {/* Added top margin and padding */}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isFetchingCategories}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    'Publish Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
