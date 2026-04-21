import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { POSTS } from '../data';
import { Search, X, Hash, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Auto focus after a short delay to allow transition
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    let filtered = POSTS;
    if (q.startsWith('#')) {
      const tagSearch = q.slice(1).trim();
      filtered = filtered.filter(post => 
        post.tags?.some(t => t.toLowerCase().includes(tagSearch))
      );
    } else {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) ||
        post.content?.toLowerCase().includes(q)
      );
    }

    return filtered
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Limit to top 5 results for sleekness
  }, [query]);

  const handleSelect = (id: string) => {
    navigate(`/post/${id}`);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (Darkened / Blurred) */}
      <div 
        className="fixed inset-0 bg-[#FCFCFA]/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Command Palette Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
        <div 
          className="w-full max-w-xl bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden pointer-events-auto border border-gray-100 flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          {/* Search Input Area */}
          <div className="flex items-center px-4 py-4 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent px-4 py-2 outline-none text-[#1A1A1A] placeholder-gray-400 font-sans"
              placeholder="Search articles or type #tag..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={onClose}
              className="px-2 py-1 bg-gray-100 rounded text-[10px] uppercase tracking-wider text-gray-500 hover:bg-gray-200 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto w-full">
            {query.length > 0 ? (
              <div className="p-2 w-full">
                {results.length > 0 ? (
                  <ul className="space-y-1 w-full">
                    <AnimatePresence mode="popLayout">
                      {results.map((post, idx) => (
                        <motion.li 
                          key={post.id} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15, delay: idx * 0.03 }}
                          className="w-full"
                        >
                          <button 
                            onClick={() => handleSelect(post.id)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex flex-col gap-1 w-full">
                              <span className="text-[#1A1A1A] font-medium transition-colors group-hover:text-blue-600 line-clamp-1">{post.title}</span>
                              <div className="flex items-center gap-3 text-xs text-gray-400 w-full">
                                <span className="flex items-center gap-1 shrink-0"><Folder className="w-3 h-3" /> {post.category}</span>
                                <span className="truncate">{post.excerpt}</span>
                              </div>
                            </div>
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                ) : (
                  <div className="px-6 py-12 text-center text-sm text-gray-500">
                    No results found for "<span className="text-[#1A1A1A]">{query}</span>"
                  </div>
                )}
                {query.length > 0 && results.length > 0 && (
                  <div className="text-center py-2 mt-2 border-t border-gray-100 text-xs text-gray-400">
                    Press <span className="font-semibold text-gray-500">Enter</span> to see all results
                  </div>
                )}
              </div>
            ) : (
              // Default view slightly guided
              <div className="px-6 py-8 text-center flex flex-col items-center gap-2 text-sm text-gray-400">
                <Search className="w-8 h-8 text-gray-200 mb-2" />
                <p>Start typing to search your digital garden...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
