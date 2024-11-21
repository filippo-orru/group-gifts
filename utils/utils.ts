import type { BudgetTransaction } from "./budget-calc";

const idCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateId = ({ length = 24 }: { length?: number } = {}): string => {
    return Array.from({ length: length },
        () => idCharacters[Math.floor(Math.random() * idCharacters.length)]
    ).join('');
}
export function getTransactionId(t: BudgetTransaction): string {
    return `${t.fromId}-${t.toId}-${t.amountCents}`;
}