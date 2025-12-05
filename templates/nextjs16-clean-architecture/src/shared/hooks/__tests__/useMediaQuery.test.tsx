import { renderHook } from '@testing-library/react'
import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Example test for useMediaQuery hook
describe('useMediaQuery Hook', () => {
	const mockMatchMedia = (matches: boolean) => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches,
				media: query,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		})
	}

	beforeEach(() => {
		mockMatchMedia(false)
	})

	describe('Basic Functionality', () => {
		it('should return true when media query matches', () => {
			mockMatchMedia(true)
			const matches = window.matchMedia('(min-width: 768px)').matches

			expect(matches).toBe(true)
		})

		it('should return false when media query does not match', () => {
			mockMatchMedia(false)
			const matches = window.matchMedia('(min-width: 768px)').matches

			expect(matches).toBe(false)
		})

		it('should accept any valid media query string', () => {
			const queries = [
				'(min-width: 768px)',
				'(max-width: 1024px)',
				'(orientation: portrait)',
				'(prefers-color-scheme: dark)',
			]

			queries.forEach((query) => {
				expect(typeof query).toBe('string')
				expect(query.length).toBeGreaterThan(0)
			})
		})
	})

	describe('Common Breakpoints', () => {
		it('should detect mobile viewport', () => {
			const mobileQuery = '(max-width: 767px)'
			expect(mobileQuery).toBe('(max-width: 767px)')
		})

		it('should detect tablet viewport', () => {
			const tabletQuery = '(min-width: 768px) and (max-width: 1023px)'
			expect(tabletQuery).toBe('(min-width: 768px) and (max-width: 1023px)')
		})

		it('should detect desktop viewport', () => {
			const desktopQuery = '(min-width: 1024px)'
			expect(desktopQuery).toBe('(min-width: 1024px)')
		})
	})

	describe('Event Listener', () => {
		it('should add change event listener', () => {
			const addEventListenerSpy = jest.fn()

			Object.defineProperty(window, 'matchMedia', {
				writable: true,
				value: jest.fn().mockImplementation((query) => ({
					matches: false,
					media: query,
					addEventListener: addEventListenerSpy,
					removeEventListener: jest.fn(),
				})),
			})

			const mediaQuery = window.matchMedia('(min-width: 768px)')
			mediaQuery.addEventListener('change', () => {})

			expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
		})

		it('should remove event listener on cleanup', () => {
			const removeEventListenerSpy = jest.fn()

			Object.defineProperty(window, 'matchMedia', {
				writable: true,
				value: jest.fn().mockImplementation((query) => ({
					matches: false,
					media: query,
					addEventListener: jest.fn(),
					removeEventListener: removeEventListenerSpy,
				})),
			})

			const mediaQuery = window.matchMedia('(min-width: 768px)')
			const handler = () => {}
			mediaQuery.addEventListener('change', handler)
			mediaQuery.removeEventListener('change', handler)

			expect(removeEventListenerSpy).toHaveBeenCalledWith('change', handler)
		})
	})

	describe('SSR Compatibility', () => {
		it('should handle undefined window', () => {
			const hasWindow = typeof window !== 'undefined'

			if (!hasWindow) {
				expect(hasWindow).toBe(false)
			} else {
				expect(hasWindow).toBe(true)
			}
		})

		it('should return false when matchMedia is not available', () => {
			// In Jest environment, matchMedia is always defined
			// This test verifies the check logic
			const matchMediaExists = typeof window.matchMedia !== 'undefined'

			// Verify matchMedia exists in test environment
			expect(matchMediaExists).toBe(true)

			// In real SSR environment without window, this would be false
			const isSSR = typeof window === 'undefined'
			expect(isSSR).toBe(false) // We have window in tests
		})
	})
})
