import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ABOUT_ME, TECH_STACK, POSTS, CATEGORIES, TAGS } from '../data';
import { cn } from '../lib/utils';
// 1. 修复：通常使用 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'; 
import { parseDate, getArchiveLabel, getLatestOneYearRange } from '../lib/dateUtils';
// 2. 修复：添加缺失的 Mail 和 Github 导入
import { ChevronRight, Archive, Inbox, Mail, Github } from 'lucide-react'; 
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 6;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    let posts = activeCategory 
      ? POSTS.filter(post => post.category === activeCategory)
      : POSTS;
    return posts;
  }, [activeCategory]);

  const recentCategories = useMemo(() => {
    const catDates = new Map<string, string>();
    POSTS.forEach(post => {
      const current = catDates.get(post.category) || '1970-01-01';
      if (post.date > current) {
        catDates.set(post.category, post.date);
      }
    });
    return Array.from(catDates.entries())
      .sort((a, b) => b[1].localeCompare(a[1]))
      .map(([cat]) => cat)
      .slice(0, 4);
  }, []);

  const archiveData = useMemo(() => {
    const { startYear } = getLatestOneYearRange();
    const counts = new Map<string, { year: string, month: string, count: number }>();
    
    POSTS.forEach(post => {
      const { year, month } = parseDate(post.date);
      if (parseInt(year) >= startYear) {
        const key = `${year}-${month}`;
        let item = counts.get(key);
        if (!item) {
          item = { year, month, count: 0 };
          counts.set(key, item);
        }
        item.count++;
      }
    });

    return Array.from(counts.values())
      .sort((a, b) => {
        if (a.year !== b.year) return b.year.localeCompare(a.year);
        return b.month.localeCompare(a.month);
      })
      .slice(0, 12);
  }, []);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleCategoryFilter = (cat: string | null) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
      {/* Sidebar: Intro & Tech Stack */}
      <aside className="col-span-1 md:col-span-4 flex flex-col gap-10">
        {/* Bio Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-4">Introduction</h2>
          <p className="text-2xl leading-relaxed font-serif italic mb-6 text-[#1A1A1A]">
            {ABOUT_ME.bio}
          </p>
          <div className="flex flex-col gap-2 text-sm text-[#717171]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-gray-300"></span>
              {/* 3. 修复：将 details 改为 ABOUT_ME */}
              <a href={`mailto:${ABOUT_ME.email}`} className="flex items-center gap-3 text-[#717171] hover:text-[#1A1A1A] transition-colors w-fit">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{ABOUT_ME.email}</span> 
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-gray-300"></span>
              {/* 3. 修复：将 details 改为 ABOUT_ME */}
              <a href={ABOUT_ME.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#717171] hover:text-[#1A1A1A] transition-colors w-fit">
                <Github className="w-4 h-4" />
                <span className="text-sm">{ABOUT_ME.github?.replace('https://', '')}</span>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Tech Stack Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {TAGS.length > 0 ? TAGS.map(tag => (
              <Link to={`/tags/${tag}`} key={tag} className="px-3 py-1 bg-white border border-gray-200 text-xs rounded-full text-[#1A1A1A] tracking-wider hover:border-gray-300 transition-colors">
                {tag}
              </Link>
            )) : TECH_STACK.map(tech => (
              <span key={tech} className="px-3 py-1 bg-white border border-gray-200 text-xs rounded-full text-[#1A1A1A] tracking-wider">
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Archives Widget Section */}
        <motion.section
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.05 }}
           className="w-full"
        >
          <div className="bg-[#FCFCFA] rounded-2xl border border-gray-200 p-5 shadow-sm shadow-gray-100/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-medium tracking-wide flex items-center gap-2 text-[#1A1A1A]">
                 <Archive className="w-[14px] h-[14px] text-[#717171]" />
                 归档 Archive
              </h2>
              <Link to="/archive" className="flex items-center gap-1 text-[#717171] hover:text-[#1A1A1A] transition-colors p-1 rounded-md hover:bg-gray-100 group">
                 <span className="text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">more</span>
                 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {archiveData.length > 0 ? (
               <ul className="space-y-4">
                 {archiveData.map((item, idx) => (
                   <li key={`${item.year}-${item.month}`} className="text-sm border-b border-gray-100/60 pb-3 last:border-0 last:pb-0">
                     <Link to={`/archive/${item.year}/${item.month}`} className="flex justify-between items-center group">
                       <span className="text-[#717171] group-hover:text-[#1A1A1A] transition-colors font-medium">
                         {getArchiveLabel(item.year, item.month)}
                       </span>
                       <span className="text-xs bg-gray-100 text-[#717171] px-2 py-0.5 rounded-full">
                         {item.count}
                       </span>
                     </Link>
                   </li>
                 ))}
               </ul>
            ) : (
               <div className="text-sm text-[#717171] flex items-center gap-2 py-4 justify-center">
                 <Inbox className="w-4 h-4" /> No archives
               </div>
            )}
          </div>
        </motion.section>
      </aside>

      {/* Articles Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="col-span-1 md:col-span-8 flex flex-col"
      >
        <div className="flex flex-col lg:flex-row lg:items-baseline justify-between mb-8 border-b border-gray-100 pb-2 gap-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171] shrink-0">Latest Articles</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 text-xs font-medium overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={cn(
                "cursor-pointer pb-1 transition-colors uppercase tracking-wider whitespace-nowrap",
                activeCategory === null ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A]" : "text-[#717171] hover:text-[#1A1A1A]"
              )}
            >
              All
            </button>
            {recentCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryFilter(cat)}
                className={cn(
                  "cursor-pointer pb-1 transition-colors uppercase tracking-wider whitespace-nowrap",
                  activeCategory === cat ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A]" : "text-[#717171] hover:text-[#1A1A1A]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

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
                  {post.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] border border-gray-200 px-2 py-0.5 rounded text-[#717171] uppercase tracking-wider shrink-0">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#717171] line-clamp-1">
                  {post.excerpt}
                </p>
              </Link>
            </article>
          ))}
          {currentPosts.length === 0 && (
            <p className="text-[#717171] py-8 text-center text-sm border-t border-gray-100 pt-8 mt-12">
              No articles found in this category.
            </p>
          )}
          
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
      </motion.section>
    </div>
  );
}