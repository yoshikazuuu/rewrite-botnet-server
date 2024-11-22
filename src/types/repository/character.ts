import type { Character } from "../entity/character";

export interface ICharacterRepository {
    findAll(): Promise<Character[]>;
    findById(id: string): Promise<Character | null>;
}
