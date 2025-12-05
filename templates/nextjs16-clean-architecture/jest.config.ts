import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
	dir: './',
})

const config: Config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testEnvironmentOptions: {
		customExportConditions: [''],
	},
	// Display name for better test organization
	displayName: 'flow-task',
	moduleNameMapper: {
		'^@/app/(.*)$': '<rootDir>/src/app/$1',
		'^@/components/(.*)$': '<rootDir>/src/shared/components/$1',
		'^@/constants/(.*)$': '<rootDir>/src/shared/constants/$1',
		'^@/errors/(.*)$': '<rootDir>/src/shared/errors/$1',
		'^@/hooks/(.*)$': '<rootDir>/src/shared/hooks/$1',
		'^@/infrastructure/(.*)$': '<rootDir>/src/shared/infrastructure/$1',
		'^@/libs/(.*)$': '<rootDir>/src/shared/libs/$1',
		'^@/modules/(.*)$': '<rootDir>/src/modules/$1',
		'^@/types/(.*)$': '<rootDir>/src/shared/types/$1',
		'^@/utils/(.*)$': '<rootDir>/src/shared/utils/$1',
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	// Test pattern supports co-location:
	// - Unit tests: src/modules/*/domain/entities/__tests__/*.test.ts
	// - Integration tests: src/__tests__/integration/*.test.ts
	testMatch: [
		'**/__tests__/**/*.test.[jt]s?(x)',
		'**/?(*.)+(spec|test).[jt]s?(x)',
	],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/.next/',
		'/e2e/',
	],
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.stories.{js,jsx,ts,tsx}',
		'!src/**/__tests__/**',
	],
}

export default createJestConfig(config)
