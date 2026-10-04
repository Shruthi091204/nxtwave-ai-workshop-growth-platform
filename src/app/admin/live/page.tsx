"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLivePage() {
  const [liveState, setLiveState] = useState({ current_step: 'Waiting', countdown_end: null as string | null, active_poll_id: null as string | null });
  const [helpRequests, setHelpRequests] = useState<any[]>([]);
  const [activePoll, setActivePoll] = useState<any>(null);
  const [pollVotes, setPollVotes] = useState<Record<number, number>>({});

  // Form states
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpts, setPollOpts] = useState('Yes, No');
  const [timerMins, setTimerMins] = useState('5');

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    const fetchInitial = async () => {
      // Fetch live state
      const { data: stateData } = await supabase.from('live_state').select('*').eq('id', 1).single();
      if (stateData) setLiveState(stateData);

      // Fetch help requests
      const { data: helpData } = await supabase.from('help_requests').select('*').order('created_at', { ascending: false });
      if (helpData) setHelpRequests(helpData);

      // If active poll, fetch it and its votes
      if (stateData?.active_poll_id) {
        fetchPollData(stateData.active_poll_id);
      }
    };
    fetchInitial();

    // Subscribe to help requests
    const channel = supabase.channel('admin-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'help_requests' }, (payload) => {
        setHelpRequests(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'help_requests' }, (payload) => {
        setHelpRequests(prev => prev.map(req => req.id === payload.new.id ? payload.new : req));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes' }, (payload) => {
        // Simple increment for votes
        setPollVotes(prev => ({
          ...prev,
          [payload.new.option_index]: (prev[payload.new.option_index] || 0) + 1
        }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_state' }, (payload) => {
        setLiveState(payload.new as any);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPollData = async (pollId: string) => {
    const { data: poll } = await supabase.from('polls').select('*').eq('id', pollId).single();
    if (poll) {
      setActivePoll(poll);
      const { data: votes } = await supabase.from('poll_votes').select('option_index').eq('poll_id', pollId);
      const voteCounts: Record<number, number> = {};
      votes?.forEach(v => {
        voteCounts[v.option_index] = (voteCounts[v.option_index] || 0) + 1;
      });
      setPollVotes(voteCounts);
    }
  };

  const updateStep = async (step: string) => {
    await supabase.from('live_state').update({ current_step: step }).eq('id', 1);
  };

  const startTimer = async () => {
    const mins = parseInt(timerMins);
    if (!mins) return;
    const end = new Date(Date.now() + mins * 60000).toISOString();
    await supabase.from('live_state').update({ countdown_end: end }).eq('id', 1);
  };

  const clearTimer = async () => {
    await supabase.from('live_state').update({ countdown_end: null }).eq('id', 1);
  };

  const launchPoll = async () => {
    const options = pollOpts.split(',').map(s => s.trim());
    if (!pollQuestion || options.length < 2) return alert("Enter question and at least 2 options.");
    
    // Create poll
    const { data: newPoll } = await supabase.from('polls').insert([{ question: pollQuestion, options }]).select().single();
    if (newPoll) {
      await supabase.from('live_state').update({ active_poll_id: newPoll.id }).eq('id', 1);
      setActivePoll(newPoll);
      setPollVotes({});
      setPollQuestion('');
    }
  };

  const stopPoll = async () => {
    if (!activePoll) return;
    await supabase.from('polls').update({ is_active: false }).eq('id', activePoll.id);
    await supabase.from('live_state').update({ active_poll_id: null }).eq('id', 1);
    setActivePoll(null);
  };

  const markHelpSolved = async (id: string) => {
    await supabase.from('help_requests').update({ status: 'solved' }).eq('id', id);
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <div className="p-8 text-center">Supabase must be connected for Live mode.</div>;
  }

  const steps = ['Waiting', 'Setup', 'Build', 'Deploy', 'Showcase'];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Host Live Controls</h1>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Current Step */}
          <div className="bg-card border border-border p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4">Workshop Step</h2>
            <div className="flex flex-wrap gap-3">
              {steps.map(step => (
                <button
                  key={step}
                  onClick={() => updateStep(step)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${liveState.current_step === step ? 'bg-primary text-white shadow-[0_0_15px_rgba(30,107,255,0.4)]' : 'bg-bg-darker border border-border hover:border-primary text-muted'}`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {/* Timer & Polls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-6 rounded-xl">
              <h2 className="text-lg font-bold mb-4">Countdown Timer</h2>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={timerMins} 
                  onChange={e => setTimerMins(e.target.value)}
                  className="w-20 bg-bg-darker border border-border rounded p-2 text-white outline-none focus:border-primary text-center"
                />
                <span className="py-2 text-muted">mins</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={startTimer} className="flex-1 bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium">Start</button>
                <button onClick={clearTimer} className="flex-1 bg-bg-darker border border-border hover:border-red-500 text-muted hover:text-red-400 py-2 rounded font-medium">Clear</button>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl">
              <h2 className="text-lg font-bold mb-4">Live Poll</h2>
              {activePoll ? (
                <div>
                  <p className="font-medium mb-3">{activePoll.question}</p>
                  <div className="space-y-2 mb-4">
                    {activePoll.options.map((opt: string, i: number) => {
                      const votes = pollVotes[i] || 0;
                      const total = Object.values(pollVotes).reduce((a, b) => a + b, 0) || 1;
                      const pct = Math.round((votes / total) * 100);
                      return (
                        <div key={i} className="relative bg-bg-darker rounded overflow-hidden p-2 text-sm flex justify-between z-10">
                          <div className="absolute top-0 left-0 h-full bg-primary/30 -z-10" style={{ width: `${pct}%` }}></div>
                          <span>{opt}</span>
                          <span className="font-bold">{votes} ({pct}%)</span>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={stopPoll} className="w-full bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white py-2 rounded font-medium transition-colors">End Poll</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input type="text" placeholder="Question?" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} className="w-full bg-bg-darker border border-border rounded p-2 text-sm text-white outline-none focus:border-primary" />
                  <input type="text" placeholder="Options (comma separated)" value={pollOpts} onChange={e => setPollOpts(e.target.value)} className="w-full bg-bg-darker border border-border rounded p-2 text-sm text-white outline-none focus:border-primary" />
                  <button onClick={launchPoll} className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium">Launch Poll</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Q&A / Stuck Queue */}
        <div className="bg-card border border-border rounded-xl flex flex-col h-[600px]">
          <div className="p-4 border-b border-border bg-bg-darker rounded-t-xl flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Stuck Queue
            </h2>
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-bold">
              {helpRequests.filter(r => r.status === 'pending').length}
            </span>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {helpRequests.length === 0 ? (
              <div className="text-center text-muted text-sm mt-10">No help requests yet.</div>
            ) : (
              helpRequests.map(req => (
                <div key={req.id} className={`p-3 rounded-lg border ${req.status === 'solved' ? 'bg-bg-darker/50 border-border opacity-60' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm truncate pr-2">{req.name}</span>
                    <span className="text-xs text-muted whitespace-nowrap">
                      {new Date(req.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{req.note}</p>
                  {req.status === 'pending' && (
                    <button onClick={() => markHelpSolved(req.id)} className="text-xs bg-bg-darker border border-border hover:border-success text-muted hover:text-success px-3 py-1 rounded transition-colors">
                      Mark Solved
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
