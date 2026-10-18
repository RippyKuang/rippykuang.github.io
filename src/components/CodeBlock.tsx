import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.split('\n');

  // Simple token highlighter for C++ / Bash
  const highlightLine = (line: string) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('#') && !line.includes('<')) {
      return <span className="text-neutral-500 dark:text-neutral-400 italic">{line}</span>;
    }

    // Replace common C++ tokens with styled spans
    const keywords = ['#include', 'template', 'typename', 'constexpr', 'return', 'void', 'auto', 'struct', 'class', 'using', 'namespace', 'if', 'else', 'const', 'inspect'];
    const types = ['size_t', 'int', 'Point', 'std::string', 'std::variant', 'atomic', 'size_t', 'uint64_t'];

    // Regex to split by word boundaries while keeping symbols
    const parts = line.split(/([A-Za-z0-9_#:]+|[^\s\w]+|\s+)/g).filter(Boolean);

    return parts.map((part, index) => {
      if (keywords.includes(part)) {
        return <span key={index} className="text-[#d73a49] dark:text-[#f97583] font-medium">{part}</span>;
      }
      if (types.includes(part)) {
        return <span key={index} className="text-[#005cc5] dark:text-[#79b8ff]">{part}</span>;
      }
      if (part.startsWith('//')) {
        return <span key={index} className="text-neutral-400 dark:text-neutral-500 italic">{part}</span>;
      }
      if (part.startsWith('"') || part.endsWith('"') || part.includes('<cstddef>')) {
        return <span key={index} className="text-[#032f62] dark:text-[#9ecbff]">{part}</span>;
      }
      if (/^\d+$/.test(part)) {
        return <span key={index} className="text-[#005cc5] dark:text-[#79b8ff]">{part}</span>;
      }
      return <span key={index} className="text-neutral-800 dark:text-neutral-200">{part}</span>;
    });
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-[#f8f9fa] dark:bg-[#1a1b20] transition-colors">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200/60 dark:border-neutral-800 text-xs text-neutral-400 font-mono">
        <span className="uppercase tracking-wider font-semibold text-[11px] text-neutral-500 dark:text-neutral-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer shadow-2xs text-[11.5px]"
          title="复制全部代码"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-neutral-600" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="overflow-x-auto p-4 text-[13.5px] leading-6 font-mono">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="w-9 pr-4 text-right text-neutral-400/80 dark:text-neutral-600 select-none align-top font-mono text-[12px]">
                  {index + 1}
                </td>
                <td className="whitespace-pre pl-2 font-mono">
                  {highlightLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
