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
    <aside className="vp-doc-aside select-none">
      <div className="sticky top-24">
        <div className="border-l border-[#e2e2e3] dark:border-[#2e2e32] pl-4 py-0.5">
          <div className="text-[13px] font-bold text-[#171717] dark:text-[#f0f0f0] mb-2 tracking-tight">
            页面导航
          </div>

          <nav className="space-y-1.5 text-[13px] text-[#57606a] dark:text-[#8b949e]">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative block w-full text-left leading-snug transition-colors cursor-pointer truncate ${
                    item.level && item.level > 2 ? 'pl-3 text-xs' : ''
                  } ${
                    isActive
                      ? 'text-[#225cd6] dark:text-[#58a6ff] font-medium'
                      : 'text-[#57606a] dark:text-[#8b949e] hover:text-[#171717] dark:hover:text-[#f0f0f0]'
                  }`}
                  title={item.title.replace(/`/g, '')}
                >
                  {isActive && (
                    <span className="absolute -left-[17px] top-0.5 bottom-0.5 w-[2px] bg-[#225cd6] dark:bg-[#58a6ff]" />
                  )}
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
