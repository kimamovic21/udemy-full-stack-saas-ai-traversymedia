"use client";

import { useRef } from "react";
import Editor, { OnMount, loader, Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useClipboard } from "@/hooks/use-clipboard";
import { useEditorPreferences } from "@/components/settings/editor-preferences-provider";
import type { EditorTheme } from "@/lib/constants/editor";
import EditorHeader from "./editor-header";

// Configure Monaco to load from CDN
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
  },
});

// Define custom themes
function defineCustomThemes(monaco: Monaco) {
  // Monokai theme
  monaco.editor.defineTheme("monokai", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "88846f" },
      { token: "keyword", foreground: "f92672" },
      { token: "string", foreground: "e6db74" },
      { token: "number", foreground: "ae81ff" },
      { token: "type", foreground: "66d9ef" },
      { token: "function", foreground: "a6e22e" },
      { token: "variable", foreground: "f8f8f2" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#f8f8f2",
      "editor.lineHighlightBackground": "#3e3d32",
      "editorCursor.foreground": "#f8f8f0",
      "editor.selectionBackground": "#49483e",
    },
  });

  // GitHub Dark theme
  monaco.editor.defineTheme("github-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8b949e" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "string", foreground: "a5d6ff" },
      { token: "number", foreground: "79c0ff" },
      { token: "type", foreground: "ffa657" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "c9d1d9" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.lineHighlightBackground": "#161b22",
      "editorCursor.foreground": "#c9d1d9",
      "editor.selectionBackground": "#264f78",
    },
  });
}

// Map theme names to Monaco theme names
function getMonacoTheme(theme: EditorTheme): string {
  const themeMap: Record<EditorTheme, string> = {
    "vs-dark": "vs-dark",
    monokai: "monokai",
    "github-dark": "github-dark",
  };
  return themeMap[theme];
}

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
  const { preferences } = useEditorPreferences();

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    // Define custom themes when Monaco mounts
    defineCustomThemes(monaco);
    // Apply the selected theme
    monaco.editor.setTheme(getMonacoTheme(preferences.theme));
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
  // Calculate line height based on font size (roughly 1.5x the font size)
  const lineHeight = Math.round(preferences.fontSize * 1.5);
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
        theme={getMonacoTheme(preferences.theme)}
        options={{
          readOnly,
          minimap: { enabled: preferences.minimap },
          scrollBeyondLastLine: false,
          fontSize: preferences.fontSize,
          tabSize: preferences.tabSize,
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
          wordWrap: preferences.wordWrap ? "on" : "off",
          folding: false,
          contextmenu: !readOnly,
          domReadOnly: readOnly,
        }}
      />
    </div>
  );
}
