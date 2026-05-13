'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import QuizCard from '@/components/QuizCard';
import { getLesson } from '@/content/lessons';
import { getQuizQuestions, type QuizType } from '@/content/questions';
import { getScore } from '@/lib/quiz';

type AnswerState = Record<string, { answer: string; isCorrect: boolean }>;

export default function QuizPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;
  const lesson = getLesson(lessonId);
  const lessonDomId = lessonId.replace('.', '-');

  // Quiz type state
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as QuizType) || 'easy';
  const [quizType, setQuizType] = useState<QuizType>(initialType);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [retryWrongOnly, setRetryWrongOnly] = useState(false);

  // Always get 20 questions for the selected quiz type
  const allQuestions = getQuizQuestions(lessonId, quizType, 20);

  const wrongQuestionIds = useMemo(
    () => Object.entries(answers).filter(([, value]) => !value.isCorrect).map(([questionId]) => questionId),
    [answers]
  );

  const questions = retryWrongOnly
    ? allQuestions.filter((question) => wrongQuestionIds.includes(question.questionId))
    : allQuestions;

  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter((value) => value.isCorrect).length;
  const score = getScore(allQuestions.length, correct);
  const isComplete = allQuestions.length > 0 && answered >= allQuestions.length;

  function handleAnswered(questionId: string, answer: string, isCorrect: boolean) {
    setAnswers((current) => ({ ...current, [questionId]: { answer, isCorrect } }));
  }


  function resetQuiz() {
    setAnswers({});
    setRetryWrongOnly(false);
  }

  function handleQuizTypeChange(newType: QuizType) {
    setQuizType(newType);
    setAnswers({});
    setRetryWrongOnly(false);
  }

  if (!lesson) {
    return (
      <div id={`quiz-not-found-${lessonDomId}`} data-testid={`quiz-not-found-${lessonDomId}`} className="math-card p-6">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <Link id={`quiz-not-found-back-${lessonDomId}`} data-testid={`quiz-not-found-back-${lessonDomId}`} href="/lessons" className="mt-4 inline-flex text-blue-700">Back to lessons</Link>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div id={`quiz-empty-page-${lessonDomId}`} data-testid={`quiz-empty-page-${lessonDomId}`} className="space-y-6">
        <Link id={`quiz-empty-back-${lessonDomId}`} data-testid={`quiz-empty-back-${lessonDomId}`} href="/lessons" className="text-sm font-semibold text-blue-700">← Back to lessons</Link>
        <section id={`quiz-empty-state-${lessonDomId}`} data-testid={`quiz-empty-state-${lessonDomId}`} className="math-card p-6">
          <h1 className="text-2xl font-bold">Quiz content is not ready yet</h1>
          <p className="mt-2 text-slate-600">Lesson {lesson.lessonId} is included in the prototype scope, but question content is only implemented for Lesson 1.3 right now.</p>
        </section>
      </div>
    );
  }

  return (
    <div id={`quiz-page-${lessonDomId}`} data-testid={`quiz-page-${lessonDomId}`} className="space-y-6">
      <Link id={`quiz-back-link-${lessonDomId}`} data-testid={`quiz-back-link-${lessonDomId}`} href={`/lessons/${lesson.lessonId}`} className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Back to lesson</Link>

      <section id={`quiz-header-${lessonDomId}`} data-testid={`quiz-header-${lessonDomId}`} className="math-card p-6">
        <p className="text-sm font-semibold text-blue-700">Quiz</p>
        <h1 className="mt-2 text-3xl font-bold">{lesson.lessonId}. {lesson.title}</h1>
        <p className="mt-2 text-slate-600">Answer each question. If you make a mistake, read the explanation and try again.</p>

        {/* Quiz type selector */}
        <div id={`quiz-type-selector-${lessonDomId}`} data-testid={`quiz-type-selector-${lessonDomId}`} className="mt-4 flex flex-wrap gap-3">
          {(['easy', 'medium', 'hard', 'mixed'] as QuizType[]).map((type) => (
            <button
              key={type}
              id={`quiz-type-btn-${lessonDomId}-${type}`}
              data-testid={`quiz-type-btn-${lessonDomId}-${type}`}
              type="button"
              className={`rounded-xl px-4 py-2 font-semibold border transition ${quizType === type ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-700 border-slate-200 hover:bg-blue-50'}`}
              onClick={() => handleQuizTypeChange(type)}
              disabled={quizType === type}
            >
              {type === 'easy' && 'Easy'}
              {type === 'medium' && 'Medium'}
              {type === 'hard' && 'Hard'}
              {type === 'mixed' && 'Mixed'}
            </button>
          ))}
        </div>
      </section>

      <ProgressBar answered={answered} total={allQuestions.length} correct={correct} />

      {isComplete && !retryWrongOnly && (
        <section id={`quiz-result-${lessonDomId}`} data-testid={`quiz-result-${lessonDomId}`} className="math-card p-6">
          <h2 className="text-2xl font-bold">Result: {score}%</h2>
          <p className="mt-2 text-slate-600">Correct answers: {correct} of {allQuestions.length}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {wrongQuestionIds.length > 0 && (
              <button id={`retry-wrong-button-${lessonDomId}`} data-testid={`retry-wrong-button-${lessonDomId}`} type="button" onClick={() => setRetryWrongOnly(true)} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                Retry wrong questions
              </button>
            )}
            <button id={`restart-quiz-button-${lessonDomId}`} data-testid={`restart-quiz-button-${lessonDomId}`} type="button" onClick={resetQuiz} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold hover:bg-slate-50">
              Restart quiz
            </button>
          </div>
        </section>
      )}

      {retryWrongOnly && (
        <section id={`retry-mode-banner-${lessonDomId}`} data-testid={`retry-mode-banner-${lessonDomId}`} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <p className="font-semibold">Retry mode</p>
          <p className="mt-1 text-sm">You are practicing only the questions answered incorrectly.</p>
        </section>
      )}

      <div id={`quiz-question-list-${lessonDomId}`} data-testid={`quiz-question-list-${lessonDomId}`} className="space-y-4">
        {questions.map((question, index) => (
          <QuizCard
            key={`${question.questionId}-${retryWrongOnly ? 'retry' : 'all'}-${quizType}`}
            question={question}
            questionNumber={index + 1}
            onAnswered={handleAnswered}
          />
        ))}
      </div>
    </div>
  );
}
