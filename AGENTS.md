# AGENTS.md

## Learned User Preferences

- Avoid `any` in TypeScript. Prefer `unknown`, generics, `as const`, or precise types. The user has repeatedly pushed back ("Don't use any!"); only use `eslint-disable @typescript-eslint/no-explicit-any` at genuine library boundaries with a brief comment explaining why.
- Use Context7 / the `docs-researcher` subagent for library and API documentation lookups (Vercel AI SDK, Elysia, better-auth, Kysely, TanStack, etc.) instead of relying on memory.

## Learned Workspace Facts

- Monorepo managed by Turborepo + Bun (runtime *and* package manager) with workspaces `apps/*` and `packages/*`. Root `package.json` declares `packageManager: bun@1.3.13`. Use `bun run <script>` and `bun --bun run dev|build`; do NOT use `npm`.
- Two apps: `apps/backend` (Elysia API + Vercel AI SDK agent + better-auth + Kysely/Postgres + logixlysia) and `apps/frontend` (Vite + React 19 + TanStack Router/Query/Start/Store + Tailwind v4 + shadcn/ui + AI Elements + better-auth client).
- Dev ports: backend on `3000`, frontend on `3001`. Backend CORS in `apps/backend/src/index.ts` is locked to `http://localhost:3001` with `credentials: true`; mirror this when adding origins.
- better-auth is mounted at `/auth` with `basePath: '/api'`, so endpoints live under `http://localhost:3000/auth/api/*`. Frontend `authClient` uses `baseURL: 'http://localhost:3000'` + `basePath: '/auth/api'`. Server config sets `trustedOrigins: ['http://localhost:3001']` and cookie attrs `sameSite: 'none', secure: true, partitioned: true` for cross-origin sessions.
- Social sign-in must pass an absolute `callbackURL` (e.g. `` `${window.location.origin}/` ``); a relative `'/'` resolves against the backend `baseURL` and lands the user on `:3000` instead of the frontend.
- Vercel AI SDK is on v6 (`ai@^6.0.177`). `UIMessage` uses `parts: [{ type: 'text', text }]`, NOT a flat `content: string`. The chat endpoint is `POST /chat/` consuming `{ messages: UIMessage[] }` and returns a UI-message stream from `toUIMessageStreamResponse()`.
- Database access is via Kysely against PostgreSQL. For raw SQL prefer `sql.raw<T>(query).execute(db)` — the tagged template `` sql<T>`${query}` `` turns the string into a bound parameter (`$1`) and won't execute. The `searchTool` already enforces SELECT-only via Zod, so `sql.raw` is safe there.
- Logger lives at `apps/backend/src/shared/logger/logger.ts`; use `logixlysiaIns.store.pino` for the underlying pino instance. The pino config MUST set `messageKey: 'msg'` explicitly — logixlysia v6 passes `messageKey: undefined` otherwise, which makes log messages render under the literal key `undefined`.
- Lint with `bun run lint` at the repo root (Turborepo runs ESLint per app). Type-check per app with `bun run --cwd apps/<app> tsc --noEmit`. Any new env var referenced by the apps must be declared in the root `turbo.json` `globalEnv` array (currently `DATABASE_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `LOG_LEVEL`).
- The previous stack (Fastify + Telegram + Chat SDK + Node + npm + better-sqlite3) was retired on 2026-05-10 in favor of the current Bun / Elysia / Postgres / Vercel AI SDK web stack. Do not suggest reverting to it.
