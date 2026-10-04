"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  const [seatsClaimed, setSeatsClaimed] = useState(240); // Will connect to DB in Phase B
  const totalSeats = 500;
  
  // Calculate percentage
  const percentage = Math.min(100, Math.round((seatsClaimed / totalSeats) * 100));

  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full relative z-10"
      >
        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Free Live Workshop
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
          Build Your First AI Project <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-hover to-accent">
            in 60 Minutes
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          A hands-on, live session designed exclusively for final-year engineering students. No prior AI experience needed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted/90 mb-12 text-sm md:text-base font-medium">
          <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-border/60">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span>Saturday, 5:00 PM IST</span>
          </div>
          <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-border/60">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span>Live Online</span>
          </div>
        </div>

        <div className="bg-card/40 backdrop-blur-md border border-border/50 p-6 rounded-2xl w-full max-w-md mx-auto mb-10 shadow-2xl">
          <div className="flex justify-between items-end mb-3 text-sm">
            <span className="text-muted"><strong className="text-white text-xl font-bold">{seatsClaimed}</strong> / {totalSeats} seats claimed</span>
            <span className="text-accent font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>
              Filling fast!
            </span>
          </div>
          <div className="w-full bg-bg-darker/80 rounded-full h-3 overflow-hidden border border-border/30">
            <motion.div 
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            ></motion.div>
          </div>
        </div>

        <a 
          href="#register" 
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-bg-dark bg-primary rounded-xl overflow-hidden transition-transform hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-hover to-primary"></div>
          <div className="absolute bottom-0 left-0 h-1/3 w-full bg-white/20 blur-md"></div>
          <span className="relative z-10 flex items-center gap-2 text-lg">
            Claim Your Free Spot
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
        </a>
      </motion.div>
    </section>
  );
}
