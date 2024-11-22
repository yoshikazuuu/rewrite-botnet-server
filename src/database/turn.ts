import { Chat } from "../types/entity/chat";
import { CreateTurn, ReturnTurn, Turn } from "../types/entity/turn";
import { ITurnRepository } from "../types/repository/turn";
import { InMemoryChatRepository } from "./chat";

export class TurnRepository implements ITurnRepository {
    private chat: Chat | null = null
    private chatRepository: InMemoryChatRepository

    constructor() {
        this.chatRepository = new InMemoryChatRepository();
    }
    async createTurn(turn: CreateTurn): Promise<Turn> {
        this.chat = await this.chatRepository.getById(turn.payload.turn.turn_key.chat_id)

        if (this.chat === null) {
            throw new Error('Chat not found')
        }

        this.chatRepository.appendMessage(turn.payload.turn.turn_key.chat_id, turn.payload.turn)
        return turn.payload.turn
    }
}