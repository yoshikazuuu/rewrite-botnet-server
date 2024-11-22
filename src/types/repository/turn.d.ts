import { Context } from 'hono';
import { Chat } from '../entity/chat';
import { CreateTurn, ReturnTurn } from '../entity/turn';

interface ITurnRepository {
	createTurn(turn: CreateTurn, chat: InMemoryChatRepository): void;
	returnTurn(
		c: Context,
		data: CreateTurn,
		chat_id: string,
		chat: InMemoryChatRepository
	): Promise<Turn>;
}
