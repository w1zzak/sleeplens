# SleepLens — Project Context for AI Agents

Sleep tracking app with AI insights. Portfolio project showcasing full-stack development with integrated AI features.

---

## Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Validation**: Zod
- **State**: React hooks + Context API

### Backend (`/backend`)
- **Runtime**: Node.js + Express
- **Language**: TypeScript (strict)
- **ORM**: Prisma
- **Database**: SQLite
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **AI**: Google Generative AI SDK (`@google/generative-ai`)

---

## Code Conventions

### Language Rules
- **UI text / copy**: Spanish
- **Code** (variables, functions, classes, types, comments, commits): English

### TypeScript
- Strict mode enabled. No `any`. No implicit types.
- Use `interface` for object shapes, `type` for unions/intersections.
- Define Zod schemas alongside types. Infer types from schemas where possible.
- Use `React.FC<Props>` for functional components with explicit prop interfaces.

### Async
- Always `async/await`. Never raw `.then()` chains.
- All async functions wrapped in `try/catch`.

### Error Handling (Backend)
- HTTP status codes: `200`, `201`, `400`, `401`, `403`, `404`, `500`.
- Return JSON: `{ error: string }` on failure, `{ data: T }` on success.
- Never expose stack traces in production responses.

### Styling
- TailwindCSS only. No inline styles. No CSS modules.
- Dark mode by default. Base color: `bg-[#1a1a2e]` or similar deep navy/obsidian.
- Accent: `#7c3aed` (purple-700 in Tailwind: `violet-700`).
- Rounded corners, subtle shadows, smooth transitions on all interactive elements.
- Hover states required on all clickable elements.

---

## Design System

| Token | Value | Tailwind Class |
|---|---|---|
| Background | `#0f0f1a` | `bg-[#0f0f1a]` |
| Surface | `#1a1a2e` | `bg-[#1a1a2e]` |
| Card | `#16213e` | `bg-[#16213e]` |
| Accent | `#7c3aed` | `violet-700` |
| Accent Light | `#a78bfa` | `violet-400` |
| Text Primary | `#f1f5f9` | `slate-100` |
| Text Muted | `#94a3b8` | `slate-400` |
| Border | `#2d2d4e` | `border-[#2d2d4e]` |
| Success | `#10b981` | `emerald-500` |
| Warning | `#f59e0b` | `amber-500` |
| Danger | `#ef4444` | `red-500` |

---

## Folder Structure

```
sleeplens/
├── CLAUDE.md
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── log/            # Daily sleep log form
│   │   │   │   ├── history/        # Calendar + list view
│   │   │   │   └── chat/           # AI chat interface
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                 # Primitive components (Button, Input, Card...)
│   │   │   ├── charts/             # Recharts wrappers
│   │   │   ├── sleep/              # Domain components (SleepLogForm, SleepCard...)
│   │   │   └── ai/                 # AI-specific components (InsightCard, ChatBubble...)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/
│   │   │   ├── api.ts              # Axios/fetch client with auth headers
│   │   │   ├── auth.ts             # JWT helpers (decode, store)
│   │   │   └── utils.ts
│   │   ├── schemas/                # Zod schemas shared with forms
│   │   └── types/                  # Global TypeScript interfaces
│   ├── public/
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── routes/                 # Express route definitions
│   │   ├── controllers/            # Request/response handlers
│   │   ├── services/               # Business logic + Prisma calls
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT verification middleware
│   │   │   └── validate.ts         # Zod request validation middleware
│   │   ├── lib/
│   │   │   ├── prisma.ts           # Prisma client singleton
│   │   │   └── gemini.ts           # Gemini client singleton
│   │   ├── schemas/                # Zod schemas for request bodies
│   │   ├── types/                  # TypeScript interfaces
│   │   └── index.ts                # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── tsconfig.json
│
└── .agents/
    └── skills/
        ├── find-skills/
        ├── create-component/
        ├── create-endpoint/
        ├── frontend-design/
        ├── nodejs-backend-patterns/
        ├── subagent-driven-development/
        ├── systematic-debugging/
        ├── tailwind-design-system/
        └── typescript-advanced-types/
```

---

## Prisma Models

```prisma
model User {
  id           String      @id @default(cuid())
  email        String      @unique
  passwordHash String
  name         String
  createdAt    DateTime    @default(now())
  sleepLogs    SleepLog[]
  chatMessages ChatMessage[]
}

model SleepLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date        DateTime @default(now())
  bedtime     DateTime
  wakeTime    DateTime
  quality     Int      // 1-5
  notes       String?

  // Day factors
  exercise    Boolean  @default(false)
  caffeine    Boolean  @default(false)
  alcohol     Boolean  @default(false)
  stress      Int      @default(0) // 1-5
  screenTime  Boolean  @default(false)

  // AI outputs
  aiInsight   String?  // Daily insight generated on save
  weeklyReport String? // Auto-generated weekly report

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ChatMessage {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      String   // "user" | "assistant"
  content   String
  createdAt DateTime @default(now())
}
```

---

## Environment Variables

