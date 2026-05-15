<div align="left">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Claude-black?style=for-the-badge&logoColor=white&logo=anthropic&color=C97C5D" alt="Claude" />
  </div>

  <div align="center">
    <h3 align="center">Meetly AI</h3>
    <p align="center">A focused video-meeting workspace with an in-product AI assistant.</p>
  </div>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🧠 [AI Features](#ai-features)
6. 🌐 [Environment Variables](#environment-variables)

## <a name="introduction">🤖 Introduction</a>

Meetly AI is a modern, focused video-meeting workspace built on Next.js 16 (App Router, React 19, Turbopack), [Stream](https://getstream.io/video/) for real-time video, [Clerk](https://clerk.com) for auth, and [Claude](https://claude.com) for the in-product AI assistant. The interface is built around a dark mint design system with a feature-rich dashboard: live agenda, recordings library, team presence, calendar, command palette (⌘K), whiteboard, and AI-generated meeting summaries.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Next.js 16** — App Router + Server Actions
- **React 19** + TypeScript (strict)
- **Tailwind CSS 3** with a custom ink / mint / coral design system
- **Stream Video SDK** for real-time meetings, recordings, layouts
- **Clerk** for authentication
- **Claude API (Opus 4.7)** for the AI assistant and meeting summaries
- **shadcn/ui primitives** (Calendar, Command, Popover, Tabs, ScrollArea, Tooltip, Avatar, Separator, Switch, Badge, Skeleton)
- **cmdk** for the command palette
- **react-day-picker** + **date-fns** for the calendar

## <a name="features">🔋 Features</a>

- **Auth** — Clerk-powered sign in / sign up with social providers, branded Meetly AI screens.
- **Hero dashboard** — greeting + live clock + next-on-calendar card + KPI tiles, all clickable and routing into relevant pages.
- **Today's agenda timeline** — vertical timeline 07:00–21:00 with a moving "now" line and real + mock meeting blocks.
- **Mini calendar + dedicated `/schedule` page** — real interactive calendar; days with meetings are dotted in mint; clicking a day opens the day detail.
- **Quick actions** — Resume last meeting, Invite a teammate, Open whiteboard, Generate AI summary.
- **Whiteboard** — real `<canvas>` with pen, eraser, palette, brush sizes, undo, clear, save-to-localStorage, PNG export.
- **AI assistant panel** — streaming chat with Claude, prompt chips, conversation history, abort + clear.
- **AI meeting summary** — pick a recent ended call, Claude returns a structured summary (TL;DR + decisions + action items) which you can copy as markdown or download as `.md`.
- **Recordings strip** — horizontal scroller pulling real recordings via the Stream API.
- **Activity feed** — filterable workspace activity (joins, mentions, summaries, recordings, scheduled).
- **Team presence** — avatars with online/busy/idle dots; click to start a 1:1 call or invite to a meeting.
- **Command palette (⌘K)** — global search across pages, meetings, recordings, quick actions, workspaces.
- **Notifications popover** — unread counter, mark-as-read, click-through.
- **Workspace switcher** — three mock workspaces persisted to localStorage.
- **Sidebar** — collapsible (88px ↔ 272px), pinned rooms, live-meeting CTA, focus-mode toggle.
- **Meeting room** — Stream video grid + speaker layouts, layout switcher, participants, chat, stats, end-for-everyone (host only).
- **Personal room** — always-on shareable room.

## <a name="quick-start">🤸 Quick Start</a>

**Prerequisites:** Node 22+, pnpm 10.

```bash
git clone <your-fork> meetly
cd meetly
pnpm install
cp .env.local.example .env.local  # fill in the values below
pnpm dev
```

Open <http://localhost:3000>.

```bash
pnpm build   # production build
pnpm start   # serve the build
pnpm lint    # eslint
```

## <a name="ai-features">🧠 AI Features</a>

Both AI surfaces are server-only — the Anthropic key never reaches the browser. Clerk auth is required.

- `POST /api/ai/chat` — streaming chat backing the AI assistant panel. Uses `claude-opus-4-7` with adaptive thinking + `effort: "low"` and prompt caching on the system prompt.
- `POST /api/ai/summary` — structured-output meeting summary backing the summary dialog. Uses `claude-opus-4-7` with adaptive thinking + `effort: "medium"` and a JSON schema enforced via `output_config.format`.

System prompts live in `lib/ai/system.ts` — edit them to change the assistant's behavior.

## <a name="environment-variables">🌐 Environment Variables</a>

```env
# Public
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_STREAM_API_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Server-only
STREAM_SECRET_KEY=...
CLERK_SECRET_KEY=...
ANTHROPIC_API_KEY=sk-ant-...
```

Get keys from:
- Stream — <https://getstream.io/dashboard>
- Clerk — <https://dashboard.clerk.com>
- Claude — <https://console.anthropic.com/settings/keys>

---

Built with care · Powered by Claude.
