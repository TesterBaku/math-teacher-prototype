import { expect, test, type Page } from '@playwright/test';

async function answerChoice(page: Page, questionId: string, choiceIndex: number, expectDisabledAfterClick = true) {
  const button = page.getByTestId(`choice-${questionId}-${choiceIndex}`);
  await button.dispatchEvent('click');

  if (expectDisabledAfterClick) {
    await expect(button).toBeDisabled();
  }
}

async function answerNumeric(page: Page, questionId: string, value: string) {
  await page.getByTestId(`input-${questionId}`).fill(value);
  await page.getByTestId(`submit-${questionId}`).click();
}

test('lesson 1.1 quiz is available and interactive', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await expect(page.getByRole('heading', { name: '1.1. Натуральные числа' })).toBeVisible();
  await expect(page.getByText('Answered: 0/7')).toBeVisible();

  await answerChoice(page, '1.1-q002', 2);
  await expect(page.getByTestId('feedback-1.1-q002').getByText('Правильно!')).toBeVisible();
});

test('quiz supports wrong-answer feedback and retry-wrong mode', async ({ page }) => {
  await page.goto('/quiz/1.3');

  await expect(page.getByText('Answered: 0/9')).toBeVisible();
  await expect(page.getByText('Correct: 0')).toBeVisible();

  await answerChoice(page, '1.3-q001', 1);
  await answerChoice(page, '1.3-q002', 0);
  await expect(page.getByTestId('feedback-1.3-q002').getByText('Почти.')).toBeVisible();

  await answerChoice(page, '1.3-q003', 0);
  await answerChoice(page, '1.3-q004', 1);

  await answerNumeric(page, '1.3-q005', '988 000');
  await answerNumeric(page, '1.3-q006', '12 300');

  await answerChoice(page, '1.3-q007', 0);
  await answerChoice(page, '1.3-q008', 0);
  await answerNumeric(page, '1.3-q009', '5 000 000');

  await expect(page.getByRole('heading', { name: 'Result: 89%' })).toBeVisible();
  await expect(page.getByText('Correct answers: 8 of 9')).toBeVisible();

  await page.getByRole('button', { name: 'Retry wrong questions' }).click();
  await expect(page.getByText('Retry mode')).toBeVisible();
  await expect(page.getByTestId('question-card-1.3-q002')).toBeVisible();
  await expect(page.getByTestId('question-card-1.3-q003')).toHaveCount(0);

  await answerChoice(page, '1.3-q002', 2, false);
  await expect(page.getByText('Correct: 9')).toBeVisible();
});
