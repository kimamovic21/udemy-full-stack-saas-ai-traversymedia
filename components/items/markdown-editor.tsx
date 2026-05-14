"use client";

import { useState, useRef, useEffect } from "react";
import { useClipboard } from "@/hooks/use-clipboard";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import EditorHeader from "./editor-header";

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = "Write your content here...",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">(
    readOnly ? "preview" : "write",
  );
  const { copied, copy } = useClipboard();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => copy(value);

  // Auto-resize textarea based on content (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (textareaRef.current && activeTab === "write") {
        textareaRef.current.style.height = "auto";
        const scrollHeight = textareaRef.current.scrollHeight;
        const minHeight = 200;
        const maxHeight = 400;
        textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [value, activeTab]);

  // Calculate height based on content lines (for preview)
  const lineCount = value.split("\n").length;
  const lineHeight = 24;
  const padding = 32;
  const minHeight = 200;
  const maxHeight = 400;
  const calculatedHeight = Math.min(
    Math.max(lineCount * lineHeight + padding, minHeight),
    maxHeight,
  );

  // Tabs for write/preview mode (only shown when not readonly)
  const tabs = readOnly
    ? undefined
    : [
        { id: "write", label: "Write" },
        { id: "preview", label: "Preview" },
      ];

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-[#1e1e1e]">
      <EditorHeader
        label="Markdown"
        copied={copied}
        onCopy={handleCopy}
        copyTitle="Copy content"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as "write" | "preview")}
        showDots={readOnly}
      />

      {/* Content area */}
      {activeTab === "write" && !readOnly ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#1e1e1e] text-foreground font-mono text-sm p-4 resize-none focus:outline-none placeholder:text-muted-foreground/50 editor-scrollbar overflow-y-auto"
          style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
        />
      ) : (
        <div
          className="prose prose-invert prose-sm max-w-none p-4 overflow-y-auto editor-scrollbar"
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
            height: value ? `${calculatedHeight}px` : `${minHeight}px`,
          }}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground/50 text-sm italic">
              Nothing to preview
            </p>
          )}
        </div>
      )}
    </div>
  );
}