### Backend (`/backend/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key-here"
JWT_EXPIRES_IN="7d"
GEMINI_API_KEY="AIzaSy..."
PORT=3001
NODE_ENV="development"
```

### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

---

## AI Features (Google Gemini API)

All AI calls use `gemini-2.5-flash` for speed/cost efficiency. Use `gemini-2.5-pro` only for the weekly report.

### 1. Daily Insight (`POST /api/sleep/log`)
- Triggered automatically after saving a sleep log.
- Prompt includes: duration, quality, active factors, and user's notes.
- Returns a 2–3 sentence insight. Stored in `SleepLog.aiInsight`.

### 2. Conversational Chat (`POST /api/ai/chat`)
- Sends user message + last 20 chat messages as context.
- System prompt includes: user's last 7 sleep logs summary.
- Streaming optional (v2 feature).

### 3. Weekly Report (`POST /api/ai/weekly-report`)
- Triggered manually or via cron every Monday.
- Aggregates 7 logs: avg quality, total sleep, factor correlations.
- Returns structured markdown report. Stored in `SleepLog.weeklyReport` for Monday's entry.

### 4. Pattern Detection (part of Weekly Report)
- Identify which factors correlate most with high/low sleep quality.
- Included in the weekly report prompt as a structured analysis section.

---

## Backend Architecture Pattern

Every feature follows this strict layered pattern:

```
Route → Controller → Service → Prisma
```

- **Route**: Applies `authMiddleware` and `validate(schema)` middleware, then calls controller.
- **Controller**: Extracts `req.user.id` and `req.body`, calls service, returns HTTP response.
- **Service**: All business logic. The only layer that touches Prisma or Gemini.
- **No direct Prisma calls outside of services.**

---

## Agent Rules

1. **Always read the relevant SKILL.md** before creating a component or endpoint.
2. **No placeholder data**. If a feature needs real data, wire it to the API.
3. **Dark mode only**. Never use light backgrounds.
4. **Respect the architecture**. Never call Prisma from controllers or routes.
5. **Validate at the boundary**. Use Zod middleware on all POST/PUT endpoints.
6. **AI calls are async**. Never block the main response. Return insight in the same response after awaiting.
7. **Commit scope**: One logical change per session. Don't mix auth + sleep log features in one task.
8. **Check existing components first** before creating new ones to avoid duplication.

---

## Project Phases & Status

### ✅ Phase 0 — Setup
- [x] Monorepo structure initialized
- [x] Frontend: Next.js 14 + TypeScript + TailwindCSS configured
- [x] Backend: Express + TypeScript + Prisma + SQLite configured
- [x] `.agents/skills/` directory populated
- [x] `CLAUDE.md` created

---

### ✅ Phase 1 — Auth (Completed 2026-05-11)
- [x] **Backend**: `POST /api/auth/register` — hash password, return JWT
- [x] **Backend**: `POST /api/auth/login` — validate credentials, return JWT
- [x] **Backend**: `authMiddleware.ts` — verify JWT, attach `req.user`
- [x] **Frontend**: `/register` page with form + Zod validation
- [x] **Frontend**: `/login` page with form + Zod validation
- [x] **Frontend**: Auth context + token persistence (`localStorage`)
- [x] **Frontend**: Protected route wrapper for dashboard pages
- [x] **Testing**: Manual auth flow (register → login → protected route)

---

### ✅ Phase 2 — Sleep Log (Completed 2026-05-12)
- [x] **Backend**: `POST /api/sleep` — create log (calculates duration automatically)
- [x] **Backend**: `GET /api/sleep` — list logs for current user
- [x] **Backend**: `GET /api/sleep/:id` — single log detail
- [x] **Backend**: `PUT /api/sleep/:id` — update log
- [x] **Backend**: `DELETE /api/sleep/:id` — delete log
- [x] **Frontend**: `/log` page — sleep log form con checkboxes para factores
- [x] **Frontend**: `SleepLogForm` component con Zod schema
- [x] **Frontend**: List simple logs in UI
- [x] **Testing**: Full CRUD log flow

---

### ✅ Phase 3 — History & Dashboard (Completed 2026-05-13)
- [x] **Backend**: `GET /api/sleep/stats` — prom. horas, prom. calidad, racha actual
- [x] **Backend**: `GET /api/sleep/history` — registros filtrados por mes
- [x] **Frontend**: `/dashboard` — 3 métricas cards (horas, calidad, racha)
- [x] **Frontend**: `/dashboard` — 2 gráficas Recharts (calidad 30 días, horas 30 días)
- [x] **Frontend**: `/history` — vista calendario mensual coloreado por calidad
- [x] **Frontend**: `/history` — lista de registros del mes seleccionado + navegación
- [x] **Frontend**: Navbar/Sidebar global con links (Dashboard, Log, History)
- [x] **Frontend**: Redirección automática de `/` a `/dashboard` (si hay auth) o `/login`

---

### ✅ Phase 4 — AI Chat (Completed 2026-05-14)
- [x] **Backend**: `POST /api/ai/chat` — conversational endpoint with history
- [x] **Backend**: `GET /api/ai/chat/history` — last N messages
- [x] **Frontend**: `/chat` page — chat UI with message bubbles
- [x] **Frontend**: `ChatInput` + `ChatBubble` components
- [x] **Frontend**: Auto-scroll, loading state, error state
- [x] **Testing**: Multi-turn conversation with sleep context

---

### ✅ Phase 5 — Weekly Report (Completed 2026-05-15)
- [x] **Backend**: `POST /api/ai/weekly-report` — aggregate 7 logs, generate report
- [x] **Frontend**: Report display in dashboard (markdown rendered)
- [x] **Frontend**: "Generate Report" button with loading state
- [x] **Testing**: Report generation with at least 7 days of data

---

### ✅ Phase 6 — Polish & Deploy (Completed 2026-05-15)
- [x] Loading skeletons on all data-fetching components (dashboard, history, chat)
- [x] Empty states with helpful prompts (dashboard, history)
- [x] Error boundary components (wrapping all dashboard pages)
- [x] README with setup instructions and API reference
- [x] Responsive design audit (mobile-first) — bottom nav, single-column layouts, mobile padding
- [ ] Deploy: backend on Railway/Render, frontend on Vercel
