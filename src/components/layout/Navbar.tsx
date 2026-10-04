"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  const [error, setError] = useState(false);

  if (error) {
    return <span className="text-xl font-bold text-white">NxtWave</span>;
  }

  return (
    <Image
      src="/nxtwave.webp"
      alt="NxtWave Logo"
      width={120}
      height={32}
      className="h-8 w-auto object-contain"
      onError={() => setError(true)}
      priority
    />
  );
}

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-sm font-medium text-muted hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/live" className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Room
            </Link>
            <Link 
              href="/#register" 
              className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
