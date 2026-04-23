import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { POSTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, Hash, Folder } from 'lucide-react';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 10;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('p') || '1', 10);
  const [localQuery, setLocalQuery] = useState(query);
  const [currentPage, setCurrentPage] = useState(pageParam);

  // Sync local query if URL changes externally
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  // Sync state upward to URL when page changes
  useEffect(() => {
    if (currentPage !== pageParam) {
      const newParams = new URLSearchParams(searchParams);
      if (currentPage > 1) {
        newParams.set('p', currentPage.toString());
      } else {
        newParams.delete('p');
      }
      setSearchParams(newParams, { replace: true });
    }
  }, [currentPage, pageParam, searchParams, setSearchParams]);

  // Debounce search query to avoid breaking CJK IME composition
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== query) {
        const newParams = new URLSearchParams(searchParams);
        if (localQuery.trim()) {
          newParams.set('q', localQuery);
        } else {
          newParams.delete('q');
        }
        newParams.delete('p'); // Reset to page 1 on new search
        setSearchParams(newParams, { replace: true });
        setCurrentPage(1);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localQuery, query, searchParams, setSearchParams]);

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

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [query]);

  const totalPages = Math.ceil(results.length / POSTS_PER_PAGE);
  const currentPosts = results.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8">
        <h1 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-6">Search Results</h1>
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#717171]">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-md text-[#1A1A1A] placeholder-[#717171] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all"
            placeholder="Search articles or type #tag..."
            autoFocus
          />
        </div>
      </header>

      {query && (
        <div className="space-y-8 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#717171]">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          
          <div className="space-y-12 min-h-[300px]">
              {results.length > 0 ? (
                currentPosts.map(post => (
                  <article key={post.id} className="group flex flex-col gap-3">
                    <div className="flex justify-between items-baseline gap-4">
                      <Link to={`/post/${post.id}`} state={{ from: 'search', query, page: currentPage }} className="block relative inline-block">
                        <h3 className="text-xl font-serif italic text-[#1A1A1A] line-clamp-2 bg-gradient-to-r from-gray-300 to-gray-300 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                          {post.title}
                        </h3>
                      </Link>
                      <time className="text-xs font-mono text-[#717171] shrink-0">{post.date}</time>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap relative z-10">
                      <Link 
                        to={`/categories/${post.category}`}
                        className="text-[10px] bg-gray-100 px-3 py-1 rounded-full text-[#1A1A1A] uppercase tracking-wider shrink-0 font-medium hover:bg-gray-200 transition-colors"
                      >
                        {post.category}
                      </Link>
                      {post.tags?.slice(0, 3).map(tag => (
                        <Link 
                          to={`/tags/${tag}`} 
                          key={tag} 
                          className="text-[10px] border border-gray-200 px-3 py-1 rounded-full text-[#717171] uppercase tracking-wider shrink-0 transition-colors hover:bg-gray-50 hover:text-[#1A1A1A] hover:border-gray-300"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                    <Link to={`/post/${post.id}`} state={{ from: 'search', query, page: currentPage }} className="block">
                      <p className="text-sm text-[#717171] line-clamp-1 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </Link>
                  </article>
                ))
              ) : (
                <div className="py-20 text-center text-[#717171] italic font-serif">
                  No matching results found.
                </div>
              )}
          </div>
          
          {results.length > 0 && (
            <div className="pt-8 mt-8 border-t border-gray-100">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
