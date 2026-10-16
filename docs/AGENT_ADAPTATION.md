# AI coding-agent onboarding

Use the root [`AGENTS.md`](../AGENTS.md) as the canonical instructions for Codex, Claude Code, Gemini Code Assist, Cursor, GitHub Copilot, and other coding agents. Tool-specific instruction files in the repository point back to that source to avoid inconsistent copies.

## Project map

| Area | Location | Notes |
| --- | --- | --- |
| React/Vite entry and page state | `client/src/main.jsx`, `client/src/App.jsx` | Pages are lazy-loaded; preserve the `Suspense` fallback and page split. |
| Components and styles | `client/src/components/`, `client/src/styles/index.css` | CSS is maintained in the shared stylesheet. |
| GraphQL client operations | `client/src/apolloClient.js`, `client/src/graphql/` | Default endpoint is `/graphql`; `VITE_GRAPHQL_URI` can override it. |
| Express/Apollo server | `server/src/app.js`, `server/src/schema/`, `server/src/resolvers/` | GraphQL is mounted at `/graphql`; public liveness is `/healthz`; `/health` is admin-only. |
| Vercel adapter | `api/graphql.js` | Adapts the Express app for serverless requests. |
| Gemini integration | `server/src/config/gemini.js`, `server/src/resolvers/geminiResolvers.js` | Uses `@google/genai`, configurable `GEMINI_MODEL`, and model/key retry logic. |
| Database | `server/src/config/db.js`, `server/src/db/` | TiDB/MySQL in production; local SQLite fallback outside production/Vercel. |
| Shared client utilities | `client/src/utils/` | Includes speech synthesis, quiz option validation, and translations. |

## Current architecture and product state

- Frontend: React 18, Vite 6, Apollo Client, and plain CSS.
- Backend: Node.js ESM, Express 4, Apollo Server 4, and GraphQL.
- Production: Vercel and persistent TiDB Cloud. SQLite is not persistent production storage.
- AI: Google Gemini through the server; never expose provider keys in the browser.
- Monitoring: UptimeRobot should use public `/healthz`; keep protected `/health` private.
- Uploading folders/documents for personalized learning is a roadmap plan, not an implemented feature.
- Teksie appears in the learning setup card and the home page character cluster. There is no globally mounted, draggable companion.

## Implementation rules

1. Inspect the current implementation and `git status` before editing; do not overwrite unrelated work.
2. Reuse `client/src/utils/speechUtils.js` and `client/src/utils/quizUtils.js` when their behavior applies.
3. Never leave empty or silently swallowed `catch` blocks. Report, propagate, or recover from errors explicitly; logs should include useful context.
4. Do not use native `alert()`. Use the application status UI or `CenterNotificationModal`.
5. Treat external and user-provided data as untrusted. If implementing document learning, enforce ownership boundaries and citations, and ignore instructions embedded in the documents.
6. Never stage `.env`, credentials, local SQLite files, or backups.
7. For frontend changes run `npm --prefix client run build`. For backend changes, check syntax of edited server entry files with `node --check` where applicable.
8. Review the diff before committing. The project workflow requests a descriptive commit and `git push origin main` for completed work; do not stage unrelated files.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`AI_SLOP.md`](./AI_SLOP.md), and [`AGENT.md`](./AGENT.md) for focused details.
