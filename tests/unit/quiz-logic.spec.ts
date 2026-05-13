import { expect, test } from '@playwright/test';
import { lessons } from '../../content/lessons';
import { getQuestionsForLesson, questions } from '../../content/questions';
import { getFeedback, getScore, isCorrectAnswer, normalizeAnswer } from '../../lib/quiz';

test('normalizeAnswer removes spaces and commas and lowercases', () => {
  expect(normalizeAnswer(' 12 300 ')).toBe('12300');
  expect(normalizeAnswer('9,880,000')).toBe('9880000');
  expect(normalizeAnswer('AB c')).toBe('abc');
});

test('isCorrectAnswer accepts formatted numeric input variants', () => {
  const numericQuestion = questions.find((q) => q.questionId === '1.3-q005');
  expect(numericQuestion).toBeTruthy();

  expect(isCorrectAnswer(numericQuestion!, '988000')).toBe(true);
  expect(isCorrectAnswer(numericQuestion!, '988 000')).toBe(true);
  expect(isCorrectAnswer(numericQuestion!, '987000')).toBe(false);
});

test('getFeedback returns specific and fallback feedback paths', () => {
  const mcQuestion = questions.find((q) => q.questionId === '1.3-q001');
  const numericQuestion = questions.find((q) => q.questionId === '1.3-q005');
  expect(mcQuestion).toBeTruthy();
  expect(numericQuestion).toBeTruthy();

  expect(getFeedback(mcQuestion!, '38 000 000')).toContain('Ответ: 38 000 000');
  expect(getFeedback(mcQuestion!, '37 000 000')).toContain('нужно округлить вверх');

  const fallback = getFeedback(numericQuestion!, '100');
  expect(fallback).toContain('Правильный ответ: 988000');
  expect(fallback).toContain('Разряд тысяч — 7');
});

test('getScore rounds percentages correctly', () => {
  expect(getScore(0, 0)).toBe(0);
  expect(getScore(8, 7)).toBe(88);
  expect(getScore(3, 2)).toBe(67);
});

test('question bank integrity for lesson 1.3', () => {
  const lessonQuestions = getQuestionsForLesson('1.3');
  expect(lessonQuestions).toHaveLength(9);

  for (const question of lessonQuestions) {
    if (question.type === 'multiple_choice') {
      expect(question.choices).toBeTruthy();
      expect(question.choices).toContain(question.correctAnswer);
    }
  }
});

test('question banks are available for lessons 1.1 and 1.2', () => {
  const lesson11Questions = getQuestionsForLesson('1.1');
  const lesson12Questions = getQuestionsForLesson('1.2');

  expect(lesson11Questions.length).toBeGreaterThanOrEqual(7);
  expect(lesson12Questions.length).toBeGreaterThanOrEqual(7);
});

test('all question IDs are unique', () => {
  const ids = questions.map((question) => question.questionId);
  const uniqueIds = new Set(ids);

  expect(uniqueIds.size).toBe(ids.length);
});

test('every Part 1 lesson has quiz coverage', () => {
  for (const lesson of lessons) {
    expect(getQuestionsForLesson(lesson.lessonId).length).toBeGreaterThan(0);
  }
});

test('every lesson has medium and hard questions', () => {
  for (const lesson of lessons) {
    const lessonQuestions = getQuestionsForLesson(lesson.lessonId);
    const difficulties = new Set(lessonQuestions.map((question) => question.difficulty));

    expect(difficulties.has('medium')).toBe(true);
    expect(difficulties.has('hard')).toBe(true);
  }
});
