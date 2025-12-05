import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
	? S & { use: { [K in keyof T]: () => T[K] } }
	: never

/**
 * Create auto-generated selectors for Zustand store
 * Usage:
 * const useStore = createSelectors(
 *   create<StoreState>((set) => ({ ... }))
 * )
 *
 * // Use auto-generated selectors
 * const user = useStore.use.user()
 * const count = useStore.use.count()
 */
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S
) => {
	const store = _store as WithSelectors<typeof _store>
	store.use = {} as never
	for (const k of Object.keys(store.getState())) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
	}

	return store
}
