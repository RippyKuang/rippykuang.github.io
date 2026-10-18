import React, { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  title: string;
  level?: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');

  useEffect(() => {
    if (items.length > 0 && !items.some(i => i.id === activeId)) {
      setActiveId(items[0].id);
    }
  }, [items, activeId]);

  useEffect(() => {
    const handleScroll = () => {
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 80) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <aside className="hidden lg:block w-[220px] shrink-0 select-none self-stretch">
      {/* Sticky container: stays fixed in viewport, never scrolling away with the page */}
      <div className="sticky top-[84px] max-h-[calc(100vh-100px)] overflow-y-auto pr-1">
        <div className="border-l border-[#e2e2e3] dark:border-[#2e2e32] pl-4 py-1">
          {/* Section title */}
          <div className="text-[14.5px] font-bold text-[#171717] dark:text-[#f0f0f0] mb-3 tracking-tight">
            页面导航
          </div>

          {/* Navigation Items: slightly larger text (14px), smooth hover slide & color animation */}
          <nav className="space-y-2 text-[14px]">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative block w-full text-left leading-[1.6] cursor-pointer truncate transition-all duration-200 ease-out hover:translate-x-1 ${
                    item.level && item.level > 2 ? 'pl-3 text-[13px]' : ''
                  } ${
                    isActive
                      ? 'text-[#225cd6] dark:text-[#58a6ff] font-medium'
                      : 'text-[#57606a] dark:text-[#8b949e] hover:text-[#225cd6] dark:hover:text-[#58a6ff]'
                  }`}
                  title={item.title.replace(/`/g, '')}
                >
                  {/* Left blue active vertical indicator pill */}
                  {isActive && (
                    <span className="absolute -left-[17px] top-1 bottom-1 w-[2.5px] bg-[#225cd6] dark:bg-[#58a6ff] rounded-full transition-all duration-200" />
                  )}
                  <span className="inline-block transition-transform duration-200 ease-out">
                    {item.title.replace(/`/g, '')}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};