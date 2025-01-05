import { hash } from 'bcrypt'
import { sql } from './index.js'
import { User } from '../controllers/users/types.js'

export async function createUser(username: string, password: string) {
  const hashedPassword = await hash(password, 10)
  await sql`INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword})`
}

export async function findUser(username: string): Promise<User> {
  const users = await sql`SELECT * FROM users WHERE username = ${username}`
  if (users.length === 0) {
    throw new Error('User not found')
  }
  return {
    username: users[0].username,
    password: users[0].password,
  }
}
