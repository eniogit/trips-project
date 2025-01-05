import { hash } from 'bcrypt';
import request from 'supertest';
import * as cookie from 'cookie';
import { server } from '../index.js';
import { verifyToken } from '../jwt/index.js';
import { describe, test, expect, vi } from 'vitest';
import { User } from '../controllers/users/types.js';

vi.hoisted(() => {
  vi.stubEnv('LOG_LEVEL', 'emerg');
});

vi.mock('../db/index.js', () => {
  return {
    setup: () => {},
  };
});

vi.mock('../redis/index.js', () => {
  return {
    setupRedis: () => {},
  };
});

vi.mock('../db/users.js', () => {
  const db: User[] = [];
  return {
    createUser: async (username: string, password: string) => {
      const passwordHash = await hash(password, 10);
      if (db.some((u) => u.username === username)) {
        throw new Error('User already exists');
      }
      db.push({ username, password: passwordHash });
    },
    findUser: async (username: string): Promise<User> => {
      const user = db.find((u) => u.username === username);
      if (!user) {
        throw new Error('User not found');
      }
      return {
        username: user.username,
        password: user.password,
      };
    },
  };
});

describe('User login and registration', () => {
  describe('User registration', () => {
    test("Register should fail when parameters length aren't correct", async () => {
      const response = await request(server)
        .post('/users/register')
        .send({
          username: 'dy',
          password: 'short',
        })
        .expect(400);
      expect(response.body.message).toEqual('Invalid request format {"username":["String must contain at least 3 character(s)"],"password":["String must contain at least 8 character(s)"]}');
    });

    test('Register test', async () => {
      const response = await request(server)
        .post('/users/register')
        .send({
          username: 'test',
          password: 'password',
        })
        .expect(201);

      expect(response.body.message).toEqual('User registered successfully');
    });

    test('Register should fail when user already exists', async () => {
      const response = await request(server)
        .post('/users/register')
        .send({
          username: 'test',
          password: 'password',
        })
        .expect(400);

      expect(response.body.message).toEqual('User already exists');
    });
  });

  describe('User login', () => {
    test('Login test', async () => {
      const response = await request(server)
        .post('/users/login')
        .send({
          username: 'test',
          password: 'password',
        })
        .expect(201);

      expect(response.body.message).toEqual('Logged in successfully');
      expect(response.headers['set-cookie']).toBeDefined();
      const cookies = cookie.parse(response.headers['set-cookie'][0]);
      expect(cookies['jwt']).toBeDefined();
      expect(await verifyToken(cookies['jwt'] ?? '')).toEqual('test');
    });

    test('Login should fail when user not found', async () => {
      const response = await request(server)
        .post('/users/login')
        .send({
          username: 'notfound',
          password: 'password',
        })
        .expect(401);

      expect(response.body.message).toEqual('Invalid username or password');
    });

    test('Login should fail when password is incorrect', async () => {
      const response = await request(server)
        .post('/users/login')
        .send({
          username: 'test',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toEqual('Invalid username or password');
    });
  });
});
