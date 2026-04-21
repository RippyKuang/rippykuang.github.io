import { useParams, Link, useSearchParams } from 'react-router-dom';
import { POSTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Inbox, Hash } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 6;

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('p') || '1', 10);
  const [currentPage, setCurrentPage] = useState(pageParam);

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

  const tagPosts = useMemo(() => {
    return POSTS.filter(p => p.tags && p.tags.includes(tag!));
  }, [tag]);

  const totalPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);
  const currentPosts = tagPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors mb-6">
          <ArrowLeft className="w-3 h-3" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-serif italic text-[#1A1A1A] flex items-center gap-3">
          <Hash className="w-6 h-6 text-[#717171]" />
          {tag}
        </h1>
        <p className="text-[#717171] mt-4">
          Found {tagPosts.length} article{tagPosts.length !== 1 && 's'} tagged with "{tag}"
        </p>
      </header>

      {tagPosts.length > 0 ? (
        <div className="space-y-12">
          {currentPosts.map(post => (
            <article key={post.id} className="group flex flex-col gap-3">
              <div className="flex justify-between items-baseline gap-4">
                <Link to={`/post/${post.id}`} state={{ from: 'tag', tag, page: currentPage }} className="block relative inline-block">
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
                {post.tags?.slice(0, 3).map(t => (
                  <Link 
                    to={`/tags/${t}`} 
                    key={t} 
                    className="text-[10px] border border-gray-200 px-3 py-1 rounded-full text-[#717171] uppercase tracking-wider shrink-0 transition-colors hover:bg-gray-50 hover:text-[#1A1A1A] hover:border-gray-300"
                  >
                    {t}
                  </Link>
                ))}
              </div>
              <Link to={`/post/${post.id}`} state={{ from: 'tag', tag, page: currentPage }} className="block">
                <p className="text-sm text-[#717171] line-clamp-1 leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            </article>
          ))}
          
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center text-[#717171] space-y-4">
          <Inbox className="w-8 h-8 opacity-50" />
          <p className="italic font-serif">No articles found for this tag.</p>
        </div>
      )}
    </motion.div>
  );
}
