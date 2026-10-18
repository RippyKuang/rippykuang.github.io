export interface ArticleSection {
  id: string;
  title: string;
  bulletText?: string;
  paragraphs: string[];
  codeSnippets?: {
    language: string;
    code: string;
    explanation?: string;
  }[];
  proposalRef?: {
    text: string;
    title: string;
    paperId: string;
    summary: string;
    linkUrl?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  date: string;
  year: string;
  month: string;
  summary: string;
  topics: string[];
  readingTime: string;
  wordCount: number;
  sections: ArticleSection[];
}

export interface ArchiveYear {
  year: string;
  months: {
    month: string;
    articles: {
      id: string;
      title: string;
      date: string;
    }[];
  }[];
}

export const BLOG_TITLE = "Daliy Nuts";

