import { expect, test } from '@playwright/test';

test.describe('Home page with LocaleSwitcher', () => {
  test('renders LocaleSwitcher and allows changing language', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Ngôn ngữ')).toBeVisible();

    const select = page.getByRole('combobox');

    await expect(select).toHaveValue('vi');

    await expect(select).toContainText('English');
    await expect(select).toContainText('Tiếng Việt');

    await select.selectOption('en');

    await expect(select).toHaveValue('en');

    await expect(page.getByText('Language')).toBeVisible();
  });
});
