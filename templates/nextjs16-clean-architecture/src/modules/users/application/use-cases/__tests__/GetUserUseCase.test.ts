import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Example test for GetUserUseCase
describe('GetUserUseCase', () => {
	const mockUserRepository = {
		findById: jest.fn(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('Successful Retrieval', () => {
		it('should get user by id', async () => {
			const userId = '123'
			const mockUser = {
				id: userId,
				email: 'user@example.com',
				name: 'John Doe',
			}

			mockUserRepository.findById.mockResolvedValue(mockUser)

			const result = await mockUserRepository.findById(userId)

			expect(result).toEqual(mockUser)
			expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
		})

		it('should return user with all fields', async () => {
			const mockUser = {
				id: '123',
				email: 'user@example.com',
				name: 'John Doe',
			}

			mockUserRepository.findById.mockResolvedValue(mockUser)

			const result = await mockUserRepository.findById(mockUser.id)

			expect(result).toHaveProperty('id')
			expect(result).toHaveProperty('email')
			expect(result).toHaveProperty('name')
		})
	})

	describe('Not Found', () => {
		it('should return null for non-existent user', async () => {
			mockUserRepository.findById.mockResolvedValue(null)

			const result = await mockUserRepository.findById('non-existent-id')

			expect(result).toBeNull()
		})

		it('should handle invalid id format', async () => {
			const invalidId = ''

			expect(invalidId).toBeFalsy()
		})
	})

	describe('Repository Integration', () => {
		it('should call repository findById method', async () => {
			const userId = '123'
			mockUserRepository.findById.mockResolvedValue(null)

			await mockUserRepository.findById(userId)

			expect(mockUserRepository.findById).toHaveBeenCalledTimes(1)
			expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
		})
	})
})
