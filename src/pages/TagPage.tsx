import { useParams, Link } from 'react-router-dom';
import { POSTS } from '../data';
import { motion } from 'motion/react';
import { ArrowLeft, Inbox, Hash } from 'lucide-react';
import { useMemo, useState } from 'react';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 6;

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const [currentPage, setCurrentPage] = useState(1);

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
            <article key={post.id} className="group cursor-pointer">
              <Link to={`/post/${post.id}`} className="block">
                <div className="flex justify-between items-baseline mb-2 gap-4">
                  <h3 className="text-xl group-hover:underline underline-offset-4 decoration-gray-300 transition-all font-serif italic text-[#1A1A1A] line-clamp-2">
                    {post.title}
                  </h3>
                  <time className="text-xs font-mono text-[#717171] shrink-0">{post.date}</time>
                </div>
                <div className="flex gap-4 items-center mb-3">
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-[#717171] uppercase tracking-wider shrink-0">
                    {post.category}
                  </span>
                  {post.tags?.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] border border-gray-200 px-2 py-0.5 rounded text-[#717171] uppercase tracking-wider shrink-0">
                      #{t}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#717171] line-clamp-1">
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
