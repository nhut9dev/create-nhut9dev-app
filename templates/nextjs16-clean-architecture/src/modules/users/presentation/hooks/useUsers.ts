import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userQueryKeys } from './userQueryKeys'

/**
 * User type definition
 */
interface User {
	id: string
	email: string
	name: string
}

/**
 * Mock API functions (replace with real API calls)
 */
const userApi = {
	getUsers: async (): Promise<User[]> => {
		// Replace with actual API call
		return [
			{ id: '1', email: 'user1@example.com', name: 'User 1' },
			{ id: '2', email: 'user2@example.com', name: 'User 2' },
		]
	},

	getUser: async (id: string): Promise<User> => {
		// Replace with actual API call
		return { id, email: `user${id}@example.com`, name: `User ${id}` }
	},

	createUser: async (data: Omit<User, 'id'>): Promise<User> => {
		// Replace with actual API call
		return { id: Math.random().toString(), ...data }
	},

	updateUser: async (id: string, data: Partial<User>): Promise<User> => {
		// Replace with actual API call
		return { id, email: 'updated@example.com', name: 'Updated', ...data }
	},

	deleteUser: async (id: string): Promise<void> => {
		// Replace with actual API call
		console.log('Deleted user:', id)
	},
}

/**
 * Hook to fetch all users
 */
export function useUsers() {
	return useQuery({
		queryKey: userQueryKeys.lists(),
		queryFn: userApi.getUsers,
	})
}

/**
 * Hook to fetch a single user
 */
export function useUser(id: string) {
	return useQuery({
		queryKey: userQueryKeys.detail(id),
		queryFn: () => userApi.getUser(id),
		enabled: !!id,
	})
}

/**
 * Hook to create a user
 */
export function useCreateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: userApi.createUser,
		onSuccess: () => {
			// Invalidate users list to refetch
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
		},
	})
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
			userApi.updateUser(id, data),
		onSuccess: (_, variables) => {
			// Invalidate specific user and users list
			queryClient.invalidateQueries({
				queryKey: userQueryKeys.detail(variables.id),
			})
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
		},
	})
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: userApi.deleteUser,
		onSuccess: () => {
			// Invalidate users list to refetch
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
		},
	})
}
