# PahamTeks Product Context

## Platform and audience
PahamTeks is a responsive web learning platform for Indonesian students and independent learners. It combines human-language learning with programming topics, quizzes, a dictionary, translation, language comparisons, and account-based progress tracking.

## Current product behavior
- Guests can try learning in a temporary browser session; registered users can keep account progress.
- The frontend is a React 18/Vite SPA. Page modules are lazy-loaded from `client/src/App.jsx`.
- Learning setup presents language flags or programming logos, chapter cards, and a static Teksie study panel. The home page also renders an interactive character cluster.
- AI quiz generation, explanations, dictionary results, and audio transcription use Google Gemini through the server API.
- Production hosting is Vercel with persistent TiDB Cloud storage. SQLite fallback is for local development only.
- `/healthz` is the public liveness endpoint; `/health` is restricted to administrators.
- Folder/document upload as user-specific AI learning material is a roadmap item and is not available yet.

## Product principles
- Use plain, supportive Indonesian by default and support the existing English UI.
- Explain answers clearly and do not invent sources or learning progress.
- Keep the responsive UI accessible and keep navigation, account state, and lesson selection understandable without decorative emoji.
- Treat user documents as untrusted reference material if/when upload is implemented. Enforce ownership and cite available source sections.
