"use client"
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getLeaderboardStats } from '@/app/actions';

type Stat = { name?: string; code?: string; count: number };

export default function LeaderboardPage() {
  const [topColleges, setTopColleges] = useState<Stat[]>([]);
  const [topReferrers, setTopReferrers] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const data = await getLeaderboardStats();
    setTopColleges(data.topColleges);
    setTopReferrers(data.topReferrers);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-dark">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            Live Rankings
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Workshop Leaderboard</h1>
          <p className="text-muted">Top colleges and students leading the AI revolution.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colleges Leaderboard */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-bg-darker py-4 px-6 border-b border-border flex justify-between items-center">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8"></path></svg>
                Top Colleges
              </h2>
              <span className="text-xs text-muted">by registrations</span>
            </div>
            <div className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted animate-pulse">Loading rankings...</div>
              ) : topColleges.length === 0 ? (
                <div className="p-8 text-center text-muted">No data yet.</div>
              ) : (
                <ul className="divide-y divide-border">
                  {topColleges.map((college, idx) => (
                    <li key={idx} className="flex items-center justify-between py-4 px-6 hover:bg-bg-darker/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-accent text-bg-dark' : idx === 1 ? 'bg-gray-300 text-bg-dark' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-bg-darker border border-border'}`}>
                          {idx + 1}
                        </div>
                        <span className="font-medium text-white line-clamp-1">{college.name}</span>
                      </div>
                      <div className="font-bold text-primary">{college.count}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Referrers Leaderboard */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-bg-darker py-4 px-6 border-b border-border flex justify-between items-center">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Top Referrers
              </h2>
              <span className="text-xs text-muted">by invites</span>
            </div>
            <div className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted animate-pulse">Loading rankings...</div>
              ) : topReferrers.length === 0 ? (
                <div className="p-8 text-center text-muted">No data yet.</div>
              ) : (
                <ul className="divide-y divide-border">
                  {topReferrers.map((referrer, idx) => (
                    <li key={idx} className="flex items-center justify-between py-4 px-6 hover:bg-bg-darker/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-accent text-bg-dark' : idx === 1 ? 'bg-gray-300 text-bg-dark' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-bg-darker border border-border'}`}>
                          {idx + 1}
                        </div>
                        <span className="font-medium text-muted font-mono">{referrer.code}</span>
                      </div>
                      <div className="font-bold text-success">{referrer.count}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
