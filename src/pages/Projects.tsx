import { Link } from 'react-router-dom';
import { PROJECTS } from '../data';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8">
        <h1 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-4">Projects</h1>
        <p className="text-2xl leading-relaxed font-serif italic text-[#1A1A1A]">Work and open source</p>
      </header>

      <div className="space-y-8">
        {currentProjects.map(project => (
          <article 
            key={project.id}
             className="group block bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <Link to={`/project/${project.id}`}>
                 <h2 className="text-xl font-serif italic text-[#1A1A1A] inline-block bg-gradient-to-r from-gray-300 to-gray-300 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                  {project.title}
                 </h2>
              </Link>
              <div className="flex items-center gap-4 text-xs">
                 <time className="font-mono text-[#717171]">{project.date}</time>
                 {project.repo && (
                   <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                      <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-[#717171] hover:text-[#1A1A1A] transition-colors" title="Repository">
                         <Github className="w-4 h-4" />
                      </a>
                   </div>
                 )}
              </div>
            </div>

            <Link to={`/project/${project.id}`} className="block mt-2">
              <p className="text-sm text-[#717171] line-clamp-2 leading-relaxed">
                {project.excerpt}
              </p>
            </Link>
          </article>
        ))}
        {PROJECTS.length === 0 && (
          <div className="py-10 text-center text-[#717171] italic font-serif">
            No projects added yet.
          </div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </motion.div>
  );
}
