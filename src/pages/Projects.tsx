import { Link } from 'react-router-dom';
import { PROJECTS } from '../data';
import { motion } from 'motion/react';
import { Github, ExternalLink } from 'lucide-react';

export default function Projects() {
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
        {PROJECTS.map(project => (
          <motion.article 
            key={project.id}
             layout
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
            className="group block rounded-md border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <Link to={`/project/${project.id}`}>
                 <h2 className="text-xl font-serif italic text-[#1A1A1A] group-hover:underline underline-offset-4 decoration-gray-300 transition-all">
                  {project.title}
                 </h2>
              </Link>
              <div className="flex items-center gap-4 text-xs">
                 <time className="font-mono text-[#717171]">{project.date}</time>
                 {(project.repo || project.link) && (
                   <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                     {project.repo && (
                        <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-[#717171] hover:text-[#1A1A1A] transition-colors" title="Repository">
                           <Github className="w-4 h-4" />
                        </a>
                     )}
                     {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[#717171] hover:text-[#1A1A1A] transition-colors" title="Live Link">
                           <ExternalLink className="w-4 h-4" />
                        </a>
                     )}
                   </div>
                 )}
              </div>
            </div>

            <Link to={`/project/${project.id}`} className="block">
              <p className="text-[#717171] leading-relaxed text-sm">
                {project.excerpt}
              </p>
            </Link>
          </motion.article>
        ))}
        {PROJECTS.length === 0 && (
          <div className="py-10 text-center text-[#717171] italic font-serif">
            No projects added yet.
          </div>
        )}
      </div>
    </motion.div>
  );
}
