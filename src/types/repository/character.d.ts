import type { Character } from "../entity/character";

interface ICharacterRepository {
    findAll(): Promise<Character[]>;
    findById(id: string): Promise<Character | null>;
}
