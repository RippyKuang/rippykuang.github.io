import React from 'react';
import { ParsedMarkdown } from '../utils/markdownParser';

interface AboutViewProps {
  aboutPost: ParsedMarkdown;
}

export const AboutView: React.FC<AboutViewProps> = ({ aboutPost }) => {
  return (
    <article className="w-full max-w-[680px]">
      <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#f0f0f0] mb-6">
        {aboutPost.metadata.title || '关于'}
      </h1>

      <div className="space-y-5 text-[15.5px] leading-[1.8] text-[#262626] dark:text-[#c9d1d9]">
        {aboutPost.content}
      </div>
    </article>
  );
};
