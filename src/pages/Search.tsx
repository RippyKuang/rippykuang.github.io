import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { POSTS } from '../data';
import { motion } from 'motion/react';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    return POSTS.filter(post => 
      post.title.toLowerCase().includes(q) || 
      post.excerpt.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8">
        <h1 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-6">Search</h1>
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#717171]">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-md text-[#1A1A1A] placeholder-[#717171] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all"
            placeholder="Search articles by title, content or excerpt..."
            autoFocus
          />
        </div>
      </header>

      {query && (
        <div className="space-y-8 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#717171]">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          
          <div className="space-y-8">
            {results.map(post => (
              <article key={post.id} className="group cursor-pointer">
                <Link to={`/post/${post.id}`} className="block">
                  <div className="flex justify-between items-baseline mb-2 gap-4">
                    <h3 className="text-xl group-hover:underline underline-offset-4 decoration-gray-300 transition-all font-serif italic text-[#1A1A1A]">
                      {post.title}
                    </h3>
                    <time className="text-xs font-mono text-[#717171] shrink-0">{post.date}</time>
                  </div>
                  <div className="flex gap-4 items-center mt-2">
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-[#717171] uppercase tracking-wider shrink-0">
                      {post.category}
                    </span>
                    <p className="text-sm text-[#717171] line-clamp-1">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
