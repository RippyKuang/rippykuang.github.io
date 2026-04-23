import { useParams, Link } from 'react-router-dom';
import { PROJECTS } from '../data';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, ArrowUp, Github, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import 'katex/dist/katex.min.css';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const project = PROJECTS.find(p => p.id === id);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif italic text-[#1A1A1A]">Project not found</h1>
        <Link to="/projects" className="text-[#1A1A1A] hover:underline underline-offset-4 decoration-gray-300">Return to Projects</Link>
      </div>
    );
  }

  return (
    <article 
      className="max-w-3xl mx-auto relative animate-in fade-in duration-500"
    >
      <Link to="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors mb-10">
        <ArrowLeft className="w-3 h-3" />
        Back to Projects
      </Link>

      <header className="mb-10 space-y-6 pb-10 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1A1A1A] leading-tight">
            {project.title}
          </h1>
          <time className="font-mono text-[#717171] text-sm shrink-0">
            {project.startDate} — {project.endDate}
          </time>
        </div>
        {(project.hasGithub || project.hasLiveDemo) && (
          <div className="flex items-center gap-4 text-sm mt-4">
            {project.hasGithub && project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] rounded transition-colors">
                <Github className="w-4 h-4" />
                <span>Source</span>
              </a>
            )}
            {project.hasLiveDemo && project.link && (
               <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#333] text-white rounded transition-colors">
                 <ExternalLink className="w-4 h-4" />
                 <span>Live Demo</span>
               </a>
            )}
          </div>
        )}
      </header>

      {/* Added [&_video]:w-full [&_img]:w-full for responsive media */}
      <div className="prose prose-neutral max-w-none prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#1A1A1A] prose-p:text-[#717171] prose-a:text-[#1A1A1A] prose-a:underline prose-a:decoration-gray-300 prose-a:underline-offset-4 prose-li:text-[#717171] prose-strong:text-[#1A1A1A] prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-0 prose-code:before:content-none prose-code:after:content-none prose-code:text-[#1A1A1A] prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:font-normal [&_video]:w-full [&_video]:rounded-md [&_video]:shadow-sm [&_img]:w-full [&_img]:rounded-md [&_img]:shadow-sm [&_img]:border [&_img]:border-gray-100 [&_video]:mt-8 [&_img]:mt-8">
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            code(props) {
              const {children, className, node, ...rest} = props;
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  {...(rest as any)}
                  PreTag="div"
                  CodeTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={github}
                  customStyle={{
                    backgroundColor: '#FCFCFA',
                    padding: '1.25rem',
                    border: '1px solid #F3F4F6', // gray-100 border to match minimal theme perfectly
                    borderRadius: '0.375rem',
                    margin: '0', // Overriding markdown default margin
                    fontSize: '0.875rem',
                    overflowX: 'auto'
                  }}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            }
          }}
        >
          {project.content}
        </Markdown>
      </div>
      
      <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Back to Projects
        </Link>
      </div>

      <button 
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 z-40 p-3 rounded-full bg-white border border-gray-200 shadow-sm text-[#717171] hover:text-[#1A1A1A] hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer",
          showScrollTop ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </article>
  );
}
