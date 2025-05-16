import { Response, Request } from 'express';
import {tokenStorage } from "../config/constants.js";

/**
 * Sets the authentication token in the response cookies.
 * @param {Response} res - The Express response object.
 * @param {string} token - The authentication token to be set.
 */
export function setAuthCookie(res: Response, token: string) {
  res.cookie(tokenStorage.TOKEN_KEY, token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: 'strict', // Helps prevent CSRF attacks
    maxAge: 60 * 60 * 1000, //1 hour
  });
}

/**
 * Retrieves the authentication token from the request cookies.
 * @param {Request} req - The Express request object.
 * @returns {string | undefined} - The authentication token or undefined if not found.
 */
export function getAuthToken(req: Request): string | undefined {
  return req.cookies?.[tokenStorage.TOKEN_KEY];
}

/**
 * Clears the authentication token from the response cookies.
 * @param {Response} res - The Express response object.
 */
export function clearAuthCookie(res: Response) {
  res.clearCookie(tokenStorage.TOKEN_KEY, {
    httpOnly: true,
    sameSite: 'strict',
  });
}