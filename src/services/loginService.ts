import config from "../config/config.js";
import { ApiEndpoints } from "../config/endpoint.js";

const TOKEN_KEY = 'auth.token';

/**
 * This module provides functions for user authentication, including login,
 * token storage, and checking login status.
 *
 * @module loginService
 */

/**
 * Credentials interface represents the structure of user credentials
 * required for login.
 * @typedef {Interface} Credentials
 */
export interface Credentials {
    email: string;
    password: string;
}
/**
 * LoginSuccess interface represents the structure of the response
 * received upon successful login.
 * @typedef {Interface} LoginSuccess
 */
export interface LoginSuccess {
    token: string;
}

/**
 * LoginError class extends the built-in Error class to represent errors
 * that occur during the login process. It includes an HTTP status code
 * to provide more context about the error.
 * @typedef {Error} LoginError
 */
export class LoginError extends Error {
    status: number;
    constructor(message: string, status = 0) {
        // Call the parent constructor with the error message
        super(message);
        this.status = status;
    }
}

/**
 * login function sends a POST request to the server with user credentials
 * and returns the login success response.
 * @param {Credentials} creds - The user credentials for login.
 * @param {string} [endpoint='/login'] - The endpoint for the login request.
 * @returns {Promise<LoginSuccess>} - A promise that resolves to the login success response.
 * @throws {LoginError} - Throws an error if the login fails or if there is a network issue.
 */
export async function login(
    creds: Credentials,
    endpoint = ApiEndpoints.LOGIN_ENDPOINT,
): 
Promise<LoginSuccess> {
    let res: Response;

    try {
        // config.urlBackend + endpoint
        res = await fetch(config.urlBackend + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(creds),
        });
    } catch (err) {
        throw new LoginError('Network unreachable');
    }
    if (!res.ok) {
        throw new LoginError('Something went wrong during login: ', res.status);
    }
    const data = await res.json();
    return data as LoginSuccess;
}

export function storeToken(t: string): void {
    localStorage.setItem(TOKEN_KEY, t);          // or cookies/sessionStorage
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
    return !!getToken();
}
