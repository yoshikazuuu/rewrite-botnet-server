import { Chat } from '../types/entity/chat';
import { Turn } from '../types/entity/turn';
import { IChatRepository } from '../types/repository/chat';

export class InMemoryChatRepository implements IChatRepository {
	private chats: Chat[] = [{ id: '1', turns: [] }];

	createChat(): Chat {
		const chat: Chat = {
			id: Math.random().toString(36).substring(7),
			turns: [],
		};
		this.chats.push(chat);
		return chat;
	}
	getById(id: string): Chat | null {
		const chat = this.chats.find((c) => c.id === id);
		return chat || null;
	}
	appendMessage(id: string, turn: Turn): void {
		const chat = this.chats.find((c) => c.id === id);
		if (!chat) {
			throw new Error('Chat not found');
		}
		chat.turns.push(turn);
	}
	getHistory(id: string): string {
		const chat = this.chats.find((c) => c.id === id);
		if (!chat) {
			throw new Error('Chat not found');
		}
		const history = chat.turns
			.map((t) => `${t.author.username}: ${t.raw_text}`)
			.join('\n');
		console.log(history);

		return history;
	}
}
