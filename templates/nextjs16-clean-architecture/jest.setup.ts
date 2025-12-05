import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			replace: jest.fn(),
			prefetch: jest.fn(),
			back: jest.fn(),
			pathname: '/',
			query: {},
			asPath: '/',
		}
	},
	useSearchParams() {
		return new URLSearchParams()
	},
	usePathname() {
		return '/'
	},
}))
