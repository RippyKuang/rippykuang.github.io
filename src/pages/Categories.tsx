import { Link } from 'react-router-dom';
import { CATEGORIES, POSTS } from '../data';
import { motion } from 'motion/react';
import { Folder } from 'lucide-react';
import { useState } from 'react';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

export default function Categories() {
  const [currentPage, setCurrentPage] = useState(1);

  const categoryData = CATEGORIES.map(category => {
    const posts = POSTS.filter(p => p.category === category);
    const latestDate = posts.length > 0 ? posts[0].date : '1970-01-01'; // POSTS are sorted
    return { category, count: posts.length, latestDate };
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
      className="max-w-3xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8">
        <h1 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-4">Categories</h1>
        <p className="text-2xl leading-relaxed font-serif italic text-[#1A1A1A]">Browse articles by folder</p>
      </header>

      <ul className="space-y-4">
        {currentCategories.map(item => {
          if (item.count === 0) return null;

          return (
            <motion.li 
              key={item.category}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link to={`/categories/${item.category}`} state={{ from: 'categories' }} className="flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-gray-300 hover:shadow-sm bg-white transition-all group">
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5 text-[#717171] group-hover:text-[#1A1A1A] transition-colors" />
                  <span className="text-lg font-medium tracking-tight text-[#1A1A1A]">{item.category}</span>
                  <span className="text-xs font-normal text-[#717171] bg-gray-100 px-2 rounded-full py-0.5">
                    {item.count} 篇
                  </span>
                </div>
                <div className="text-xs text-[#717171] font-mono">
                  更新于 {item.latestDate}
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </motion.div>
  );
}
