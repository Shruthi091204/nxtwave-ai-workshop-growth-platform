import Link from 'next/link';
import { Logo } from './Navbar';

export function Footer() {
  return (
    <footer className="bg-bg-darker py-8 border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <Link href="/" className="mb-4 inline-block opacity-80 hover:opacity-100 transition-opacity">
          <Logo />
        </Link>
        <p className="text-muted text-sm mt-4">
          Campaign concept built for the NxtWave Growth Challenge.
        </p>
        <p className="text-muted text-xs mt-2">
          &copy; {new Date().getFullYear()} NxtWave Concept. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
