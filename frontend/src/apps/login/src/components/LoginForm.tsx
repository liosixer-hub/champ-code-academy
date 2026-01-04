import { useState } from "react";
import { Button, MessageBox } from "shared/components";
import { useUserStore } from "shared/store";

export function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const baseUrl = import.meta.env.BASE_URL;
      const apiUrl = `${baseUrl}api/auth/login`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const user = await response.json();
        setUser(user);
        setMessage({ text: 'Login successful! Welcome back.', type: 'success' });
      } else {
        setMessage({ text: 'Invalid credentials. Please check your email and password.', type: 'error' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ text: 'Login failed. Please try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-8">
      <div className="mb-10">
        <h1 className="text-3xl mb-2 text-foreground">Tutor Login</h1>
        <p className="text-muted-foreground">Welcome back to Champ Code Academy</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-2 text-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-border rounded-xl bg-input-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-border rounded-xl bg-input-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 border-input rounded text-primary focus:ring-ring"
            />
            <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
          </label>
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-12 mt-8 rounded-xl font-medium"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {message && (
        <MessageBox
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?{" "}
        <Button onClick={onSwitchToRegister} variant="link">
          Register
        </Button>
      </p>
    </div>
  );
}
