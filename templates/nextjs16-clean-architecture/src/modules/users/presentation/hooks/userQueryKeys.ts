/**
 * User module query keys
 * Co-located with user hooks for better maintainability
 */

export const userQueryKeys = {
	all: ['users'] as const,
	lists: () => [...userQueryKeys.all, 'list'] as const,
	list: (filters?: Record<string, unknown>) =>
		[...userQueryKeys.lists(), filters] as const,
	details: () => [...userQueryKeys.all, 'detail'] as const,
	detail: (id: string) => [...userQueryKeys.details(), id] as const,
} as const
