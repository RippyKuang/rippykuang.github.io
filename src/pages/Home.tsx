import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ABOUT_ME, TECH_STACK, POSTS, CATEGORIES } from '../data';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredPosts = activeCategory 
    ? POSTS.filter(post => post.category === activeCategory)
    : POSTS;

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
              <span>{ABOUT_ME.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-gray-300"></span>
              <span>{ABOUT_ME.github.replace('https://', '')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-gray-300"></span>
              <span>{ABOUT_ME.twitter.replace('https://', '')}</span>
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
            {TECH_STACK.map(tech => (
              <span key={tech} className="px-3 py-1 bg-white border border-gray-200 text-xs rounded-full text-[#1A1A1A] tracking-wider">
                {tech}
              </span>
            ))}
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
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 border-b border-gray-100 pb-2 gap-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171] shrink-0">Latest Articles</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "cursor-pointer pb-1 transition-colors uppercase tracking-wider",
                activeCategory === null ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A]" : "text-[#717171] hover:text-[#1A1A1A]"
              )}
            >
              All
            </button>
            {recentCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "cursor-pointer pb-1 transition-colors uppercase tracking-wider",
                  activeCategory === cat ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A]" : "text-[#717171] hover:text-[#1A1A1A]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {filteredPosts.map(post => (
            <article key={post.id} className="group cursor-pointer">
              <Link to={`/post/${post.id}`} className="block">
                <div className="flex justify-between items-baseline mb-2 gap-4">
                  <h3 className="text-xl group-hover:underline underline-offset-4 decoration-gray-300 transition-all font-serif italic text-[#1A1A1A]">
                    {post.title}
                  </h3>
                  <time className="text-xs font-mono text-[#717171] shrink-0">{post.date}</time>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-[#717171] uppercase tracking-wider shrink-0">
                    {post.category}
                  </span>
                  <p className="text-sm text-[#717171] line-clamp-1">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
          {filteredPosts.length === 0 && (
            <p className="text-[#717171] py-8 text-center text-sm border-t border-gray-100 pt-8 mt-12">
              No articles found in this category.
            </p>
          )}
        </div>
      </motion.section>
    </div>
  );
}
