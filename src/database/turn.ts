import { Context } from 'hono';
import { CreateTurn, ReturnTurn, Turn } from '../types/entity/turn';
import { ITurnRepository } from '../types/repository/turn';
import { InMemoryChatRepository } from './chat';
import { env } from 'hono/adapter';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export class TurnRepository implements ITurnRepository {
	createTurn(data: CreateTurn, chat: InMemoryChatRepository): void {
		const chatId = data.payload.turn.turn_key.chat_id;
		const turn = data.payload.turn;
		chat.appendMessage(chatId, turn);
	}

	async returnTurn(
		c: Context,
		data: CreateTurn,
		chat_id: string,
		chat: InMemoryChatRepository
	): Promise<Turn> {
		const { OPENAI_API_KEY } = env(c);
		const openai = createOpenAI({
			apiKey: OPENAI_API_KEY,
			compatibility: 'strict',
		});

		const { text } = await generateText({
			model: openai('gpt-4o-mini-2024-07-18'),
			prompt: `pretend like you a human, you can remember, and assume things, use emotional intelligence, and read the context,
			 ${chat.getHistory(chat_id)} now reply to ${
				data.payload.turn.raw_text
			} (don't put other context if not asked)`,
		});

		const format: ReturnTurn = {
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
						username: 'Bot',
						user_id: 'user_001',
						is_bot: false,
					},
					raw_text: text,
				},
			},
			request_turn_id: 'req_67890',
		};

		const chatId = format.payload.turn.turn_key.chat_id;
		const returnTurn = format.payload.turn;
		chat.appendMessage(chatId, returnTurn);
		return returnTurn;
	}
}
