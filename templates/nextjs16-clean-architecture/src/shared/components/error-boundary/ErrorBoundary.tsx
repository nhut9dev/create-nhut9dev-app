'use client'

import React, { Component, ReactNode } from 'react'
import { errorHandler, ErrorSeverity } from '@/errors/ErrorHandler'

interface Props {
	children: ReactNode
	fallback?: (error: Error, reset: () => void) => ReactNode
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
	hasError: boolean
	error: Error | null
}

/**
 * Error Boundary component
 * Catches React rendering errors
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
		}
	}

	static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
		}
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Handle error
		errorHandler.handle(error, {
			componentStack: errorInfo.componentStack,
			source: 'ErrorBoundary',
		})

		// Call custom error handler
		this.props.onError?.(error, errorInfo)
	}

	reset = () => {
		this.setState({
			hasError: false,
			error: null,
		})
	}

	render() {
		if (this.state.hasError && this.state.error) {
			// Custom fallback
			if (this.props.fallback) {
				return this.props.fallback(this.state.error, this.reset)
			}

			// Default fallback
			return <DefaultErrorFallback error={this.state.error} reset={this.reset} />
		}

		return this.props.children
	}
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '400px',
				padding: '2rem',
				textAlign: 'center',
			}}
		>
			<h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
				Oops! Something went wrong
			</h2>
			<p style={{ color: '#666', marginBottom: '1.5rem' }}>
				{errorHandler.getUserMessage(error)}
			</p>
			{process.env.NODE_ENV === 'development' && (
				<details style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
					<summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
						Error Details
					</summary>
					<pre
						style={{
							padding: '1rem',
							background: '#f5f5f5',
							borderRadius: '4px',
							overflow: 'auto',
							fontSize: '0.875rem',
						}}
					>
						{error.stack}
					</pre>
				</details>
			)}
			<button
				onClick={reset}
				style={{
					padding: '0.5rem 1rem',
					background: '#000',
					color: '#fff',
					border: 'none',
					borderRadius: '4px',
					cursor: 'pointer',
				}}
			>
				Try Again
			</button>
		</div>
	)
}
