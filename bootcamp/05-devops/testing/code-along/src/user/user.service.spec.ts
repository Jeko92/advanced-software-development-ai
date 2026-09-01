import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = {
  findOne: vi.fn(),
  save: vi.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  it("retrieves a user's name successfully", async () => {
    // Arrange: Program the mock to return a specific user
    const testUser = { id: 1, name: 'Alice', email: 'alice@example.com' };
    mockUserRepository.findOne.mockResolvedValue(testUser);

    // Act: Call the service method
    const result = await service.getUserName(1);

    // Assert: Verify the mock was called correctly and the output matches
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toBe('Alice');
  });

  it('throws a NotFoundException when the user does not exist', async () => {
    // Arrange: Program the mock to simulate a missing database record
    mockUserRepository.findOne.mockResolvedValue(null);

    // Act & Assert: Expect the promise to reject with a specific error
    await expect(service.getUserName(99)).rejects.toThrow(NotFoundException);
  });
});
