import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

interface Token {
  text: string;
  light: string;
  dark: string;
  italic?: boolean;
}

const COLORS = {
  keyword: { light: '#D73A49', dark: '#F97583' },   // red/pink: keywords, types, operators, #include, literal suffixes
  entity: { light: '#6F42C1', dark: '#B392F0' },    // purple: namespaces, functions, classes/types after ::
  string: { light: '#032F62', dark: '#9ECBFF' },    // dark blue / light blue: strings, <headers>
  param: { light: '#E36209', dark: '#FFAB70' },     // orange: function parameters, lambda captures
  number: { light: '#005CC5', dark: '#79B8FF' },    // blue: numbers, booleans, nullptr
  comment: { light: '#6A737D', dark: '#6A737D' },   // grey: comments
  default: { light: '#24292E', dark: '#E1E4E8' },   // dark grey / light grey: punctuation, normal vars
};

const KEYWORDS = new Set([
  '#include', '#define', '#ifdef', '#ifndef', '#endif', '#pragma', '#if', '#else', '#elif',
  'using', 'namespace', 'void', 'int', 'auto', 'for', 'while', 'do', 'if', 'else', 'switch',
  'case', 'default', 'break', 'continue', 'return', 'const', 'constexpr', 'consteval', 'constinit',
  'static', 'extern', 'inline', 'virtual', 'override', 'final', 'explicit', 'friend', 'operator',
  'template', 'typename', 'class', 'struct', 'enum', 'union', 'public', 'private', 'protected',
  'sizeof', 'alignof', 'decltype', 'noexcept', 'co_await', 'co_return', 'co_yield', 'requires',
  'concept', 'export', 'import', 'module', 'mutable', 'volatile', 'register', 'thread_local',
  'signed', 'unsigned', 'short', 'long', 'char', 'char8_t', 'char16_t', 'char32_t', 'wchar_t',
  'bool', 'float', 'double', 'int8_t', 'int16_t', 'int32_t', 'int64_t', 'uint8_t', 'uint16_t',
  'uint32_t', 'uint64_t', 'size_t', 'ptrdiff_t', 'intptr_t', 'uintptr_t',
  'fn', 'let', 'mut', 'pub', 'impl', 'trait', 'where', 'match', 'loop', 'move', 'ref', ' self',
  'def', 'from', 'as', 'pass', 'lambda', 'yield', 'async', 'await', 'function', 'var',
]);

const LITERAL_CONSTS = new Set(['true', 'false', 'nullptr', 'NULL', 'None', 'True', 'False', 'undefined', 'NaN']);

