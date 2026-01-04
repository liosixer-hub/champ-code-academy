import React, { useEffect } from 'react';

interface HomeAppProps {
  onLoginClick?: () => void;
}

function HomeApp({ onLoginClick }: HomeAppProps) {
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors py-12 px-4 sm:px-6 lg:px-8 relative">

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Home
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-muted-foreground">
            This is the home application. Start building your features here.
          </p>
          <div className="text-center">
            <button
              onClick={onLoginClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded transition-colors"
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
