import { motion } from 'motion/react';
import { Github, Twitter, Mail, MapPin, Briefcase } from 'lucide-react';
import { parseMarkdown } from '../data';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
// @ts-ignore
import rawAbout from '../about.md?raw';

export default function About() {
  const parsed = parseMarkdown(rawAbout, 'about');
  const details = parsed as Record<string, any>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-12"
    >
      <header className="border-b border-gray-100 pb-8 space-y-4">
        <h1 className="text-xs uppercase tracking-[0.2em] text-[#717171]">About Me</h1>
        <p className="text-2xl leading-relaxed font-serif italic text-[#1A1A1A]">
          {details.headline || "Software engineer crafting tools for humans and machines alike."}
        </p>
      </header>

      <section className="prose prose-neutral max-w-none prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#1A1A1A] prose-p:text-[#717171] prose-a:text-[#1A1A1A] prose-a:underline prose-a:decoration-gray-300 prose-a:underline-offset-4 prose-li:text-[#717171] prose-strong:text-[#1A1A1A]">
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
        >
          {parsed.content}
        </Markdown>
      </section>

      <section className="space-y-6 pt-8 border-t border-gray-100">
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171]">Connect</h2>
        <div className="flex flex-col gap-4">
          {details.email && (
            <a href={`mailto:${details.email}`} className="flex items-center gap-3 text-[#717171] hover:text-[#1A1A1A] transition-colors w-fit">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{details.email}</span> 
            </a>
          )}
          {details.github && (
            <a href={details.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#717171] hover:text-[#1A1A1A] transition-colors w-fit">
              <Github className="w-4 h-4" />
              <span className="text-sm">{details.github.replace('https://', '')}</span>
            </a>
          )}
          {details.twitter && (
            <a href={details.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#717171] hover:text-[#1A1A1A] transition-colors w-fit">
              <Twitter className="w-4 h-4" />
              <span className="text-sm">{details.twitter.replace('https://', '')}</span>
            </a>
          )}
        </div>
      </section>

      <section className="space-y-6 pt-8 border-t border-gray-100">
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171]">Quick Facts</h2>
        <ul className="space-y-4 text-sm text-[#717171]">
          {details.location && (
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              <span>{details.location}</span>
            </li>
          )}
          {details.role && (
            <li className="flex items-center gap-3">
              <Briefcase className="w-4 h-4" />
              <span>{details.role}</span>
            </li>
          )}
        </ul>
      </section>
    </motion.div>
  );
}
