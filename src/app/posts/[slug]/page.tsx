"use client";

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CommentSection from '@/components/comment-section';

// Mock data for posts (will be replaced with actual data fetching)
const mockPosts = [
  {
    id: '1',
    title: "The Future of Artificial Intelligence in Daily Life",
    author: {
      name: "John Doe",
      image: "https://picsum.photos/seed/author1/200/200",
      bio: "Tech enthusiast and AI researcher with over 10 years of experience in the field."
    },
    date: "June 15, 2025",
    readTime: "5 min read",
    content: `
      <h2>Introduction to AI in Everyday Life</h2>
      <p>Artificial Intelligence (AI) is rapidly transforming from a futuristic concept to an everyday reality. From the moment we wake up to when we go to sleep, AI-powered technologies are increasingly influencing how we live, work, and interact with the world around us.</p>
      
      <p>In this article, we'll explore the current state of AI in daily life and what we can expect in the coming decade as these technologies continue to evolve and become more integrated into our routines.</p>
      
      <h2>AI in Home Environments</h2>
      <p>Smart homes represent one of the most visible ways AI has entered our daily lives. Voice assistants like Amazon's Alexa, Google Assistant, and Apple's Siri have become common household tools, helping us manage schedules, control connected devices, answer questions, and even engage in basic conversations.</p>
      
      <p>Beyond voice assistants, AI is powering numerous other home technologies:</p>
      <ul>
        <li>Smart thermostats that learn your preferences and optimize energy usage</li>
        <li>Security systems that can distinguish between family members and unknown visitors</li>
        <li>Robotic vacuum cleaners that map your home and adapt their cleaning patterns</li>
        <li>Smart refrigerators that can track inventory and suggest recipes based on available ingredients</li>
      </ul>
      
      <h2>AI in Healthcare</h2>
      <p>Perhaps no area holds more promise for AI's positive impact than healthcare. AI algorithms are already helping doctors diagnose diseases more accurately, predict patient outcomes, and personalize treatment plans.</p>
      
      <p>Wearable devices powered by AI can monitor vital signs continuously, detecting potential health issues before they become serious. Meanwhile, AI-driven research is accelerating drug discovery and development, potentially bringing life-saving medications to market faster than ever before.</p>
      
      <h2>The Future of AI in Daily Life</h2>
      <p>Looking ahead to the next decade, we can expect AI to become even more seamlessly integrated into our daily routines. Here are some developments that may become commonplace:</p>
      
      <h3>Personalized AI Assistants</h3>
      <p>Future AI assistants will move beyond simple command responses to become proactive partners that anticipate our needs based on context, preferences, and patterns. These assistants will coordinate across devices and services to provide truly personalized support throughout our day.</p>
      
      <h3>Autonomous Transportation</h3>
      <p>While fully autonomous vehicles are still in development, the next decade will likely see them become more common on our roads. This shift will fundamentally change how we commute, potentially reducing traffic accidents and giving us back hours of productive time each week.</p>
      
      <h3>Ambient Intelligence</h3>
      <p>Rather than interacting with specific AI-powered devices, our environments themselves will become intelligent. Sensors and AI systems embedded throughout our homes, workplaces, and public spaces will work together to create responsive environments that adapt to our presence and needs without requiring explicit commands.</p>
      
      <h2>Ethical Considerations</h2>
      <p>As AI becomes more pervasive in our daily lives, important ethical questions arise. Issues of privacy, surveillance, algorithmic bias, and the digital divide will need thoughtful attention from technologists, policymakers, and citizens alike.</p>
      
      <p>The most beneficial future will come not just from advancing AI capabilities, but from ensuring these technologies are developed and deployed in ways that respect human autonomy, promote equity, and enhance rather than diminish our humanity.</p>
      
      <h2>Conclusion</h2>
      <p>The integration of AI into our daily lives represents one of the most significant technological shifts of our time. By understanding both the possibilities and challenges of this transformation, we can help shape an AI-enabled future that truly serves human flourishing.</p>
    `,
    category: {
      name: "Tech",
      slug: "tech"
    },
    featuredImage: "https://picsum.photos/seed/post1/1200/600",
    slug: "future-of-ai-in-daily-life",
    tags: ["AI", "Technology", "Machine Learning"]
  },
  {
    id: '2',
    title: "Sustainable Living: Small Changes with Big Impact",
    author: {
      name: "Jane Smith",
      image: "https://picsum.photos/seed/author2/200/200",
      bio: "Environmental activist and sustainable living advocate based in Portland, Oregon."
    },
    date: "June 14, 2025",
    readTime: "4 min read",
    content: `
      <h2>The Power of Small Changes</h2>
      <p>When it comes to living more sustainably, many people believe they need to make dramatic lifestyle changes to have any real impact. The good news is that even small, consistent actions can collectively make a significant difference for our planet.</p>
      
      <p>This article explores practical, accessible ways to reduce your environmental footprint without completely overhauling your life or breaking the bank.</p>
      
      <h2>Kitchen Sustainability</h2>
      <p>The kitchen is often the heart of the home—and a great place to start your sustainability journey:</p>
      
      <h3>Reduce Food Waste</h3>
      <p>Approximately one-third of all food produced globally is wasted. To combat this in your own home:</p>
      <ul>
        <li>Plan meals and shop with a list to avoid impulse purchases</li>
        <li>Store food properly to maximize freshness</li>
        <li>Learn to love leftovers and get creative with using food scraps</li>
        <li>Start composting to keep food waste out of landfills</li>
      </ul>
      
      <h3>Mindful Water Usage</h3>
      <p>Simple changes to your water habits can save thousands of gallons annually:</p>
      <ul>
        <li>Fix leaky faucets promptly</li>
        <li>Install aerators on faucets to reduce flow while maintaining pressure</li>
        <li>Keep a pitcher of drinking water in the refrigerator instead of running the tap until it's cold</li>
        <li>Only run the dishwasher when it's full</li>
      </ul>
      
      <h2>Sustainable Shopping Habits</h2>
      <p>Every purchase we make is essentially a vote for the kind of world we want to live in:</p>
      
      <h3>Reduce Single-Use Plastics</h3>
      <p>Plastic pollution is one of our most pressing environmental challenges. Start by:</p>
      <ul>
        <li>Carrying reusable shopping bags, water bottles, and coffee cups</li>
        <li>Choosing products with minimal or plastic-free packaging</li>
        <li>Buying in bulk when possible to reduce packaging waste</li>
        <li>Using beeswax wraps or silicone food covers instead of plastic wrap</li>
      </ul>
      
      <h3>Embrace Secondhand</h3>
      <p>The most sustainable product is one that already exists:</p>
      <ul>
        <li>Check thrift stores, online marketplaces, or neighborhood buy-nothing groups before buying new</li>
        <li>Borrow or rent items you'll only use occasionally</li>
        <li>Repair broken items rather than replacing them when possible</li>
      </ul>
      
      <h2>Energy Conservation at Home</h2>
      <p>Reducing energy consumption lowers both your carbon footprint and your utility bills:</p>
      
      <h3>Simple Energy Savers</h3>
      <ul>
        <li>Switch to LED light bulbs, which use up to 80% less energy than incandescent bulbs</li>
        <li>Unplug electronics or use power strips to eliminate "vampire energy" draw</li>
        <li>Wash clothes in cold water and hang to dry when possible</li>
        <li>Adjust your thermostat by just 1-2 degrees (lower in winter, higher in summer)</li>
      </ul>
      
      <h2>Sustainable Transportation</h2>
      <p>Transportation is often the largest source of an individual's carbon emissions:</p>
      <ul>
        <li>Combine errands to reduce trips</li>
        <li>Walk or bike for short distances</li>
        <li>Use public transportation when available</li>
        <li>Consider carpooling or car-sharing services</li>
      </ul>
      
      <h2>Conclusion: The Ripple Effect</h2>
      <p>While individual actions might seem small in the face of global environmental challenges, they create important ripple effects. Your choices influence those around you, send market signals to companies, and collectively add up to meaningful change.</p>
      
      <p>Remember that sustainability is a journey, not a destination. Start with changes that feel manageable, celebrate your progress, and gradually incorporate more sustainable practices into your life. Every positive choice, no matter how small, is a step toward a healthier planet.</p>
    `,
    category: {
      name: "Lifestyle",
      slug: "lifestyle"
    },
    featuredImage: "https://picsum.photos/seed/post2/1200/600",
    slug: "sustainable-living-small-changes",
    tags: ["Sustainability", "Environment", "Green Living"]
  }
];

