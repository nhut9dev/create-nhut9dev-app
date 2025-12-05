import { describe, it, expect, beforeEach } from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import { useGlobalStore } from '../globalStore'

describe('GlobalStore', () => {
	beforeEach(() => {
		// Reset store before each test
		const { result } = renderHook(() => useGlobalStore((state) => state.reset))
		act(() => {
			result.current()
		})
	})

	describe('Theme', () => {
		it('should have default theme as system', () => {
			const { result } = renderHook(() => useGlobalStore.use.theme())

			expect(result.current).toBe('system')
		})

		it('should set theme to light', () => {
			const { result } = renderHook(() => ({
				theme: useGlobalStore.use.theme(),
				setTheme: useGlobalStore.use.setTheme(),
			}))

			act(() => {
				result.current.setTheme('light')
			})

			expect(result.current.theme).toBe('light')
		})

		it('should set theme to dark', () => {
			const { result } = renderHook(() => ({
				theme: useGlobalStore.use.theme(),
				setTheme: useGlobalStore.use.setTheme(),
			}))

			act(() => {
				result.current.setTheme('dark')
			})

			expect(result.current.theme).toBe('dark')
		})
	})

	describe('Sidebar', () => {
		it('should have sidebar open by default', () => {
			const { result } = renderHook(() => useGlobalStore.use.isSidebarOpen())

			expect(result.current).toBe(true)
		})

		it('should toggle sidebar', () => {
			const { result } = renderHook(() => ({
				isSidebarOpen: useGlobalStore.use.isSidebarOpen(),
				toggleSidebar: useGlobalStore.use.toggleSidebar(),
			}))

			expect(result.current.isSidebarOpen).toBe(true)

			act(() => {
				result.current.toggleSidebar()
			})

			expect(result.current.isSidebarOpen).toBe(false)

			act(() => {
				result.current.toggleSidebar()
			})

			expect(result.current.isSidebarOpen).toBe(true)
		})

		it('should have sidebar not collapsed by default', () => {
			const { result } = renderHook(() =>
				useGlobalStore.use.isSidebarCollapsed()
			)

			expect(result.current).toBe(false)
		})

		it('should toggle sidebar collapse', () => {
			const { result } = renderHook(() => ({
				isSidebarCollapsed: useGlobalStore.use.isSidebarCollapsed(),
				toggleSidebarCollapse: useGlobalStore.use.toggleSidebarCollapse(),
			}))

			expect(result.current.isSidebarCollapsed).toBe(false)

			act(() => {
				result.current.toggleSidebarCollapse()
			})

			expect(result.current.isSidebarCollapsed).toBe(true)

			act(() => {
				result.current.toggleSidebarCollapse()
			})

			expect(result.current.isSidebarCollapsed).toBe(false)
		})
	})

	describe('Navigation', () => {
		it('should have default current path as /', () => {
			const { result } = renderHook(() => useGlobalStore.use.currentPath())

			expect(result.current).toBe('/')
		})

		it('should set current path', () => {
			const { result } = renderHook(() => ({
				currentPath: useGlobalStore.use.currentPath(),
				setCurrentPath: useGlobalStore.use.setCurrentPath(),
			}))

			act(() => {
				result.current.setCurrentPath('/users')
			})

			expect(result.current.currentPath).toBe('/users')
		})
	})

	describe('Reset', () => {
		it('should reset entire store to initial state', () => {
			const { result } = renderHook(() => ({
				theme: useGlobalStore.use.theme(),
				isSidebarOpen: useGlobalStore.use.isSidebarOpen(),
				currentPath: useGlobalStore.use.currentPath(),
				setTheme: useGlobalStore.use.setTheme(),
				toggleSidebar: useGlobalStore.use.toggleSidebar(),
				setCurrentPath: useGlobalStore.use.setCurrentPath(),
				reset: useGlobalStore.use.reset(),
			}))

			// Change state
			act(() => {
				result.current.setTheme('dark')
				result.current.toggleSidebar()
				result.current.setCurrentPath('/users')
			})

			expect(result.current.theme).toBe('dark')
			expect(result.current.isSidebarOpen).toBe(false)
			expect(result.current.currentPath).toBe('/users')

			// Reset
			act(() => {
				result.current.reset()
			})

			expect(result.current.theme).toBe('system')
			expect(result.current.isSidebarOpen).toBe(true)
			expect(result.current.currentPath).toBe('/')
		})
	})
})
