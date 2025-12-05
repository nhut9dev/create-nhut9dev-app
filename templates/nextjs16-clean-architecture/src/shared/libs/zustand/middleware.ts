import { StateCreator } from 'zustand'

/**
 * Logger middleware for Zustand stores
 * Logs state changes in development
 */
export const logger =
	<T>(config: StateCreator<T>): StateCreator<T> =>
	(set, get, api) =>
		config(
			(args) => {
				if (process.env.NODE_ENV === 'development') {
					console.log('  Previous State:', get())
					console.log('  Action:', args)
				}
				set(args)
				if (process.env.NODE_ENV === 'development') {
					console.log('  Next State:', get())
				}
			},
			get,
			api
		)

/**
 * Reset middleware for Zustand stores
 * Adds a reset action to restore initial state
 */
export const resetters = new Set<() => void>()

export const resetAllStores = () => {
	resetters.forEach((resetter) => resetter())
}

export const createResetable = <T>(initialState: T) => {
	return (set: (state: T | Partial<T>) => void) => {
		resetters.add(() => set(initialState))
		return initialState
	}
}
