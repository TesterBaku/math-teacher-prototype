import { expect, test } from '@playwright/test';

const LESSON = '1-1';

test('quiz type buttons: only the active type is visually selected', async ({ page }) => {
  await page.goto('/quiz/1.1?type=easy');

  const easyBtn   = page.getByTestId(`quiz-type-btn-${LESSON}-easy`);
  const mediumBtn = page.getByTestId(`quiz-type-btn-${LESSON}-medium`);
  const hardBtn   = page.getByTestId(`quiz-type-btn-${LESSON}-hard`);
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

  await expect(mediumBtn).toBeDisabled();
  await expect(page.getByTestId(`quiz-type-btn-${LESSON}-easy`)).toBeEnabled();
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
  await expect(page.locator('[data-testid^="question-card-"]')).toHaveCount(10);

  const firstCard = page.locator('[data-testid^="question-card-"]').first();
  const choices   = firstCard.locator('[data-testid^="choice-"]');

  if ((await choices.count()) > 0) {
    await choices.first().click();
  } else {
    const qId = (await firstCard.getAttribute('data-testid'))!.replace('question-card-', '');
    await firstCard.locator('[data-testid^="input-"]').first().fill('1');
    await page.getByTestId(`submit-${qId}`).click();
  }

  await page.getByTestId(`quiz-type-btn-${LESSON}-medium`).click();

  // Answers reset — no feedback elements present
  await expect(page.locator('[data-testid^="feedback-"]')).toHaveCount(0);
});

test('back link from quiz navigates to lesson detail', async ({ page }) => {
  await page.goto('/quiz/1.1');

  const backLink = page.getByTestId(`quiz-back-link-${LESSON}`);
  await expect(backLink).toBeVisible();
  await backLink.click();

  await expect(page).toHaveURL(/\/lessons\/1\.1/);
});

test('"Начать заново" button is absent from DOM before quiz is complete', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await expect(page.getByTestId(`restart-quiz-button-${LESSON}`)).toHaveCount(0);
});

test('"Повторить ошибки" button is absent from DOM before quiz is complete', async ({ page }) => {
  await page.goto('/quiz/1.1');

  await expect(page.getByTestId(`retry-wrong-button-${LESSON}`)).toHaveCount(0);
});

test('submit button is disabled when numeric input is empty, enabled when filled', async ({ page }) => {
  await page.goto('/quiz/1.1');

  const cards = page.locator('[data-testid^="question-card-"]');
  await expect(cards).toHaveCount(10);
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card   = cards.nth(i);
    const inputs = card.locator('[data-testid^="input-"]');
    if ((await inputs.count()) === 0) continue;

    const qId      = (await card.getAttribute('data-testid'))!.replace('question-card-', '');
    const submitBtn = page.getByTestId(`submit-${qId}`);

    await expect(submitBtn).toBeDisabled();       // empty → disabled
    await inputs.first().fill('42');
    await expect(submitBtn).toBeEnabled();         // filled → enabled
    return;
  }

  throw new Error('No numeric input card found in lesson 1.1 easy — check question bank');
});

test('Enter key submits a numeric input answer', async ({ page }) => {
  await page.goto('/quiz/1.1');

  const cards = page.locator('[data-testid^="question-card-"]');
  await expect(cards).toHaveCount(10);
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card   = cards.nth(i);
    const inputs = card.locator('[data-testid^="input-"]');
    if ((await inputs.count()) === 0) continue;

    const qId = (await card.getAttribute('data-testid'))!.replace('question-card-', '');
    await inputs.first().fill('42');
    await inputs.first().press('Enter');

    await expect(card.locator(`[data-testid="feedback-${qId}"]`)).toBeVisible();
    return;
  }

  throw new Error('No numeric input card found in lesson 1.1 easy — check question bank');
});

test('quiz page for unknown lesson shows not-found message with back link', async ({ page }) => {
  await page.goto('/quiz/99.99');

  await expect(page.getByTestId('quiz-not-found-99-99')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Урок не найден' })).toBeVisible();

  // Back link navigates to /lessons
  await page.getByTestId('quiz-not-found-back-99-99').click();
  await expect(page).toHaveURL(/\/lessons$/);
});
