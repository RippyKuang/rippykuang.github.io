import { parseMarkdown, ParsedMarkdown } from '../utils/markdownParser';

import rawAboutMarkdown from '../content/about.md?raw';

// Use Vite's eager glob to load all markdown files synchronously at startup (0ms latency!)
const rawPostModules = import.meta.glob('/src/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export interface PostMeta {
  id: string;
  title: string;
  date: string;
  year: string;
  month: string;
  topics: string[];
  summary: string;
}

export interface DynamicTopic {
  name: string;
  count: number;
}

export interface ArchiveMonth {
  month: string;
  articles: {
    id: string;
    title: string;
    date: string;
  }[];
}

export interface ArchiveYear {
  year: string;
  months: ArchiveMonth[];
}

// In-memory cache for parsed posts
const postCache = new Map<string, ParsedMarkdown>();

// Synchronously compute all post metadata at module initialization time
const allPostMetas: PostMeta[] = (() => {
  const metas: PostMeta[] = [];
  const entries = Object.entries(rawPostModules);

  for (const [path, rawText] of entries) {
    const idMatch = path.match(/\/([^/]+)\.md$/);
    const id = idMatch ? idMatch[1] : '';

    try {
      const parsed = parseMarkdown(rawText);
      postCache.set(id, parsed);
      metas.push({
        id,
        title: parsed.metadata.title,
        date: parsed.metadata.date,
        year: parsed.metadata.year,
        month: parsed.metadata.month,
        topics: parsed.metadata.topics,
        summary: parsed.metadata.summary,
      });
    } catch (err) {
      console.error(`Failed to parse post metadata for ${path}:`, err);
    }
  }

  // Sort descending by date
  metas.sort((a, b) => b.date.localeCompare(a.date));
  return metas;
})();

// Instant synchronous retrieval of all posts (0ms loading!)
export function getAllPostMetasSync(): PostMeta[] {
  return allPostMetas;
}

export async function getAllPostMetas(): Promise<PostMeta[]> {
  return allPostMetas;
}

// Instant synchronous retrieval of a single post by ID
export function getPostSync(postId: string): ParsedMarkdown | null {
  if (postCache.has(postId)) {
    return postCache.get(postId)!;
  }
  const filePath = `/src/posts/${postId}.md`;
  const rawText = rawPostModules[filePath];
  if (!rawText) return null;

  const parsed = parseMarkdown(rawText);
  postCache.set(postId, parsed);
  return parsed;
}

export async function loadPost(postId: string): Promise<ParsedMarkdown | null> {
  return getPostSync(postId);
}

// Synchronous dynamic retrieval of About markdown post
export function getAboutMarkdownSync(): ParsedMarkdown {
  return parseMarkdown(rawAboutMarkdown);
}

// Construct archive directory tree 100% dynamically from Markdown files
export function buildArchiveTree(posts: PostMeta[]): ArchiveYear[] {
  const yearMap = new Map<string, Map<string, { id: string; title: string; date: string }[]>>();

  for (const post of posts) {
    if (!yearMap.has(post.year)) {
      yearMap.set(post.year, new Map());
    }
    const monthMap = yearMap.get(post.year)!;
    if (!monthMap.has(post.month)) {
      monthMap.set(post.month, []);
    }
    monthMap.get(post.month)!.push({
      id: post.id,
      title: post.title,
      date: post.date,
    });
  }

  // Years sorted ascending: 2024, 2025, 2026 (matching screenshot)
  const years = Array.from(yearMap.keys()).sort((a, b) => a.localeCompare(b));

  const result: ArchiveYear[] = years.map((year) => {
    const monthMap = yearMap.get(year)!;
    // Months sorted ascending: 01, 02, 03... 12
    const months = Array.from(monthMap.keys()).sort((a, b) => a.localeCompare(b));

    return {
      year,
      months: months.map((month) => {
        const articles = monthMap.get(month)!;
        articles.sort((a, b) => a.date.localeCompare(b.date));
        return {
          month,
          articles,
        };
      }),
    };
  });

  return result;
}

// Extract topics 100% dynamically from Markdown files
export function extractTopicsFromPosts(posts: PostMeta[]): DynamicTopic[] {
  const countMap: Record<string, number> = {};

  for (const post of posts) {
    for (const t of post.topics) {
      if (t) {
        countMap[t] = (countMap[t] || 0) + 1;
      }
    }
  }

  return Object.entries(countMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
