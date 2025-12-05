'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/libs/react-query'
import { ReactNode } from 'react'

interface ReactQueryProviderProps {
	children: ReactNode
}

/**
 * React Query Provider wrapper
 * Provides QueryClient to the app and includes DevTools in development
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{process.env.NODE_ENV === 'development' && (
				<ReactQueryDevtools initialIsOpen={false} position="bottom" />
			)}
		</QueryClientProvider>
	)
}
