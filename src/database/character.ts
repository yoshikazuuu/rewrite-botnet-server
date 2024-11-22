import { Character } from '../types/entity/character';
import { ICharacterRepository } from '../types/repository/character';
export class InMemoryCharacterRepository implements ICharacterRepository {
    private characters: Character[] = [
        {
            id: '1',
            name: 'Alice',
            description: 'Alice is a character',
        },
        {
            id: '2',
            name: 'Bob',
            description: 'Bob is a character',
        },
        {
            id: '3',
            name: 'Charlie',
            description: 'Charlie is a character',
        },
    ];
    findAll(): Promise<Character[]> {
        return Promise.resolve(this.characters);
    }
    findById(id: string): Promise<Character | null> {
        const character = this.characters.find((c) => c.id === id);
        return Promise.resolve(character || null);
    }
    save(character: Character): Promise<void> {
        this.characters.push(character);
        return Promise.resolve();
    }
}
