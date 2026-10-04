import { getShowcaseProjects } from '@/app/actions';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default async function ShowcasePage() {
  const projects = await getShowcaseProjects();

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-4">
            Wall of Fame
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Project Showcase</h1>
          <p className="text-muted">Incredible AI projects built by students in just 60 minutes.</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <h2 className="text-xl font-bold mb-2">No projects yet</h2>
            <p className="text-muted">Submit your project to be the first on the wall of fame!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p: any) => (
              <div key={p.id} className="bg-card border border-border hover:border-primary/50 transition-all rounded-2xl overflow-hidden flex flex-col group relative">
                
                {p.score_data?.total >= 90 && (
                  <div className="absolute top-0 right-0 bg-accent text-bg-dark text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-lg">
                    Top Builder 🏆
                  </div>
                )}
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg line-clamp-2 pr-4">{p.title}</h3>
                    <div className="w-12 h-12 shrink-0 rounded-full border-2 border-primary/30 flex items-center justify-center font-bold text-lg text-primary relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm"></div>
                      <span className="relative z-10">{p.score_data?.total || 0}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 line-clamp-3 mb-4">{p.description}</p>
                  
                  <div className="space-y-2 mt-auto">
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Top Strength</h4>
                    <p className="text-xs text-success bg-success/10 px-2 py-1 rounded line-clamp-2">
                      ✓ {p.score_data?.strengths?.[0] || 'Good effort'}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-bg-darker border-t border-border flex justify-between items-center mt-auto">
                  <div className="text-xs text-muted flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
                      {p.email.charAt(0).toUpperCase()}
                    </div>
                    {p.email.split('@')[0]}
                  </div>
                  <a 
                    href={p.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    View Project <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
