# Current Feature: Auth UI - Sign In, Register & Sign Out

Replace NextAuth default pages with custom UI. Update user icon, email and username in bottom of sidebar.

## Status

In Progress

## Goals

- Create custom Sign In page (`/sign-in`) with email/password fields and GitHub OAuth button
- Create custom Register page (`/register`) with name, email, password, confirm password fields
- Form validation and error display on both pages
- Link register page to sign-in page
- Submit register form to `/api/auth/register` endpoint
- Display user avatar in sidebar (GitHub image or initials fallback)
- Display user name in sidebar
- Dropdown menu on avatar click with "Sign out" link
- Avatar click navigates to "/profile"
- Create reusable avatar component handling both image and initials

## Notes

- Avatar logic: If user has `image` (from GitHub), use that. Otherwise, generate initials from name (e.g., "Brad Traversy" → "BT")
- Need to create a reusable UserAvatar component that handles both cases

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
