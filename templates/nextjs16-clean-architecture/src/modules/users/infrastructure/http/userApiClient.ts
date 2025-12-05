import { httpClient } from '@/infrastructure/api'
import type { User } from '../../domain/entities/User'

/**
 * User API endpoints
 */
const ENDPOINTS = {
	users: '/users',
	user: (id: string) => `/users/${id}`,
} as const

/**
 * User API client
 */
export const userApiClient = {
	/**
	 * Get all users
	 */
	async getUsers(): Promise<User[]> {
		return httpClient.get<User[]>(ENDPOINTS.users)
	},

	/**
	 * Get user by ID
	 */
	async getUser(id: string): Promise<User> {
		return httpClient.get<User>(ENDPOINTS.user(id))
	},

	/**
	 * Create user
	 */
	async createUser(data: Omit<User, 'id'>): Promise<User> {
		return httpClient.post<User>(ENDPOINTS.users, data)
	},

	/**
	 * Update user
	 */
	async updateUser(id: string, data: Partial<User>): Promise<User> {
		return httpClient.patch<User>(ENDPOINTS.user(id), data)
	},

	/**
	 * Delete user
	 */
	async deleteUser(id: string): Promise<void> {
		return httpClient.delete<void>(ENDPOINTS.user(id))
	},
}
