export {}

declare global {
    export interface String {
        capitalize(): string;
    }

    export interface Number {
        roundCents(): number;
    }
}

String.prototype.capitalize = function (): string {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Number.prototype.roundCents = function (this: number): number {
    return Math.round(this * 100) / 100;
};
