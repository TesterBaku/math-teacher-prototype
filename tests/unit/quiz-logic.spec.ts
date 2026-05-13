import { expect, test } from '@playwright/test';
import { lessons } from '../../content/lessons';
import { getQuestionsForLesson, getQuizQuestions, questions } from '../../content/questions';
import { getFeedback, getScore, isCorrectAnswer, normalizeAnswer } from '../../lib/quiz';

test('normalizeAnswer removes spaces and commas and lowercases', () => {
  expect(normalizeAnswer(' 12 300 ')).toBe('12300');
  expect(normalizeAnswer('9,880,000')).toBe('9880000');
  expect(normalizeAnswer('AB c')).toBe('abc');
});

test('isCorrectAnswer handles multiple_choice question', () => {
  const q = questions.find((q) => q.questionId === '1.1-e-01');
  expect(q).toBeTruthy();
  expect(isCorrectAnswer(q!, '1')).toBe(true);
  expect(isCorrectAnswer(q!, '0')).toBe(false);
  expect(isCorrectAnswer(q!, '-3')).toBe(false);
});

test('isCorrectAnswer handles numeric input with whitespace variants', () => {
  const q = questions.find((q) => q.questionId === '1.3-e-01');
  expect(q).toBeTruthy();
  expect(isCorrectAnswer(q!, '30')).toBe(true);
  expect(isCorrectAnswer(q!, ' 30 ')).toBe(true);
  expect(isCorrectAnswer(q!, '40')).toBe(false);
});

test('getFeedback returns specific wrong feedback when available', () => {
  const q = questions.find((q) => q.questionId === '1.1-e-01');
  expect(q).toBeTruthy();
  expect(getFeedback(q!, '0')).toBe('0 – не натуральное число.');
  expect(getFeedback(q!, '0.5')).toBe('Дробные числа не натуральные.');
});

test('getFeedback returns fallback with correct answer when no specific feedback', () => {
  const numericQ = questions.find((q) => q.questionId === '1.3-e-01');
  expect(numericQ).toBeTruthy();
  const feedback = getFeedback(numericQ!, '99');
  expect(feedback).toContain('30');
});

test('getFeedback returns correctExplanation on correct answer', () => {
  const q = questions.find((q) => q.questionId === '1.1-e-01');
  expect(q).toBeTruthy();
  const feedback = getFeedback(q!, '1');
  expect(feedback).toBe(q!.correctExplanation);
});

test('getScore rounds percentages correctly', () => {
  expect(getScore(0, 0)).toBe(0);
  expect(getScore(8, 7)).toBe(88);
  expect(getScore(3, 2)).toBe(67);
  expect(getScore(10, 10)).toBe(100);
  expect(getScore(10, 0)).toBe(0);
});

test('each lesson has at least 10 questions per tier (30 total minimum)', () => {
  for (const lesson of lessons) {
    const all = getQuestionsForLesson(lesson.lessonId);
    expect(all.length).toBeGreaterThanOrEqual(30);

    const easy   = all.filter((q) => q.difficulty === 'easy');
    const medium = all.filter((q) => q.difficulty === 'medium');
    const hard   = all.filter((q) => q.difficulty === 'hard');
    expect(easy.length).toBeGreaterThanOrEqual(10);
    expect(medium.length).toBeGreaterThanOrEqual(10);
    expect(hard.length).toBeGreaterThanOrEqual(10);
  }
});

test('getQuizQuestions returns at most 10 questions per tier', () => {
  for (const type of ['easy', 'medium', 'hard'] as const) {
    const result = getQuizQuestions('1.1', type, 10);
    expect(result.length).toBe(10);
    expect(result.every((q) => q.difficulty === type)).toBe(true);
  }
});

test('getQuizQuestions mixed returns exactly 10 questions spanning all 3 tiers', () => {
  const result = getQuizQuestions('1.1', 'mixed', 10);
  // Math.floor(10/3)=3 easy + 3 medium + 4 hard = 10 total
  expect(result.length).toBe(10);
  const difficulties = new Set(result.map((q) => q.difficulty));
  expect(difficulties.size).toBe(3);
});

test('getQuizQuestions returns empty array for unknown lesson', () => {
  expect(getQuizQuestions('99.99', 'easy')).toEqual([]);
});

test('all question IDs are unique', () => {
  const ids = questions.map((q) => q.questionId);
  const uniqueIds = new Set(ids);
  expect(uniqueIds.size).toBe(ids.length);
});

test('no undefined elements in the question bank', () => {
  for (let i = 0; i < questions.length; i++) {
    expect(questions[i]).toBeTruthy();
    expect(typeof questions[i].questionId).toBe('string');
    expect(typeof questions[i].lessonId).toBe('string');
  }
});

test('every lesson has quiz coverage', () => {
  for (const lesson of lessons) {
    expect(getQuestionsForLesson(lesson.lessonId).length).toBeGreaterThan(0);
  }
});

test('all multiple_choice questions include correctAnswer in choices', () => {
  const mcQuestions = questions.filter((q) => q.type === 'multiple_choice');
  for (const q of mcQuestions) {
    expect(q.choices).toBeTruthy();
    expect(q.choices!.includes(q.correctAnswer)).toBe(true);
  }
});
