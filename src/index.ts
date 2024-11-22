import { generateText } from 'ai';
import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/cloudflare-workers';
import { InMemoryCharacterRepository } from './database/character';
import { create_turn, ReturnTurn } from './types/entity/turn';
import { InMemoryChatRepository } from './database/chat';
import { Chat } from './types/entity/chat';
import { TurnRepository } from './database/turn';
import { createOpenAI } from '@ai-sdk/openai';
import { env } from 'hono/adapter';

const app = new Hono();
const chatRepository = new InMemoryChatRepository();
const turnRepository = new TurnRepository();

app.get('/', (c) => {
	return c.json({
		message: 'Hello, World from Bunny.ai!',
	});
});

app.get('/characters', async (c) => {
	const characters = await new InMemoryCharacterRepository().findAll();
	return c.json({ characters });
});

app.get('/characters/:id', async (c) => {
	const character = await new InMemoryCharacterRepository().findById(
		c.req.param('id')
	);
	return c.json({ character });
});

app.get(
	'/chat',
	upgradeWebSocket((c) => {
		return {
			async onMessage(event, ws) {
				try {
					const data = JSON.parse(event.data);

					// Handle the websocket message based on the command type
					if (data.command === 'create_turn') {
						const turn = create_turn.parse(data);
						const chat_id = turn.payload.turn.turn_key.chat_id;
						turnRepository.createTurn(turn, chatRepository);

						const reply = await turnRepository.returnTurn(
							c,
							turn,
							chat_id,
							chatRepository
						);

						ws.send(JSON.stringify(reply));
					} else {
						ws.send(JSON.stringify({ message: 'Unknown command' }));
					}
				} catch (error) {
					console.log(error);
					ws.send(JSON.stringify({ message: 'Invalid JSON' }));
				}
			},
			onClose: () => {
				console.log('Connection closed');
			},
		};
	})
);

export default app;
