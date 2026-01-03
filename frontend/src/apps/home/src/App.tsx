import React, { useEffect } from 'react';

interface HomeAppProps {
  onLoginClick?: () => void;
}

function HomeApp({ onLoginClick }: HomeAppProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

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

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-gray-900 dark:text-white transition-colors py-12 px-4 sm:px-6 lg:px-8 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Home
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            This is the home application. Start building your features here.
          </p>
          <div className="text-center">
            <button
              onClick={onLoginClick}
              className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeApp;
