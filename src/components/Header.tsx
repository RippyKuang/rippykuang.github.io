import React from 'react';
import { Search, Sun, Moon, Menu, X, Github } from 'lucide-react';

interface HeaderProps {
  currentTitle: string;
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateTopic: () => void;
  onNavigateLatest: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isMobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
  activeView: 'article' | 'about' | 'topics';
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  onOpenSearch,
  onNavigateAbout,
  onNavigateTopic,
  onNavigateLatest,
  isDarkMode,
  onToggleTheme,
  isMobileSidebarOpen,
  onToggleMobileSidebar,
  activeView,
}) => {
  return (
    <header className="vp-navbar bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md transition-colors">
      <div className="vp-navbar-container">
        {/* Left: Mobile menu toggle, Breadcrumb title, and compact Search box right beside it */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="切换侧边栏导航"
            title="侧边栏"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="text-[15px] font-medium text-[#262626] dark:text-neutral-200 truncate select-none">
              {activeView === 'topics' ? '分类' : activeView === 'about' ? '关于' : currentTitle}
            </span>
          </div>

          {/* Compact VitePress-style Search Button directly beside title */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-3 px-3 py-1.5 text-[13px] bg-[#f6f6f7] dark:bg-[#161618] hover:border-[#225cd6]/50 dark:hover:border-blue-400/50 text-[#57606a] dark:text-neutral-400 rounded-lg border border-transparent transition-all cursor-pointer group shrink-0"
            title="搜索文章 (Ctrl + K)"
          >
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#262626] dark:group-hover:text-neutral-300 transition-colors" />
              <span>Search</span>
            </div>
            <kbd className="inline-flex items-center text-[11px] font-mono bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Navigation items (About, Topic, Latest), Theme switch, and GitHub */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="搜索"
            aria-label="搜索"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Nav links (No Home button) */}
          <nav className="flex items-center gap-1 sm:gap-2 text-[14px] font-normal text-[#262626] dark:text-neutral-300">
            <button
              onClick={onNavigateAbout}
              className={`px-2.5 py-1 rounded-md transition-colors hover:text-[#225cd6] dark:hover:text-[#58a6ff] cursor-pointer ${
                activeView === 'about' ? 'font-medium text-[#225cd6] dark:text-[#58a6ff]' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={onNavigateTopic}
              className={`px-2.5 py-1 rounded-md transition-colors hover:text-[#225cd6] dark:hover:text-[#58a6ff] cursor-pointer ${
                activeView === 'topics' ? 'font-medium text-[#225cd6] dark:text-[#58a6ff]' : ''
              }`}
            >
              Topic
            </button>
            <button
              onClick={onNavigateLatest}
              className="px-2.5 py-1 rounded-md transition-colors hover:text-[#225cd6] dark:hover:text-[#58a6ff] cursor-pointer"
            >
              Latest
            </button>
          </nav>

          <div className="h-4 w-px bg-[#e2e2e3] dark:bg-[#2e2e32] mx-1.5 hidden sm:block" />

          {/* Theme Switch Pill */}
          <button
            onClick={onToggleTheme}
            className="relative flex items-center justify-center p-1.5 rounded-full border border-[#e2e2e3] dark:border-[#2e2e32] bg-[#f6f6f7] dark:bg-[#161618] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all text-neutral-700 dark:text-neutral-300 cursor-pointer"
            title={isDarkMode ? "切换至浅色模式" : "切换至深色模式"}
            aria-label="切换主题模式"
          >
            {isDarkMode ? (
              <Moon className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </button>

          <div className="h-4 w-px bg-[#e2e2e3] dark:bg-[#2e2e32] mx-1 hidden sm:block" />

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/rippykuang/rippykuang.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            title="GitHub 仓库"
            aria-label="GitHub 仓库"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
