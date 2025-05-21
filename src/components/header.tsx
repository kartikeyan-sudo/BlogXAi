"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from './theme-provider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const { theme, setTheme } = useTheme();
  
  // Check if user is logged in and if they are an admin
  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsLoggedIn(true);
        setUserName(user.name || 'User');
        setIsAdmin(user.role === 'ADMIN');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(true); // Still set logged in even if parsing fails
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 fixed w-full top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            BlogX
          </Link>
          
          <div className={`lg:flex items-center gap-6 ${isMenuOpen ? 'flex flex-col absolute top-20 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-md z-50' : 'hidden lg:flex'}`}>
            <ul className="flex flex-col lg:flex-row gap-6">
              <li>
                <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 font-medium">
                  Posts
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 font-medium">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 font-medium">
                  About
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li>
                    <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 font-medium">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/profile" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 font-medium">
                      My Profile
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="py-2 pl-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-auto"
              />
              <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"></i>
            </div>
            
            {!isLoggedIn ? (
              <div className="flex gap-2">
                <Link href="/login" className="btn py-2 px-4 rounded-lg bg-white dark:bg-gray-700 text-primary-500 border border-primary-500">
                  Login
                </Link>
                <Link href="/register" className="btn py-2 px-4 rounded-lg bg-primary-500 text-white">
                  Join
                </Link>
              </div>
            ) : (
              <>
                <Link href="/create-post" className="btn py-2 px-4 rounded-lg bg-primary-500 text-white hidden md:inline-block">
                  Create Post
                </Link>
                <div className="relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500"
                  >
                    <img 
                      src="https://picsum.photos/seed/avatar/200/300" 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                      <p className="px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700">
                        {userName}
                      </p>
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Dashboard
                      </Link>
                      <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        My Profile
                      </Link>
                      <Link href="/create-post" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Create Post
                      </Link>
                      {/* Admin link - only shown if user is admin */}
                      {isAdmin && (
                        <Link href="/admin" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                        <button 
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
            >
              {theme === 'dark' ? (
                <i className="ri-sun-line text-yellow-400"></i>
              ) : (
                <i className="ri-moon-line text-gray-700"></i>
              )}
            </button>
            
            <button 
              onClick={toggleMenu}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10"
            >
              <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 my-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
