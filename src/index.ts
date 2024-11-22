import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'
import { InMemoryCharacterRepository } from './database/database'

const app = new Hono()
const clients = new Set()

app.get('/', (c) => {
  return c.json({
    message: 'Hello, World from Bunny.ai!',
  })
})

app.get('/characters', async (c) => {
  const characters = await new InMemoryCharacterRepository().findAll()
  return c.json({ characters })
})

app.get('/characters/:id', async (c) => {
  const character = await new InMemoryCharacterRepository().findById(c.req.param('id'))
  return c.json({ character })
})

app.get(
  '/chat/:id',
  upgradeWebSocket((c) => {
    const { id } = c.req.param();
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`)
        ws.send(`Hello from ${id}!`)
      },
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)

export default app
