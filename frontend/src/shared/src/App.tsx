import Button from './components/Button';
import { Layout } from './layout';
import { useUserStore } from './store';

function SharedApp() {
  const { user, isAuthenticated, setUser, logout } = useUserStore();

  return (
    <Layout>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Shared Components Demo</h2>

          <div className="bg-card text-card-foreground overflow-hidden shadow rounded-lg mb-6 transition-colors">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-foreground mb-4">
                Button Component
              </h3>
              <Button onClick={() => alert('Button clicked!')}>
                Click Me
              </Button>
            </div>
          </div>

          <div className="bg-card text-card-foreground overflow-hidden shadow rounded-lg mb-6 transition-colors">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-foreground mb-4">
                Store Demo
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Authentication Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}
              </p>
              {user && (
                <div className="mb-4">
                  <p className="text-sm text-foreground">Name: {user.name}</p>
                  <p className="text-sm text-foreground">Email: {user.email}</p>
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
    </Layout>
  );

  function handleLoginDemo() {
    setUser({ name: 'Demo User', email: 'demo@example.com' });
  }
}

export default SharedApp;
