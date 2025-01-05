import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError.js';
import { z } from 'zod';

type RequestParsable = 'body' | 'query' | 'params';

export function validateRequest(which: RequestParsable, schema: z.ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const parsed = await schema.safeParseAsync(req[which]);

    if (parsed.success) {
      next();
    } else {
      next(
        new HttpError(
          400,
          `Invalid request format ${JSON.stringify(parsed.error.flatten().fieldErrors)}`,
          parsed.error.flatten().fieldErrors,
        ),
      );
    }
  };
}
