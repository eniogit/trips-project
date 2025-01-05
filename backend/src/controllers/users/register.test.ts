import { createUser } from './register.js';
import { Request, Response } from 'express';
import { describe, test, expect, vi } from 'vitest';
import { createUser as dbOp } from '../../db/users.js';

vi.mock('../../db/users.js', () => {
  return {
    createUser: vi
      .fn()
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(false),
  };
});

describe('register', () => {
  test('should register a user', async () => {
    const req = { body: { username: 'test', password: 'test' } };
    const res: Partial<Response> = {
      status: vi.fn(() => {
        return res as Response;
      }),
      send: vi.fn(),
    };
    await createUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: 'User registered successfully',
    });
    expect(dbOp).toHaveBeenCalledWith('test', 'test');
  });

  test('should throw error if user already exists', async () => {
    const req = { body: { username: 'exists', password: 'exists' } };
    const res: Partial<Response> = {
      status: vi.fn(() => {
        return res as Response;
      }),
      send: vi.fn(),
    };
    await expect(
      async () => await createUser(req as Request, res as Response),
    ).rejects.toThrow();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
