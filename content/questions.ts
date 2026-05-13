import { lessons } from './lessons';
import { questionsCh1 } from './questions-ch1';
import { questionsCh2 } from './questions-ch2';
import { questionsCh3 } from './questions-ch3';
import { questionsCh4 } from './questions-ch4';
import { questionsCh5 } from './questions-ch5';
import { questionsCh6 } from './questions-ch6';
import { questionsCh7 } from './questions-ch7';
import { questionsCh8 } from './questions-ch8';

export type QuestionType = 'multiple_choice' | 'sign_select' | 'numeric_input';

export type Question = {
  questionId: string;
  lessonId: string;
  type: QuestionType;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  choices?: string[];
  correctAnswer: string;
  correctExplanation: string;
  wrongFeedback?: Record<string, string>;
  helperText?: string;
};

// ch2–ch8 are generated via JSON.stringify, so TypeScript widens 'type' and
// 'difficulty' to string. The cast is safe — the generator enforces the values.
export const questions = [
  ...questionsCh1,
  ...questionsCh2,
  ...questionsCh3,
  ...questionsCh4,
  ...questionsCh5,
  ...questionsCh6,
  ...questionsCh7,
  ...questionsCh8,
] as Question[];

// Group by lessonId and difficulty
const questionsByLesson: Record<string, Record<'easy' | 'medium' | 'hard', Question[]>> = {};
for (const q of questions) {
  if (!questionsByLesson[q.lessonId]) {
    questionsByLesson[q.lessonId] = { easy: [], medium: [], hard: [] };
  }
  questionsByLesson[q.lessonId][q.difficulty].push(q);
}

function sampleOrRepeat<T>(arr: T[], count: number): T[] {
  if (arr.length === 0) return [];
  if (arr.length >= count) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  const result: T[] = [];
  while (result.length < count) result.push(...arr);
  return result.slice(0, count);
}

export type QuizType = 'easy' | 'medium' | 'hard' | 'mixed';

export function getQuestionsForLesson(lessonId: string): Question[] {
  return questions.filter((q) => q.lessonId === lessonId);
}

export function getQuizQuestions(lessonId: string, quizType: QuizType = 'easy', count = 20): Question[] {
  const byDiff = questionsByLesson[lessonId];
  if (!byDiff) return [];
  if (quizType === 'mixed') {
    const easy = sampleOrRepeat(byDiff.easy, Math.floor(count / 3));
    const medium = sampleOrRepeat(byDiff.medium, Math.floor(count / 3));
    const hard = sampleOrRepeat(byDiff.hard, count - easy.length - medium.length);
    return [...easy, ...medium, ...hard].sort(() => Math.random() - 0.5);
  }
  return sampleOrRepeat(byDiff[quizType], count);
}

// unused export kept for the lesson page
export { lessons };
