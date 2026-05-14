"use client";

import { useRef } from "react";
import Editor, { OnMount, loader } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useClipboard } from "@/hooks/use-clipboard";
import EditorHeader from "./editor-header";

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
  const { copied, copy } = useClipboard();

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopy = () => copy(value);

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
      <EditorHeader
        label={displayLanguage}
        copied={copied}
        onCopy={handleCopy}
        copyTitle="Copy code"
      />

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
