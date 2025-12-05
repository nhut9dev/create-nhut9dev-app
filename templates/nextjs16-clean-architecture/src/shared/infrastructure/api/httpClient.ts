import { publicEnv } from '@/shared/config/env'

/**
 * HTTP Client Configuration
 */
interface RequestConfig {
	method?: string
	headers?: HeadersInit
	body?: BodyInit
	timeout?: number
	params?: Record<string, string | number | boolean>
	signal?: AbortSignal
}

/**
 * API Error class
 */
export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public statusText: string,
		public data?: unknown
	) {
		super(message)
		this.name = 'ApiError'
	}
}

/**
 * Request interceptor type
 */
type RequestInterceptor = (
	url: string,
	config: RequestConfig
) => Promise<{ url: string; config: RequestConfig }> | { url: string; config: RequestConfig }

/**
 * Response interceptor type
 */
type ResponseInterceptor = (response: Response) => Promise<Response> | Response

/**
 * HTTP Client class with interceptors
 */
class HttpClient {
	private baseURL: string
	private defaultTimeout: number
	private requestInterceptors: RequestInterceptor[] = []
	private responseInterceptors: ResponseInterceptor[] = []

	constructor(baseURL: string, timeout = 30000) {
		this.baseURL = baseURL
		this.defaultTimeout = timeout
	}

	/**
	 * Add request interceptor
	 */
	addRequestInterceptor(interceptor: RequestInterceptor) {
		this.requestInterceptors.push(interceptor)
	}

	/**
	 * Add response interceptor
	 */
	addResponseInterceptor(interceptor: ResponseInterceptor) {
		this.responseInterceptors.push(interceptor)
	}

	/**
	 * Build URL with query params
	 */
	private buildURL(url: string, params?: Record<string, string | number | boolean>): string {
		const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`

		if (!params) return fullURL

		const searchParams = new URLSearchParams()
		Object.entries(params).forEach(([key, value]) => {
			searchParams.append(key, String(value))
		})

		const queryString = searchParams.toString()
		return queryString ? `${fullURL}?${queryString}` : fullURL
	}

	/**
	 * Execute request with timeout
	 */
	private async executeRequest(
		url: string,
		config: RequestConfig
	): Promise<Response> {
		const timeout = config.timeout || this.defaultTimeout
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), timeout)

		try {
			const response = await fetch(url, {
				...config,
				signal: controller.signal,
			})

			clearTimeout(timeoutId)
			return response
		} catch (error) {
			clearTimeout(timeoutId)
			if (error instanceof Error && error.name === 'AbortError') {
				throw new ApiError('Request timeout', 408, 'Request Timeout')
			}
			throw error
		}
	}

	/**
	 * Process response
	 */
	private async processResponse<T>(response: Response): Promise<T> {
		// Run response interceptors
		let processedResponse = response
		for (const interceptor of this.responseInterceptors) {
			processedResponse = await interceptor(processedResponse)
		}

		// Check for errors
		if (!processedResponse.ok) {
			let errorData: unknown
			try {
				errorData = await processedResponse.json()
			} catch {
				errorData = await processedResponse.text()
			}

			throw new ApiError(
				`Request failed with status ${processedResponse.status}`,
				processedResponse.status,
				processedResponse.statusText,
				errorData
			)
		}

		// Parse response
		const contentType = processedResponse.headers.get('content-type')
		if (contentType?.includes('application/json')) {
			return processedResponse.json()
		}

		return processedResponse.text() as Promise<T>
	}

	/**
	 * Generic request method
	 */
	async request<T = unknown>(url: string, config: RequestConfig = {}): Promise<T> {
		// Extract params
		const { params, ...requestConfig } = config

		// Build URL
		let processedURL = this.buildURL(url, params)
		let processedConfig: RequestConfig = {
			...requestConfig,
			headers: {
				'Content-Type': 'application/json',
				...(requestConfig.headers as Record<string, string>),
			},
		}

		// Run request interceptors
		for (const interceptor of this.requestInterceptors) {
			const result = await interceptor(processedURL, processedConfig)
			processedURL = result.url
			processedConfig = result.config as RequestConfig
		}

		// Execute request
		const response = await this.executeRequest(processedURL, processedConfig)

		// Process response
		return this.processResponse<T>(response)
	}

	/**
	 * GET request
	 */
	async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(url, { ...config, method: 'GET' })
	}

	/**
	 * POST request
	 */
	async post<T = unknown>(
		url: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(url, {
			...config,
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	/**
	 * PUT request
	 */
	async put<T = unknown>(
		url: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(url, {
			...config,
			method: 'PUT',
			body: JSON.stringify(data),
		})
	}

	/**
	 * PATCH request
	 */
	async patch<T = unknown>(
		url: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(url, {
			...config,
			method: 'PATCH',
			body: JSON.stringify(data),
		})
	}

	/**
	 * DELETE request
	 */
	async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(url, { ...config, method: 'DELETE' })
	}
}

/**
 * Create HTTP client instance
 */
export const httpClient = new HttpClient(publicEnv.apiUrl)

/**
 * Request interceptor: Add auth token
 */
httpClient.addRequestInterceptor(async (url, config) => {
	// Add auth token if available
	// const token = getAuthToken() // Implement based on your auth strategy
	// if (token) {
	//   config.headers = {
	//     ...config.headers,
	//     Authorization: `Bearer ${token}`,
	//   }
	// }

	return { url, config }
})

/**
 * Request interceptor: Log requests in development
 */
if (publicEnv.enableDevtools) {
	httpClient.addRequestInterceptor(async (url, config) => {
		console.log(`[HTTP] ${config.method || 'GET'} ${url}`, config)
		return { url, config }
	})
}

/**
 * Response interceptor: Log responses in development
 */
if (publicEnv.enableDevtools) {
	httpClient.addResponseInterceptor(async (response) => {
		console.log(`[HTTP] Response ${response.status}`, response)
		return response
	})
}

/**
 * Response interceptor: Handle 401 Unauthorized
 */
httpClient.addResponseInterceptor(async (response) => {
	if (response.status === 401) {
		// Handle unauthorized - e.g., redirect to login
		// window.location.href = '/login'
		console.warn('Unauthorized request - implement auth handling')
	}
	return response
})

/**
 * Export for testing/customization
 */
export { HttpClient }
