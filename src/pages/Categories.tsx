import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, POSTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Categories() {
  // Start with all categories expanded by default
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CATEGORIES.forEach(c => initial[c] = true);
    return initial;
  });

  const toggleCategory = (cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8">
        <h1 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-4">Categories</h1>
        <p className="text-2xl leading-relaxed font-serif italic text-[#1A1A1A]">Browse articles by topic</p>
      </header>

      <div className="space-y-6">
        {CATEGORIES.map(category => {
          const categoryPosts = POSTS.filter(p => p.category === category);
          
          if (categoryPosts.length === 0) return null;

          const isExpanded = expandedCats[category];

          return (
            <section key={category} className="space-y-0 rounded bg-white p-4 border border-gray-100">
              <h2 
                className="text-lg font-medium tracking-tight flex items-center justify-between pb-2 cursor-pointer select-none group"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#1A1A1A]">{category}</span>
                  <span className="text-xs font-normal text-[#717171] bg-gray-100 px-2 rounded-full py-0.5">
                    {categoryPosts.length}
                  </span>
                </div>
                <div className="text-[#717171] group-hover:text-[#1A1A1A] transition-colors">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </h2>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-gray-100 mt-2">
                      {categoryPosts.map(post => (
                        <Link 
                          key={post.id} 
                          to={`/post/${post.id}`}
                          className="p-5 rounded-md border border-gray-200 hover:border-gray-300 bg-white shadow-sm hover:shadow transition-all group"
                        >
                          <div className="text-xs text-[#717171] font-mono mb-3">{post.date}</div>
                          <h3 className="font-serif italic text-base text-[#1A1A1A] group-hover:underline underline-offset-4 decoration-gray-300 transition-all line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
}
