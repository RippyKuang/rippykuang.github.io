/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ArticleView } from './components/ArticleView';
import { TableOfContents } from './components/TableOfContents';
import { SearchModal } from './components/SearchModal';
import { AboutView } from './components/AboutView';
import { TopicsView } from './components/TopicsView';
import { 
  getPostSync, 
  getAboutMarkdownSync,
  getAllPostMetasSync, 
  buildArchiveTree, 
  extractTopicsFromPosts,
  PostMeta 
} from './services/postService';
import { ParsedMarkdown } from './utils/markdownParser';

export default function App() {
  // Current active article ID (default matches the user screenshot: 2026-07-27)
  const [currentArticleId, setCurrentArticleId] = useState<string>('2026-07-27');
  
  // Instant synchronous posts metadata list (0ms loading!)
  const [posts] = useState<PostMeta[]>(() => getAllPostMetasSync());
  
  // Instant synchronous parsed markdown post (0ms loading!)
  const [currentParsedPost, setCurrentParsedPost] = useState<ParsedMarkdown | null>(() => 
    getPostSync('2026-07-27')
  );

  // Dynamic markdown post for About page
  const aboutParsedPost = useMemo(() => getAboutMarkdownSync(), []);

  // Active main view: article | about | topics
  const [activeView, setActiveView] = useState<'article' | 'about' | 'topics'>('article');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('blog-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('blog-theme', 'light');
    }
  }, [isDarkMode]);

  // Synchronously update currentParsedPost when article ID changes (instant, 0ms latency!)
  useEffect(() => {
    const post = getPostSync(currentArticleId);
    setCurrentParsedPost(post);
  }, [currentArticleId]);

  // Global keyboard shortcut for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute directory archive tree 100% dynamically from Markdown files
  const archives = useMemo(() => buildArchiveTree(posts), [posts]);

  // Compute topics 100% dynamically from Markdown files
  const topics = useMemo(() => extractTopicsFromPosts(posts), [posts]);

  // Article index for prev / next pagination (chronologically ordered ascending)
  const chronologicalPosts = useMemo(() => {
    return [...posts].sort((a, b) => a.date.localeCompare(b.date));
  }, [posts]);

  const currentIndex = chronologicalPosts.findIndex(a => a.id === currentArticleId);
  const prevArticle = currentIndex > 0 ? chronologicalPosts[currentIndex - 1] : undefined;
  const nextArticle = currentIndex >= 0 && currentIndex < chronologicalPosts.length - 1 ? chronologicalPosts[currentIndex + 1] : undefined;

  const handleSelectArticle = (id: string) => {
    setCurrentArticleId(id);
    setActiveView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopic = (topic: string) => {
    setSelectedTopicFilter(topic);
    setActiveView('topics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActiveView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAbout = () => {
    setActiveView('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTopic = () => {
    setSelectedTopicFilter('all');
    setActiveView('topics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateLatest = () => {
    if (posts.length > 0) {
      setCurrentArticleId(posts[0].id);
    }
    setActiveView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headerTitle = currentParsedPost?.metadata.title || `败犬日报 ${currentArticleId}`;

  return (
    <div className="min-h-screen bg-white dark:bg-[#121316] text-[#262626] dark:text-[#c9d1d9] transition-colors">
      {/* Column 1: Left Sidebar (Always visible on desktop, dynamically indented on wide screens) */}
      <Sidebar
        currentArticleId={currentArticleId}
        onSelectArticle={handleSelectArticle}
        onNavigateTopic={handleNavigateTopic}
        onNavigateHome={handleNavigateHome}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        archives={archives}
        topics={topics}
      />

      {/* Right Content Wrapper: Offsets precisely by the sidebar width */}
      <div className="w-full min-h-screen flex flex-col md:pl-[260px] min-[1280px]:pl-[calc((100vw-1240px)/2+260px)]">
        {/* Top Sticky Header */}
        <Header
          currentTitle={headerTitle}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigateHome={handleNavigateHome}
          onNavigateAbout={handleNavigateAbout}
          onNavigateTopic={handleNavigateTopic}
          onNavigateLatest={handleNavigateLatest}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(prev => !prev)}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          activeView={activeView}
        />

        {/* Compact Center Article (688px) + 48px gap + Right TOC (196px) */}
        <div className="flex-1 w-full max-w-[980px] px-6 md:pl-12 md:pr-6 py-8 md:py-10 flex items-start gap-12">
          {/* Column 2: Center Main Content */}
          <main className="w-full max-w-[688px] min-w-0 flex-1">
            {activeView === 'article' && (
              <ArticleView
                parsedPost={currentParsedPost}
                isLoading={false}
                onSelectTopic={handleSelectTopic}
                onPrevArticle={prevArticle ? () => handleSelectArticle(prevArticle.id) : undefined}
                onNextArticle={nextArticle ? () => handleSelectArticle(nextArticle.id) : undefined}
                prevTitle={prevArticle?.title}
                nextTitle={nextArticle?.title}
              />
            )}

            {activeView === 'about' && (
              <AboutView aboutPost={aboutParsedPost} />
            )}

            {activeView === 'topics' && (
              <TopicsView
                initialTopic={selectedTopicFilter}
                onSelectArticle={handleSelectArticle}
                posts={posts}
              />
            )}
          </main>

          {/* Column 3: Right In-Page Navigation (Table of Contents) */}
          {activeView === 'article' && currentParsedPost && (
            <TableOfContents items={currentParsedPost.toc} />
          )}
          {activeView === 'about' && aboutParsedPost && aboutParsedPost.toc.length > 0 && (
            <TableOfContents items={aboutParsedPost.toc} />
          )}
        </div>
      </div>

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectArticle}
        posts={posts}
      />
    </div>
  );
}