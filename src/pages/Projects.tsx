import { Link } from 'react-router-dom';
import { PROJECTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

export default function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(PROJECTS.length / ITEMS_PER_PAGE);
  const currentProjects = PROJECTS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-4">Projects</h1>
          <p className="text-2xl leading-relaxed font-serif italic text-[#1A1A1A]">Work and open source</p>
        </div>
        <p className="text-xs text-[#717171] font-mono mb-1">
          {PROJECTS.length} REPOSITORIES
        </p>
      </header>

      <div className="space-y-4">
        <div className="min-h-[500px] relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-6"
            >
              {currentProjects.map((project) => (
                <article 
                  key={project.id}
                  className="group relative grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-start p-6 -mx-6 rounded-2xl transition-all duration-300 hover:bg-gray-50/40 cursor-pointer"
                >
                  {/* Year/Date Column - Removed the heavy border animation, keeping it elegantly minimal */}
                  <div className="md:col-span-3 pt-1 md:pt-2 mt-1">
                    <time className="font-mono text-sm text-[#717171]/80 group-hover:text-[#1A1A1A] transition-colors duration-300">
                      {project.endDate}
                    </time>
                  </div>
                  
                  {/* Content Column */}
                  <div className="md:col-span-9 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Link to={`/project/${project.id}`}>
                        <h2 className="text-3xl font-serif italic text-[#1A1A1A] group-hover:underline underline-offset-4 decoration-gray-300 transition-all">
                          {project.title}
                        </h2>
                      </Link>
                      {project.hasGithub && project.repo && (
                        <a href={project.repo} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border border-gray-100 rounded-full text-[#717171] hover:text-[#1A1A1A] hover:border-gray-300 shadow-sm transition-all group-hover:scale-105 group-hover:shadow hover:bg-gray-50 z-10" title="Repository">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    
                    <Link to={`/project/${project.id}`} className="block relative">
                      <p className="text-[#717171] leading-relaxed max-w-2xl text-sm md:text-base group-hover:text-[#1A1A1A] transition-colors duration-300">
                        {project.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-6 text-xs font-mono uppercase tracking-widest text-[#717171] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <span>View Project</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </Link>
                  </div>
                </article>
              ))}
              {PROJECTS.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-[#717171] space-y-4">
                  <p className="italic font-serif text-lg">No projects added yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={handlePageChange} />
    </motion.div>
  );
}
