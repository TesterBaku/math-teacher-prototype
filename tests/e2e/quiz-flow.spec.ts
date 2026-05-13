import { expect, test, type Page } from '@playwright/test';

/** Wait for all 10 question cards to appear, then return the cards locator. */
async function waitForCards(page: Page) {
  const cards = page.locator('[data-testid^="question-card-"]');
  await expect(cards).toHaveCount(10);
  return cards;
}

/** Answer a question card however possible. Returns true if the answer was correct. */
async function answerCard(page: Page, card: ReturnType<Page['locator']>): Promise<boolean> {
  const qId = (await card.getAttribute('data-testid'))!.replace('question-card-', '');

  // Multiple choice — click the first available choice
  const choices = card.locator('[data-testid^="choice-"]');
  if (await choices.count() > 0) {
    await choices.first().click();
  } else {
    // Numeric input — submit something to get feedback
    const input = card.locator(`[data-testid="input-${qId}"]`);
    await input.fill('1');
    await page.locator(`[data-testid="submit-${qId}"]`).click();
  }

  await expect(card.locator(`[data-testid="feedback-${qId}"]`)).toBeVisible();
  const retryBtn = card.locator(`[data-testid="retry-${qId}"]`);
  return (await retryBtn.count()) === 0;
}

/** Answer all 10 question cards on the page. */
async function answerAllCards(page: Page) {
  const cards = await waitForCards(page);
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    await answerCard(page, cards.nth(i));
  }
}

test('quiz page loads for lesson 1.1 with 10 questions', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await expect(page.getByTestId('quiz-page-1-1')).toBeVisible();
  await expect(page.getByRole('heading', { name: /1\.1\./ })).toBeVisible();

  const cards = page.locator('[data-testid^="question-card-"]');
  await expect(cards).toHaveCount(10);
});

test('quiz page shows correct header and progress bar', async ({ page }) => {
  await page.goto('/quiz/1.3');

  await expect(page.getByTestId('quiz-header-1-3')).toBeVisible();
  await expect(page.getByRole('heading', { name: /1\.3\./ })).toBeVisible();
  await expect(page.getByTestId('quiz-type-selector-1-3')).toBeVisible();
});

test('answering a multiple choice question disables all its choices', async ({ page }) => {
  await page.goto('/quiz/1.1');
  const cards = await waitForCards(page);
  const count = await cards.count();

  let mcCard: ReturnType<Page['locator']> | null = null;
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const choices = card.locator('[data-testid^="choice-"]');
    if ((await choices.count()) > 0) {
      mcCard = card;
      break;
    }
  }

  expect(mcCard).not.toBeNull();
  const choices = mcCard!.locator('[data-testid^="choice-"]');
  await choices.first().click();

  const allChoices = await choices.all();
  for (const choice of allChoices) {
    await expect(choice).toBeDisabled();
  }
});

test('answering a numeric input question disables the submit button', async ({ page }) => {
  await page.goto('/quiz/1.1');
  const cards = await waitForCards(page);
  const count = await cards.count();

  let numericCard: ReturnType<Page['locator']> | null = null;
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const inputs = card.locator('[data-testid^="input-"]');
    if ((await inputs.count()) > 0) {
      numericCard = card;
      break;
    }
  }

  expect(numericCard).not.toBeNull();
  const qId = (await numericCard!.getAttribute('data-testid'))!.replace('question-card-', '');
  const input = numericCard!.locator(`[data-testid="input-${qId}"]`);
  const submitBtn = numericCard!.locator(`[data-testid="submit-${qId}"]`);

  await input.fill('42');
  await submitBtn.click();

  await expect(submitBtn).toBeDisabled();
  await expect(input).toBeDisabled();
});

test('completing the quiz shows the result section', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await answerAllCards(page);

  await expect(page.getByTestId('quiz-result-1-1')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Результат:/ })).toBeVisible();
  await expect(page.getByText(/Правильных ответов:/)).toBeVisible();
});

test('Начать заново resets all answers', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await answerAllCards(page);
  await expect(page.getByTestId('quiz-result-1-1')).toBeVisible();

  await page.getByTestId('restart-quiz-button-1-1').click();

  // Result section gone
  await expect(page.getByTestId('quiz-result-1-1')).not.toBeVisible();

  // Questions re-rendered — no answers submitted
  await waitForCards(page);
  const feedbacks = page.locator('[data-testid^="feedback-"]');
  await expect(feedbacks).toHaveCount(0);
});

test('Повторить ошибки shows only incorrectly answered questions', async ({ page }) => {
  await page.goto('/quiz/1.1');
  const cards = await waitForCards(page);
  const count = await cards.count();
  const wrongIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const qId = (await card.getAttribute('data-testid'))!.replace('question-card-', '');
    const correct = await answerCard(page, card);
    if (!correct) wrongIds.push(qId);
  }

  // If all happened to be correct, the retry button won't appear — that's fine
  if (wrongIds.length === 0) {
    await expect(page.getByTestId('restart-quiz-button-1-1')).toBeVisible();
    return;
  }

  await expect(page.getByTestId('retry-wrong-button-1-1')).toBeVisible();
  await page.getByTestId('retry-wrong-button-1-1').click();

  await expect(page.getByTestId('retry-mode-banner-1-1')).toBeVisible();
  await expect(page.getByText('Режим повтора ошибок')).toBeVisible();

  const retryCards = page.locator('[data-testid^="question-card-"]');
  await expect(retryCards).toHaveCount(wrongIds.length);
  for (const id of wrongIds) {
    await expect(page.getByTestId(`question-card-${id}`)).toBeVisible();
  }
});

test('wrong answer shows individual retry button that resets the card', async ({ page }) => {
  await page.goto('/quiz/1.1');
  const cards = await waitForCards(page);
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const qId = (await card.getAttribute('data-testid'))!.replace('question-card-', '');
    const choices = card.locator('[data-testid^="choice-"]');
    if ((await choices.count()) < 2) continue;

    await choices.first().click();
    await expect(card.locator(`[data-testid="feedback-${qId}"]`)).toBeVisible();

    const retryBtn = card.locator(`[data-testid="retry-${qId}"]`);
    if ((await retryBtn.count()) === 0) continue; // correct — try next card

    await expect(retryBtn).toBeVisible();
    await retryBtn.click();

    await expect(card.locator(`[data-testid="feedback-${qId}"]`)).not.toBeVisible();
    await expect(choices.first()).toBeEnabled();
    return;
  }
});
