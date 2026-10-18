import React, { useState, useMemo } from 'react';
import { PostMeta } from '../services/postService';

interface TopicsViewProps {
  initialTopic?: string;
  onSelectArticle: (articleId: string) => void;
  posts: PostMeta[];
}

export const TopicsView: React.FC<TopicsViewProps> = ({
  initialTopic,
  onSelectArticle,
  posts,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic || 'all');

  // Extract unique topics and counts from loaded posts
  const topicStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      for (const t of post.topics) {
        counts[t] = (counts[t] || 0) + 1;
      }
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [posts]);

  const filteredArticles = selectedTopic === 'all'
    ? posts
    : posts.filter(art => art.topics.includes(selectedTopic));

  return (
    <div className="w-full max-w-[680px]">
      {/* Title: exactly matching the article title typography and layout */}
      <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#f0f0f0] mb-6">
        分类
      </h1>

      {/* Category selector pills: clean, minimalist, no clutter */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
        <button
          onClick={() => setSelectedTopic('all')}
          className={`px-3 py-1 rounded text-[13px] font-normal transition-colors cursor-pointer ${
            selectedTopic === 'all'
              ? 'bg-[#171717] text-white dark:bg-white dark:text-[#171717] font-medium'
              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#57606a] dark:text-neutral-300'
          }`}
        >
          全部
        </button>

        {topicStats.map((topic) => {
          const isActive = selectedTopic === topic.name;
          return (
            <button
              key={topic.name}
              onClick={() => setSelectedTopic(topic.name)}
              className={`px-3 py-1 rounded text-[13px] font-normal transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#171717] text-white dark:bg-white dark:text-[#171717] font-medium'
                  : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#57606a] dark:text-neutral-300'
              }`}
            >
              {topic.name}
            </button>
          );
        })}
      </div>

      {/* Minimal article list: clean narrow layout matching the blog's tone */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => onSelectArticle(article.id)}
            className="py-3 flex items-baseline justify-between gap-4 group cursor-pointer"
          >
            <div className="flex items-baseline gap-3 min-w-0">
              <span className="text-[13px] text-[#8c959f] dark:text-neutral-500 shrink-0">
                {article.date}
              </span>
              <span className="text-[15px] text-[#171717] dark:text-neutral-200 group-hover:text-[#225cd6] dark:group-hover:text-[#58a6ff] group-hover:underline transition-colors truncate">
                {article.title}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              {article.topics.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
