import { useParams, Link, useLocation } from 'react-router-dom';
import { POSTS } from '../data';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, ArrowUp, Clock, Copy, Check, List } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import 'katex/dist/katex.min.css';
import { cn } from '../lib/utils';
import React, { useState, useEffect, useMemo } from 'react';

const extractText = (node: any): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && node.props && node.props.children) return extractText(node.props.children);
  return '';
};

const slugify = (text: string) => {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]/g, '');
};

const Heading = ({ level, children, ...props }: any) => {
  const text = extractText(children);
  const id = slugify(text);
  const Tag = `h${level}` as any;
  return (
    <Tag id={id} className="scroll-mt-32 group relative" {...props}>
      <a 
        href={`#${id}`} 
        onClick={(e) => {
           e.preventDefault();
           const el = document.getElementById(id);
           if (el) {
             const y = el.getBoundingClientRect().top + window.scrollY - 100;
             window.scrollTo({ top: y, behavior: 'smooth' });
           }
        }}
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 no-underline text-lg font-normal hidden sm:inline-block cursor-pointer px-2"
      >
        #
      </a>
      {children}
    </Tag>
  );
};

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const post = POSTS.find(p => p.id === id);
  const [isCopied, setIsCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [isTocOpen, setIsTocOpen] = useState(true);

  const toc = useMemo(() => {
    if (!post) return [];
    const headings: Array<{id: string, text: string, level: number}> = [];
    const regex = /^(#{1,3})\s+(.+)$/gm;
    let match;
    while ((match = regex.exec(post.content)) !== null) {
      const level = match[1].length; 
      const text = match[2].trim().replace(/[*_~`]/g, '');
      const id = slugify(text);
      headings.push({ id, text, level });
    }
    return headings;
  }, [post]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );
    
    setTimeout(() => {
      const headings = document.querySelectorAll('.prose h1, .prose h2, .prose h3');
      headings.forEach(h => observer.observe(h));
    }, 100);

    return () => observer.disconnect();
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const readingTime = post ? Math.ceil(post.content.split(/\s+/g).length / 200) : 0;

  const isFromSearch = location.state?.from === 'search';
  const isFromTag = location.state?.from === 'tag';

  const backToUrl = isFromSearch 
    ? `/search?q=${encodeURIComponent(location.state.query)}&p=${location.state.page}` 
    : isFromTag
    ? `/tags/${encodeURIComponent(location.state.tag)}?p=${location.state.page}`
    : '/';

  const backToText = isFromSearch 
    ? 'Back to Search' 
    : isFromTag 
    ? `Back to #${location.state.tag}` 
    : 'Back to Home';

  if (!post) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif italic text-[#1A1A1A]">Article not found</h1>
        <Link to="/" className="text-[#1A1A1A] hover:underline underline-offset-4 decoration-gray-300">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center max-w-7xl mx-auto items-start relative animate-in fade-in duration-500 overflow-visible mt-2">
      
      {/* Table of Contents Sidebar (Left side) */}
      <AnimatePresence initial={false}>
        {toc.length > 0 && isTocOpen && (
          <motion.aside 
            key="toc-sidebar"
            initial={{ width: 0, opacity: 0, paddingRight: 0 }}
            animate={{ width: 280, opacity: 1, paddingRight: 48 }}
            exit={{ width: 0, opacity: 0, paddingRight: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="hidden xl:block shrink-0 relative pt-10 overflow-hidden"
          >
            <div className="w-56 sticky top-32 max-h-[calc(100vh-10rem)] pl-2 overflow-y-auto scrollbar-hide">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#717171] mb-6 font-medium">
                Contents
              </h4>
              <div className="relative">
                {/* Vertical line tracker */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100" />
                
                <ul className="space-y-3 relative text-sm">
                  {toc.map(item => (
                    <li 
                      key={item.id} 
                      className="relative flex items-center"
                      style={{ paddingLeft: `${(item.level - 1) * 0.75 + 1}rem` }}
                    >
                      {activeId === item.id && (
                        <motion.div 
                          layoutId="active-toc-indicator"
                          className="absolute left-[-1.5px] w-[4px] h-[4px] rounded-full bg-[#1A1A1A] z-10" 
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                      )}
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(item.id);
                          if (el) {
                             const y = el.getBoundingClientRect().top + window.scrollY - 100;
                             window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }}
                        className={cn(
                          "block truncate transition-all duration-300 w-full",
                          activeId === item.id 
                            ? "text-[#1A1A1A] font-medium" 
                            : "text-[#717171] hover:text-[#1A1A1A]"
                        )}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <article className="flex-1 w-full max-w-3xl relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
      <div className="flex items-center justify-between mb-10 pt-10 xl:pt-0">
        <div className="flex items-center gap-6">
          <Link to={backToUrl} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            {backToText}
          </Link>
          
          {toc.length > 0 && (
            <button 
              onClick={() => setIsTocOpen(!isTocOpen)}
              title={isTocOpen ? 'Hide Contents' : 'Show Contents'}
              className="hidden xl:inline-flex items-center justify-center text-[#717171] hover:text-[#1A1A1A] hover:bg-gray-100 rounded-md w-6 h-6 transition-all"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        <button 
          onClick={handleCopy}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors"
        >
          {isCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
          {isCopied ? 'Copied' : 'Share'}
        </button>
      </div>

      <header className="mb-10 space-y-4 pb-10 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#717171]">
          <span className="bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
            {post.category}
          </span>
          {post.tags && post.tags.length > 0 && post.tags.map(tag => (
            <Link key={tag} to={`/tags/${tag}`} className="border border-gray-200 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] hover:border-gray-300 hover:text-[#1A1A1A] transition-colors">
              #{tag}
            </Link>
          ))}
          <span>•</span>
          <time className="font-mono">{post.date}</time>
          <span>•</span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" /> {readingTime} min read
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1A1A1A] leading-tight">
          {post.title}
        </h1>
      </header>

      <div className="prose prose-neutral max-w-none prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#1A1A1A] prose-p:text-[#717171] prose-a:text-[#1A1A1A] prose-a:underline prose-a:decoration-gray-300 prose-a:underline-offset-4 prose-li:text-[#717171] prose-strong:text-[#1A1A1A] prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-0 prose-code:before:content-none prose-code:after:content-none prose-code:text-[#1A1A1A] prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:font-normal [&_video]:w-full [&_video]:rounded-md [&_video]:shadow-sm [&_img]:w-full [&_img]:rounded-md [&_img]:shadow-sm [&_img]:border [&_img]:border-gray-100 [&_video]:mt-8 [&_img]:mt-8">
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            h1: (props) => <Heading level={1} {...props} />,
            h2: (props) => <Heading level={2} {...props} />,
            h3: (props) => <Heading level={3} {...props} />,
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
          {post.content}
        </Markdown>
      </div>
      
      <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
        <Link to={backToUrl} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft className="w-3 h-3" />
          {backToText}
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
    </div>
  );
}
