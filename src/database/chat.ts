import { Chat } from "../types/entity/chat";
import { Turn } from "../types/entity/turn";
import { IChatRepository } from "../types/repository/chat";

export class InMemoryChatRepository implements IChatRepository {
    private chats: Chat[] = [];

    createChat(): Promise<Chat> {
        const chat: Chat = {
            id: Math.random().toString(36).substring(7),
            turns: [],
        };
        this.chats.push(chat);
        return Promise.resolve(chat);
    }
    getById(id: string): Promise<Chat | null> {
        const chat = this.chats.find((c) => c.id === id);
        return Promise.resolve(chat || null);
    }
    appendMessage(id: string, turn: Turn): Promise<void> {
        const chat = this.chats.find((c) => c.id === id);
        if (!chat) {
            return Promise.reject(new Error('Chat not found'));
        }
        chat.turns.push(turn);
        return Promise.resolve();
    }
}