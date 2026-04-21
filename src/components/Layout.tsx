import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Github, Mail, Search } from 'lucide-react';
import { ABOUT_ME } from '../data';
import { useState, useEffect } from 'react';
import CommandPalette from './CommandPalette';

export default function Layout() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-gray-200 bg-[#FCFCFA] text-[#1A1A1A]">
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <header className="w-full max-w-6xl mx-auto px-6 md:px-12 py-8 flex justify-between items-center border-b border-gray-100 bg-[#FCFCFA]/80 backdrop-blur-sm sticky top-0 z-10">
        <Link to="/" className="text-xl font-medium tracking-tight hover:opacity-80 transition-opacity shrink-0">
          {ABOUT_ME.name.split(' ')[0]}
        </Link>
        <nav className="flex items-center gap-4 md:gap-8 text-sm text-[#717171] uppercase tracking-widest overflow-x-auto whitespace-nowrap scrollbar-hide pb-2 sm:pb-0 w-full sm:w-auto ml-6 sm:ml-0">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "hover:text-[#1A1A1A] transition-colors pb-1",
                location.pathname === link.path && "text-[#1A1A1A] border-b border-[#1A1A1A]"
              )}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-[#1A1A1A] transition-colors pb-1 flex items-center justify-center p-1"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-10">
        <Outlet />
      </main>

      <footer className="w-full max-w-6xl mx-auto px-6 md:px-12 py-6 border-t border-gray-100 bg-[#FCFCFA] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-[#717171] mt-auto">
        <div className="text-center sm:text-left">© {new Date().getFullYear()} {ABOUT_ME.name} — Built with Minimalist Intent</div>
        <div className="flex gap-6 items-center">
          <a href={ABOUT_ME.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A]">
            <Github className="w-4 h-4" />
          </a>
          <a href={`mailto:${ABOUT_ME.email}`} className="hover:text-[#1A1A1A]">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
