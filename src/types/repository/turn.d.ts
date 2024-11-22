import { CreateTurn, ReturnTurn } from "../entity/turn";

interface ITurnRepository {
    createTurn(turn: CreateTurn): Promise<Turn>;
}
