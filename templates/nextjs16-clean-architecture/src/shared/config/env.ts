/**
 * Environment variables with type safety
 * Validates and exports all environment variables
 */

// Validate required env vars
function getEnvVar(key: string, defaultValue?: string): string {
	const value = process.env[key] || defaultValue

	if (!value) {
		throw new Error(`Missing environment variable: ${key}`)
	}

	return value
}

// Public env vars (accessible in browser)
export const publicEnv = {
	appName: process.env.NEXT_PUBLIC_APP_NAME || 'Flow Task',
	appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
	apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
	enableDevtools: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
	enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
} as const

// Server-only env vars
export const serverEnv = {
	nodeEnv: process.env.NODE_ENV || 'development',
	apiTimeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
} as const

// Environment checks
export const isDevelopment = serverEnv.nodeEnv === 'development'
export const isProduction = serverEnv.nodeEnv === 'production'
export const isTest = serverEnv.nodeEnv === 'test'

// Type-safe env access
export const env = {
	...publicEnv,
	...serverEnv,
	isDevelopment,
	isProduction,
	isTest,
} as const

// Export type for use in components
export type Env = typeof env
