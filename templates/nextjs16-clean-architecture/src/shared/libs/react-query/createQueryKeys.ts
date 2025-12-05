/**
 * Factory function to create type-safe query keys
 * Reusable pattern for all modules
 */

export function createQueryKeys<T extends string>(baseKey: T) {
	return {
		all: [baseKey] as const,
		lists: () => [baseKey, 'list'] as const,
		list: (filters?: Record<string, unknown>) =>
			[baseKey, 'list', filters] as const,
		details: () => [baseKey, 'detail'] as const,
		detail: (id: string) => [baseKey, 'detail', id] as const,
	} as const
}

/**
 * Example usage:
 *
 * const productQueryKeys = createQueryKeys('products')
 * productQueryKeys.all           // ['products']
 * productQueryKeys.list()        // ['products', 'list']
 * productQueryKeys.detail('123') // ['products', 'detail', '123']
 */
