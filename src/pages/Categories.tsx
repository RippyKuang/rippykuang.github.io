import { Link } from 'react-router-dom';
import { CATEGORIES, POSTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 8;

export default function Categories() {
  const [currentPage, setCurrentPage] = useState(1);

  const categoryData = CATEGORIES.map(category => {
    const posts = POSTS.filter(p => p.category === category);
    const latestDate = posts.length > 0 ? posts[0].date : '1970-01-01'; // POSTS are sorted
    return { 
      category, 
      count: posts.length, 
      latestDate,
      latestPostTitle: posts.length > 0 ? posts[0].title : 'No articles yet'
    };
  }).sort((a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime());

  const totalPages = Math.ceil(categoryData.length / ITEMS_PER_PAGE);
  const currentCategories = categoryData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-4">Categories</h1>
          <p className="text-2xl leading-relaxed font-serif italic text-[#1A1A1A]">Index of all topics</p>
        </div>
        <p className="text-xs text-[#717171] font-mono mb-1">
          {categoryData.length} DIRECTORIES
        </p>
      </header>

      <div className="space-y-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul 
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            {/* Header row for desktop */}
            <li className="hidden sm:flex text-[10px] uppercase tracking-widest text-[#717171] pb-4 border-b border-gray-100 items-center">
              <div className="w-1/3">Folder</div>
              <div className="flex-1 pr-4">Latest Entry</div>
              <div className="flex items-center w-full sm:w-auto shrink-0 gap-6">
                <div className="w-24 text-right">Items</div>
                <div className="w-24 text-right">Updated</div>
                <div className="w-8"></div>
              </div>
            </li>

            {currentCategories.map((item, idx) => {
              if (item.count === 0) return null;
              
              const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;

              return (
                <motion.li 
                  key={item.category}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link 
                    to={`/categories/${item.category}`} 
                    state={{ from: 'categories', page: currentPage }}
                    className="group flex flex-col sm:flex-row sm:items-center py-6 sm:py-5 border-b border-gray-100/60 hover:border-[#1A1A1A] transition-colors relative"
                  >
                    <div className="flex items-center gap-4 sm:w-1/3">
                      <h2 className="text-xl sm:text-2xl font-serif italic text-[#1A1A1A] group-hover:translate-x-2 transition-transform duration-300">
                        {item.category}
                      </h2>
                    </div>
                    
                    <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-0 ml-8 sm:ml-0 gap-2 sm:gap-4">
                      <div className="text-sm text-[#717171] flex-1 line-clamp-1 group-hover:text-[#1A1A1A] transition-colors pr-4">
                        {item.latestPostTitle}
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto shrink-0 gap-6">
                        <span className="text-xs text-[#717171] font-mono sm:w-24 sm:text-right">
                          <span className="sm:hidden mr-1">Count:</span>{item.count}
                        </span>
                        <span className="text-xs text-[#717171] font-mono sm:w-24 text-right">
                          {item.latestDate}
                        </span>
                        <div className="hidden sm:flex w-8 justify-end">
                          <ArrowRight className="w-4 h-4 text-[#1A1A1A] -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>

        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </motion.div>
  );
}
