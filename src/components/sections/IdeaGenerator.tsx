"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

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
    
    supabase.from('events').insert([{ type: 'ai_tool_used', meta: { tool: 'idea_generator', branch, interest } }]).then(({ error }) => { if (error) console.error(error); });

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch, interest })
      });

      if (!res.ok) throw new Error('Failed to fetch ideas');

      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (err) {
      setError("We're having trouble connecting to the AI. Here are some fallback ideas instead.");
      setIdeas([
        { title: "AI Resume Scanner", description: "Matches resumes to job descriptions using semantic search." },
        { title: "Smart Study Bot", description: "Creates interactive quizzes from uploaded lecture notes." },
        { title: "Finance Categorizer", description: "Tags and categorizes expenses using natural language processing." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-bg-darker border-y border-border/20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
            <span className="text-sm font-bold tracking-widest uppercase">AI Powered</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Generate your project idea</h2>
          <p className="text-muted text-xl max-w-2xl mx-auto">Tell us what you study and what you love, and our AI will suggest the perfect project for you to build at the workshop.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card/60 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-2xl relative"
        >
          <div className="bg-bg-darker/50 rounded-[1.8rem] p-6 md:p-8 flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-bold text-white mb-2 ml-1">Your Branch</label>
              <select 
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="CSE/IT" className="bg-bg-dark">CSE / IT</option>
                <option value="ECE" className="bg-bg-dark">ECE / EEE</option>
                <option value="Mechanical" className="bg-bg-dark">Mechanical / Civil</option>
                <option value="Other" className="bg-bg-dark">Other</option>
              </select>
            </div>

            <div className="w-full md:w-1/2">
              <label className="block text-sm font-bold text-white mb-2 ml-1">What are you interested in?</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Sports, Finance, Healthcare, Gaming"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateIdeas()}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted/50"
                />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <button 
                onClick={generateIdeas}
                disabled={isLoading}
                className="w-full md:w-auto bg-primary hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:bg-primary/50 text-bg-darker font-black py-4 px-8 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 whitespace-nowrap transform active:scale-95"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Generate Ideas
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center mt-6 font-medium bg-red-500/10 py-3 rounded-lg border border-red-500/20 max-w-2xl mx-auto">
            {error}
          </motion.p>
        )}

        <AnimatePresence>
          {ideas.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ideas.map((idea, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="bg-card/40 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-card hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,229,255,0.1)]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 text-primary flex items-center justify-center mb-6 text-xl font-black group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-2xl mb-4 text-white leading-tight">{idea.title}</h3>
                    <p className="text-muted text-base leading-relaxed">{idea.description}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 text-center"
              >
                <a 
                  href="#register" 
                  className="inline-flex items-center justify-center gap-3 relative group"
                >
                  <span className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors rounded-full"></span>
                  <span className="relative border-2 border-primary text-primary hover:bg-primary hover:text-bg-darker font-black text-lg py-4 px-10 rounded-2xl transition-all duration-300 transform group-hover:scale-105">
                    Build this live in the workshop →
                  </span>
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
