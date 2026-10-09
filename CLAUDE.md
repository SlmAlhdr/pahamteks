# Claude Code instructions

Follow [`AGENTS.md`](./AGENTS.md) as the canonical project guidance and [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for current system details. Do not rely on duplicated or stale architecture summaries.

Useful commands:

- Frontend development: `npm --prefix client run dev`
- Backend development: `npm --prefix server run dev`
- Frontend build: `npm --prefix client run build`
- Database initialization: `npm --prefix server run init-db`

The active frontend is React/Vite, while the API is Express/Apollo GraphQL. Production uses TiDB; SQLite is local-development fallback. Document-folder learning is planned only. Do not commit environment secrets or local databases.
