import { expect, test } from '@playwright/test';

test('home page hero is visible with Russian content', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('home-hero')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Уроки и тренировочные задания' })).toBeVisible();
  await expect(page.getByTestId('home-open-lessons-link')).toBeVisible();
  await expect(page.getByTestId('home-try-rounding-quiz-link')).toBeVisible();
});

test('home page "Открыть уроки" link navigates to lessons', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('home-open-lessons-link').click();
  await expect(page).toHaveURL(/\/lessons$/);
  await expect(page.getByRole('heading', { name: 'Уроки' })).toBeVisible();
  await expect(page.getByTestId('lessons-page')).toBeVisible();
});

test('home page "Попробовать тест: Округление" link navigates to quiz', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('home-try-rounding-quiz-link').click();
  await expect(page).toHaveURL(/\/quiz\/1\.3$/);
  await expect(page.getByTestId('quiz-page-1-3')).toBeVisible();
});

test('lessons page shows chapter groups with lesson cards', async ({ page }) => {
  await page.goto('/lessons');

  await expect(page.getByTestId('lessons-page')).toBeVisible();
  await expect(page.getByTestId('lessons-header')).toBeVisible();

  // First chapter is open by default
  const firstChapter = page.locator('[data-testid^="chapter-group-"]').first();
  await expect(firstChapter).toBeVisible();

  // Lesson 1.1 card exists
  await expect(page.getByTestId('lesson-card-1-1')).toBeVisible();
});

test('lessons page quiz links navigate to quiz with correct type', async ({ page }) => {
  await page.goto('/lessons');

  const easyLink = page.getByTestId('lesson-quiz-link-1-1-easy');
  await expect(easyLink).toBeVisible();

  await easyLink.click();
  await expect(page).toHaveURL(/\/quiz\/1\.1\?type=easy/);
  await expect(page.getByTestId('quiz-page-1-1')).toBeVisible();
});

test('lessons page learn link navigates to lesson detail', async ({ page }) => {
  await page.goto('/lessons');

  await page.getByTestId('lesson-learn-link-1-1').click();
  await expect(page).toHaveURL(/\/lessons\/1\.1/);
});
