import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createSelectors } from '@/libs/zustand'

/**
 * Theme type
 */
type Theme = 'light' | 'dark' | 'system'

/**
 * Global store state
 */
interface GlobalStoreState {
	// Theme
	theme: Theme

	// Sidebar
	isSidebarOpen: boolean
	isSidebarCollapsed: boolean

	// Navigation
	currentPath: string

	// Actions
	setTheme: (theme: Theme) => void
	toggleSidebar: () => void
	toggleSidebarCollapse: () => void
	setCurrentPath: (path: string) => void
	reset: () => void
}

/**
 * Initial state
 */
const initialState = {
	theme: 'system' as Theme,
	isSidebarOpen: true,
	isSidebarCollapsed: false,
	currentPath: '/',
}

/**
 * Global store for app-wide state
 */
const useGlobalStoreBase = create<GlobalStoreState>()(
	devtools(
		persist(
			(set) => ({
				...initialState,

				setTheme: (theme) => set({ theme }),

				toggleSidebar: () =>
					set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

				toggleSidebarCollapse: () =>
					set((state) => ({
						isSidebarCollapsed: !state.isSidebarCollapsed,
					})),

				setCurrentPath: (path) => set({ currentPath: path }),

				reset: () => set(initialState),
			}),
			{
				name: 'global-store',
			}
		),
		{
			name: 'GlobalStore',
		}
	)
)

/**
 * Export store with auto-generated selectors
 */
export const useGlobalStore = createSelectors(useGlobalStoreBase)
