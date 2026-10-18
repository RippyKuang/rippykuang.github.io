import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
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

      {/* Column 1: Left Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-[260px] bg-[#f6f6f7] dark:bg-[#161618] border-r border-[#e2e2e3] dark:border-[#2e2e32] flex flex-col shrink-0 transition-transform duration-200 ease-in-out select-none pl-6 pr-0 relative before:content-[''] before:hidden md:before:block before:absolute before:inset-y-0 before:right-full before:w-[100vw] before:bg-[#f6f6f7] dark:before:bg-[#161618] before:pointer-events-none ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Logo 保持原有品牌字体 */}
        <div className="h-[60px] pr-6 flex items-center border-b border-[#e2e2e3] dark:border-[#2e2e32] shrink-0">
          <button
            onClick={() => {
              onNavigateHome();
              if (isMobileOpen) onCloseMobile();
            }}
            className="flex items-center gap-2 group text-left w-full cursor-pointer"
          >
            <span className="text-[16px] font-bold tracking-tight text-[#171717] dark:text-[#f0f0f0] group-hover:text-[#225cd6] dark:group-hover:text-blue-400 transition-colors">
              {BLOG_TITLE}
            </span>
          </button>
        </div>

        {/* 目录树容器：挂载 sidebar-tree-font，仅此区域内的数字与文字应用 Inter 无衬线体 */}
        <div className="sidebar-tree-font flex-1 overflow-y-auto py-4 pr-3.5 space-y-3.5 text-[14px]">
          {/* 顶部 Topic 入口（对应图二无图标纯文字版） */}
          <div className="border-b border-[#e2e2e3] dark:border-[#2e2e32] pb-2.5">
            <button
              onClick={() => {
                onNavigateTopic();
                if (isMobileOpen) onCloseMobile();
              }}
              className="w-full flex items-center justify-between py-1 px-1 text-[#3c3c43] dark:text-[#e6edf3] hover:text-[#3451b2] dark:hover:text-[#a8b1ff] font-bold text-[14px] leading-[24px] transition-colors cursor-pointer group"
            >
              <span>Topic</span>
              <ChevronRight className="w-4 h-4 text-[#8c959f] dark:text-[#6e7681] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 归档年份列表 */}
          {archives.map((archive, idx) => (
            <div
              key={archive.year}
              className={`space-y-1 ${idx > 0 ? 'border-t border-[#e2e2e3] dark:border-[#2e2e32] pt-2.5 mt-2.5' : ''}`}
            >
              {/* 年份：h2 语义，字重 700 加粗，字号 14px，行高 24px */}
              <h2 className="flex items-center justify-between text-[#3c3c43] dark:text-[#e6edf3] font-bold px-1 text-[14px] leading-[24px]">
                <span>{archive.year}</span>
              </h2>

              <div className="space-y-0.5">
                {archive.months.map((m) => {
                  const monthKey = `${archive.year}-${m.month}`;
                  const isExpanded = !!expandedMonths[monthKey];
                  const hasArticles = m.articles.length > 0;

                  return (
                    <div key={m.month} className="group">
                      {/* 月份：h3 语义，字重 500 Medium，字号 14px，行高 24px */}
                      <button
                        onClick={() => toggleMonth(archive.year, m.month)}
                        className={`w-full flex items-center justify-between py-1 px-1 rounded text-[14px] leading-[24px] transition-colors cursor-pointer ${
                          isExpanded
                            ? 'font-medium text-[#3c3c43] dark:text-[#e6edf3]'
                            : 'font-medium text-[#67676c] dark:text-[#929295] hover:text-[#3c3c43] dark:hover:text-[#e6edf3]'
                        }`}
                      >
                        <h3 className="text-[14px] leading-[24px] font-medium m-0">
                          {m.month}
                        </h3>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#8c959f] dark:text-[#6e7681]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#8c959f] dark:text-[#6e7681]" />
                        )}
                      </button>

                      {/* 具体日期文章：p 语义，字重 500 Medium */}
                      {isExpanded && (
                        <div className="relative ml-2 pl-2.5 border-l border-[#e2e2e3] dark:border-[#2e2e32] mt-0.5 space-y-0.5">
                          {hasArticles ? (
                            m.articles.map((art) => {
                              const isActive = art.id === currentArticleId;
                              return (
                                <button
                                  key={art.id}
                                  onClick={() => handleArticleClick(art.id)}
                                  className={`relative w-full text-left py-1 pl-2.5 pr-1 text-[14px] leading-[24px] transition-colors flex items-center cursor-pointer ${
                                    isActive
                                      ? 'text-[#3451b2] dark:text-[#a8b1ff] font-medium'
                                      : 'text-[#67676c] dark:text-[#929295] hover:text-[#3c3c43] dark:hover:text-[#e6edf3] font-medium'
                                  }`}
                                >
                                  {/* 激活指示蓝条 */}
                                  {isActive && (
                                    <span className="absolute -left-[11px] top-0 bottom-0 w-[2px] bg-[#3451b2] dark:bg-[#a8b1ff]" />
                                  )}
                                  <p className="truncate m-0 text-[14px] leading-[24px] font-medium">
                                    {art.date}
                                  </p>
                                </button>
                              );
                            })
                          ) : (
                            <div className="py-1 px-2 text-[12px] text-neutral-400 italic">
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