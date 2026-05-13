'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import QuizCard from '@/components/QuizCard';
import { getLesson } from '@/content/lessons';
import { getQuizQuestions, type QuizType } from '@/content/questions';
import { getScore } from '@/lib/quiz';

type AnswerState = Record<string, { answer: string; isCorrect: boolean }>;

const QUIZ_TYPES: { type: QuizType; label: string; style: string }[] = [
  { type: 'easy',   label: 'Лёгкий',  style: 'bg-emerald-600 text-white border-emerald-700' },
  { type: 'medium', label: 'Средний', style: 'bg-amber-500 text-white border-amber-600' },
  { type: 'hard',   label: 'Сложный', style: 'bg-rose-600 text-white border-rose-700' },
  { type: 'mixed',  label: 'Микс',    style: 'bg-slate-700 text-white border-slate-800' },
];

function QuizContent() {
  const params = useParams<{ lessonId: string }>();
  const searchParams = useSearchParams();

  const lessonId = params?.lessonId ?? '';
  const lesson = getLesson(lessonId);
  const lessonDomId = lessonId.replace('.', '-');

  const initialType = (searchParams.get('type') as QuizType) || 'easy';
  const [quizType, setQuizType] = useState<QuizType>(initialType);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [retryWrongOnly, setRetryWrongOnly] = useState(false);
  // Incremented on manual restart so QuizCards remount even when the same question IDs are resampled.
  const [quizKey, setQuizKey] = useState(0);

  // Questions generated only on the client: Math.random() differs between server/client renders,
  // so initialising with [] avoids a hydration mismatch that would detach DOM elements.
  const [allQuestions, setAllQuestions] = useState<ReturnType<typeof getQuizQuestions>>([]);
  useEffect(() => {
    setAllQuestions(getQuizQuestions(lessonId, quizType));
    setAnswers({});
    setRetryWrongOnly(false);
    setQuizKey((k) => k + 1);
  }, [lessonId, quizType]);

  const wrongQuestionIds = useMemo(
    () => Object.entries(answers).filter(([, v]) => !v.isCorrect).map(([id]) => id),
    [answers]
  );

  const questions = retryWrongOnly
    ? allQuestions.filter((q) => wrongQuestionIds.includes(q.questionId))
    : allQuestions;

  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter((v) => v.isCorrect).length;
  const score = getScore(allQuestions.length, correct);
  const isComplete = allQuestions.length > 0 && answered >= allQuestions.length;

  function handleAnswered(questionId: string, answer: string, isCorrect: boolean) {
    setAnswers((prev) => ({ ...prev, [questionId]: { answer, isCorrect } }));
  }

  function resetQuiz() {
    setAllQuestions(getQuizQuestions(lessonId, quizType));
    setAnswers({});
    setRetryWrongOnly(false);
    setQuizKey((k) => k + 1);
  }

  function handleQuizTypeChange(newType: QuizType) {
    setQuizType(newType);
    // useEffect handles question refresh and state reset when quizType changes
  }

  if (!lesson) {
    return (
      <div id={`quiz-not-found-${lessonDomId}`} data-testid={`quiz-not-found-${lessonDomId}`} className="math-card p-6">
        <h1 className="text-2xl font-bold">Урок не найден</h1>
        <Link href="/lessons" className="mt-4 inline-flex text-blue-700">← К урокам</Link>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    // Either still loading (useEffect hasn't fired yet) or lesson truly has no questions.
    // We can't tell without checking the question bank, so show a neutral loading state.
    return (
      <div id={`quiz-loading-${lessonDomId}`} data-testid={`quiz-loading-${lessonDomId}`} className="math-card p-6 text-slate-500">
        Загрузка вопросов…
      </div>
    );
  }

  return (
    <div id={`quiz-page-${lessonDomId}`} data-testid={`quiz-page-${lessonDomId}`} className="space-y-6">
      <Link
        id={`quiz-back-link-${lessonDomId}`}
        data-testid={`quiz-back-link-${lessonDomId}`}
        href={`/lessons/${lesson.lessonId}`}
        className="text-sm font-semibold text-blue-700 hover:text-blue-900"
      >
        ← Назад к уроку
      </Link>

      {/* Header */}
      <section id={`quiz-header-${lessonDomId}`} data-testid={`quiz-header-${lessonDomId}`} className="math-card p-6">
        <p className="text-sm font-semibold text-blue-700">Тест · {lesson.chapter}</p>
        <h1 className="mt-2 text-2xl font-bold">{lesson.lessonId}. {lesson.title}</h1>
        <p className="mt-2 text-sm text-slate-600">Ответь на вопросы. При ошибке прочитай объяснение.</p>

        {/* Quiz type selector */}
        <div
          id={`quiz-type-selector-${lessonDomId}`}
          data-testid={`quiz-type-selector-${lessonDomId}`}
          className="mt-4 flex flex-wrap gap-2"
        >
          {QUIZ_TYPES.map(({ type, label, style }) => (
            <button
              key={type}
              id={`quiz-type-btn-${lessonDomId}-${type}`}
              data-testid={`quiz-type-btn-${lessonDomId}-${type}`}
              type="button"
              onClick={() => handleQuizTypeChange(type)}
              disabled={quizType === type}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
                quizType === type
                  ? style
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              } disabled:cursor-default`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <ProgressBar answered={answered} total={allQuestions.length} correct={correct} />

      {/* Result */}
      {isComplete && !retryWrongOnly && (
        <section
          id={`quiz-result-${lessonDomId}`}
          data-testid={`quiz-result-${lessonDomId}`}
          className="math-card p-6"
        >
          <h2 className="text-2xl font-bold">Результат: {score}%</h2>
          <p className="mt-2 text-slate-600">Правильных ответов: {correct} из {allQuestions.length}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {wrongQuestionIds.length > 0 && (
              <button
                id={`retry-wrong-button-${lessonDomId}`}
                data-testid={`retry-wrong-button-${lessonDomId}`}
                type="button"
                onClick={() => setRetryWrongOnly(true)}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Повторить ошибки
              </button>
            )}
            <button
              id={`restart-quiz-button-${lessonDomId}`}
              data-testid={`restart-quiz-button-${lessonDomId}`}
              type="button"
              onClick={resetQuiz}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
            >
              Начать заново
            </button>
          </div>
        </section>
      )}

      {/* Retry banner */}
      {retryWrongOnly && (
        <section
          id={`retry-mode-banner-${lessonDomId}`}
          data-testid={`retry-mode-banner-${lessonDomId}`}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950"
        >
          <p className="font-semibold">Режим повтора ошибок</p>
          <p className="mt-1 text-sm">Ты тренируешься только на неверно отвеченных вопросах.</p>
        </section>
      )}

      {/* Questions */}
      <div
        id={`quiz-question-list-${lessonDomId}`}
        data-testid={`quiz-question-list-${lessonDomId}`}
        className="space-y-4"
      >
        {questions.map((question, index) => (
          <QuizCard
            key={`${question.questionId}-${retryWrongOnly ? 'retry' : 'all'}-${quizType}-${quizKey}`}
            question={question}
            questionNumber={index + 1}
            onAnswered={handleAnswered}
          />
        ))}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="math-card p-6 text-slate-500">Загрузка теста…</div>}>
      <QuizContent />
    </Suspense>
  );
}
