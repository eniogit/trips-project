import { login } from './login.js'
import { userSchema } from './types.js'
import { createUser } from './register.js'
import { validateRequest } from '../utils.js'
import express, { Request, Response } from 'express'
import { cookieAuth } from '../../middleware/auth.js'

export const usersRouter = express.Router()

usersRouter.post('/register', validateRequest('body', userSchema), createUser)
usersRouter.post('/login', validateRequest('body', userSchema), login)
usersRouter.get('/me', cookieAuth, (req: Request, res: Response) => {
  res.send({
    username: req.username
  })
})
