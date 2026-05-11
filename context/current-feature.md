# Current Feature: Item Drawer

## Status

In Progress

## Goals

- Right-side slide-in drawer using shadcn Sheet component that opens when clicking an ItemCard
- Works on both dashboard and items list pages
- Action bar with Favorite (star, yellow when active), Pin, Copy, Edit (pencil), and Delete (trash, right-aligned)
- Client wrapper component to manage drawer state (pages are server components)
- Full item detail fetched on click via API route (`/api/items/[id]`), no page navigation
- Query function in `lib/db/items.ts`, API route with auth check
- Skeleton/loading state while fetching
- Display: item type icon + title, type badge, language badge, description, content (with code block for snippets), tags, collections, created/updated dates
- Focus on detail display only — code editor and item-specific features come later

## Notes

- Card data (title, description, tags) already fetched by server components
- Full item detail (content, collections, language, etc.) fetched on click via API
- Reference screenshot: `context/screenshots/dashboard-ui-drawer.png`
- Drawer header: type icon + title, type badge, language badge
- Action bar: Favorite | Pin | Copy | Edit ... Delete (right-aligned with gap)
- Content sections: Description, Content (code block with line numbers for text types), Tags, Collections, Details (created/updated dates)

## History

- **Initial Setup** - Next.js 16, Tailwind CSS v4, TypeScript configured (Completed)
- **Dashboard UI Phase 1** - ShadCN UI initialization, dashboard route at /dashboard, main layout with dark mode, top bar with search and buttons, sidebar and main placeholders (Completed)
- **Dashboard UI Phase 2** - Collapsible sidebar with item type navigation, favorite and recent collections, user avatar area, mobile drawer, and responsive behavior (Completed)
- **Dashboard UI Phase 3** - Main content area with stats cards, collections section, pinned items, and recent items list (Completed)
- **Prisma + Neon PostgreSQL** - Prisma 7 ORM with Neon PostgreSQL, full schema with User, NextAuth, Item, ItemType, Collection, Tag models, indexes, cascade deletes, seed file for system item types, initial migration (Completed)
- **Seed Data** - Demo user ([demo@devstash.io]), 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources), 17 items (snippets, prompts, commands, links) with bcryptjs password hashing (Completed)
- **Dashboard Collections** - Real database data for collections section, dynamic border colors from most-used item type, type icons display, server component data fetching with Prisma (Completed)
- **Dashboard Items** - Real database data for pinned and recent items, item type icons/colors, tags display, server component data fetching with Prisma (Completed)
- **Stats & Sidebar** - Real database data for stats cards and sidebar, item types with counts and custom ordering, favorite/recent collections with colored indicators, "View all collections" link (Completed)
- **Pro Badge Sidebar** - PRO badge on Files and Images item types in desktop and mobile sidebars using ShadCN Badge component (Completed)
- **Code Quality Quick Wins** - N+1 query fix using Prisma _count and take, database indexes for common queries, shared ICON_MAP with fallback, shared date utility, dashboard loading/error states, query limit validation (Completed)
- **Auth Setup Phase 1** - NextAuth v5 with GitHub OAuth, split auth config for edge compatibility, Prisma adapter with JWT strategy, /dashboard route protection via proxy, Session type with user.id (Completed)
- **Auth Setup Phase 2** - Credentials provider with email/password, bcrypt validation, /api/auth/register endpoint with validation (Completed)
- **Auth Setup Phase 3** - Custom sign-in and register pages, reusable UserAvatar component with image/initials fallback, sidebar user dropdown with profile link and sign out, Sonner toast notifications, dashboard uses authenticated session (Completed)
- **Email Verification** - Resend SDK integration, verification tokens on registration, verification emails, /api/auth/verify endpoint, /verify-email page, sign-in blocking for unverified users, resend functionality, edge case handling (Completed)
- **Email Verification Toggle** - SKIP_EMAIL_VERIFICATION env variable to bypass email verification during development, auto-verify on registration, skip sign-in check when enabled (Completed)
- **Forgot Password** - Forgot password link on sign-in, /forgot-password and /reset-password pages, API endpoints for token generation and password reset, password reset emails via Resend, reuses VerificationToken model with prefix, 1-hour token expiry, edge case handling (Completed)
- **Profile Page** - Profile page at /profile with user info, usage stats with item type breakdown, change password for email users, delete account with confirmation dialog, API endpoints for password change and account deletion (Completed)
- **Rate Limiting for Auth** - Upstash Redis rate limiting on auth endpoints, reusable rate-limit utility with sliding window algorithm, protects login/register/forgot-password/reset-password/resend-verification with configurable limits, 429 responses with Retry-After header, fail-open design (Completed)
- **Items List View** - Dynamic route /items/[type] for type-filtered item lists, getItemsByType query with pinned-first sorting, responsive two-column grid using existing ItemCard, type validation with 404, empty state (Completed)
- **Vitest Setup** - Vitest for unit testing server actions and utilities (not components), co-located test files, sample date utility tests, updated workflow and coding standards docs (Completed)
- **Items List Three-Column Layout** - Changed items grid from 2 to 3 columns on lg breakpoint, responsive 1/2/3 column layout (Completed)
