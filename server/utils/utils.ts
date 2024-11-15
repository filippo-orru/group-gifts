const idCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateId = ({ length = 24 }: { length?: number } = {}): string => {
    return Array.from({ length: length },
        () => idCharacters[Math.floor(Math.random() * idCharacters.length)]
    ).join('');
}