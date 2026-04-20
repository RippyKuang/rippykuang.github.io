/// <reference types="vite/client" />

export interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  excerpt: string;
}

export interface Project {
  id: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  repo?: string;
  link?: string;
}

export const ABOUT_ME = {
  name: "张三 (San Zhang)",
  bio: "保持好奇，保持热爱。致力于构建高性能、易维护的系统。",
  email: "hello@example.com",
  github: "https://github.com",
  twitter: "https://twitter.com"
};

export const TECH_STACK = ['React', 'TypeScript', 'Node.js', 'Go', 'Docker', 'Kubernetes', 'PostgreSQL'];

const mdFiles = import.meta.glob('/src/posts/**/*.md', { eager: true, query: '?raw', import: 'default' });
const projectFiles = import.meta.glob('/src/projects/**/*.md', { eager: true, query: '?raw', import: 'default' });

export const POSTS: Post[] = [];
export const PROJECTS: Project[] = [];

// Helper to parse markdown files with basic frontmatter
function parseMarkdown(rawContent: string, defaultId: string) {
  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  let result: Record<string, string> = {
    id: defaultId,
    title: defaultId,
    date: '1970-01-01',
    excerpt: '',
    content: rawContent
  };

  if (match) {
    const frontmatter = match[1];
    result.content = match[2];
    const lines = frontmatter.split('\n');
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > -1) {
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        result[key] = value;
      }
    }
  }
  return result;
}

for (const path in mdFiles) {
  const rawContent = mdFiles[path] as string;
  const pathParts = path.split('/');
  const filename = pathParts[pathParts.length - 1];
  const category = pathParts[pathParts.length - 2];
  const id = filename.replace(/\.md$/, '');

  const parsed = parseMarkdown(rawContent, id);
  POSTS.push({ 
    id, 
    title: parsed.title, 
    date: parsed.date, 
    category, 
    content: parsed.content, 
    excerpt: parsed.excerpt 
  });
}

for (const path in projectFiles) {
  const rawContent = projectFiles[path] as string;
  const pathParts = path.split('/');
  const filename = pathParts[pathParts.length - 1];
  const id = filename.replace(/\.md$/, '');

  const parsed = parseMarkdown(rawContent, id);
  PROJECTS.push({
    id,
    title: parsed.title,
    date: parsed.date,
    content: parsed.content,
    excerpt: parsed.excerpt,
    repo: parsed.repo,
    link: parsed.link
  });
}

// Sort both by date descending
POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
PROJECTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Automatically calculate all available categories
export const CATEGORIES = Array.from(new Set(POSTS.map(p => p.category)));
