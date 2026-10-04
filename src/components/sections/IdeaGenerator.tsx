"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Idea = { title: string; description: string };

export function IdeaGenerator() {
  const [branch, setBranch] = useState('CSE/IT');
  const [interest, setInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [error, setError] = useState('');

  const generateIdeas = async () => {
    if (!interest.trim()) {
      setError("Please enter what you're interested in.");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Track usage
    supabase.from('events').insert([{ type: 'ai_tool_used', meta: { tool: 'idea_generator', branch, interest } }]).catch(() => {});

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch, interest })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch ideas');
      }

      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (err) {
      setError("We're having trouble connecting to the AI. Here are some fallback ideas instead.");
      // In a real scenario we could serve fallback client side, but the server route handles the fallback.
      // If the server route is fully down, we catch it here.
      setIdeas([
        { title: "AI Resume Scanner", description: "Matches resumes to job descriptions." },
        { title: "Smart Study Bot", description: "Creates quizzes from lecture notes." },
        { title: "Finance Categorizer", description: "Tags expenses using NLP." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-bg-dark border-y border-border px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Get your AI project idea in 10 seconds</h2>
          <p className="text-muted">Not sure what to build? Tell us your branch and interests.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="w-full md:w-1/3 z-10">
            <label className="block text-sm font-medium text-muted mb-2">Your Branch</label>
            <select 
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
            >
              <option value="CSE/IT">CSE / IT</option>
              <option value="ECE">ECE / EEE</option>
              <option value="Mechanical">Mechanical / Civil</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="w-full md:w-1/2 z-10">
            <label className="block text-sm font-medium text-muted mb-2">What are you interested in?</label>
            <input 
              type="text" 
              placeholder="e.g. Sports, Finance, Healthcare, Gaming"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateIdeas()}
              className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="w-full md:w-auto z-10">
            <button 
              onClick={generateIdeas}
              disabled={isLoading}
              className="w-full md:w-auto bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-3 px-6 rounded-lg transition-colors flex justify-center items-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Generate Ideas
                </>
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}

        {ideas.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ideas.map((idea, idx) => (
                <div key={idx} className="bg-bg-darker border border-border p-6 rounded-xl hover:border-primary/50 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{idea.title}</h3>
                  <p className="text-muted text-sm">{idea.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a 
                href="#register" 
                className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Build this live in the workshop. Register free.
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
