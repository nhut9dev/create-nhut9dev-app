import { expect, test } from '@playwright/test';

test.describe('Home page with LocaleSwitcher', () => {
  test('renders LocaleSwitcher and allows changing language', async ({ page }) => {
    await page.goto('/');

    // Check that the default locale is English (as configured in i18n/config.ts)
    await expect(page.getByText('Language')).toBeVisible();

    const select = page.getByRole('combobox');

    await expect(select).toHaveValue('en');

    await expect(select).toContainText('English');
    await expect(select).toContainText('Tiếng Việt');

    // Switch to Vietnamese
    await select.selectOption('vi');

    await expect(select).toHaveValue('vi');

    // Verify the label changes to Vietnamese
    await expect(page.getByText('Ngôn ngữ')).toBeVisible();
  });
});
