import { Chat } from "../entity/chat";
import { Turn } from "../entity/turn";

interface IChatRepository {
    createChat(): Promise<Chat>;
    getById(id: string): Promise<Chat | null>;
    appendMessage(id: string, turn: Turn): Promise<void>;
}