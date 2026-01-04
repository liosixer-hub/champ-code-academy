import React, { useState, useEffect } from 'react';
import { ImageCarousel } from './components/ImageCarousel';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';

interface LoginAppProps {
  onBackClick?: () => void;
}

function LoginApp({ onBackClick }: LoginAppProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 从 localStorage 读取主题偏好
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // 检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const htmlElement = document.documentElement;
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="h-screen flex bg-white dark:bg-slate-950 transition-colors">
      {/* Left Panel - Image Carousel */}
      <div className="hidden lg:block lg:w-1/2 relative h-full" style={{ height: '100%', width: '100%' }}>
        <ImageCarousel />
      </div>

      {/* Right Panel - Login/Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-950 overflow-y-auto h-full transition-colors relative">
        {!window.matchMedia('(max-width: 1024px)').matches && (
          <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        )}
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default LoginApp;