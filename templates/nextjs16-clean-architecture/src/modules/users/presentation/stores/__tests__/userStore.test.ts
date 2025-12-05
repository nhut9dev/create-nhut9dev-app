import { describe, it, expect, beforeEach } from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import { useUserStore } from '../userStore'

describe('UserStore', () => {
	beforeEach(() => {
		// Reset store before each test
		const { result } = renderHook(() => useUserStore((state) => state.reset))
		act(() => {
			result.current()
		})
	})

	describe('Filters', () => {
		it('should have default filters', () => {
			const { result } = renderHook(() => useUserStore.use.filters())

			expect(result.current).toEqual({
				search: '',
				status: 'all',
				page: 1,
				limit: 10,
			})
		})

		it('should update filters', () => {
			const { result } = renderHook(() => ({
				filters: useUserStore.use.filters(),
				setFilters: useUserStore.use.setFilters(),
			}))

			act(() => {
				result.current.setFilters({ search: 'test' })
			})

			expect(result.current.filters.search).toBe('test')
		})

		it('should reset filters', () => {
			const { result } = renderHook(() => ({
				filters: useUserStore.use.filters(),
				setFilters: useUserStore.use.setFilters(),
				resetFilters: useUserStore.use.resetFilters(),
			}))

			act(() => {
				result.current.setFilters({ search: 'test', page: 5 })
			})

			expect(result.current.filters.search).toBe('test')
			expect(result.current.filters.page).toBe(5)

			act(() => {
				result.current.resetFilters()
			})

			expect(result.current.filters).toEqual({
				search: '',
				status: 'all',
				page: 1,
				limit: 10,
			})
		})
	})

	describe('Selected User', () => {
		it('should set selected user id', () => {
			const { result } = renderHook(() => ({
				selectedUserId: useUserStore.use.selectedUserId(),
				setSelectedUserId: useUserStore.use.setSelectedUserId(),
			}))

			expect(result.current.selectedUserId).toBeNull()

			act(() => {
				result.current.setSelectedUserId('123')
			})

			expect(result.current.selectedUserId).toBe('123')
		})

		it('should clear selected user id', () => {
			const { result } = renderHook(() => ({
				selectedUserId: useUserStore.use.selectedUserId(),
				setSelectedUserId: useUserStore.use.setSelectedUserId(),
			}))

			act(() => {
				result.current.setSelectedUserId('123')
			})

			expect(result.current.selectedUserId).toBe('123')

			act(() => {
				result.current.setSelectedUserId(null)
			})

			expect(result.current.selectedUserId).toBeNull()
		})
	})

	describe('Modal State', () => {
		it('should open and close create modal', () => {
			const { result } = renderHook(() => ({
				isCreateModalOpen: useUserStore.use.isCreateModalOpen(),
				openCreateModal: useUserStore.use.openCreateModal(),
				closeCreateModal: useUserStore.use.closeCreateModal(),
			}))

			expect(result.current.isCreateModalOpen).toBe(false)

			act(() => {
				result.current.openCreateModal()
			})

			expect(result.current.isCreateModalOpen).toBe(true)

			act(() => {
				result.current.closeCreateModal()
			})

			expect(result.current.isCreateModalOpen).toBe(false)
		})

		it('should open and close edit modal', () => {
			const { result } = renderHook(() => ({
				isEditModalOpen: useUserStore.use.isEditModalOpen(),
				openEditModal: useUserStore.use.openEditModal(),
				closeEditModal: useUserStore.use.closeEditModal(),
			}))

			expect(result.current.isEditModalOpen).toBe(false)

			act(() => {
				result.current.openEditModal()
			})

			expect(result.current.isEditModalOpen).toBe(true)

			act(() => {
				result.current.closeEditModal()
			})

			expect(result.current.isEditModalOpen).toBe(false)
		})

		it('should clear selected user when closing edit modal', () => {
			const { result } = renderHook(() => ({
				selectedUserId: useUserStore.use.selectedUserId(),
				setSelectedUserId: useUserStore.use.setSelectedUserId(),
				closeEditModal: useUserStore.use.closeEditModal(),
			}))

			act(() => {
				result.current.setSelectedUserId('123')
			})

			expect(result.current.selectedUserId).toBe('123')

			act(() => {
				result.current.closeEditModal()
			})

			expect(result.current.selectedUserId).toBeNull()
		})
	})

	describe('Reset', () => {
		it('should reset entire store to initial state', () => {
			const { result } = renderHook(() => ({
				filters: useUserStore.use.filters(),
				selectedUserId: useUserStore.use.selectedUserId(),
				isCreateModalOpen: useUserStore.use.isCreateModalOpen(),
				setFilters: useUserStore.use.setFilters(),
				setSelectedUserId: useUserStore.use.setSelectedUserId(),
				openCreateModal: useUserStore.use.openCreateModal(),
				reset: useUserStore.use.reset(),
			}))

			// Change state
			act(() => {
				result.current.setFilters({ search: 'test', page: 5 })
				result.current.setSelectedUserId('123')
				result.current.openCreateModal()
			})

			expect(result.current.filters.search).toBe('test')
			expect(result.current.selectedUserId).toBe('123')
			expect(result.current.isCreateModalOpen).toBe(true)

			// Reset
			act(() => {
				result.current.reset()
			})

			expect(result.current.filters).toEqual({
				search: '',
				status: 'all',
				page: 1,
				limit: 10,
			})
			expect(result.current.selectedUserId).toBeNull()
			expect(result.current.isCreateModalOpen).toBe(false)
		})
	})
})
