import { ABOUT_ME } from '../data';
import { motion } from 'motion/react';
import { Github, Twitter, Mail, MapPin, Briefcase } from 'lucide-react';

export default function About() {
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
          Software engineer crafting tools for humans and machines alike.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none prose-p:text-[#717171]">
        <p>
          Hello! I'm <strong className="text-[#1A1A1A]">{ABOUT_ME.name}</strong>. {ABOUT_ME.bio}
        </p>
        <p>
          This is my personal digital garden where I plant ideas, technical explorations, 
          and random thoughts. I believe in keeping things simple, both in code and in design.
        </p>
        <p>
          Instead of relying on heavy frameworks for everything, I enjoy the craftsmanship of 
          building robust, fast, and accessible web experiences from scratch.
        </p>
      </section>

      <section className="space-y-6 pt-8 border-t border-gray-100">
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171]">Connect</h2>
        <div className="flex flex-col gap-4">
          <a href={`mailto:${ABOUT_ME.email}`} className="flex items-center gap-3 text-[#717171] hover:text-[#1A1A1A] transition-colors w-fit">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{ABOUT_ME.email}</span> 
          </a>
          <a href={ABOUT_ME.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#717171] hover:text-[#1A1A1A] transition-colors w-fit">
            <Github className="w-4 h-4" />
            <span className="text-sm">{ABOUT_ME.github.replace('https://', '')}</span>
          </a>
          <a href={ABOUT_ME.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#717171] hover:text-[#1A1A1A] transition-colors w-fit">
            <Twitter className="w-4 h-4" />
            <span className="text-sm">{ABOUT_ME.twitter.replace('https://', '')}</span>
          </a>
        </div>
      </section>

      <section className="space-y-6 pt-8 border-t border-gray-100">
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#717171]">Quick Facts</h2>
        <ul className="space-y-4 text-sm text-[#717171]">
          <li className="flex items-center gap-3">
            <MapPin className="w-4 h-4" />
            <span>Based in Earth</span>
          </li>
          <li className="flex items-center gap-3">
            <Briefcase className="w-4 h-4" />
            <span>Software Engineer</span>
          </li>
        </ul>
      </section>
    </motion.div>
  );
}