// Mock related posts
const relatedPosts = [
  {
    id: '3',
    title: "The Healing Power of Nature: Forest Bathing and Mental Health",
    author: {
      name: "Michael Chen",
      image: "https://picsum.photos/seed/author3/200/200"
    },
    date: "June 13, 2025",
    featuredImage: "https://picsum.photos/seed/post3/800/600",
    slug: "healing-power-of-nature",
    category: {
      name: "Science",
      slug: "science"
    }
  },
  {
    id: '5',
    title: "The Science of Sleep: How to Optimize Your Rest",
    author: {
      name: "David Wilson",
      image: "https://picsum.photos/seed/author5/200/200"
    },
    date: "June 11, 2025",
    featuredImage: "https://picsum.photos/seed/post5/800/600",
    slug: "science-of-sleep",
    category: {
      name: "Health",
      slug: "health"
    }
  },
  {
    id: '8',
    title: "The Rise of Quantum Computing: What You Need to Know",
    author: {
      name: "Lisa Chen",
      image: "https://picsum.photos/seed/author8/200/200"
    },
    date: "June 8, 2025",
    featuredImage: "https://picsum.photos/seed/post8/800/600",
    slug: "quantum-computing-explained",
    category: {
      name: "Science",
      slug: "science"
    }
  }
];

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch the post by slug
    // For demo purposes, we'll simulate fetching from our mock data
    const fetchPost = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const foundPost = mockPosts.find(p => p.slug === slug);
      setPost(foundPost || null);
      setIsLoading(false);
    };
    
    fetchPost();
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-8"></div>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Post Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/posts" className="btn-primary btn">
                Browse All Posts
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <article>
          {/* Featured Image */}
          <div className="w-full h-96 bg-gray-200 dark:bg-gray-800 mb-8 relative">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8">
              <Link 
                href={`/categories/${post.category.slug}`}
                className="inline-block bg-primary-500 text-white text-sm font-medium py-1 px-3 rounded-md hover:bg-primary-600 mb-4"
              >
                {post.category.name}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center">
                <img 
                  src={post.author.image} 
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full border-2 border-white mr-3"
                />
                <div>
                  <p className="text-white font-medium">
                    {post.author.name}
                  </p>
                  <p className="text-gray-200 text-sm">
                    {post.date} • {post.readTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag: string, index: number) => (
                      <Link 
                        key={index}
                        href={`/tags/${tag.toLowerCase()}`}
                        className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Post Content */}
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-primary-500"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  {/* Share Buttons */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                          <i className="ri-heart-line text-xl"></i>
                          <span>Like</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                          <i className="ri-bookmark-line text-xl"></i>
                          <span>Save</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                          <i className="ri-twitter-fill text-xl"></i>
                        </button>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                          <i className="ri-facebook-fill text-xl"></i>
                        </button>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                          <i className="ri-linkedin-fill text-xl"></i>
                        </button>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                          <i className="ri-link text-xl"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Author Bio */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mt-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img 
                      src={post.author.image} 
                      alt={post.author.name}
                      className="w-24 h-24 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {post.author.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {post.author.bio}
                      </p>
                      <div className="flex gap-3">
                        <a href="#" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                          <i className="ri-twitter-fill text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                          <i className="ri-facebook-fill text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                          <i className="ri-linkedin-fill text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                          <i className="ri-globe-line text-xl"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comments Section */}
                <div className="mt-8" id="comments">
                  <CommentSection postId={post.id} />
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3">
                {/* Related Posts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Related Posts
                  </h3>
                  <div className="space-y-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/posts/${relatedPost.slug}`} className="flex gap-4 group">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={relatedPost.featuredImage} 
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <h4 className="text-gray-900 dark:text-white font-medium line-clamp-2 group-hover:text-primary-500">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {relatedPost.date}
                          </p>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2 rounded-md mt-2 inline-block">
                            {relatedPost.category.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Newsletter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Get the latest posts and updates delivered straight to your inbox.
                  </p>
                  <form className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <button 
                      type="submit" 
                      className="w-full py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
