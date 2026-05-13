import type { Question } from '@/content/questions';

export function normalizeAnswer(value: string): string {
  return value.replace(/\s+/g, '').replace(/,/g, '').trim().toLowerCase();
}

export function isCorrectAnswer(question: Question, answer: string): boolean {
  return normalizeAnswer(answer) === normalizeAnswer(question.correctAnswer);
}

export function getFeedback(question: Question, answer: string): string {
  if (isCorrectAnswer(question, answer)) {
    return question.correctExplanation;
  }

  if (question.wrongFeedback?.[answer]) {
    return question.wrongFeedback[answer];
  }

  return `Проверь разряд и правило ещё раз. Правильный ответ: ${question.correctAnswer}. ${question.correctExplanation}`;
}

export function getScore(total: number, correct: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
