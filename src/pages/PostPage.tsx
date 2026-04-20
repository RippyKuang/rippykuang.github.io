import { useParams, Link } from 'react-router-dom';
import { POSTS } from '../data';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import 'katex/dist/katex.min.css';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const post = POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif italic text-[#1A1A1A]">Article not found</h1>
        <Link to="/" className="text-[#1A1A1A] hover:underline underline-offset-4 decoration-gray-300">Return to Home</Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors mb-10">
        <ArrowLeft className="w-3 h-3" />
        Back to Home
      </Link>

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
      
      <div className="mt-16 pt-8 border-t border-gray-100">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#717171] hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Back to Home
        </Link>
      </div>
    </motion.article>
  );
}
