# Current Feature: Email Verification Toggle

## Status

In Progress

## Goals

- Add environment variable `SKIP_EMAIL_VERIFICATION` to control email verification behavior
- When `SKIP_EMAIL_VERIFICATION=true`, skip sending verification emails and auto-verify users on registration
- When disabled or not set, email verification works as currently implemented
- Update registration flow to check the toggle
- Update sign-in flow to skip verification check when toggle is enabled
- Document the environment variable in `.env.example`

## Notes

- Currently no domain is linked to Resend, so only the Resend test email can receive verification emails
- This toggle allows local development and testing without a verified domain
- Environment variable approach keeps the feature simple and follows existing patterns in the codebase
- Default behavior (no env var set) should require verification to maintain security in production

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
