import cors from 'cors';
import { env } from './config/env.js';
import { status } from './db/index.js';
import cookieParser from 'cookie-parser';
import * as swaggerUi from 'swagger-ui-express';
import { HttpError } from './errors/HttpError.js';
import { createNewLogger } from './logger/index.js';
import { status as redisStatus } from './redis/index.js';
import { tripsRouter } from './controllers/trips/index.js';
import { usersRouter } from './controllers/users/index.js';
import { locationsRouter } from './controllers/locations/index.js';
import express, { NextFunction, Request, Response, Express } from 'express';

import { swaggerDocument } from './swagger.js';

const log = createNewLogger('HttpServer', env.LOG_LEVEL);

declare module 'express' {
  interface Request {
    username?: string;
  }
}

const app = express();

app.use((req, _res, next) => {
  log.info(`${req.method} ${req.url}`);
  log.debug(`Request headers: ${JSON.stringify(req.headers)}`);
  log.debug(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/locations', locationsRouter);
app.use('/trips', tripsRouter);

app.use('/users', usersRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    log.error(err.message);
    res.status(err.code).send({
      message: err.message,
      error: err.obj,
    });
  } else {
    log.error(JSON.stringify(err), err);
    res.status(500).send('Internal server error');
  }
  next();
});

export async function listen() {
  app.get('/health', (_req, res) => {
    log.info(
      `Health check, { status: ${status.ready}, redisStatus: ${redisStatus.ready} }`,
    );
    if (status.ready && redisStatus.ready) res.status(200).send('Healthy');
    else res.status(500).send('Unhealthy');
  });
  return new Promise<Express>((resolve) => {
    app.listen(env.PORT, () => {
      log.info(`Server is running on http://localhost:${env.PORT}`);
      resolve(app);
    });
  });
}
