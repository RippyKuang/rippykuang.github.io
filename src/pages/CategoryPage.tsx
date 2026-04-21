import { useParams, Link, useLocation } from 'react-router-dom';
import { POSTS } from '../data';
import { motion } from 'motion/react';
import { ArrowLeft, Inbox, Folder } from 'lucide-react';
import { useMemo, useState } from 'react';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 6;

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  const fromCategories = location.state?.from === 'categories';
  const backToUrl = fromCategories ? '/categories' : '/';
  const backToText = fromCategories ? 'All Categories' : 'Back to Home';

  const categoryPosts = useMemo(() => {
    return POSTS.filter(p => p.category === category);
  }, [category]);

  const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);
  const currentPosts = categoryPosts.slice(
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
        <Link to={backToUrl} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors mb-6">
          <ArrowLeft className="w-3 h-3" />
          {backToText}
        </Link>
        <h1 className="text-3xl font-serif italic text-[#1A1A1A] flex items-center gap-3">
          <Folder className="w-6 h-6 text-[#717171]" />
          {category}
        </h1>
        <p className="text-[#717171] mt-4">
          Found {categoryPosts.length} article{categoryPosts.length !== 1 && 's'} in this category
        </p>
      </header>

      {categoryPosts.length > 0 ? (
        <>
          <div className="relative border-l border-gray-200 ml-4 space-y-10 py-4">
            {currentPosts.map(post => {
              const date = new Date(post.date);
              const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              return (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative pl-8 group"
                >
                  {/* Timeline dot */}
                  <div className="absolute w-3 h-3 bg-white border-2 border-gray-300 rounded-full -left-[6.5px] top-1.5 group-hover:border-[#1A1A1A] group-hover:bg-[#1A1A1A] transition-colors" />
                  
                  <Link to={`/post/${post.id}`} className="block relative inline-block">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <time className="text-xs font-mono text-[#717171] shrink-0 w-24">
                        {formattedDate}
                      </time>
                      <h3 className="text-xl font-serif italic text-[#1A1A1A] line-clamp-1 bg-gradient-to-r from-gray-300 to-gray-300 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
          
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center text-[#717171] space-y-4">
          <Inbox className="w-8 h-8 opacity-50" />
          <p className="italic font-serif">No articles found in this category.</p>
        </div>
      )}
    </motion.div>
  );
}
