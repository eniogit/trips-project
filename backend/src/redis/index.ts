import { createClient } from 'redis';
import { env } from '../config/env.js';
import { createNewLogger } from '../logger/index.js';

const log = createNewLogger('REDIS');

export const status = {
  ready: false,
};

const instance = createClient({
  url: env.REDIS_URL,
}).on('error', (err) => {
  log.error('Redis Client Error', err);
  status.ready = false;
}).on('ready', () => {
  status.ready = true;
  log.info('Redis Client Ready');
});

export async function setupRedis() {
  await instance.connect();
  log.info('Redis connected');
  return instance;
}

export async function setSearchKey(key: string, value: object) {
  try {
    return await instance.set(key, JSON.stringify(value), {
      EX: 10 * 60,
    });
  } catch (err) {
    log.error('Failed to set key in redis', err);
  }
}

export async function getSearchKey(key: string) {
  try {
    return await instance.get(key);
  } catch (err) {
    log.error('Failed to get key from redis', err);
    return null;
  }
}

export async function setTripKey(key: string, value: object) {
  try {
    return await instance.set(key, JSON.stringify(value), {
      EX: 10 * 60,
    });
  } catch (err) {
    log.error('Failed to set key in redis', err);
  }
}

export async function getTripKey(key: string) {
  try {
    return await instance.get(key);
  } catch (err) {
    log.error('Failed to get key from redis', err);
    return null;
  }
}
