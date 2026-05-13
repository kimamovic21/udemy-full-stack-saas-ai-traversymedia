"use client";

import { useRef, useState, useCallback } from "react";
import Editor, { OnMount, loader } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Configure Monaco to load from CDN
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
  },
});

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [value]);

  // Map common language aliases to Monaco language IDs
  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      rb: "ruby",
      sh: "shell",
      bash: "shell",
      zsh: "shell",
      yml: "yaml",
      md: "markdown",
      jsx: "javascript",
      tsx: "typescript",
    };
    return languageMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  const monacoLanguage = getMonacoLanguage(language);
  const displayLanguage = language || "plaintext";

  // Calculate height based on content lines (fluid height with max)
  const lineCount = value.split("\n").length;
  const lineHeight = 19; // Monaco default line height
  const padding = 16; // Top and bottom padding
  const minHeight = 100;
  const maxHeight = 400;
  const calculatedHeight = Math.min(
    Math.max(lineCount * lineHeight + padding, minHeight),
    maxHeight,
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-[#1e1e1e]">
      {/* Header with macOS dots, language, and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
        {/* macOS window dots */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
        </div>

        {/* Language and copy button */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {displayLanguage}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={calculatedHeight}
        language={monacoLanguage}
        value={value}
        onChange={(val) => onChange?.(val ?? "")}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineHeight: lineHeight,
          padding: { top: 8, bottom: 8 },
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          renderLineHighlight: readOnly ? "none" : "line",
          cursorStyle: readOnly ? "underline" : "line",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            useShadows: false,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          wordWrap: "off",
          folding: false,
          contextmenu: !readOnly,
          domReadOnly: readOnly,
        }}
      />
    </div>
  );
}
