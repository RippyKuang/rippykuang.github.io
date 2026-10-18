import React from 'react';
import katex from 'katex';
import { CodeBlock } from '../components/CodeBlock';

export interface ParsedMarkdown {
  metadata: {
    title: string;
    date: string;
    year: string;
    month: string;
    topics: string[];
    summary: string;
  };
  toc: {
    id: string;
    title: string;
    level: number;
  }[];
  content: React.ReactNode;
}

// Render inline LaTeX using KaTeX without artificial blue color
export function renderMathInline(latex: string): React.ReactNode {
  try {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
    });
    return (
      <span
        className="inline-block px-0.5 align-baseline text-neutral-900 dark:text-neutral-100"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return (
      <code className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-800 dark:text-neutral-200">
        {latex}
      </code>
    );
  }
}

// Render display / block LaTeX without background or border box
export function renderMathBlock(latex: string): React.ReactNode {
  try {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    });
    return (
      <div
        className="my-5 py-2 overflow-x-auto text-center text-neutral-900 dark:text-neutral-100 bg-transparent border-none shadow-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return (
      <div className="my-4 text-center font-mono text-xs text-neutral-600 dark:text-neutral-400 overflow-x-auto">
        {latex}
      </div>
    );
  }
}

// Process inline text: bold, inline code, inline math `$formula$`, links
export function parseInlineText(text: string): React.ReactNode[] {
  // Regex to split by markdown tokens, supporting complex bracketed links like [[[clang::trivial_abi]]](url)
  const tokens = text.split(/(\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*|\[.+?\]\(https?:\/\/[^\s)]+\)|\[[^\]]+\]\([^)]+\)|这个提案)/g);

  return tokens.map((part, idx) => {
    if (!part) return null;

    // Inline Math: $...$ -> rendered naturally in text color
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const math = part.slice(1, -1);
      return <React.Fragment key={idx}>{renderMathInline(math)}</React.Fragment>;
    }

    // Inline Code: `...` -> matches screenshot: soft cool-gray bg #eff1f3 and crisp #262626 text
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="mx-0.5 px-1.5 py-0.5 rounded-[4px] bg-[#eff1f3] dark:bg-[#21262d] text-[#262626] dark:text-[#e6edf3] font-mono text-[13.5px] font-normal"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold: **...**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-[#171717] dark:text-[#f0f0f0]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Direct hyperlink: [text](url) -> matches screenshot: vibrant blue #225cd6 with underline
    const linkMatch = part.match(/^\[([\s\S]*)\]\(([^)]+)\)$/);
    if (linkMatch) {
      let label = linkMatch[1];
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#225cd6] dark:text-[#58a6ff] underline decoration-[#225cd6] dark:decoration-[#58a6ff] underline-offset-2 hover:opacity-80 font-normal cursor-pointer"
        >
          {parseInlineText(label)}
        </a>
      );
    }

    // Direct jump for "这个提案" keyword -> clicks to navigate directly
    if (part === '这个提案') {
      return (
        <a
          key={idx}
          href="https://wg21.link/p2280"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#225cd6] dark:text-[#58a6ff] underline decoration-[#225cd6] dark:decoration-[#58a6ff] underline-offset-2 hover:opacity-80 font-normal cursor-pointer"
          title="直接跳转至 ISO C++ P2280 提案"
        >
          这个提案
        </a>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

// Main parser function
export function parseMarkdown(rawMd: string): ParsedMarkdown {
  let content = rawMd;
  const metadata = {
    title: '未命名文章',
    date: '2026-07-25',
    year: '2026',
    month: '07',
    topics: ['C++'],
    summary: '',
  };

  // 1. Parse YAML Frontmatter
  if (content.startsWith('---')) {
    const endIdx = content.indexOf('---', 3);
    if (endIdx !== -1) {
      const frontmatterStr = content.slice(3, endIdx).trim();
      content = content.slice(endIdx + 3).trim();

      const lines = frontmatterStr.split('\n');
      for (const line of lines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
          const key = line.slice(0, colonIdx).trim();
          let value = line.slice(colonIdx + 1).trim();

          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }

          if (key === 'title') metadata.title = value;
          if (key === 'date') {
            metadata.date = value;
            const parts = value.split('-');
            if (parts.length >= 2) {
              metadata.year = parts[0];
              metadata.month = parts[1];
            }
          }
          if (key === 'summary') metadata.summary = value;
          if (key === 'topics') {
            try {
              if (value.startsWith('[')) {
                metadata.topics = JSON.parse(value.replace(/'/g, '"'));
              } else {
                metadata.topics = value.split(',').map((s) => s.trim());
              }
            } catch {
              metadata.topics = [value];
            }
          }
        }
      }
    }
  }

  // 2. Parse Blocks & Extract Headings for TOC
  const toc: { id: string; title: string; level: number }[] = [];
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeLang = '';
  let codeLines: string[] = [];

  let inMathBlock = false;
  let mathLines: string[] = [];

  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(' ').trim();
      if (text) {
        renderedElements.push(
          <p key={`p-${renderedElements.length}`} className="text-[15.5px] leading-[1.75] text-[#262626] dark:text-[#c9d1d9]">
            {parseInlineText(text)}
          </p>
        );
      }
      paragraphLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Block Math: $$
    if (line.trim().startsWith('$$')) {
      if (inMathBlock) {
        const latex = mathLines.join('\n');
        renderedElements.push(
          <React.Fragment key={`math-${renderedElements.length}`}>
            {renderMathBlock(latex)}
          </React.Fragment>
        );
        mathLines = [];
        inMathBlock = false;
      } else {
        flushParagraph();
        const rest = line.trim().slice(2).trim();
        if (rest.endsWith('$$') && rest.length > 2) {
          renderedElements.push(
            <React.Fragment key={`math-${renderedElements.length}`}>
              {renderMathBlock(rest.slice(0, -2))}
            </React.Fragment>
          );
        } else {
          inMathBlock = true;
          if (rest) mathLines.push(rest);
        }
      }
      continue;
    }

    if (inMathBlock) {
      mathLines.push(line);
      continue;
    }

    // Code Block: ```lang
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        const fullCode = codeLines.join('\n');
        renderedElements.push(
          <CodeBlock
            key={`code-${renderedElements.length}`}
            code={fullCode}
            language={codeLang || 'text'}
          />
        );
        codeLines = [];
        inCodeBlock = false;
        codeLang = '';
      } else {
        flushParagraph();
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Horizontal Rule: --- or ***
    if (line.trim() === '---' || line.trim() === '***') {
      flushParagraph();
      renderedElements.push(
        <hr key={`hr-${renderedElements.length}`} className="my-6 border-t border-[#e1e4e8] dark:border-[#30363d]" />
      );
      continue;
    }

    // Headings
    if (line.startsWith('#')) {
      flushParagraph();
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const headingText = match[2].trim();
        const headingId = `heading-${toc.length + 1}`;
        toc.push({ id: headingId, title: headingText, level });

        if (level === 1) {
          renderedElements.push(
            <h1 key={`h1-${renderedElements.length}`} id={headingId} className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#f0f0f0] mt-8 mb-4 scroll-mt-20">
              {parseInlineText(headingText)}
            </h1>
          );
        } else if (level === 2) {
          renderedElements.push(
            <h2 key={`h2-${renderedElements.length}`} id={headingId} className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#171717] dark:text-[#f0f0f0] mt-8 mb-4 scroll-mt-20">
              {parseInlineText(headingText)}
            </h2>
          );
        } else {
          renderedElements.push(
            <h3 key={`h3-${renderedElements.length}`} id={headingId} className="text-xl font-bold tracking-tight text-[#171717] dark:text-[#f0f0f0] mt-6 mb-3 scroll-mt-20">
              {parseInlineText(headingText)}
            </h3>
          );
        }
        continue;
      }
    }

    // Bullet lists: - or *
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      flushParagraph();
      const listContent = line.trim().slice(2).trim();
      const isTocNumberLink = /^\d+\.\s+/.test(listContent);

      renderedElements.push(
        <div key={`li-${renderedElements.length}`} className="flex items-start gap-2.5 my-2 pl-2 text-[15.5px] text-[#262626] dark:text-[#c9d1d9]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#171717] dark:bg-[#c9d1d9] mt-2.5 shrink-0" />
          <div className="leading-relaxed">
            {isTocNumberLink ? (
              <a
                href="#heading-1"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('heading-1');
                  if (target) {
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="text-[#225cd6] dark:text-[#58a6ff] underline decoration-[#225cd6] dark:decoration-[#58a6ff] underline-offset-2 hover:opacity-85 cursor-pointer"
              >
                {parseInlineText(listContent)}
              </a>
            ) : (
              parseInlineText(listContent)
            )}
          </div>
        </div>
      );
      continue;
    }

    // Empty line -> flush paragraph
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // Regular text line
    paragraphLines.push(line);
  }

  flushParagraph();

  return {
    metadata,
    toc,
    content: (
      <div className="space-y-4">
        {renderedElements}
      </div>
    ),
  };
}
