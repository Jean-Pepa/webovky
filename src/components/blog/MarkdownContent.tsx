"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>

      <style jsx global>{`
        .markdown-content h1 { font-size: 2rem; margin: 2rem 0 1rem; }
        .markdown-content h2 { font-size: 1.5rem; margin: 1.5rem 0 0.75rem; }
        .markdown-content h3 { font-size: 1.2rem; margin: 1.25rem 0 0.5rem; }
        .markdown-content p { margin: 0.75rem 0; line-height: 1.8; }
        .markdown-content ul, .markdown-content ol { margin: 0.75rem 0; padding-left: 1.5rem; }
        .markdown-content li { margin: 0.25rem 0; }
        .markdown-content blockquote { border-left: 3px solid #ddd; padding-left: 1rem; margin: 1rem 0; color: #666; }
        .markdown-content code { background: #f4f4f4; padding: 0.15rem 0.4rem; font-size: 0.9em; }
        .markdown-content pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
        .markdown-content pre code { background: none; padding: 0; }
        .markdown-content img { max-width: 100%; height: auto; margin: 1rem 0; }
        .markdown-content a { text-decoration: underline; }
      `}</style>
    </div>
  );
}
