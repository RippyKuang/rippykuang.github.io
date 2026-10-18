import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Tag } from 'lucide-react';
import { BLOG_TITLE } from '../data/blogData';
import { ArchiveYear, DynamicTopic } from '../services/postService';

interface SidebarProps {
  currentArticleId: string;
  onSelectArticle: (articleId: string) => void;
  onNavigateTopic: () => void;
  onNavigateHome: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  archives: ArchiveYear[];
  topics?: DynamicTopic[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentArticleId,
  onSelectArticle,
  onNavigateTopic,
  onNavigateHome,
  isMobileOpen,
  onCloseMobile,
  archives,
}) => {
  // State to track expanded months: keyed by `${year}-${month}`
  // By default, 2026-07 is expanded (matching screenshot)
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({
    '2026-07': true,
  });

  const toggleMonth = (year: string, month: string) => {
    const key = `${year}-${month}`;
    setExpandedMonths(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleArticleClick = (articleId: string) => {
    onSelectArticle(articleId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-[#fbfbfb] dark:bg-[#16171b] border-r border-neutral-200/80 dark:border-neutral-800 flex flex-col shrink-0 transition-transform duration-200 ease-in-out select-none ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Logo Title */}
        <div className="h-14 px-6 flex items-center border-b border-neutral-200/60 dark:border-neutral-800/80 shrink-0">
          <button
            onClick={() => {
              onNavigateHome();
              if (isMobileOpen) onCloseMobile();
            }}
            className="flex items-center gap-2 group text-left w-full cursor-pointer"
          >
            <span className="text-lg font-bold tracking-tight text-[#171717] dark:text-[#f0f0f0] group-hover:text-[#225cd6] dark:group-hover:text-blue-400 transition-colors">
              {BLOG_TITLE}
            </span>
          </button>
        </div>

        {/* Scrollable Tree Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 text-[13.5px]">
          {/* Topic button: directly navigates to Topic page without dropdown */}
          <div className="border-b border-neutral-200/50 dark:border-neutral-800/60 pb-3">
            <button
              onClick={() => {
                onNavigateTopic();
                if (isMobileOpen) onCloseMobile();
              }}
              className="w-full flex items-center justify-between py-1 px-1.5 rounded-md text-[#262626] dark:text-neutral-200 font-semibold hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-neutral-500 group-hover:text-[#225cd6] dark:group-hover:text-blue-400" />
                <span>Topic</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Dynamic Year Archive Trees matching screenshot */}
          {archives.map((archive) => (
            <div key={archive.year} className="space-y-1.5">
              <div className="flex items-center justify-between text-[#171717] dark:text-[#f0f0f0] font-bold px-1 text-sm tracking-wide">
                <span>{archive.year}</span>
              </div>

              <div className="space-y-0.5">
                {archive.months.map((m) => {
                  const monthKey = `${archive.year}-${m.month}`;
                  const isExpanded = !!expandedMonths[monthKey];
                  const hasArticles = m.articles.length > 0;

                  return (
                    <div key={m.month} className="group">
                      {/* Month row button */}
                      <button
                        onClick={() => toggleMonth(archive.year, m.month)}
                        className={`w-full flex items-center justify-between py-1 px-1 rounded text-[#57606a] dark:text-[#8b949e] hover:text-[#171717] dark:hover:text-[#f0f0f0] transition-colors cursor-pointer ${
                          isExpanded ? 'font-medium text-[#171717] dark:text-[#f0f0f0]' : ''
                        }`}
                      >
                        <span className="text-[13px]">{m.month}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#8c959f] dark:text-[#6e7681]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#8c959f] dark:text-[#6e7681]" />
                        )}
                      </button>

                      {/* Expanded Articles list for this month */}
                      {isExpanded && (
                        <div className="relative ml-2 pl-2.5 border-l border-[#e1e4e8] dark:border-[#30363d] mt-1 space-y-0.5">
                          {hasArticles ? (
                            m.articles.map((art) => {
                              const isActive = art.id === currentArticleId;
                              return (
                                <button
                                  key={art.id}
                                  onClick={() => handleArticleClick(art.id)}
                                  className={`relative w-full text-left py-1 pl-2.5 pr-1 text-[13px] transition-colors flex items-center cursor-pointer ${
                                    isActive
                                      ? 'text-[#225cd6] dark:text-[#58a6ff] font-medium'
                                      : 'text-[#57606a] dark:text-[#8b949e] hover:text-[#171717] dark:hover:text-[#f0f0f0]'
                                  }`}
                                >
                                  {/* Left blue active vertical accent indicator on the guide line */}
                                  {isActive && (
                                    <span className="absolute -left-[11px] top-0 bottom-0 w-[2.5px] bg-[#225cd6] dark:bg-[#58a6ff]" />
                                  )}
                                  <span className="truncate">{art.date}</span>
                                </button>
                              );
                            })
                          ) : (
                            <div className="py-1 px-2 text-[11.5px] text-neutral-400 italic">
                              暂无归档文章
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
