import { User } from './types.js';
import { Request, Response } from 'express';
import { HttpError } from '../../errors/HttpError.js';
import { createUser as createUserDb } from '../../db/users.js';

export async function createUser(req: Request & { body: User }, res: Response) {
  const { username, password } = req.body;
  try {
    await createUserDb(username, password);
    res.status(201).send({
      message: 'User registered successfully',
    });
  } catch {
    throw new HttpError(400, 'User already exists');
  }
}
