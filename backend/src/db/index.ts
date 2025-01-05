import postgres from 'postgres';
import { env } from '../config/env.js';
import { createNewLogger } from '../logger/index.js';
import pRetry from 'p-retry';

const log = createNewLogger('Database');

export const status = {
  ready: false,
};

export const sql = postgres({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  debug: env.NODE_ENV === 'development',
  connect_timeout: 10 * 1000,
  onclose: () => {
    log.error('Database connection closed');
    status.ready = false;
  }
});

export async function setup(): Promise<void> {
  await pRetry(
    async () => {
      await sql`CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
      )`;

      await sql`CREATE TABLE IF NOT EXISTS locations (
        name TEXT PRIMARY KEY
      )`;

      await sql`INSERT INTO locations (name) VALUES 
        ('ATL'),
        ('PEK'),
        ('LAX'),
        ('DXB'),
        ('HND'),
        ('ORD'),
        ('LHR'),
        ('PVG'),
        ('CDG'),
        ('DFW'),
        ('AMS'),
        ('FRA'),
        ('IST'),
        ('CAN'),
        ('JFK'),
        ('SIN'),
        ('DEN'),
        ('ICN'),
        ('BKK'),
        ('SFO'),
        ('LAS'),
        ('CLT'),
        ('MIA'),
        ('KUL'),
        ('SEA'),
        ('MUC'),
        ('EWR'),
        ('MAD'),
        ('HKG'),
        ('MCO'),
        ('PHX'),
        ('IAH'),
        ('SYD'),
        ('MEL'),
        ('GRU'),
        ('YYZ'),
        ('LGW'),
        ('BCN'),
        ('MAN'),
        ('BOM'),
        ('DEL'),
        ('ZRH'),
        ('SVO'),
        ('DME'),
        ('JNB'),
        ('ARN'),
        ('OSL'),
        ('CPH'),
        ('HEL'),
        ('VIE')
        ON CONFLICT DO NOTHING`;

      await sql`CREATE TABLE IF NOT EXISTS trips (
        id UUID,
        user_id TEXT NOT NULL,
        PRIMARY KEY (id, user_id),
        FOREIGN KEY (user_id) REFERENCES users (username)
      )`;
      log.info('Database setup complete');
    },
    {
      retries: 5,
      factor: 2,
      onFailedAttempt: (error) => {
        log.error(`Failed to setup database: ${error.message}, ${error.retriesLeft} retries left...`);
      },
    },
  );
  status.ready = true;
}
