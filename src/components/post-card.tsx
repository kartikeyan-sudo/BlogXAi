"use client";

import Link from 'next/link';
import { useState } from 'react';

type Author = {
  name: string;
  image: string;
};

type Category = {
  name: string;
  slug: string;
};

type Post = {
  id: string;
  title: string;
  author: Author;
  date: string;
  readTime: string;
  excerpt: string;
  category: Category;
  featuredImage: string;
  slug: string;
  tags: string[];
};

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 1);
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    
    setIsLiked(!isLiked);
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would open a share dialog
    alert(`Share post: ${post.title}`);
  };
  
  return (
    <div className="card group h-full flex flex-col">
      <div className="block">
        <div className="relative overflow-hidden h-48">
          <Link href={`/posts/${post.slug}`}>
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="absolute top-4 left-4">
            <Link 
              href={`/categories/${post.category.slug}`}
              className="bg-primary-500 text-white text-xs font-medium py-1 px-2 rounded-md hover:bg-primary-600"
            >
              {post.category.name}
            </Link>
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center mb-3">
            <img 
              src={post.author.image} 
              alt={post.author.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="text-sm">
              <p className="text-gray-900 dark:text-gray-100 font-medium">{post.author.name}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{post.date} • {post.readTime}</p>
            </div>
          </div>
          
          <Link href={`/posts/${post.slug}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {post.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Link 
                key={index}
                href={`/tags/${tag.toLowerCase()}`}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto flex justify-between items-center">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <i className={`${isLiked ? 'ri-heart-fill text-red-500' : 'ri-heart-line'}`}></i>
              <span>{likeCount}</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Link 
                href={`/posts/${post.slug}#comments`}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <i className="ri-chat-3-line"></i>
                <span>{Math.floor(Math.random() * 20)}</span>
              </Link>
              
              <button 
                onClick={handleShare}
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <i className="ri-share-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
