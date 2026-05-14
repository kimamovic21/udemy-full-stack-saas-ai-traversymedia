import { z } from "zod";

/**
 * Parse Zod validation errors into a field-keyed error map
 */
export function parseZodErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = issue.path[0]?.toString() || "unknown";
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(issue.message);
  }
  return fieldErrors;
}

/**
 * Validate URL uses http or https protocol only (prevents javascript:, data:, etc.)
 */
export function isValidUrlProtocol(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Zod schema for URLs that only allows http/https protocols
 */
export const safeUrlSchema = z
  .string()
  .url("Invalid URL")
  .refine(isValidUrlProtocol, "URL must use http or https protocol")
  .nullable()
  .optional()
  .transform((val) => val || null);
