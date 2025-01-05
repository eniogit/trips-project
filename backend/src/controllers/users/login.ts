import { compare } from 'bcrypt'
import { User } from './types.js'
import { Request, Response } from 'express'
import { findUser } from '../../db/users.js'
import { createToken } from '../../jwt/index.js'
import { HttpError } from '../../errors/HttpError.js'

export async function login(req: Request & { body: User }, res: Response) {
  const { username, password } = req.body
  try {
    const user = await findUser(username)
    const isPasswordCorrect = await compare(password, user.password)
    if (!isPasswordCorrect) {
      throw new HttpError(401, 'Invalid username or password')
    }
    const jwt = await createToken(username)
    res
      .status(201)
      .cookie('jwt', jwt, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2,
      })
      .send({ message: 'Logged in successfully', username })
  } catch {
    throw new HttpError(401, 'Invalid username or password')
  }
}
