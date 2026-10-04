"use client"
import { useEffect, useState } from 'react';
import { getAdminStats } from '@/app/actions';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({ registrations: [], events: [] });
  const [loading, setLoading] = useState(true);
  
  // UTM Builder state
  const [utmSource, setUtmSource] = useState('whatsapp');
  const [utmCollege, setUtmCollege] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    getAdminStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const totalRegs = stats.registrations.length;
  const goal = 500;
  const progress = Math.min(100, Math.round((totalRegs / goal) * 100));

  // Process Daily Trend Data
  const trendMap: Record<string, number> = {};
  stats.registrations.forEach((r: any) => {
    const date = new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    trendMap[date] = (trendMap[date] || 0) + 1;
  });
  const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, registrations: count }));

  // Process Breakdowns
  const sourceMap: Record<string, number> = {};
  const collegeMap: Record<string, number> = {};
  const branchMap: Record<string, number> = {};

  stats.registrations.forEach((r: any) => {
    const source = r.utm_source || 'direct';
    sourceMap[source] = (sourceMap[source] || 0) + 1;
    collegeMap[r.college] = (collegeMap[r.college] || 0) + 1;
    branchMap[r.branch] = (branchMap[r.branch] || 0) + 1;
  });

  const sourceData = Object.entries(sourceMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  const collegeData = Object.entries(collegeMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  const branchData = Object.entries(branchMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  const exportCSV = () => {
    if (stats.registrations.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'WhatsApp', 'College', 'Branch', 'Year', 'UTM Source', 'Referred By', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...stats.registrations.map((r: any) => 
        [r.id, `"${r.name}"`, r.email, r.whatsapp, `"${r.college}"`, r.branch, r.grad_year, r.utm_source || '', r.referred_by || '', r.created_at].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buildLink = () => {
    let url = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    url += `/?utm_source=${utmSource}&utm_medium=partner&utm_campaign=college_outreach`;
    if (utmCollege) {
      url += `&college=${encodeURIComponent(utmCollege)}`; // Custom param for tracking
    }
    setGeneratedLink(url);
  };

  if (loading) return <div className="animate-pulse p-8">Loading dashboard data...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
        <button onClick={exportCSV} className="bg-bg-darker border border-border hover:border-primary text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export CSV
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
          <div className="text-muted text-sm font-medium mb-1">Total Registrations</div>
          <div className="text-4xl font-bold text-white flex items-baseline gap-2">
            {totalRegs} <span className="text-sm font-normal text-muted">/ {goal} target</span>
          </div>
          <div className="mt-4 h-2 bg-bg-darker rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl">
          <div className="text-muted text-sm font-medium mb-1">Check-in Rate</div>
          <div className="text-4xl font-bold text-white">
            {totalRegs > 0 ? Math.round((stats.registrations.filter((r:any) => r.attended).length / totalRegs) * 100) : 0}%
          </div>
          <div className="mt-4 text-xs text-muted">Will update during Phase E live mode</div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl">
          <div className="text-muted text-sm font-medium mb-1">Referral Conversions</div>
          <div className="text-4xl font-bold text-success">
            {stats.registrations.filter((r:any) => r.referred_by).length}
          </div>
          <div className="mt-4 text-xs text-muted">Users registered via a friend's link</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="bg-card border border-border p-6 rounded-xl lg:col-span-2">
          <h2 className="text-lg font-bold mb-4">Registration Trend (Day 1-7)</h2>
          <div className="h-72 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2B45" />
                  <XAxis dataKey="date" stroke="#9AA7BD" fontSize={12} />
                  <YAxis stroke="#9AA7BD" fontSize={12} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1F2B45' }} />
                  <Line type="monotone" dataKey="registrations" stroke="#1E6BFF" strokeWidth={3} dot={{ r: 4, fill: '#1E6BFF' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted border border-dashed border-border rounded-lg">No data points yet</div>
            )}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-card border border-border p-6 rounded-xl">
          <h2 className="text-lg font-bold mb-4">Top Sources</h2>
          <div className="space-y-4">
            {sourceData.length > 0 ? sourceData.map((src, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{src.name}</span>
                  <span className="font-bold">{src.count}</span>
                </div>
                <div className="h-2 bg-bg-darker rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${(src.count / totalRegs) * 100}%` }}></div>
                </div>
              </div>
            )) : <div className="text-muted text-sm text-center py-4">No sources tracked yet</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UTM Builder */}
        <div className="bg-card border border-border p-6 rounded-xl">
          <h2 className="text-lg font-bold mb-1">UTM Link Builder</h2>
          <p className="text-xs text-muted mb-4">Generate tracked links for outreach campaigns.</p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Channel (utm_source)</label>
              <select 
                value={utmSource} onChange={(e) => setUtmSource(e.target.value)}
                className="w-full bg-bg-darker border border-border rounded p-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="whatsapp">WhatsApp Group</option>
                <option value="instagram">Instagram Story</option>
                <option value="linkedin">LinkedIn Post</option>
                <option value="email">Email Blast</option>
                <option value="college_club">College Club</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Target College (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. VIT Vellore"
                value={utmCollege} onChange={(e) => setUtmCollege(e.target.value)}
                className="w-full bg-bg-darker border border-border rounded p-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <button onClick={buildLink} className="w-full bg-bg-darker border border-primary text-primary hover:bg-primary hover:text-white transition-colors py-2 rounded text-sm font-medium">
              Generate Link
            </button>
            {generatedLink && (
              <div className="mt-3 p-3 bg-bg-dark border border-border rounded text-xs text-muted break-all select-all">
                {generatedLink}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4">Branch Breakdown</h2>
            <div className="h-48">
              {branchData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1F2B45" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#9AA7BD" fontSize={11} width={80} />
                    <RechartsTooltip cursor={{fill: '#1F2B45'}} contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1F2B45' }} />
                    <Bar dataKey="count" fill="#3B82FF" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted border border-dashed border-border rounded-lg text-sm">No data</div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
