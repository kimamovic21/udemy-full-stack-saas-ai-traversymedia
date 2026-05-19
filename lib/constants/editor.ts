/**
 * Editor preferences types and defaults for Monaco editor
 */

export interface EditorPreferences {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  theme: EditorTheme;
}

export type EditorTheme = "vs-dark" | "monokai" | "github-dark";

export const EDITOR_THEMES: { value: EditorTheme; label: string }[] = [
  { value: "vs-dark", label: "VS Dark" },
  { value: "monokai", label: "Monokai" },
  { value: "github-dark", label: "GitHub Dark" },
];

export const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];

export const TAB_SIZES = [2, 4, 8];

export const DEFAULT_EDITOR_PREFERENCES: EditorPreferences = {
  fontSize: 13,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  theme: "vs-dark",
};

/**
 * Merge user preferences with defaults, ensuring all fields are present
 */
export function mergeWithDefaults(
  preferences: Partial<EditorPreferences> | null | undefined,
): EditorPreferences {
  return {
    ...DEFAULT_EDITOR_PREFERENCES,
    ...preferences,
  };
}
