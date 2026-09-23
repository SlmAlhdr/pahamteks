# PahamTeks AI Agent Instructions

Welcome to **PahamTeks**. As an AI Coding Assistant working on this codebase, you must adapt to the following project standards:

## Project Overview
- **App**: Dual-domain learning platform (Human Languages & Programming Logic)
- **Frontend**: React 18, Vite 6, Apollo Client GraphQL, pure CSS in `client/src/styles/index.css`.
- **Backend**: Node.js ESM, Apollo Server v4 (`/graphql`), Express.js, REST `/health`.
- **Database**: Dual Database Failover (MySQL primary with auto-failover to SQLite `server/data/pahamteks_backup.sqlite`).
- **Detailed Documentation**: See `docs/AGENT_ADAPTATION.md` and `docs/ARCHITECTURE.md`.

## Coding Standards (Zero AI Slop)
1. **No Swallowed Catches**: Never leave empty `catch (e) {}` blocks. Always log with `console.warn` or handle gracefully.
2. **Reuse Shared Utilities**:
   - Speech synthesis: `import { speakText } from '../utils/speechUtils';`
   - Quiz options validation: `import { LETTERS, cleanOptionText, isOptionCorrect } from '../utils/quizUtils';`
3. **No Browser Alerts**: Avoid native `alert()`. Use responsive UI status or `CenterNotificationModal`.
4. **Build Verification**: Always run `npm --prefix client run build` to verify frontend build passes before finishing tasks.
5. **Zero Leak Policy**: NEVER commit or stage `.env` files or local SQLite databases.