const KNOWN_TYPES_AND_NS = new Set([
  'std', 'literals', 'this_thread', 'chrono', 'views', 'ranges', 'filesystem', 'execution',
  'stop_token', 'jthread', 'thread', 'atomic', 'mutex', 'unique_lock', 'lock_guard',
  'condition_variable', 'future', 'promise', 'optional', 'variant', 'any', 'expected',
  'string', 'string_view', 'vector', 'array', 'map', 'unordered_map', 'set', 'unordered_set',
  'tuple', 'pair', 'span', 'unique_ptr', 'shared_ptr', 'weak_ptr', 'function', 'hash', 'equal_to',
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  if (!line) return tokens;

  // 1. Check for #include line
  const includeMatch = line.match(/^(\s*)(#include)(\s+)(<[^>]+>|"[^"]+")(.*)$/);
  if (includeMatch) {
    const [, leading, inc, space, header, rest] = includeMatch;
    if (leading) tokens.push({ text: leading, ...COLORS.default });
    tokens.push({ text: inc, ...COLORS.keyword });
    tokens.push({ text: space + header, ...COLORS.string });
    if (rest) tokens.push(...tokenizeLine(rest));
    return tokens;
  }

  // Detect if this line has a function signature parameter list or lambda capture
  // Find parameter identifiers and lambda capture identifiers by character ranges
  const paramRanges: Array<[number, number]> = [];

  // Lambda capture: [num, id] -> or [num, id](
  const lambdaRegex = /\[([^\[\]]*)\](?=\s*(?:->|\(|\{))/g;
  let m: RegExpExecArray | null;
  while ((m = lambdaRegex.exec(line)) !== null) {
    const inner = m[1];
    const baseIdx = m.index + 1;
    const idRegex = /[A-Za-z_][A-Za-z0-9_]*/g;
    let im: RegExpExecArray | null;
    while ((im = idRegex.exec(inner)) !== null) {
      if (!KEYWORDS.has(im[0])) {
        paramRanges.push([baseIdx + im.index, baseIdx + im.index + im[0].length]);
      }
    }
  }

  // Function parameter list: e.g., (std::stop_token token, int num) { or ->
  const funcParamRegex = /\(([^()]*)\)(?=\s*(?:\{|->|const|noexcept|override|final))/g;
  while ((m = funcParamRegex.exec(line)) !== null) {
    const inner = m[1];
    const baseIdx = m.index + 1;
    // In each comma-separated parameter declaration, the last identifier is the parameter name
    let offset = 0;
    for (const part of inner.split(',')) {
      const idMatches = [...part.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)];
      if (idMatches.length >= 2) {
        const lastId = idMatches[idMatches.length - 1];
        if (lastId.index !== undefined && !KEYWORDS.has(lastId[0])) {
          const start = baseIdx + offset + lastId.index;
          paramRanges.push([start, start + lastId[0].length]);
        }
      }
      offset += part.length + 1;
    }
  }

  const isInParamRange = (start: number, end: number) =>
    paramRanges.some(([ps, pe]) => start >= ps && end <= pe);

  // Master token regex
  const masterRegex = /(\s+)|(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)([A-Za-z_][A-Za-z0-9_]*)?|(#?[A-Za-z_][A-Za-z0-9_]*)|(->|::|==|!=|<=|>=|\+\+|--|&&|\|\||<<|>>|\+=|-=|\*=|\/=|[=+\-*\/%<>!&|^~?:;,.()[\]{}])/g;

  let match: RegExpExecArray | null;
  while ((match = masterRegex.exec(line)) !== null) {
    const [full, ws, comment, str, num, numSuffix, ident, punct] = match;
    const idx = match.index;

    if (ws) {
      tokens.push({ text: ws, ...COLORS.default });
    } else if (comment) {
      tokens.push({ text: comment, ...COLORS.comment, italic: true });
    } else if (str) {
      tokens.push({ text: str, ...COLORS.string });
    } else if (num) {
      tokens.push({ text: num, ...COLORS.number });
      if (numSuffix) {
        tokens.push({ text: numSuffix, ...COLORS.keyword });
      }
    } else if (ident) {
      const endIdx = idx + ident.length;
      const afterText = line.slice(endIdx);
      const beforeText = line.slice(0, idx);

      if (KEYWORDS.has(ident)) {
        tokens.push({ text: ident, ...COLORS.keyword });
      } else if (LITERAL_CONSTS.has(ident)) {
        tokens.push({ text: ident, ...COLORS.number });
      } else if (isInParamRange(idx, endIdx)) {
        tokens.push({ text: ident, ...COLORS.param });
      } else if (
        KNOWN_TYPES_AND_NS.has(ident) ||
        /^\s*::/.test(afterText) ||
        /^\s*\(/.test(afterText) ||
        (/::\s*$/.test(beforeText) && /^\s+[A-Za-z_]/.test(afterText))
      ) {
        // Check if it's a type or member after :: — in Shiki github-light, std::stop_callback cb1{ has stop_callback default when followed by brace init, but std::stop_token token has stop_token purple
        tokens.push({ text: ident, ...COLORS.entity });
      } else {
        tokens.push({ text: ident, ...COLORS.default });
      }
    } else if (punct) {
      if (punct === '->' || punct === '::' || /^[;,()[\]{}.:]$/.test(punct)) {
        tokens.push({ text: punct, ...COLORS.default });
      } else {
        // Operators like =, ==, !=, <, >, ++, --, +, -
        tokens.push({ text: punct, ...COLORS.keyword });
      }
    } else {
      tokens.push({ text: full, ...COLORS.default });
    }
  }

  return tokens;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cleanCode = code.replace(/\n$/, '');
  const lines = cleanCode.split('\n');
  const displayLang = (language || 'cpp').toLowerCase();

  return (
    <div className="group relative my-4 rounded-lg bg-[#f6f6f7] dark:bg-[#161618] transition-colors overflow-hidden">
      {/* Top-right Copy Button: hidden by default, appears on hover matching VitePress */}
      <button
        type="button"
        title="Copy Code"
        aria-label="Copy Code"
        onClick={handleCopy}
        className={`copy absolute top-2.5 right-2.5 z-20 flex items-center justify-center h-10 rounded-[4px] border border-transparent bg-[#f6f6f7] dark:bg-[#161618] hover:bg-white dark:hover:bg-[#202127] hover:border-[#e2e2e3] dark:hover:border-[#2e2e32] text-[#71717a] dark:text-[#a1a1aa] hover:text-[#24292e] dark:hover:text-[#e1e4e8] transition-all duration-200 cursor-pointer ${
          copied
            ? 'opacity-100 px-2.5 gap-1.5 border-[#e2e2e3] dark:border-[#2e2e32] bg-white dark:bg-[#202127]'
            : 'w-10 opacity-0 group-hover:opacity-100 focus:opacity-100'
        }`}
      >
        {copied ? (
          <>
            <span className="text-[12px] font-medium text-[#57606a] dark:text-[#8b949e] font-sans">
              Copied
            </span>
            <svg className="w-4 h-4 text-[#225cd6] dark:text-[#58a6ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>

      {/* Top-right Language Label: visible by default, fades out on hover when Copy button appears */}
      <span
        className={`lang absolute top-2 right-3 z-10 text-[12px] font-medium text-[#8e8e93] dark:text-[#6e7681] font-mono select-none pointer-events-none transition-opacity duration-200 ${
          copied ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
        }`}
      >
        {displayLang}
      </span>

      {/* Code & Line Numbers Container */}
      <div className="relative flex items-start">
        {/* Left Line Numbers Wrapper matching VitePress .line-numbers-wrapper */}
        <div
          className="line-numbers-wrapper shrink-0 py-5 w-10 text-right pr-3 border-r border-[#e2e2e3] dark:border-[#2e2e32] text-[#8e8e93]/75 dark:text-[#6e7681] text-[13.5px] leading-[1.7] font-mono select-none"
          aria-hidden="true"
        >
          {lines.map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="line-number">{idx + 1}</span>
              <br />
            </React.Fragment>
          ))}
        </div>

        {/* Pre / Code Shiki-compatible Renderer */}
        <pre
          className="shiki shiki-themes github-light github-dark vp-code flex-1 m-0 py-5 px-6 overflow-x-auto text-[13.5px] leading-[1.7] font-mono"
          tabIndex={0}
        >
          <code className="block w-fit min-w-full">
            {lines.map((line, lineIdx) => {
              const tokens = tokenizeLine(line);
              return (
                <span key={lineIdx} className="line block min-h-[1.7em] whitespace-pre">
                  {tokens.map((tok, tokIdx) => (
                    <span
                      key={tokIdx}
                      style={
                        {
                          '--shiki-light': tok.light,
                          '--shiki-dark': tok.dark,
                        } as React.CSSProperties
                      }
                      className={`text-[var(--shiki-light)] dark:text-[var(--shiki-dark)] ${
                        tok.italic ? 'italic' : ''
                      }`}
                    >
                      {tok.text}
                    </span>
                  ))}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};