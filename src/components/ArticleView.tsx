import React from 'react';
import { ParsedMarkdown } from '../utils/markdownParser';
import { Tag } from 'lucide-react';

interface ArticleViewProps {
  parsedPost: ParsedMarkdown | null;
  isLoading: boolean;
  onSelectTopic: (topic: string) => void;
  onPrevArticle?: () => void;
  onNextArticle?: () => void;
  prevTitle?: string;
  nextTitle?: string;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  parsedPost,
  isLoading,
  onSelectTopic,
  onPrevArticle,
  onNextArticle,
  prevTitle,
  nextTitle,
}) => {
  if (isLoading || !parsedPost) {
    return (
      <article className="w-full max-w-[680px] animate-pulse space-y-6">
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-3/4 mb-8" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
        </div>
      </article>
    );
  }

  const { metadata, content } = parsedPost;

  return (
    <article className="w-full max-w-[680px]">
      {/* Article Title */}
      <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#f0f0f0] mb-6">
        {metadata.title}
      </h1>

      {/* Rendered Markdown & LaTeX Content */}
      <div className="space-y-5 text-[15.5px] leading-[1.75] text-[#262626] dark:text-[#c9d1d9]">
        {content}
      </div>

      {/* Topic Tags */}
      {metadata.topics && metadata.topics.length > 0 && (
        <div className="mt-10 pt-5 border-t border-[#e1e4e8] dark:border-[#30363d]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#8c959f] dark:text-[#6e7681] uppercase tracking-wider mr-1">
              标签:
            </span>
            {metadata.topics.map((t) => (
              <button
                key={t}
                onClick={() => onSelectTopic(t)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-xs font-normal bg-[#eff1f3] hover:bg-[#e4e7eb] dark:bg-[#21262d] dark:hover:bg-[#30363d] text-[#57606a] dark:text-[#8b949e] transition-colors cursor-pointer"
              >
                <Tag className="w-3 h-3 text-[#8c959f] dark:text-[#6e7681]" />
                <span>{t}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pagination matching screenshot: 上一页 / 下一页 in blue font */}
      <div className="my-8 pt-6 border-t border-[#e1e4e8] dark:border-[#30363d] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {onPrevArticle && prevTitle ? (
          <button
            onClick={onPrevArticle}
            className="p-3.5 sm:p-4 rounded-lg border border-[#e1e4e8] dark:border-[#30363d] hover:border-[#b0b8c4] dark:hover:border-[#58a6ff] bg-white dark:bg-[#16171b] transition-all text-left cursor-pointer group"
          >
            <div className="text-xs text-[#8c959f] dark:text-[#6e7681] mb-1">
              上一页
            </div>
            <div className="text-sm font-medium text-[#225cd6] dark:text-[#58a6ff] group-hover:underline truncate">
              {prevTitle}
            </div>
          </button>
        ) : <div />}

        {onNextArticle && nextTitle ? (
          <button
            onClick={onNextArticle}
            className="p-3.5 sm:p-4 rounded-lg border border-[#e1e4e8] dark:border-[#30363d] hover:border-[#b0b8c4] dark:hover:border-[#58a6ff] bg-white dark:bg-[#16171b] transition-all text-right cursor-pointer group ml-auto w-full"
          >
            <div className="text-xs text-[#8c959f] dark:text-[#6e7681] mb-1">
              下一页
            </div>
            <div className="text-sm font-medium text-[#225cd6] dark:text-[#58a6ff] group-hover:underline truncate">
              {nextTitle}
            </div>
          </button>
        ) : <div />}
      </div>
    </article>
  );
};
