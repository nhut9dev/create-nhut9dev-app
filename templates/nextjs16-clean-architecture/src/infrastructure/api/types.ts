/**
 * Common API types
 */

/**
 * Pagination params
 */
export interface PaginationParams {
	page: number
	limit: number
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
	hasNextPage: boolean
	hasPreviousPage: boolean
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
	data: T[]
	meta: PaginationMeta
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
	success: boolean
	data: T
	message?: string
	errors?: Record<string, string[]>
}

/**
 * API error response
 */
export interface ApiErrorResponse {
	success: false
	message: string
	errors?: Record<string, string[]>
	statusCode: number
}

/**
 * Sort params
 */
export interface SortParams {
	sortBy: string
	sortOrder: 'asc' | 'desc'
}

/**
 * Filter params (generic)
 */
export type FilterParams = Record<string, string | number | boolean | undefined>

/**
 * Common list params
 */
export interface ListParams extends PaginationParams, Partial<SortParams> {
	search?: string
	filters?: FilterParams
}
