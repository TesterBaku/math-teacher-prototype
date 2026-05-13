import { expect, test } from '@playwright/test';

const LESSON = '1-1';

test('quiz type buttons: only the active type is visually selected', async ({ page }) => {
  await page.goto('/quiz/1.1?type=easy');

  const easyBtn  = page.getByTestId(`quiz-type-btn-${LESSON}-easy`);
  const mediumBtn = page.getByTestId(`quiz-type-btn-${LESSON}-medium`);
  const hardBtn  = page.getByTestId(`quiz-type-btn-${LESSON}-hard`);
  const mixedBtn  = page.getByTestId(`quiz-type-btn-${LESSON}-mixed`);

  // Easy is active on load — its button is disabled (active = disabled in the selector)
  await expect(easyBtn).toBeDisabled();
  await expect(mediumBtn).toBeEnabled();
  await expect(hardBtn).toBeEnabled();
  await expect(mixedBtn).toBeEnabled();
});

test('clicking Средний quiz type button activates it and reloads questions', async ({ page }) => {
  await page.goto('/quiz/1.1?type=easy');

  const mediumBtn = page.getByTestId(`quiz-type-btn-${LESSON}-medium`);
  await mediumBtn.click();

  // Medium is now active (disabled), easy is inactive (enabled)
  await expect(mediumBtn).toBeDisabled();
  await expect(page.getByTestId(`quiz-type-btn-${LESSON}-easy`)).toBeEnabled();

  // Still 10 questions shown
  await expect(page.locator('[data-testid^="question-card-"]')).toHaveCount(10);
});

test('clicking Сложный quiz type button activates it', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await page.getByTestId(`quiz-type-btn-${LESSON}-hard`).click();

  await expect(page.getByTestId(`quiz-type-btn-${LESSON}-hard`)).toBeDisabled();
  await expect(page.getByTestId(`quiz-type-btn-${LESSON}-easy`)).toBeEnabled();
  await expect(page.locator('[data-testid^="question-card-"]')).toHaveCount(10);
});

test('clicking Микс quiz type button activates it', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await page.getByTestId(`quiz-type-btn-${LESSON}-mixed`).click();

  await expect(page.getByTestId(`quiz-type-btn-${LESSON}-mixed`)).toBeDisabled();
  await expect(page.getByTestId(`quiz-type-btn-${LESSON}-easy`)).toBeEnabled();
  await expect(page.locator('[data-testid^="question-card-"]')).toHaveCount(10);
});

test('switching quiz type resets any in-progress answers', async ({ page }) => {
  await page.goto('/quiz/1.1?type=easy');

  // Wait for cards to appear (useEffect populates them after hydration)
  await expect(page.locator('[data-testid^="question-card-"]')).toHaveCount(10);

  // Answer the first card
  const firstCard = page.locator('[data-testid^="question-card-"]').first();
  const choices = firstCard.locator('[data-testid^="choice-"]');
  const numerics = firstCard.locator('[data-testid^="input-"]');

  if ((await choices.count()) > 0) {
    await choices.first().click();
  } else {
    const qId = (await firstCard.getAttribute('data-testid'))!.replace('question-card-', '');
    await numerics.first().fill('1');
    await page.getByTestId(`submit-${qId}`).click();
  }

  // Now switch to medium
  await page.getByTestId(`quiz-type-btn-${LESSON}-medium`).click();

  // No feedbacks visible — answers were reset
  await expect(page.locator('[data-testid^="feedback-"]')).toHaveCount(0);
});

test('back link from quiz navigates to lesson detail', async ({ page }) => {
  await page.goto('/quiz/1.1');

  const backLink = page.getByTestId(`quiz-back-link-${LESSON}`);
  await expect(backLink).toBeVisible();
  await backLink.click();

  await expect(page).toHaveURL(/\/lessons\/1\.1/);
});

test('"Начать заново" button is not visible before quiz is complete', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await expect(page.getByTestId(`restart-quiz-button-${LESSON}`)).not.toBeVisible();
});

test('"Повторить ошибки" button is not visible before quiz is complete', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await expect(page.getByTestId(`retry-wrong-button-${LESSON}`)).not.toBeVisible();
});

test('submit button is disabled when numeric input is empty', async ({ page }) => {
  await page.goto('/quiz/1.1');

  // Find a numeric input card
  const cards = page.locator('[data-testid^="question-card-"]');
  await expect(cards).toHaveCount(10);
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const inputs = card.locator('[data-testid^="input-"]');
    if ((await inputs.count()) === 0) continue;

    const qId = (await card.getAttribute('data-testid'))!.replace('question-card-', '');
    const submitBtn = page.getByTestId(`submit-${qId}`);

    // Empty input → submit disabled
    await expect(submitBtn).toBeDisabled();

    // Filled input → submit enabled
    await inputs.first().fill('42');
    await expect(submitBtn).toBeEnabled();
    return;
  }
});

test('Enter key submits a numeric input answer', async ({ page }) => {
  await page.goto('/quiz/1.1');

  const cards = page.locator('[data-testid^="question-card-"]');
  await expect(cards).toHaveCount(10);
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const inputs = card.locator('[data-testid^="input-"]');
    if ((await inputs.count()) === 0) continue;

    const qId = (await card.getAttribute('data-testid'))!.replace('question-card-', '');
    await inputs.first().fill('42');
    await inputs.first().press('Enter');

    await expect(card.locator(`[data-testid="feedback-${qId}"]`)).toBeVisible();
    return;
  }
});

test('quiz page for unknown lesson shows not-found message', async ({ page }) => {
  await page.goto('/quiz/99.99');

  await expect(page.getByTestId('quiz-not-found-99-99')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Урок не найден' })).toBeVisible();
});
