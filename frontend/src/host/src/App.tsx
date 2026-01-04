import React, { Suspense, useState, useEffect } from 'react';
import { ThemeProvider } from 'shared/providers';
import { useThemeStore } from 'shared/store';

// 懒加载远程模块
const LoginApp = React.lazy(() => import('login/LoginApp'));
const DashboardApp = React.lazy(() => import('dashboard/DashboardApp'));
const HomeApp = React.lazy(() => import('home/HomeApp'));

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

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

  // 如果已认证，显示 dashboard
  if (isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-background text-foreground transition-colors relative">
          <button
            onClick={toggleTheme}
            className="fixed bottom-4 right-4 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-lg z-50"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Module...</div>}>
            <DashboardApp />
          </Suspense>
        </div>
      </ThemeProvider>
    );
  }

  // 未认证时，根据当前视图显示 home 或 login
  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <button
          onClick={toggleTheme}
          className="fixed bottom-4 right-4 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-lg z-50"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Module...</div>}>
          {currentView === 'home' ? (
            <HomeApp onLoginClick={() => setCurrentView('login')} />
          ) : (
            <LoginApp onBackClick={() => setCurrentView('home')} />
          )}
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;
