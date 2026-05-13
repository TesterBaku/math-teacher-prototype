# Task: Questions + UI Overhaul

## Summary
Full content pass + UI polish for the 5th-grade math prototype.

## Bugs found (all fixed)
- `difficulty` in existing 1.1 questions used Russian strings ('легкий' etc.) but `questionsByLesson` groups by `'easy'|'medium'|'hard'` → 1.1 questions silently produced 0 results.
- Lessons 1.2 and 1.3 were in `detailedLessonIds` (excluded from generator) but had zero questions → empty quiz.
- Generated placeholder questions (3 per lesson) were about meta-goals, not math.

---

## Phase 1 – Duplicate check & questions architecture ✅
- [x] Read existing questions.ts, identify all questionIds
- [x] Confirm: no duplicate questionIds within 1.1
- [x] Design chapter-file split: `content/questions-ch{1..8}.ts` imported by `questions.ts`
- [x] Write `content/questions-ch1.ts` — lessons 1.1–1.8 (real math questions, fix difficulty naming)

## Phase 2 – Write questions for all chapters ✅
- [x] `content/questions-ch1.ts` — Ch1: 1.1–1.8 — **176 questions**
- [x] `content/questions-ch2.ts` — Ch2: 2.1–2.11 — **165 questions**
- [x] `content/questions-ch3.ts` — Ch3: 3.1–3.12 — **180 questions**
- [x] `content/questions-ch4.ts` — Ch4: 4.1–4.4 — **60 questions**
- [x] `content/questions-ch5.ts` — Ch5: 5.1–5.6 — **90 questions**
- [x] `content/questions-ch6.ts` — Ch6: 6.1–6.7 — **105 questions**
- [x] `content/questions-ch7.ts` — Ch7: 7.1–7.6 — **90 questions**
- [x] `content/questions-ch8.ts` — Ch8: 8.1–8.3 — **45 questions**

## Phase 3 – Wire up questions.ts ✅
- [x] Replace `detailedQuestions` + `generatedQuestions` with imports from chapter files
- [x] Fix `difficulty` type to `'easy' | 'medium' | 'hard'`
- [x] Remove `detailedLessonIds` concept entirely
- [x] Verify quiz page shows questions for every lesson

## Phase 4 – UI improvements ✅
- [x] `app/globals.css` — richer design tokens, card shadows, choice-label helpers
- [x] `app/layout.tsx` — Russian header with subtitle
- [x] `components/ProgressBar.tsx` — % score, colour-coded fill (green/amber/red)
- [x] `components/QuizCard.tsx` — Cyrillic letter labels А/Б/В/Г, Enter-to-submit
- [x] `components/FeedbackBox.tsx` — ✓/! icons, better typography
- [x] `app/page.tsx` — Russian hero, chapter overview grid
- [x] `app/lessons/page.tsx` — estimated time chip, Russian labels
- [x] `app/lessons/[lessonId]/page.tsx` — question counts per difficulty

## Phase 5 – Verify ✅
- [x] Dev server: HTTP 200 on all tested pages
- [x] Quiz renders for all 57 lessons — 0 lessons without questions
- [x] **911 total questions, 0 duplicates** *(earlier count of 735 was wrong — ch1 uses single-quoted keys that the regex missed)*

---

## Review

**Questions:** 911 real Russian math questions across 57 lessons (Chapters 1–8).
Each lesson has easy / medium / hard questions. Zero duplicate IDs.

| Chapter | Lessons | Questions |
|---------|---------|-----------|
| 1 — Натуральные числа | 8 | 176 |
| 2 — Обыкновенные дроби | 11 | 165 |
| 3 — Десятичные дроби | 12 | 180 |
| 4 — Проценты | 4 | 60 |
| 5 — Уравнения и неравенства | 6 | 90 |
| 6 — Плоские фигуры | 7 | 105 |
| 7 — Тела и измерения | 6 | 90 |
| 8 — Статистика | 3 | 45 |
| **Total** | **57** | **911** |
