"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock comments data (will be replaced with actual data fetching)
const mockComments = [
  {
    id: '1',
    content: "This is a really insightful article! I've been thinking about how AI will change our daily routines, and your points about ambient intelligence are spot on.",
    createdAt: "2025-06-16T10:30:00Z",
    author: {
      id: '101',
      name: "Alex Johnson",
      image: "https://picsum.photos/seed/user1/200/200"
    },
    replies: [
      {
        id: '1-1',
        content: "Thanks for your kind words, Alex! I'm particularly excited about the potential for AI to help us be more present in our daily lives by handling routine tasks.",
        createdAt: "2025-06-16T11:15:00Z",
        author: {
          id: '1',
          name: "John Doe",
          image: "https://picsum.photos/seed/author1/200/200"
        }
      },
      {
        id: '1-2',
        content: "I agree with both of you. The key will be ensuring these technologies enhance rather than distract from our human connections.",
        createdAt: "2025-06-16T13:45:00Z",
        author: {
          id: '103',
          name: "Maria Garcia",
          image: "https://picsum.photos/seed/user3/200/200"
        }
      }
    ]
  },
  {
    id: '2',
    content: "Great overview of the current state and future possibilities. I'd be interested to hear more about the ethical implications, especially regarding privacy and surveillance.",
    createdAt: "2025-06-16T14:20:00Z",
    author: {
      id: '102',
      name: "Taylor Smith",
      image: "https://picsum.photos/seed/user2/200/200"
    },
    replies: []
  },
  {
    id: '3',
    content: "I work in healthcare AI, and I can confirm that the advancements in diagnostic tools have been remarkable. We're seeing accuracy rates that surpass human specialists in some narrow domains.",
    createdAt: "2025-06-17T09:10:00Z",
    author: {
      id: '104',
      name: "Dr. Patel",
      image: "https://picsum.photos/seed/user4/200/200"
    },
    replies: []
  }
];

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch comments for the post
    // For demo purposes, we'll simulate fetching from our mock data
    const fetchComments = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      setComments(mockComments);
      setIsLoading(false);
    };
    
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsLoggedIn(true);
    }
    
    fetchComments();
  }, [postId]);
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    // In a real app, this would be an API call to create a new comment
    // For demo purposes, we'll just add it to our local state
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newCommentObj = {
      id: `new-${Date.now()}`,
      content: newComment,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id || 'guest',
        name: currentUser.name || 'Guest User',
        image: currentUser.image || 'https://picsum.photos/seed/guest/200/200'
      },
      replies: []
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };
  
  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    // In a real app, this would be an API call to create a new reply
    // For demo purposes, we'll just update our local state
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newReply = {
      id: `reply-${Date.now()}`,
      content: replyContent,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id || 'guest',
        name: currentUser.name || 'Guest User',
        image: currentUser.image || 'https://picsum.photos/seed/guest/200/200'
      }
    };
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setReplyContent('');
    setReplyingTo(null);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>
      
      {isLoggedIn ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
            required
          />
          <div className="flex justify-end mt-3">
            <button 
              type="submit" 
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Please log in to join the conversation.
          </p>
          <Link 
            href="/login" 
            className="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Log In
          </Link>
        </div>
      )}
      
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Be the first to comment on this post!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
              <div className="flex gap-4">
                <img 
                  src={comment.author.image} 
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {comment.content}
                  </p>
                  {isLoggedIn && (
                    <button 
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Reply
                    </button>
                  )}
                  
                  {/* Reply form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                        required
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          onClick={() => setReplyingTo(null)}
                          className="px-4 py-1 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSubmitReply(comment.id)}
                          className="px-4 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                      {comment.replies.map((reply: any) => (
                        <div key={reply.id} className="flex gap-3">
                          <img 
                            src={reply.author.image} 
                            alt={reply.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                {reply.author.name}
                              </h5>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
