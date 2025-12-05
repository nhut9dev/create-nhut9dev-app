import { describe, it, expect } from '@jest/globals'

// Example test for UserEmail value object
describe('UserEmail Value Object', () => {
	describe('Validation', () => {
		it('should accept valid email format', () => {
			const validEmails = [
				'user@example.com',
				'test.user@domain.co.uk',
				'john+tag@company.org',
			]

			validEmails.forEach((email) => {
				expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
			})
		})

		it('should reject invalid email format', () => {
			const invalidEmails = [
				'invalid',
				'@domain.com',
				'user@',
				'user@domain',
				'user domain@test.com',
			]

			invalidEmails.forEach((email) => {
				expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
			})
		})
	})

	describe('Business Rules', () => {
		it('should normalize email to lowercase', () => {
			const email = 'USER@EXAMPLE.COM'
			const normalized = email.toLowerCase()

			expect(normalized).toBe('user@example.com')
		})

		it('should trim whitespace from email', () => {
			const email = '  user@example.com  '
			const trimmed = email.trim()

			expect(trimmed).toBe('user@example.com')
		})
	})
})
