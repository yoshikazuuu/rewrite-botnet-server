import { CreateTurn, ReturnTurn, Turn } from '../types/entity/turn';
import { ITurnRepository } from '../types/repository/turn';
import { InMemoryChatRepository } from './chat';

export class TurnRepository implements ITurnRepository {
	private chat: InMemoryChatRepository | null = null;

	createTurn(data: CreateTurn, chat: InMemoryChatRepository): void {
		this.chat = chat;
		const chatId = data.payload.turn.turn_key.chat_id;
		const turn = data.payload.turn;
		chat.appendMessage(chatId, turn);
	}

	returnTurn(turn: ReturnTurn, chat: InMemoryChatRepository): Turn {
		this.chat = chat;
		const chatId = turn.payload.turn.turn_key.chat_id;
		const returnTurn = turn.payload.turn;
		chat.appendMessage(chatId, returnTurn);
		return returnTurn;
	}
}
