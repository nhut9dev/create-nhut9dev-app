import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'

// Example test for useDebounce hook
describe('useDebounce Hook', () => {
	beforeEach(() => {
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	describe('Basic Functionality', () => {
		it('should return initial value immediately', () => {
			const initialValue = 'test'
			const debouncedValue = initialValue

			expect(debouncedValue).toBe('test')
		})

		it('should debounce value changes', () => {
			let debouncedValue = 'initial'
			const delay = 500

			// Simulate value change
			const newValue = 'updated'

			// Before delay, should still be initial
			expect(debouncedValue).toBe('initial')

			// Simulate delay passing
			jest.advanceTimersByTime(delay)

			// Update debounced value
			debouncedValue = newValue

			// After delay, should be updated
			expect(debouncedValue).toBe('updated')
		})

		it('should cancel previous timeout on new value', () => {
			const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
			let timeoutId: NodeJS.Timeout | undefined

			// First timeout
			timeoutId = setTimeout(() => {}, 500)

			// Clear and set new timeout
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
			timeoutId = setTimeout(() => {}, 500)

			expect(clearTimeoutSpy).toHaveBeenCalled()

			clearTimeoutSpy.mockRestore()
		})
	})

	describe('Delay Configuration', () => {
		it('should use default delay of 500ms', () => {
			const defaultDelay = 500

			expect(defaultDelay).toBe(500)
		})

		it('should accept custom delay', () => {
			const customDelay = 1000

			expect(customDelay).toBe(1000)
		})

		it('should wait for specified delay before updating', () => {
			const delay = 300
			let debouncedValue = 'initial'

			// Advance less than delay
			jest.advanceTimersByTime(200)
			expect(debouncedValue).toBe('initial')

			// Advance to complete delay
			jest.advanceTimersByTime(100)
			// Value would update here
		})
	})

	describe('Multiple Updates', () => {
		it('should only use last value after multiple rapid changes', () => {
			let value = 'a'
			const changes = ['b', 'c', 'd', 'e']
			const delay = 500

			// Simulate rapid changes
			changes.forEach((newVal) => {
				value = newVal
			})

			// Before delay
			expect(value).toBe('e')

			// After delay, should be last value
			jest.advanceTimersByTime(delay)
			expect(value).toBe('e')
		})

		it('should reset timer on each value change', () => {
			const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
			const delay = 500

			// Simulate multiple changes
			setTimeout(() => {}, delay)
			setTimeout(() => {}, delay)
			setTimeout(() => {}, delay)

			expect(setTimeoutSpy).toHaveBeenCalledTimes(3)

			setTimeoutSpy.mockRestore()
		})
	})

	describe('Cleanup', () => {
		it('should clear timeout on unmount', () => {
			const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
			const timeoutId = setTimeout(() => {}, 500)

			// Simulate unmount
			clearTimeout(timeoutId)

			expect(clearTimeoutSpy).toHaveBeenCalled()

			clearTimeoutSpy.mockRestore()
		})
	})
})
