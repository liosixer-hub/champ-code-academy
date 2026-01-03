import Button from './components/Button';
import Header from './components/Header';
import { useUserStore } from './store';

function SharedApp() {
  const { user, isAuthenticated, setUser, logout } = useUserStore();

  const handleLoginDemo = () => {
    setUser({ name: 'Demo User', email: 'demo@example.com' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-4">Shared Components Demo</h2>

          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Button Component
              </h3>
              <Button onClick={() => alert('Button clicked!')}>
                Click Me
              </Button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Store Demo
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Authentication Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}
              </p>
              {user && (
                <div className="mb-4">
                  <p className="text-sm text-gray-900">Name: {user.name}</p>
                  <p className="text-sm text-gray-900">Email: {user.email}</p>
                </div>
              )}
              <div className="space-x-2">
                <Button onClick={handleLoginDemo}>Demo Login</Button>
                <Button onClick={logout}>Logout</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SharedApp;