<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Gemini%20AI-Powered-886FBF?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

# PRD Generator

> AI-powered Product Requirements Document generator that transforms project ideas into comprehensive, structured PRDs in seconds.

**Live:** [prd.ervareza.tech](https://prd.ervareza.tech)

---

## ✨ Features

- **AI-Powered Generation** — Describe your project idea and get a full PRD with personas, user stories, features, data models, API specs, and more
- **Iterative Revision** — Chat-style floating input to revise any section with AI assistance
- **Version Control** — Every revision creates a new version; switch between versions instantly
- **Rich Visualizations** — Mermaid diagrams for architecture, user journey, and ERD rendered inline
- **Export Options** — Download as Markdown (`.md`) or print to PDF
- **Dark Mode** — Automatic dark/light theme based on system preference
- **Multi-language** — English and Bahasa Indonesia support
- **Google OAuth** — Secure authentication via Supabase Auth
- **Responsive Design** — Full sidebar navigation with collapsible mode, works on all screen sizes

---

## 🏗️ Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| **Framework**  | Next.js 16.2 (App Router, Turbopack)|
| **UI**         | React 19, Tailwind CSS v4           |
| **Language**   | TypeScript 5                        |
| **Database**   | Supabase (PostgreSQL)               |
| **Auth**       | Supabase Auth (Google OAuth)        |
| **AI**         | Google Gemini API                   |
| **Diagrams**   | Mermaid.js                          |
| **Animations** | Framer Motion                       |
| **Icons**      | Lucide React                        |
| **Hosting**    | Heroku                              |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-prd/    # POST — Generate new PRD via Gemini
│   │   ├── update-prd/      # POST — Revise existing PRD
│   │   └── seed-test-prd/   # GET  — Dev-only test data seeder
│   ├── auth/
│   │   ├── callback/        # OAuth callback handler
│   │   └── auth-code-error/ # Auth error page
│   ├── changelog/           # Changelog page
│   ├── dashboard/           # PRD list dashboard
│   ├── login/               # Login page (Google OAuth)
│   ├── prd/
│   │   ├── new/             # Create new PRD form
│   │   └── [id]/            # PRD viewer + revision UI
│   ├── globals.css          # Design system tokens
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Landing page
├── components/
│   ├── AppShell.tsx          # Auth guard + sidebar layout
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── LogoutModal.tsx       # Logout confirmation
│   └── MermaidRenderer.tsx   # Mermaid diagram renderer
├── context/
│   └── LanguageContext.tsx    # i18n provider (EN/ID)
├── utils/
│   ├── exportMd.ts           # Markdown export utility
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       ├── server.ts         # Server Supabase client
│       └── middleware.ts     # Session refresh middleware
└── middleware.ts             # Next.js middleware entry
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **pnpm**
- A [Supabase](https://supabase.com) project
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the repository

```bash
git clone https://github.com/ervareza/PRD-MAKER.git
cd PRD-MAKER
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.1-flash-lite
```

### 4. Set up the database

Run the following SQL in your Supabase SQL editor:

```sql
-- PRDs table
CREATE TABLE IF NOT EXISTS prds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  idea TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRD Versions table
CREATE TABLE IF NOT EXISTS prd_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prd_id UUID NOT NULL REFERENCES prds(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE prd_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own PRDs"
  ON prds FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage versions of their PRDs"
  ON prd_versions FOR ALL
  USING (prd_id IN (SELECT id FROM prds WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prds_user_id ON prds(user_id);
CREATE INDEX IF NOT EXISTS idx_prds_updated_at ON prds(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_prd_versions_prd_id ON prd_versions(prd_id);
```

### 5. Configure Supabase Auth

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Enable **Google** provider
3. Add your Google OAuth Client ID and Secret
4. Set redirect URL to: `http://localhost:3000/auth/callback`

### 6. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🌐 Deployment (Heroku)

### 1. Create Heroku app

```bash
heroku create prd-ervareza
```

### 2. Set environment variables

```bash
heroku config:set NEXT_PUBLIC_SUPABASE_URL=your-url
heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
heroku config:set GEMINI_API_KEY=your-key
heroku config:set GEMINI_MODEL=gemini-3.1-flash-lite
```

### 3. Deploy

```bash
git push heroku main
```

### 4. Custom domain

```bash
heroku domains:add prd.ervareza.tech
```

Then add a CNAME record in your DNS pointing `prd.ervareza.tech` to the Heroku DNS target.

---

## 📝 Design System

The app uses a custom design system inspired by **Kenya Hara's warm restraint philosophy**:

- **Surface stack** — Warm off-whites (light) / warm darks (dark mode)
- **Single accent** — Terracotta/rust (`oklch(0.55 0.14 28)`)
- **Typography** — Source Serif 4 (display), DM Sans (body), JetBrains Mono (code)
- **Elevation** — Layered shadows for depth
- **Animations** — Subtle fade-in-up, scale-in transitions

---

## 🔒 Security

- API keys are passed via HTTP headers, never in URL query strings
- All database queries use Supabase Row Level Security (RLS)
- Auth sessions are refreshed automatically via middleware
- Server-side auth checks on all API routes
- Input validation with length limits on all endpoints
- CSRF protection via Supabase cookie-based auth

---

## 📋 Available Scripts

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm run dev`   | Start development server       |
| `npm run build` | Build for production           |
| `npm run start` | Start production server        |
| `npm run lint`  | Run ESLint                     |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b v1.x.x`)
3. Commit with [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`)
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Erva Reza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) — React framework
- [Supabase](https://supabase.com/) — Backend as a service
- [Google Gemini](https://ai.google.dev/) — AI generation
- [Mermaid](https://mermaid.js.org/) — Diagram rendering
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Lucide](https://lucide.dev/) — Icon library

---

<p align="center">
  Made with ❤️ by <a href="https://ervareza.tech">Erva Reza</a>
</p>
