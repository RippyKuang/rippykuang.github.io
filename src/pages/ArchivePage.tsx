import { useParams, Link } from 'react-router-dom';
import { POSTS } from '../data';
import { motion } from 'motion/react';
import { ArrowLeft, Archive, Inbox, CalendarDays } from 'lucide-react';
import { parseDate, getArchiveLabel, CHINESE_MONTHS } from '../lib/dateUtils';
import { useMemo, useState } from 'react';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 12;

export default function ArchivePage() {
  const { year, month } = useParams<{ year?: string, month?: string }>();
  const isMonthView = year && month;
  const [currentPage, setCurrentPage] = useState(1);

  const validPosts = useMemo(() => {
    let posts = POSTS;
    if (isMonthView) {
      posts = posts.filter(p => {
        const d = parseDate(p.date);
        return d.year === year && d.month === month;
      });
    }
    return posts;
  }, [year, month, isMonthView]);

  const archiveIndex = useMemo(() => {
    const index = new Map<string, string[]>();
    POSTS.forEach(post => {
      const { year, month } = parseDate(post.date);
      if (!index.has(year)) {
        index.set(year, []);
      }
      if (!index.get(year)!.includes(month)) {
        index.get(year)!.push(month);
      }
    });

    const result = Array.from(index.entries()).sort((a,b) => b[0].localeCompare(a[0]));
    result.forEach(item => {
       item[1].sort((a,b) => b.localeCompare(a));
    });
    return result;
  }, []);

  const totalPages = Math.ceil(validPosts.length / POSTS_PER_PAGE);
  const currentPosts = validPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="col-span-1 md:col-span-8 space-y-12"
      >
        <header className="border-b border-gray-100 pb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors mb-6">
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-serif italic text-[#1A1A1A] flex items-center gap-3">
            <Archive className="w-6 h-6 text-[#717171]" />
            {isMonthView ? getArchiveLabel(year!, month!) : "Archive"}
          </h1>
          <p className="text-[#717171] mt-4 text-sm">
            Found {validPosts.length} article{validPosts.length !== 1 && 's'}
          </p>
        </header>

        {validPosts.length > 0 ? (
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
                      <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-[7rem]">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-[#717171] uppercase tracking-wider shrink-0">
                          {post.category}
                        </span>
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
            <p className="italic font-serif">No articles found for this period.</p>
          </div>
        )}
      </motion.div>

      {/* Quick Index Sidebar - Only visible accurately if it's the ALL view, or even when filtered it gives a nice global index */}
      <motion.aside
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="col-span-1 md:col-span-4 hidden md:block"
      >
        <div className="sticky top-12 bg-[#FCFCFA] rounded-2xl border border-gray-200 p-6 shadow-sm shadow-gray-100/50 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-6 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Time Index
          </h2>
          {archiveIndex.length > 0 ? (
            <ul className="space-y-6">
              {archiveIndex.map(([y, months]) => (
                <li key={y}>
                  <div className="font-serif italic text-lg text-[#1A1A1A] mb-3">{y}</div>
                  <div className="flex flex-wrap gap-2">
                    {months.map(m => {
                      const isActive = year === y && month === m;
                      return (
                        <Link 
                          to={`/archive/${y}/${m}`} 
                          key={`${y}-${m}`}
                          onClick={() => setCurrentPage(1)}
                          className={`text-xs px-2.5 py-1 rounded transition-colors ${
                            isActive 
                              ? "bg-[#1A1A1A] text-white" 
                              : "bg-white border border-gray-200 text-[#717171] hover:border-gray-300 hover:text-[#1A1A1A]"
                          }`}
                        >
                          {CHINESE_MONTHS[parseInt(m, 10) - 1]}
                        </Link>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-[#717171] italic">No index available.</div>
          )}
          {isMonthView && (
             <div className="mt-8 pt-6 border-t border-gray-100">
               <Link to="/archive" onClick={() => setCurrentPage(1)} className="text-xs text-[#717171] hover:text-[#1A1A1A] transition-colors underline underline-offset-4">
                 View All Time
               </Link>
             </div>
          )}
        </div>
      </motion.aside>
    </div>
  );
}
