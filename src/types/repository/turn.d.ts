import { Chat } from '../entity/chat';
import { CreateTurn, ReturnTurn } from '../entity/turn';

interface ITurnRepository {
	createTurn(turn: CreateTurn, chat: InMemoryChatRepository): void;
	returnTurn(turn: ReturnTurn, chat: InMemoryChatRepository): Turn;
}
