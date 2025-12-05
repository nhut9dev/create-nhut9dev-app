import { ApiError } from '@/infrastructure/api'

/**
 * Error severity levels
 */
export enum ErrorSeverity {
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error',
	CRITICAL = 'critical',
}

/**
 * Structured error interface
 */
export interface StructuredError {
	message: string
	code?: string
	severity: ErrorSeverity
	timestamp: Date
	stack?: string
	metadata?: Record<string, unknown>
}

/**
 * Error handler class
 */
class ErrorHandler {
	private errorListeners: Array<(error: StructuredError) => void> = []

	/**
	 * Register error listener
	 */
	onError(listener: (error: StructuredError) => void) {
		this.errorListeners.push(listener)
		return () => {
			this.errorListeners = this.errorListeners.filter((l) => l !== listener)
		}
	}

	/**
	 * Handle error
	 */
	handle(error: unknown, metadata?: Record<string, unknown>): StructuredError {
		const structuredError = this.parseError(error, metadata)

		// Notify listeners
		this.errorListeners.forEach((listener) => {
			try {
				listener(structuredError)
			} catch (err) {
				console.error('Error in error listener:', err)
			}
		})

		// Log to console in development
		if (process.env.NODE_ENV === 'development') {
			console.error('[ErrorHandler]', structuredError)
		}

		// Send to error tracking service (Sentry, etc)
		this.reportToService(structuredError)

		return structuredError
	}

	/**
	 * Parse error to structured format
	 */
	private parseError(
		error: unknown,
		metadata?: Record<string, unknown>
	): StructuredError {
		// API Error
		if (error instanceof ApiError) {
			return {
				message: error.message,
				code: `API_${error.status}`,
				severity: this.getSeverityFromStatus(error.status),
				timestamp: new Date(),
				stack: error.stack,
				metadata: {
					...metadata,
					statusCode: error.status,
					statusText: error.statusText,
					data: error.data,
				},
			}
		}

		// Standard Error
		if (error instanceof Error) {
			return {
				message: error.message,
				code: error.name,
				severity: ErrorSeverity.ERROR,
				timestamp: new Date(),
				stack: error.stack,
				metadata,
			}
		}

		// String error
		if (typeof error === 'string') {
			return {
				message: error,
				severity: ErrorSeverity.ERROR,
				timestamp: new Date(),
				metadata,
			}
		}

		// Unknown error
		return {
			message: 'An unknown error occurred',
			severity: ErrorSeverity.ERROR,
			timestamp: new Date(),
			metadata: {
				...metadata,
				originalError: error,
			},
		}
	}

	/**
	 * Get severity from HTTP status code
	 */
	private getSeverityFromStatus(status: number): ErrorSeverity {
		if (status >= 500) return ErrorSeverity.CRITICAL
		if (status >= 400) return ErrorSeverity.ERROR
		if (status >= 300) return ErrorSeverity.WARNING
		return ErrorSeverity.INFO
	}

	/**
	 * Report error to external service
	 */
	private reportToService(error: StructuredError) {
		// Only report errors and critical in production
		if (
			process.env.NODE_ENV === 'production' &&
			(error.severity === ErrorSeverity.ERROR ||
				error.severity === ErrorSeverity.CRITICAL)
		) {
			// Send to Sentry, LogRocket, etc
			// Example:
			// Sentry.captureException(error)
			console.log('Would report to error tracking service:', error)
		}
	}

	/**
	 * Get user-friendly error message
	 */
	getUserMessage(error: unknown): string {
		if (error instanceof ApiError) {
			switch (error.status) {
				case 400:
					return 'Invalid request. Please check your input.'
				case 401:
					return 'You need to login to perform this action.'
				case 403:
					return 'You do not have permission to perform this action.'
				case 404:
					return 'The requested resource was not found.'
				case 408:
					return 'Request timeout. Please try again.'
				case 429:
					return 'Too many requests. Please try again later.'
				case 500:
					return 'Server error. Please try again later.'
				case 503:
					return 'Service temporarily unavailable. Please try again later.'
				default:
					return error.message
			}
		}

		if (error instanceof Error) {
			return error.message
		}

		if (typeof error === 'string') {
			return error
		}

		return 'An unexpected error occurred. Please try again.'
	}
}

/**
 * Global error handler instance
 */
export const errorHandler = new ErrorHandler()
