'use client'

import { ReactNode, useEffect } from 'react'
import { ReactQueryProvider } from './ReactQueryProvider'
import { ErrorBoundary } from '@/components/error-boundary'
import { setupErrorHandling } from '@/libs/error-handler/setupErrorHandling'

interface AppProvidersProps {
	children: ReactNode
}

/**
 * Root providers wrapper
 * Combines all app-level providers
 */
export function AppProviders({ children }: AppProvidersProps) {
	useEffect(() => {
		// Setup global error handling on mount
		setupErrorHandling()
	}, [])

	return (
		<ErrorBoundary>
			<ReactQueryProvider>{children}</ReactQueryProvider>
		</ErrorBoundary>
	)
}

export { ReactQueryProvider }
