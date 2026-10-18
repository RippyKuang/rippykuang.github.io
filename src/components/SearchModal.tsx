import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Calendar, ArrowRight } from 'lucide-react';
import { PostMeta } from '../services/postService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (articleId: string) => void;
  posts: PostMeta[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
  posts,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter articles by query
  const filteredArticles = query.trim() === ''
    ? posts
    : posts.filter(art => {
        const q = query.toLowerCase();
        const inTitle = art.title.toLowerCase().includes(q);
        const inSummary = art.summary.toLowerCase().includes(q);
        const inTopics = art.topics.some(t => t.toLowerCase().includes(q));
        const inDate = art.date.includes(q);
        return inTitle || inSummary || inTopics || inDate;
      });

  const handleSelect = (id: string) => {
    onSelectArticle(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#18191f] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章标题、内容、代码片段或标签 (如: constexpr, 指针, C++26)..."
            className="w-full bg-transparent border-none outline-hidden text-neutral-900 dark:text-white placeholder:text-neutral-400 text-[15px]"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 mr-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="text-xs font-medium px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((art) => (
              <button
                key={art.id}
                onClick={() => handleSelect(art.id)}
                className="w-full text-left p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700/60 transition-all group flex flex-col gap-1.5 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#171717] dark:text-white group-hover:text-[#225cd6] dark:group-hover:text-[#58a6ff] text-[15px] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#225cd6] shrink-0" />
                    <span>{art.title}</span>
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {art.date}
                  </span>
                </div>

                <p className="text-xs text-[#57606a] dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  {art.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                      #{t}
                    </span>
                  ))}
                  <span className="ml-auto text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    阅读文章 <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="py-12 text-center text-neutral-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>未找到与 “{query}” 相关的文章</p>
              <p className="text-xs text-neutral-500 mt-1">尝试搜索: C++, 指针, constexpr, eBPF</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 border-t border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-xs text-neutral-500 flex items-center justify-between">
          <span>共找到 {filteredArticles.length} 篇相关文章</span>
          <div className="flex items-center gap-3">
            <span>按 ESC 键退出</span>
          </div>
        </div>
      </div>
    </div>
  );
};
