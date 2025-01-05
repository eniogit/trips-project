import { verifyToken } from '../jwt/index.js'
import { HttpError } from '../errors/HttpError.js'
import { Request, Response, NextFunction } from 'express'

export async function cookieAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const jwt = req.cookies.token ?? req.cookies.jwt

  if (!jwt) {
    throw new HttpError(401, 'Unauthorized')
  }
  req.username = await verifyToken(jwt)
  next()
}
