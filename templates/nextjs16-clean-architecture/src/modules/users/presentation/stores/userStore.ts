import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createSelectors } from '@/libs/zustand'

/**
 * User filters state
 */
interface UserFilters {
	search: string
	status: 'all' | 'active' | 'inactive'
	page: number
	limit: number
}

/**
 * User store state
 */
interface UserStoreState {
	// Filters
	filters: UserFilters

	// Selected user ID for detail view
	selectedUserId: string | null

	// UI state
	isCreateModalOpen: boolean
	isEditModalOpen: boolean

	// Actions
	setFilters: (filters: Partial<UserFilters>) => void
	resetFilters: () => void
	setSelectedUserId: (id: string | null) => void
	openCreateModal: () => void
	closeCreateModal: () => void
	openEditModal: () => void
	closeEditModal: () => void
	reset: () => void
}

/**
 * Initial state
 */
const initialState = {
	filters: {
		search: '',
		status: 'all' as const,
		page: 1,
		limit: 10,
	},
	selectedUserId: null,
	isCreateModalOpen: false,
	isEditModalOpen: false,
}

/**
 * User store with Zustand
 * Manages UI state and filters for user management
 */
const useUserStoreBase = create<UserStoreState>()(
	devtools(
		persist(
			(set) => ({
				...initialState,

				setFilters: (newFilters) =>
					set((state) => ({
						filters: { ...state.filters, ...newFilters },
					})),

				resetFilters: () =>
					set({
						filters: initialState.filters,
					}),

				setSelectedUserId: (id) =>
					set({
						selectedUserId: id,
					}),

				openCreateModal: () =>
					set({
						isCreateModalOpen: true,
					}),

				closeCreateModal: () =>
					set({
						isCreateModalOpen: false,
					}),

				openEditModal: () =>
					set({
						isEditModalOpen: true,
					}),

				closeEditModal: () =>
					set({
						isEditModalOpen: false,
						selectedUserId: null,
					}),

				reset: () => set(initialState),
			}),
			{
				name: 'user-store',
				// Only persist filters
				partialize: (state) => ({ filters: state.filters }),
			}
		),
		{
			name: 'UserStore',
		}
	)
)

/**
 * Export store with auto-generated selectors
 * Usage:
 * const filters = useUserStore.use.filters()
 * const search = useUserStore.use.filters().search
 */
export const useUserStore = createSelectors(useUserStoreBase)
