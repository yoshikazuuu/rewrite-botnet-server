import { Chat } from "../entity/chat";
import { Turn } from "../entity/turn";

interface IChatRepository {
    createChat(): Chat;
    getById(id: string): Chat | null;
    appendMessage(id: string, turn: Turn): void;
}