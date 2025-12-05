import { QueryClient, DefaultOptions } from '@tanstack/react-query'

/**
 * Default options for React Query
 */
const queryConfig: DefaultOptions = {
	queries: {
		// Disable automatic refetching
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,

		// Retry configuration
		retry: 1,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

		// Stale time: 5 minutes
		staleTime: 5 * 60 * 1000,

		// Cache time: 10 minutes
		gcTime: 10 * 60 * 1000,
	},
	mutations: {
		// Retry mutations once
		retry: 1,
	},
}

/**
 * Create a new QueryClient instance
 */
export function createQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: queryConfig,
	})
}

/**
 * Singleton QueryClient for app-wide use
 */
export const queryClient = createQueryClient()
