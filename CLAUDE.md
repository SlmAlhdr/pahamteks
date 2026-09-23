# CLAUDE.md — PahamTeks Project Guidelines

## Commands
- Run Frontend: `npm --prefix client run dev` (Port 5173)
- Run Backend: `npm --prefix server run dev` (Port 4000)
- Build Frontend: `npm --prefix client run build`
- Backup Database: `npm --prefix server run backup-db`
- Initialize DB: `npm --prefix server run init-db`

## Architecture & Code Standards
- **Stack**: React 18 + Vite, Apollo GraphQL Client/Server, Express.js, MySQL + SQLite failover (`node:sqlite`).
- **Zero AI Slop**: No empty `catch (e) {}` blocks, no duplicate helpers, no hallucinated imports.
- **Shared Utilities**:
  - `client/src/utils/speechUtils.js` for Web Speech synthesis
  - `client/src/utils/quizUtils.js` for quiz normalization and option validation
- **Documentation**: Kept locally in `docs/` (refer to `docs/AGENT_ADAPTATION.md`).
- **Security**: Never expose `.env` credentials or commit local `.sqlite` databases.
