import React, { useState, useEffect } from 'react';
import { ImageCarousel } from './components/ImageCarousel';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';

interface LoginAppProps {
  onBackClick?: () => void;
}

function LoginApp({ onBackClick }: LoginAppProps) {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // 强制设置为 light 主题
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <div className="h-screen flex bg-white transition-colors">
      {/* Left Panel - Image Carousel */}
      <div className="hidden lg:block lg:w-1/2 relative h-full" style={{ height: '100%', width: '100%' }}>
        <ImageCarousel />
      </div>

      {/* Right Panel - Login/Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto h-full transition-colors relative">
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