"use client"
import { useEffect, useState } from 'react';
import { getReferralStats } from '@/app/actions';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ThankYouPage() {
  const [refCode, setRefCode] = useState<string>('');
  const [referredCount, setReferredCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem('my_referral_code') || 'DEMO12';
    setRefCode(code);
    
    if (code !== 'DEMO12') {
      getReferralStats(code).then(res => {
        if (res.success) setReferredCount(res.count);
      });
    }
  }, []);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${refCode}` : '';
  const shareMessage = `Hey! I'm joining the free 'Build Your First AI Project in 60 Minutes' live workshop by NxtWave. Join me here: ${shareUrl}`;

  const trackShare = (platform: string) => {
    supabase.from('events').insert([{ type: 'share_click', meta: { platform, refCode } }]).then(({ error }) => { if (error) console.error(error); });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    trackShare('copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const getCalendarLink = () => {
    const event = {
      title: 'Build Your First AI Project in 60 Minutes | NxtWave',
      details: 'Free live workshop. Join via the link sent to your email.',
      location: 'Online',
      dates: '20261010T113000Z/20261010T123000Z' // Example date
    };
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&dates=${event.dates}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Registration Successful!</h1>
          <p className="text-lg text-muted">Your spot is secured. Check your email for further instructions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
          {/* Action Cards */}
          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center">
            <svg className="w-8 h-8 text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <h3 className="font-bold text-lg mb-2">Add to Calendar</h3>
            <p className="text-sm text-muted mb-4">Don't miss the live session. Get a reminder before it starts.</p>
            <a 
              href={getCalendarLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-bg-darker border border-primary text-primary hover:bg-primary hover:text-white transition-colors w-full py-2 rounded-lg font-medium"
            >
              Google Calendar
            </a>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center">
            <svg className="w-8 h-8 text-[#25D366] mb-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <h3 className="font-bold text-lg mb-2">Join the Community</h3>
            <p className="text-sm text-muted mb-4">Get pre-workshop materials and network with peers.</p>
            <a 
              href={process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20b858] text-white transition-colors w-full py-2 rounded-lg font-medium"
            >
              Join WhatsApp Group
            </a>
          </div>
        </div>

        {/* Referral Loop Section */}
        <div className="w-full bg-card border border-border p-6 md:p-10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Unlock the AI Template Pack</h2>
            <p className="text-muted">Refer 3 friends to unlock: AI project templates pack + priority Q&A</p>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-bg-darker p-6 rounded-xl border border-border">
            <div className="text-center md:text-left flex-grow">
              <div className="text-sm text-muted mb-1">Your referral progress</div>
              <div className="text-3xl font-bold text-white flex items-end gap-2 justify-center md:justify-start">
                {referredCount} <span className="text-lg font-normal text-muted mb-1">/ 3 friends</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between text-xs mb-2">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span className="text-accent font-bold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.277c1.78.337 3 2.11 3 4.14v3.13l1.87 2.174c.264.306.012.783-.396.783H4.776c-.408 0-.66-.477-.396-.783l1.87-2.174v-3.13c0-2.03 1.22-3.803 3-4.14V2.75A.75.75 0 0110 2zm1 14.5h-2a1 1 0 002 0z" clipRule="evenodd"></path></svg>
                  Goal
                </span>
              </div>
              <div className="h-3 bg-card rounded-full overflow-hidden w-full relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: `${Math.min(100, (referredCount / 3) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackShare('whatsapp')}
              className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Share on WhatsApp
            </a>
            
            <a
              href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackShare('linkedin')}
              className="flex-1 bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Share on LinkedIn
            </a>

            <button
              onClick={handleCopy}
              className="flex-1 bg-bg-darker border border-border hover:border-primary text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
          <div className="text-center mt-6 text-sm text-muted">
            Your unique referral link: <span className="text-white bg-bg-darker px-2 py-1 rounded select-all">{shareUrl}</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
