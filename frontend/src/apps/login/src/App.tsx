import React, { useState } from 'react';
import { ImageCarousel } from './components/ImageCarousel';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';

interface LoginAppProps {
  onBackClick?: () => void;
}

function LoginApp({ onBackClick }: LoginAppProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen flex">
      {/* Left Panel - Image Carousel */}
      <div className="hidden lg:block lg:w-1/2 relative h-full" style={{ height: '100%', width: '50%' }}>
        <ImageCarousel />
      </div>

      {/* Right Panel - Login/Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto h-full">
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