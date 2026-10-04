"use client"
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use a server action to verify password to keep it secure, but for simplicity here we can just use a simple api route or pass it to a server action.
    const { verifyAdminPassword } = await import('@/app/actions');
    const valid = await verifyAdminPassword(password);
    
    if (valid) {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark px-4">
        <div className="bg-card p-8 rounded-2xl border border-border max-w-md w-full shadow-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <header className="bg-bg-darker border-b border-border py-4 px-6 flex justify-between items-center">
        <div className="font-bold text-xl flex items-center gap-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded">ADMIN</span>
          NxtWave Campaign
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { localStorage.removeItem('admin_auth'); setIsAuthenticated(false); }}
            className="text-muted hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
}
