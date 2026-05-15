# SleepLens 🌙

> Full-stack sleep tracking app with AI-powered insights and weekly reports. Portfolio project showcasing modern full-stack development with integrated AI features.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | JWT-based register/login with protected routes |
| 📋 **Sleep Logging** | Daily log with bedtime, wake time, quality (1-5), stress, and lifestyle factors |
| 📊 **Dashboard** | Metrics cards + Recharts line graphs for quality and hours over time |
| 🗓️ **History** | Monthly calendar view colored by sleep quality with day-detail drill-down |
| 🤖 **AI Chat** | Multi-turn conversational AI (Gemini) with persistent memory and sleep context |
| 📝 **Weekly Report** | On-demand AI-generated analysis with factor correlations in Markdown |
| 💡 **Daily Insights** | Auto-generated AI insight after each sleep log |

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State**: React Context API + hooks

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript (strict)
- **ORM**: Prisma
- **Database**: SQLite
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod middleware
- **AI**: Google Generative AI SDK (`@google/generative-ai`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or pnpm
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sleeplens.git
cd sleeplens
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment variables

#### Backend (`/backend/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key-change-this"
JWT_EXPIRES_IN="7d"
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3001
NODE_ENV="development"
```

#### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### 4. Initialize the database

```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Start the development servers

```bash
# Terminal 1 — Backend (from /backend)
npm run dev

# Terminal 2 — Frontend (from /frontend)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
sleeplens/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/login
│       │   ├── (auth)/register
│       │   └── (dashboard)/
│       │       ├── dashboard/      ← Metrics + charts + weekly report
│       │       ├── log/            ← Daily sleep form
│       │       ├── history/        ← Calendar + list view
│       │       └── chat/           ← AI chat interface
│       ├── components/
│       │   ├── ai/                 ← ChatBubble, ChatInput
│       │   ├── sleep/              ← SleepLogForm, SleepLogList
│       │   └── ui/                 ← Button, Input, Skeleton, ErrorBoundary, Markdown
│       └── types/, schemas/, lib/
│
├── backend/
│   └── src/
│       ├── routes/                 ← auth, sleep, ai
│       ├── controllers/            ← auth, sleep, ai
│       ├── services/               ← auth, sleep, ai (Gemini + Prisma)
│       ├── middleware/             ← auth, validate
│       ├── lib/                    ← prisma.ts, gemini.ts
│       └── schemas/                ← Zod schemas
│
└── prisma/
    └── schema.prisma
```

---

## 🔑 API Endpoints

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login + get JWT | ❌ |
| POST | `/api/sleep` | Create sleep log | ✅ |
| GET | `/api/sleep` | List all logs | ✅ |
| GET | `/api/sleep/stats` | Avg hours, quality, streak | ✅ |
| GET | `/api/sleep/history` | Logs filtered by month | ✅ |
| PUT | `/api/sleep/:id` | Update log | ✅ |
| DELETE | `/api/sleep/:id` | Delete log | ✅ |
| POST | `/api/ai/chat` | Send message to AI | ✅ |
| GET | `/api/ai/history` | Get chat history | ✅ |
| POST | `/api/ai/weekly-report` | Generate weekly AI report | ✅ |

---

## 🤖 AI Architecture

SleepLens uses a **RAG-lite** (Retrieval Augmented Generation) pattern:

1. **Context retrieval**: Last 7 sleep logs fetched from DB per request
2. **Dynamic system prompt**: Sleep data + behavioral rules injected as `systemInstruction`
3. **Memory**: Last 20 chat messages retrieved and sent as conversation history
4. **Persistence**: User message + AI response saved atomically after successful inference

All AI calls use `gemini-2.5-flash` via the `@google/generative-ai` SDK.

---

## 📄 License

MIT
