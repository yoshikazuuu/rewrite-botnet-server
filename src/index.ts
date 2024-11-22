import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/cloudflare-workers';
import { InMemoryCharacterRepository } from './database/character';
import { create_turn, ReturnTurn } from './types/entity/turn';
import { InMemoryChatRepository } from './database/chat';
import { Chat } from './types/entity/chat';
import { TurnRepository } from './database/turn';

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
	upgradeWebSocket((_) => {
		let currentChat: Chat | null = null;

		return {
			async onMessage(event, ws) {
				console.log('Message received');
				console.log('Chat:', currentChat);

				try {
					const data = JSON.parse(event.data);

					// Handle the websocket message based on the command type
					if (data.command === 'create_turn') {
						const turn = create_turn.parse(data);
						const chat_id = turn.payload.turn.turn_key.chat_id;

						// Only get the chat once when it's not already stored
						if (!currentChat) {
							currentChat = chatRepository.getById(chat_id);
							if (!currentChat) {
								ws.send(
									JSON.stringify({
										message: 'Chat not found',
									})
								);
								return;
							}
						}

						turnRepository.createTurn(turn, chatRepository);
						const returnTurn: ReturnTurn = {
							command: 'return_turn',
							origin: 'backend.api.jer.ee',
							username: 'test_user',
							payload: {
								turn: {
									turn_key: {
										turn_id: '12345',
										chat_id: '1',
									},
									author: {
										username: 'test_user',
										user_id: 'user_001',
										is_bot: false,
									},
									raw_text:
										'Here is the response to your query!',
								},
							},
							request_turn_id: 'req_67890',
						};

						const reply = turnRepository.returnTurn(
							returnTurn,
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
				currentChat = null;
				console.log('Connection closed');
			},
		};
	})
);

export default app;
