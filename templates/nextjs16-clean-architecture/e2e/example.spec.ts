import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
	test('should display homepage title', async ({ page }) => {
		await page.goto('/')

		// Wait for page to load
		await page.waitForLoadState('networkidle')

		// Check if the page is accessible
		await expect(page).toHaveURL('/')
	})

	test('should have proper meta tags', async ({ page }) => {
		await page.goto('/')

		// Check page title (default Next.js title)
		await expect(page).toHaveTitle(/Create Next App/)
	})
})
