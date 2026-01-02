/// <reference path="../../dts/global.d.ts" />
import React, { Suspense, useState } from 'react';

// Import shared module
import { useAppStore } from 'shared/store';

// 懒加载远程模块
const LoginApp = React.lazy(() => import('login/LoginApp'));
const DashboardApp = React.lazy(() => import('dashboard/DashboardApp'));
const HomeApp = React.lazy(() => import('home/HomeApp'));

function App() {
  const { isAuthenticated } = useAppStore(); // 使用共享状态
  const [currentView, setCurrentView] = useState<'home' | 'login'>('login');

  // 如果已认证，显示 dashboard
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<div>Loading Module...</div>}>
          <DashboardApp />
        </Suspense>
      </div>
    );
  }

  // 未认证时，根据当前视图显示 home 或 login
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading Module...</div>}>
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