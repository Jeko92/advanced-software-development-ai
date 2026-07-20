// Add the isUpperCase method to String to see whether the string is ALL CAPS.

declare global {
    interface String {
        isUpperCase(): boolean;
    }
}

String.prototype.isUpperCase = function (): boolean {
    return this.toString() === this.toUpperCase();
};
