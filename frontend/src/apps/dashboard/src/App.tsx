import React from 'react';
import { useAppStore } from 'shared/store';

interface DashboardAppProps {
  onBackClick?: () => void;
}

function DashboardApp({ onBackClick }: DashboardAppProps) {
  const storeState = useAppStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Dashboard
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-gray-600">
            This is the dashboard application. Start building your features here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardApp;
