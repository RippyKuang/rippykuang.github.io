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
    <aside className="hidden lg:block w-52 shrink-0 select-none">
      <div className="sticky top-20">
        {/* Subtle left border, bold '页面导航', minimalist text list */}
        <div className="border-l border-[#e1e4e8] dark:border-[#30363d] pl-4 py-0.5">
          <div className="text-[14px] font-bold text-[#171717] dark:text-[#f0f0f0] mb-2.5 tracking-tight">
            页面导航
          </div>

          <nav className="space-y-2 text-[13px] text-[#57606a] dark:text-[#8b949e]">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left leading-normal transition-colors cursor-pointer truncate ${
                    item.level && item.level > 2 ? 'pl-2 text-xs' : ''
                  } ${
                    isActive
                      ? 'text-[#225cd6] dark:text-[#58a6ff] font-medium'
                      : 'text-[#57606a] dark:text-[#8b949e] hover:text-[#171717] dark:hover:text-[#f0f0f0]'
                  }`}
                  title={item.title.replace(/`/g, '')}
                >
                  {item.title.replace(/`/g, '')}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};
