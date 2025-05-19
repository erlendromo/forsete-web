// This file contains utility functions for error handling in TypeScript.
export function ensureDefined<T>(value: T | undefined, message: string = "Value is undefined"): T {
    if (value === undefined) {
        throw new Error(message);
    }
    return value;
}

/**
 * Asserts that the provided value is not `undefined`.
 *
 * @typeParam T - The expected type of the value.
 * @param value - The value to check for `undefined`.
 * @param message - Optional custom error message to throw if the value is `undefined`. Defaults to "Value is undefined".
 * @throws {Error} Throws an error with the provided message if the value is `undefined`.
 * @remarks
 * This function is useful for narrowing types and ensuring that a value is defined at runtime.
 */
export function assertDefined<T>(value: T | undefined, message: string = "Value is undefined"): asserts value is T {
    if (value === undefined) {
        throw new Error(message);
    }
}

/**
 * Handles and logs different types of request errors.
 */
export const handleRequestError = (error: any): void => {
  console.error('Error in postATRRequest:', error.message);

  if (error.response) {
    console.error('ATR service error response:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
  } else if (error.request) {
    console.error('No response received from ATR service');
  }
};


  