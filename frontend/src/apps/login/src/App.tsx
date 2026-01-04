import React, { useState, useEffect } from 'react';
import { ImageCarousel } from './components/ImageCarousel';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';

interface LoginAppProps {
  onBackClick?: () => void;
}

function LoginApp({ onBackClick }: LoginAppProps) {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {}, []);

  return (
    <div className="h-screen flex bg-background text-foreground transition-colors">
      <div
        className="hidden lg:block lg:w-1/2 relative h-full lg:border-r border-border"
        style={{ height: '100%', width: '100%' }}
      >
        <ImageCarousel />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-card text-card-foreground overflow-y-auto h-full transition-colors relative">
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
