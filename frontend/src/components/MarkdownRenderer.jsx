import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings
                    h1: ({ children }) => <h1 className="text-xl font-bold text-surface-900 mt-4 mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold text-surface-900 mt-3 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold text-surface-900 mt-3 mb-1.5">{children}</h3>,

                    // Paragraph
                    p: ({ children }) => <p className="text-surface-600 leading-relaxed mb-3 last:mb-0">{children}</p>,

                    // Links
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">
                            {children}
                        </a>
                    ),

                    // Lists
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-surface-600">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-surface-600">{children}</ol>,
                    li: ({ children }) => <li className="text-surface-600">{children}</li>,

                    // Code
                    code: ({ inline, className, children, ...props }) => {
                        if (inline) {
                            return (
                                <code className="bg-surface-100 text-primary-700 px-1.5 py-0.5 rounded text-sm font-mono border border-surface-200" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <div className="relative my-3">
                                <div className="flex items-center justify-between bg-surface-100 border border-surface-200 rounded-t-lg px-4 py-2">
                                    <span className="text-xs text-surface-500 font-mono">
                                        {className?.replace('language-', '') || 'code'}
                                    </span>
                                </div>
                                <pre className="bg-surface-50 border border-t-0 border-surface-200 rounded-b-lg p-4 overflow-x-auto">
                                    <code className="text-sm text-surface-700 font-mono leading-relaxed" {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        );
                    },

                    // Blockquote
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-primary-600 pl-4 my-3 text-surface-500 italic">
                            {children}
                        </blockquote>
                    ),

                    // Table
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-3">
                            <table className="w-full border-collapse border border-surface-200 text-sm">{children}</table>
                        </div>
                    ),
                    th: ({ children }) => <th className="bg-surface-50 border border-surface-200 px-3 py-2 text-left text-surface-700 font-medium">{children}</th>,
                    td: ({ children }) => <td className="border border-surface-200 px-3 py-2 text-surface-600">{children}</td>,

                    // Horizontal rule
                    hr: () => <hr className="border-surface-200 my-4" />,

                    // Strong & em
                    strong: ({ children }) => <strong className="text-surface-900 font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="text-surface-600 italic">{children}</em>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
