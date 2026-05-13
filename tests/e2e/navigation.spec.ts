import { expect, test } from '@playwright/test';

test('home page links lead to lessons and quiz pages', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Interactive lessons and mistake-specific quiz explanations' })).toBeVisible();

  await page.getByRole('link', { name: 'Open Lessons' }).click();
  await expect(page).toHaveURL(/\/lessons$/);
  await expect(page.getByRole('heading', { name: 'Lessons' })).toBeVisible();

  const lessonCard = page.locator('article', { hasText: '1.3' });
  await lessonCard.getByRole('link', { name: 'Quiz' }).click();

  await expect(page).toHaveURL(/\/quiz\/1\.3$/);
  await expect(page.getByRole('heading', { name: '1.3. Округление натуральных чисел' })).toBeVisible();
});
