# Математика 5 класс — интерактивный прототип

Interactive lesson and quiz prototype for Grade 5 mathematics (Russian curriculum).  
57 lessons across 8 chapters — explanations, visual examples, and tiered quizzes (easy / medium / hard / mixed) with per-mistake feedback.

---

## Running the prototype

### Option A — Docker (recommended, no Node.js required)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
git clone https://github.com/TesterBaku/math-teacher-prototype.git
cd math-teacher-prototype
docker compose up --build
```

Open **http://localhost:3000**.  
Stop with `Ctrl+C`. On subsequent runs (no source changes) skip the `--build`:

```bash
docker compose up
```

---

### Option B — Node.js launch scripts (no Docker required)

**Prerequisites:** [Node.js 18+](https://nodejs.org) installed.

**Windows:**
```
start.bat
```

**macOS / Linux:**
```bash
chmod +x start.sh && ./start.sh
```

On first run the script installs dependencies and builds; subsequent runs start immediately.  
Open **http://localhost:3000**.

---

### Option C — Development mode (live reload)

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. Source changes reload automatically.

---

## Project structure

```
app/
  page.tsx                Home page
  lessons/page.tsx        All lessons grouped by chapter
  lessons/[lessonId]/     Lesson detail
  quiz/[lessonId]/        Quiz — 10 questions per tier, randomised each session
components/               QuizCard, ProgressBar, FeedbackBox, LessonVisual, RoundingVisual
content/
  lessons.ts              Lesson metadata (title, chapter, time estimate)
  questions-types.ts      Shared Question type used by all chapter files
  questions.ts            Question bank wiring + getQuizQuestions()
  questions-ch1.ts … ch8.ts   1 710 questions total (10 per tier per lesson)
lib/
  quiz.ts                 normalizeAnswer, isCorrectAnswer, getFeedback, getScore
tests/
  unit/                   Logic tests — no browser, no server
  e2e/                    Full browser tests (navigation, quiz flow, all buttons)
```

---

## Running tests

**Unit tests** (fast, no browser):
```bash
npm run test:unit
```

**E2E tests** (headless browser, auto-builds and starts the server):
```bash
npm run test:functional
```

**All tests:**
```bash
npm test
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, PR workflow, and merge rules.
