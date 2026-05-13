# Math Teacher Prototype

A small Next.js prototype for teaching Grade 5 math lessons with:

- short lesson explanations;
- visual examples;
- quiz questions;
- immediate feedback;
- mistake-specific explanations;
- retry mode for wrong answers.

## Current scope

Implemented content:

- All lesson topics from Part 1 and core Part 2 chapters (lesson IDs `1.1` to `8.3`)

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Important files

```text
content/lessons.ts       Lesson metadata and explanations
content/questions.ts     Quiz question bank
components/QuizCard.tsx  Main quiz interaction
components/FeedbackBox.tsx  Correct/wrong explanation UI
components/RoundingVisual.tsx  Visual example for rounding
lib/quiz.ts              Answer normalization and scoring
```

## Next steps

1. Add final questions for Lesson 1.1.
2. Add final questions for Lesson 1.2.
3. Add AI tutor button after static feedback works well.
4. Add localStorage progress persistence.
5. Test with one student and revise explanations.
