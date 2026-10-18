import React from 'react';
import { Search, Sun, Moon, Menu, X, ArrowLeft, Github } from 'lucide-react';

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
  onNavigateHome,
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
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="w-full max-w-[1120px] xl:max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile menu toggle & Breadcrumb title */}
        <div className="flex items-center gap-3 min-w-0">
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
        </div>

        {/* Center-Left: Quick Search Button */}
        <div className="flex-1 max-w-xs mx-2 hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 text-[#57606a] dark:text-neutral-400 rounded-lg border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer group"
            title="搜索文章 (Ctrl + K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-neutral-400 group-hover:text-[#262626] dark:group-hover:text-neutral-300 transition-colors" />
              <span>Search</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[11px] font-mono bg-white dark:bg-neutral-700/80 text-neutral-500 dark:text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-600 shadow-2xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Navigation items and Theme switch */}
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

          {/* Nav links */}
          <nav className="flex items-center gap-0.5 sm:gap-1 text-sm font-normal text-[#262626] dark:text-neutral-300">
            <button
              onClick={onNavigateAbout}
              className={`px-2.5 py-1 rounded-md transition-colors hover:text-[#171717] dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800 cursor-pointer ${
                activeView === 'about' ? 'font-medium text-[#225cd6] dark:text-[#58a6ff] bg-blue-50/70 dark:bg-blue-950/40' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={onNavigateTopic}
              className={`px-2.5 py-1 rounded-md transition-colors hover:text-[#171717] dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800 cursor-pointer ${
                activeView === 'topics' ? 'font-medium text-[#225cd6] dark:text-[#58a6ff] bg-blue-50/70 dark:bg-blue-950/40' : ''
              }`}
            >
              Topic
            </button>
            <button
              onClick={onNavigateLatest}
              className="px-2.5 py-1 rounded-md transition-colors hover:text-[#171717] dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Latest
            </button>
          </nav>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/rippykuang/rippykuang.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title="GitHub 仓库"
            aria-label="GitHub 仓库"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Theme Switch Pill with Sun/Moon Icon */}
          <button
            onClick={onToggleTheme}
            className="relative flex items-center justify-center p-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all text-neutral-700 dark:text-neutral-300 cursor-pointer"
            title={isDarkMode ? "切换至浅色模式" : "切换至深色模式"}
            aria-label="切换主题模式"
          >
            {isDarkMode ? (
              <Moon className="w-4 h-4 text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
