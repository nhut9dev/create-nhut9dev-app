import { errorHandler } from '@/errors/ErrorHandler'

/**
 * Setup global error handling
 * Call this in app initialization
 */
export function setupErrorHandling() {
	// TODO: Add toast notification integration when UI library is configured
	// errorHandler.onError((error) => {
	//   // Show toast notifications for errors
	// })

	// Global unhandled error handler
	if (typeof window !== 'undefined') {
		window.addEventListener('error', (event) => {
			errorHandler.handle(event.error, {
				source: 'window.onerror',
				filename: event.filename,
				lineno: event.lineno,
				colno: event.colno,
			})
		})

		// Unhandled promise rejection
		window.addEventListener('unhandledrejection', (event) => {
			errorHandler.handle(event.reason, {
				source: 'unhandledrejection',
				promise: event.promise,
			})
		})
	}
}
