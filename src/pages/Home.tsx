import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ABOUT_ME, TECH_STACK, POSTS, CATEGORIES, TAGS } from '../data';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { parseDate, getArchiveLabel, getLatestOneYearRange } from '../lib/dateUtils';
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

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    // 翻页时跳转到列表顶部比较合理
    const element = document.getElementById('latest-articles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryFilter = (cat: string | null) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    // 切换专题时不再强行跳转到顶端，保持当前视口
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
          <div className="flex flex-col gap-3 text-sm text-[#717171]">
            <a href={`mailto:${ABOUT_ME.email}`} className="flex items-center gap-3 hover:text-[#1A1A1A] transition-colors group w-fit">
              <Mail className="w-4 h-4" />
              <span className="group-hover:underline underline-offset-4 decoration-gray-300">{ABOUT_ME.email}</span>
            </a>
            <a href={ABOUT_ME.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#1A1A1A] transition-colors group w-fit">
              <Github className="w-4 h-4" />
              <span className="group-hover:underline underline-offset-4 decoration-gray-300">{ABOUT_ME.github.replace('https://', '')}</span>
            </a>
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
               <ul className="space-y-1 mt-2">
                 {archiveData.map((item, idx) => (
                   <li key={`${item.year}-${item.month}`} className="text-sm">
                     <Link to={`/archive/${item.year}/${item.month}`} className="flex justify-between items-center group p-2.5 -mx-2.5 rounded-xl hover:bg-white hover:shadow-[0_10px_40px_rgb(0,0,0,0.05)] hover:z-10 relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                       <span className="text-[#717171] group-hover:text-[#1A1A1A] group-hover:translate-x-1 group-hover:scale-[1.02] origin-left transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] font-medium">
                         {getArchiveLabel(item.year, item.month)}
                       </span>
                       <span className="text-xs bg-gray-100 text-[#717171] group-hover:bg-[#A3A3A3] group-hover:text-white px-2.5 py-0.5 rounded-full transition-colors duration-300">
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
        id="latest-articles"
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

        <div className="space-y-12 min-h-[500px] relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={(activeCategory || 'all') + '-' + currentPage}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-4"
            >
              {currentPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="group relative flex flex-col gap-2.5 p-5 -mx-5 rounded-3xl scale-[0.93] hover:scale-100 hover:bg-white hover:shadow-[0_15px_40px_rgb(0,0,0,0.06)] hover:z-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                >
                  <div className="flex justify-between items-center gap-4">
                    <Link to={`/post/${post.id}`} state={{ from: 'home' }} className="block relative inline-block">
                      <h3 className="text-xl font-serif italic text-[#1A1A1A] line-clamp-2 bg-gradient-to-r from-gray-300 to-gray-300 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                        {post.title}
                      </h3>
                    </Link>
                    <time className="text-xs font-mono text-[#717171] shrink-0 whitespace-nowrap py-1 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                      {post.date}
                    </time>
                  </div>
                  <div className="flex gap-2 items-center flex-nowrap relative z-10 w-full overflow-hidden">
                    <Link 
                      to={`/categories/${post.category}`}
                      className="text-[10px] bg-gray-100 px-3 py-1 rounded-full text-[#1A1A1A] uppercase tracking-wider shrink-0 font-medium hover:bg-gray-200 transition-colors"
                    >
                      {post.category}
                    </Link>
                    <div className="flex gap-2 items-center flex-wrap">
                      {post.tags?.slice(0, 3).map(tag => (
                        <Link 
                          to={`/tags/${tag}`} 
                          key={tag} 
                          className="text-[10px] border border-gray-200 px-3 py-1 rounded-full text-[#717171] uppercase tracking-wider shrink-0 transition-colors hover:bg-gray-50 hover:text-[#1A1A1A] hover:border-gray-300 whitespace-nowrap"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link to={`/post/${post.id}`} state={{ from: 'home' }} className="block">
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                      <div className="overflow-hidden">
                        <p className="text-sm text-[#717171] line-clamp-2 leading-relaxed mt-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
              {currentPosts.length === 0 && (
                <p className="text-[#717171] py-8 text-center text-sm border-t border-gray-100 pt-8 mt-12">
                  No articles found in this category.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={handlePageChange} />
        </div>
      </motion.section>
    </div>
  );
}
