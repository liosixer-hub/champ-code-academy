/// <reference path="../../dts/global.d.ts" />
import React, { Suspense, useState, useEffect } from 'react';

// 懒加载远程模块
const LoginApp = React.lazy(() => import('login/LoginApp'));
const DashboardApp = React.lazy(() => import('dashboard/DashboardApp'));
const HomeApp = React.lazy(() => import('home/HomeApp'));

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login'>('login');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 监听认证状态和localStorage变化
  useEffect(() => {
    // 检查localStorage中的用户信息
    const user = localStorage.getItem('user-store');
    if (user) {
      try {
        const userStore = JSON.parse(user);
        if (userStore.state && userStore.state.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // 监听storage事件（其他标签页的变化）
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem('user-store');
      if (user) {
        try {
          const userStore = JSON.parse(user);
          if (userStore.state && userStore.state.user) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 定时检查认证状态（兼容同标签页的更新）
  useEffect(() => {
    const interval = setInterval(() => {
      const user = localStorage.getItem('user-store');
      if (user) {
        try {
          const userStore = JSON.parse(user);
          setIsAuthenticated(!!(userStore.state && userStore.state.user));
        } catch {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 初始化主题
  useEffect(() => {
    // 从 localStorage 读取主题偏好
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
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

  // 同步主题到HTML元素
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);

  // 如果已认证，显示 dashboard
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors relative">
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Module...</div>}>
          <DashboardApp />
        </Suspense>
      </div>
    );
  }

  // 未认证时，根据当前视图显示 home 或 login
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Module...</div>}>
        {currentView === 'home' ? (
          <HomeApp onLoginClick={() => setCurrentView('login')} />
        ) : (
          <LoginApp onBackClick={() => setCurrentView('home')} />
        )}
      </Suspense>
    </div>
  );
}

export default App;