"use client"
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';

type LiveState = {
  current_step: string;
  countdown_end: string | null;
  active_poll_id: string | null;
};

type Reaction = { id: string; emoji: string; x: number };

export default function LiveStudentPage() {
  const [email, setEmail] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);
  const [liveState, setLiveState] = useState<LiveState>({ current_step: 'Waiting', countdown_end: null, active_poll_id: null });
  const [timeRemaining, setTimeRemaining] = useState('');
  
  const [poll, setPoll] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  const [stuckNote, setStuckNote] = useState('');
  const [showStuckModal, setShowStuckModal] = useState(false);
  
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Subscribe to Live State & Polls & Reactions
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    // Fetch initial state
    supabase.from('live_state').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setLiveState(data);
    });

    // Realtime channel
    const channel = supabase.channel('workshop-room')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_state' }, (payload) => {
        setLiveState(payload.new as LiveState);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, (payload) => {
        if (payload.new && (payload.new as any).is_active) {
          setPoll(payload.new);
          setHasVoted(false);
        } else {
          setPoll(null);
        }
      })
      .on('broadcast', { event: 'reaction' }, (payload) => {
        // Spawn reaction
        const newReaction = { id: Math.random().toString(), emoji: payload.payload.emoji, x: Math.random() * 80 + 10 };
        setReactions(prev => [...prev, newReaction]);
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== newReaction.id));
        }, 2000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Fetch active poll if exists
  useEffect(() => {
    if (liveState.active_poll_id) {
      supabase.from('polls').select('*').eq('id', liveState.active_poll_id).single().then(({ data }) => {
        if (data) setPoll(data);
      });
    } else {
      setPoll(null);
    }
  }, [liveState.active_poll_id]);

  // Countdown timer
  useEffect(() => {
    if (!liveState.countdown_end) {
      setTimeRemaining('');
      return;
    }
    const interval = setInterval(() => {
      const diff = new Date(liveState.countdown_end!).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeRemaining('00:00');
        clearInterval(interval);
      } else {
        const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
        const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
        setTimeRemaining(`${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [liveState.countdown_end]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('registrations').update({ attended: true }).eq('email', email);
    }
    setCheckedIn(true);
    localStorage.setItem('workshop_email', email);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('workshop_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setCheckedIn(true);
    }
  }, []);

  const sendReaction = (emoji: string) => {
    supabase.channel('workshop-room').send({
      type: 'broadcast',
      event: 'reaction',
      payload: { emoji }
    });
    // Add locally immediately for responsiveness
    const newReaction = { id: Math.random().toString(), emoji, x: Math.random() * 80 + 10 };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => { setReactions(prev => prev.filter(r => r.id !== newReaction.id)); }, 2000);
  };

  const submitHelpRequest = async () => {
    if (!stuckNote) return;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('help_requests').insert([{ email, name: email.split('@')[0], note: stuckNote }]);
    }
    setStuckNote('');
    setShowStuckModal(false);
    alert('Instructor notified! Someone will help you shortly.');
  };

  const votePoll = async (index: number) => {
    if (hasVoted || !poll) return;
    setHasVoted(true);
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('poll_votes').insert([{ poll_id: poll.id, email, option_index: index }]);
    }
  };

  if (!checkedIn) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
        <div className="bg-card p-8 rounded-2xl border border-border max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Workshop Check-In</h1>
          <p className="text-muted mb-6">Enter your registered email to join the live session.</p>
          <form onSubmit={handleCheckIn} className="space-y-4">
            <input 
              type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors">
              Enter Live Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-darker flex flex-col relative overflow-hidden" ref={containerRef}>
      <Navbar />
      
      {/* Floating Reactions Layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {reactions.map(r => (
            <motion.div
              key={r.id}
              initial={{ opacity: 1, y: '100vh', x: `${r.x}vw`, scale: 1 }}
              animate={{ opacity: 0, y: '-10vh', scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute text-4xl"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <main className="flex-grow pt-24 pb-32 px-4 sm:px-6 max-w-lg mx-auto w-full flex flex-col gap-6">
        {/* Status Card */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Live</span>
          </div>
          <h2 className="text-muted text-sm uppercase tracking-wider mb-1">Current Step</h2>
          <div className="text-3xl font-bold text-white mb-4">{liveState.current_step}</div>
          
          {timeRemaining && (
            <div className="inline-block bg-bg-darker border border-border px-6 py-3 rounded-xl">
              <div className="text-xs text-muted mb-1">Time Remaining</div>
              <div className="text-4xl font-mono font-bold text-accent">{timeRemaining}</div>
            </div>
          )}
        </div>

        {/* Live Poll */}
        {poll && (
          <div className="bg-card border border-primary/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(30,107,255,0.15)] relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Live Poll
            </div>
            <h3 className="text-lg font-bold mt-2 mb-4 text-center">{poll.question}</h3>
            <div className="space-y-3">
              {poll.options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => votePoll(idx)}
                  disabled={hasVoted}
                  className={`w-full py-3 px-4 rounded-xl border text-left font-medium transition-all ${
                    hasVoted ? 'bg-bg-darker border-border text-muted cursor-not-allowed' : 'bg-bg-darker border-border hover:border-primary text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {hasVoted && <p className="text-center text-sm text-success mt-4">Vote recorded!</p>}
          </div>
        )}

      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border p-4 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={() => setShowStuckModal(true)}
            className="flex-1 bg-bg-darker border border-red-500/50 text-red-400 hover:bg-red-500/10 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            I'm Stuck
          </button>
          
          <div className="flex gap-2">
            <button onClick={() => sendReaction('🔥')} className="w-12 h-12 bg-bg-darker border border-border rounded-full flex items-center justify-center text-xl hover:bg-border transition-colors">
              🔥
            </button>
            <button onClick={() => sendReaction('👏')} className="w-12 h-12 bg-bg-darker border border-border rounded-full flex items-center justify-center text-xl hover:bg-border transition-colors">
              👏
            </button>
          </div>
        </div>
      </div>

      {/* Stuck Modal */}
      {showStuckModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-sm">
            <h3 className="text-xl font-bold mb-2">Need help?</h3>
            <p className="text-sm text-muted mb-4">Briefly describe where you are stuck.</p>
            <textarea 
              value={stuckNote} onChange={e => setStuckNote(e.target.value)}
              className="w-full bg-bg-darker border border-border rounded-lg p-3 text-white focus:ring-1 focus:ring-primary outline-none mb-4 h-24 resize-none"
              placeholder="e.g. My API key is throwing a 401 error"
            ></textarea>
            <div className="flex gap-3">
              <button onClick={() => setShowStuckModal(false)} className="flex-1 py-2 text-muted hover:text-white">Cancel</button>
              <button onClick={submitHelpRequest} className="flex-1 bg-primary text-white py-2 rounded-lg font-medium">Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
