import { setup } from './db/index.js'
import { listen } from './server.js'
import { setupRedis } from './redis/index.js'

await setup()
await setupRedis()
export const server = await listen()
