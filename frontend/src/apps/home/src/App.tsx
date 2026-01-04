import React, { useEffect } from 'react';

interface HomeAppProps {
  onLoginClick?: () => void;
}

function HomeApp({ onLoginClick }: HomeAppProps) {
  useEffect(() => {
    // 强制设置为 light 主题
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 transition-colors py-12 px-4 sm:px-6 lg:px-8 relative">

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Home
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-gray-600">
            This is the home application. Start building your features here.
          </p>
          <div className="text-center">
            <button
              onClick={onLoginClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
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
