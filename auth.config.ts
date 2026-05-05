import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth configuration.
 * Contains only providers - no adapter or database dependencies.
 * Used by proxy.ts for route protection in edge environments.
 */
export default {
  providers: [GitHub],
} satisfies NextAuthConfig;
