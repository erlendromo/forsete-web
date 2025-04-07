// This file contains utility functions for error handling in TypeScript.
export function ensureDefined<T>(value: T | undefined, message: string = "Value is undefined"): T {
    if (value === undefined) {
        throw new Error(message);
    }
    return value;
}

export function assertDefined<T>(value: T | undefined, message: string = "Value is undefined"): asserts value is T {
    if (value === undefined) {
        throw new Error(message);
    }
}