import React from 'react';
import { useAppStore } from 'shared/store';

interface HomeAppProps {
  onBackClick?: () => void;
}

function HomeApp({ onBackClick }: HomeAppProps) {
  const storeState = useAppStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
        </div>
      </div>
    </div>
  );
}

export default HomeApp;
