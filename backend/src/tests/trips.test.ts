import { hash } from 'bcrypt';
import request from 'supertest';
import { server } from '../index.js';
import { User } from '../controllers/users/types.js';
import { describe, test, expect, vi, beforeAll, beforeEach } from 'vitest';

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

vi.mock('../db/trips.js', () => {
  const trips: { id: string; user_id: string }[] = [];
  return {
    saveTrip: async (tripId: string, username: string) => {
      trips.push({
        id: tripId,
        user_id: username,
      });
    },
    getTrips: async () => {
      return trips.map((trip) => {
        return {
          id: trip.id,
          origin: 'LAX',
          destination: 'HND',
          cost: 100,
          duration: 1600,
          display_name: 'LAX -> HND',
          type: 'plane',
        };
      });
    },
  };
});

vi.mock('../redis/index.js', () => {
  return {
    setupRedis: () => {},
    getSearchKey: async () => {
      return null;
    },
    setSearchKey: async () => {},
  };
});

const results = [
  {
    id: '1',
    origin: 'LAX',
    destination: 'HND',
    cost: 100,
    duration: 1600,
    display_name: 'LAX -> HND',
    type: 'plane',
  },
  {
    id: '2',
    origin: 'LAX',
    destination: 'HND',
    cost: 150,
    duration: 1200,
    display_name: 'LAX -> HND',
    type: 'train',
  },
];

beforeEach(() => {
  vi.stubGlobal('fetch', async () => {
    return {
      ok: true,
      json: async () => {
        return results;
      },
    };
  });
});

describe('Trips', () => {
  describe('Searching trips', () => {
    test('Seatch trips', async () => {
      const response = await request(server)
        .get('/trips')
        .query({
          origin: 'LAX',
          destination: 'HND',
          sort_by: 'cost',
        })
        .expect(200);

      expect(response.body).toEqual(results);
    });

    test('Search trips should fail when origin is missing', async () => {
      const response = await request(server)
        .get('/trips')
        .query({
          destination: 'HND',
          sort_by: 'cost',
        })
        .expect(400);

      expect(response.body.message).toEqual('Invalid request format {"origin":["Required"]}');
    });

    test('Search trips should fail when destination is missing', async () => {
      const response = await request(server)
        .get('/trips')
        .query({
          origin: 'LAX',
          sort_by: 'cost',
        })
        .expect(400);

      expect(response.body.message).toEqual('Invalid request format {"destination":["Required"]}');
    });

    test('Search trips should return sorted by duration', async () => {
      const response = await request(server)
        .get('/trips')
        .query({
          origin: 'LAX',
          destination: 'HND',
          sort_by: 'duration',
        })
        .expect(200);

      expect(response.body).toEqual(
        results.sort((a, b) => a.duration - b.duration),
      );
    });

    test('Search trips should fail when origin and destination are the same', async () => {
      const response = await request(server)
        .get('/trips')
        .query({
          origin: 'LAX',
          destination: 'LAX',
          sort_by: 'cost',
        })
        .expect(400);

      expect(response.body.message).toEqual(
        "Origin and destination can't be the same",
      );
    });

    test.only('Search trips should fail when error fetching trips', async () => {
      vi.stubGlobal('fetch', async () => {
        return {
          ok: false,
          text: async () => '',
          status: 500,
        };
      });

      const response = await request(server)
        .get('/trips')
        .query({
          origin: 'LAX',
          destination: 'HND',
          sort_by: 'cost',
        })
        .expect(500);

      expect(response.body.message).toEqual('Failed to fetch trips  500');
    });
  });

  describe('Saving trips', () => {
    let token: string | undefined;

    beforeAll(async () => {
      const registerResponse = await request(server)
        .post('/users/register')
        .send({
          username: 'test',
          password: '123456789',
        });

      expect(registerResponse.body).toEqual({
        message: 'User registered successfully',
      });

      const loginResponse = await request(server).post('/users/login').send({
        username: 'test',
        password: '123456789',
      });

      token = loginResponse.headers['set-cookie'][0]
        .split('=')[1]
        .split(';')[0];
    });

    test('Save trip', async () => {
      vi.stubGlobal('fetch', async () => {
        return {
          ok: true,
          json: async () => {
            return {
              id: '1',
              origin: 'LAX',
              destination: 'HND',
              cost: 100,
              duration: 1600,
              display_name: 'LAX -> HND',
              type: 'plane',
            };
          },
        };
      });

      await request(server)
        .post('/trips/saved')
        .set('Cookie', `token=${token}`)
        .send({
          id: '1',
        })
        .expect(201);
    });

    test('Save trip should fail when trip_id is missing', async () => {
      const response = await request(server)
        .post('/trips/saved')
        .set('Cookie', `token=${token}`)
        .send({
          random: 'test',
        })
        .expect(400);

      expect(response.body.message).toEqual(
        'Invalid request format {"id":["Required"]}',
      );
    });

    test('Save trip should fail when user is not logged in', async () => {
      const response = await request(server)
        .post('/trips/saved')
        .send({
          id: '1',
        })
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    test('Save trip should fail when error fetching trip', async () => {
      vi.stubGlobal('fetch', async () => {
        return {
          ok: false,
        };
      });

      const response = await request(server)
        .post('/trips/saved')
        .set('Cookie', `token=${token}`)
        .send({
          id: '1',
        })
        .expect(500);

      expect(response.body.message).toEqual('Error saving trip');
    });

    test('Get saved trips should fail when user is not logged in', async () => {
      const response = await request(server).get('/trips/saved').expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    test('Get saved trips', async () => {
      const response = await request(server)
        .get('/trips/saved')
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
