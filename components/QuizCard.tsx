'use client';

import { useState } from 'react';
import type { Question } from '@/content/questions';
import { getFeedback, isCorrectAnswer } from '@/lib/quiz';
import FeedbackBox from './FeedbackBox';

type QuizCardProps = {
  question: Question;
  questionNumber: number;
  onAnswered: (questionId: string, answer: string, isCorrect: boolean) => void;
};

const LABELS = ['А', 'Б', 'В', 'Г'];

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy:   { label: 'Лёгкий',  color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Средний', color: 'bg-amber-100 text-amber-700' },
  hard:   { label: 'Сложный', color: 'bg-rose-100 text-rose-700' },
};

export default function QuizCard({ question, questionNumber, onAnswered }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);

  const isSubmitted = submittedAnswer !== null;
  const isCorrect = submittedAnswer ? isCorrectAnswer(question, submittedAnswer) : false;
  const feedback = submittedAnswer ? getFeedback(question, submittedAnswer) : '';
  const diff = difficultyConfig[question.difficulty] ?? { label: question.difficulty, color: 'bg-slate-100 text-slate-600' };

  function submitAnswer(answerOverride?: string) {
    const answer = answerOverride ?? selectedAnswer;
    if (!answer.trim()) return;
    setSubmittedAnswer(answer);
    onAnswered(question.questionId, answer, isCorrectAnswer(question, answer));
  }

  function resetQuestion() {
    setSelectedAnswer('');
    setSubmittedAnswer(null);
  }

  return (
    <article className="math-card p-6" data-testid={`question-card-${question.questionId}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {questionNumber}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${diff.color}`}>
              {diff.label}
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 leading-snug">{question.prompt}</h3>
          {question.helperText && (
            <p className="mt-1.5 text-sm text-slate-500 italic">{question.helperText}</p>
          )}
        </div>
      </div>

      {/* Multiple choice */}
      {question.type === 'multiple_choice' && question.choices && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {question.choices.map((choice, index) => {
            const choiceSubmitted = submittedAnswer === choice;
            const choiceCorrect = choice === question.correctAnswer;
            const isCorrectState = isSubmitted && choiceCorrect;
            const isWrongState = choiceSubmitted && !choiceCorrect;

            return (
              <button
                key={choice}
                type="button"
                id={`choice-${question.questionId}-${index}`}
                data-testid={`choice-${question.questionId}-${index}`}
                disabled={isSubmitted}
                onClick={() => submitAnswer(choice)}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  isCorrectState
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 choice-correct'
                    : isWrongState
                      ? 'border-amber-300 bg-amber-50 text-amber-950 choice-wrong'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]'
                } disabled:cursor-default`}
              >
                <span className={`choice-label shrink-0 ${isCorrectState ? 'choice-correct' : ''} ${isWrongState ? 'choice-wrong' : ''}`}>
                  {LABELS[index] ?? index + 1}
                </span>
                <span className="leading-snug">{choice}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Numeric input */}
      {question.type === 'numeric_input' && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id={`input-${question.questionId}`}
            data-testid={`input-${question.questionId}`}
            value={selectedAnswer}
            disabled={isSubmitted}
            onChange={(event) => setSelectedAnswer(event.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitAnswer(); }}
            placeholder="Введи ответ…"
            className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
              isSubmitted
                ? isCorrect
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-rose-300 bg-rose-50 text-rose-900'
                : 'border-slate-300 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          <button
            type="button"
            id={`submit-${question.questionId}`}
            data-testid={`submit-${question.questionId}`}
            disabled={isSubmitted || !selectedAnswer.trim()}
            onClick={() => submitAnswer()}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 transition-colors shrink-0"
          >
            Проверить
          </button>
        </div>
      )}

      {/* Feedback */}
      {isSubmitted && (
        <div data-testid={`feedback-${question.questionId}`} className="mt-3">
          <FeedbackBox boxId={`feedback-box-${question.questionId}`} isCorrect={isCorrect} message={feedback} />
        </div>
      )}

      {isSubmitted && !isCorrect && (
        <button
          type="button"
          id={`retry-${question.questionId}`}
          data-testid={`retry-${question.questionId}`}
          onClick={resetQuestion}
          className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>↺</span> Попробовать ещё раз
        </button>
      )}
    </article>
  );
}
